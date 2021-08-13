import {
	screen,
	render,
	waitFor,
	fireEvent,
	waitForElementToBeRemoved,
} from '@testing-library/react';
import React from 'react';
import { getEmptyResponseCart } from '../src/empty-carts';
import { useShoppingCart } from '../src/index';
import { planOne, planTwo, renewalOne, renewalTwo, mainCartKey } from './utils/mock-cart-api';
import { ProductList, MockProvider, ProductListWithoutHook } from './utils/mock-components';
import { convertMsToSecs, verifyThatNever, verifyThatTextNeverAppears } from './utils/utils';

import '@testing-library/jest-dom/extend-expect';

const emptyResponseCart = getEmptyResponseCart();

describe( 'useShoppingCart', () => {
	const markUpdateComplete = jest.fn();

	beforeEach( () => {
		markUpdateComplete.mockClear();
	} );

	describe( 'addProductsToCart', () => {
		const TestComponent = ( { initialProducts = undefined, products = undefined } ) => {
			const { addProductsToCart } = useShoppingCart();
			const onClick = () => {
				products && addProductsToCart( products ).then( () => markUpdateComplete() );
			};
			return (
				<div>
					<ProductList initialProducts={ initialProducts } />
					<button onClick={ onClick }>Click me</button>
				</div>
			);
		};

		afterEach( () => {
			jest.restoreAllMocks();
		} );

		it( 'adds a product to the cart if the cart is empty', async () => {
			render(
				<MockProvider>
					<TestComponent products={ [ planOne ] } />
				</MockProvider>
			);
			fireEvent.click( screen.getByText( 'Click me' ) );
			await waitFor( () => screen.getByTestId( 'product-list' ) );
			expect( screen.getByTestId( 'product-list' ) ).toHaveTextContent( planOne.product_name );
		} );

		it( 'allows setting the cart key via the optional argument', async () => {
			const TestComponentWithKey = () => {
				const shoppingCartManager = useShoppingCart( mainCartKey );
				return (
					<div>
						<ProductListWithoutHook
							productsToAddOnClick={ [ planOne ] }
							shoppingCartManager={ shoppingCartManager }
							cart={ shoppingCartManager.responseCart }
						/>
					</div>
				);
			};
			render(
				<MockProvider cartKeyOverride="asdjalkjdaldjsalkjdslka">
					<TestComponentWithKey />
				</MockProvider>
			);
			fireEvent.click( screen.getByText( 'Click me' ) );
			await waitFor( () => {
				expect( screen.getByTestId( 'product-list' ) ).toHaveTextContent( planOne.product_name );
			} );
		} );

		it( 'throws an error if the product is missing a product_id', async () => {
			jest.spyOn( console, 'error' ).mockImplementation( () => undefined );
			expect( () => {
				render(
					<MockProvider>
						<TestComponent initialProducts={ [ { product_slug: planOne.product_slug } ] } />
					</MockProvider>
				);
			} ).toThrow( /product_id/ );
		} );

		it( 'adds a product to the cart if the existing products are not renewals and the new products are also', async () => {
			render(
				<MockProvider>
					<TestComponent initialProducts={ [ planTwo ] } products={ [ planOne ] } />
				</MockProvider>
			);
			fireEvent.click( screen.getByText( 'Click me' ) );
			await waitFor( () => screen.getByTestId( 'product-list' ) );
			expect( screen.getByTestId( 'product-list' ) ).toHaveTextContent( planOne.product_name );
			expect( screen.getByTestId( 'product-list' ) ).toHaveTextContent( planTwo.product_name );
		} );

		it( 'adds a product to the cart if the existing products are renewals and the new products are also', async () => {
			render(
				<MockProvider>
					<TestComponent initialProducts={ [ renewalTwo ] } products={ [ renewalOne ] } />
				</MockProvider>
			);
			fireEvent.click( screen.getByText( 'Click me' ) );
			await waitFor( () => screen.getByTestId( 'product-list' ) );
			expect( screen.getByTestId( 'product-list' ) ).toHaveTextContent( renewalTwo.product_name );
			expect( screen.getByTestId( 'product-list' ) ).toHaveTextContent( renewalOne.product_name );
		} );

		it( 'replaces the cart if the existing products are not renewals and any of the new products is a renewal', async () => {
			render(
				<MockProvider>
					<TestComponent initialProducts={ [ planOne ] } products={ [ renewalTwo ] } />
				</MockProvider>
			);
			fireEvent.click( screen.getByText( 'Click me' ) );
			await waitFor( () => screen.getByTestId( 'product-list' ) );
			expect( screen.getByTestId( 'product-list' ) ).not.toHaveTextContent( planOne.product_name );
			expect( screen.getByTestId( 'product-list' ) ).toHaveTextContent( renewalTwo.product_name );
		} );

		it( 'replaces the cart if any of the existing products is a renewal and the new products are not', async () => {
			render(
				<MockProvider>
					<TestComponent initialProducts={ [ renewalTwo ] } products={ [ planOne ] } />
				</MockProvider>
			);
			fireEvent.click( screen.getByText( 'Click me' ) );
			await waitFor( () => screen.getByTestId( 'product-list' ) );
			expect( screen.getByTestId( 'product-list' ) ).toHaveTextContent( planOne.product_name );
			expect( screen.getByTestId( 'product-list' ) ).not.toHaveTextContent(
				renewalTwo.product_name
			);
		} );

		it( 'returns a Promise that resolves after the update completes', async () => {
			render(
				<MockProvider>
					<TestComponent products={ [ planOne ] } />
				</MockProvider>
			);
			fireEvent.click( screen.getByText( 'Click me' ) );
			expect( markUpdateComplete ).not.toHaveBeenCalled();
			await waitFor( () => screen.getByTestId( 'product-list' ) );
			expect( markUpdateComplete ).toHaveBeenCalled();
		} );
	} );

	describe( 'removeProductFromCart', () => {
		const TestComponent = () => {
			const { removeProductFromCart, responseCart } = useShoppingCart();
			const onClick = () => {
				const uuid = responseCart.products.length ? responseCart.products[ 0 ].uuid : null;
				if ( uuid ) {
					removeProductFromCart( uuid ).then( () => markUpdateComplete() );
				}
			};
			return (
				<div>
					<ProductList initialProducts={ [ planOne ] } />
					<button onClick={ onClick }>Click me</button>
				</div>
			);
		};

		it( 'removes a product from the cart', async () => {
			render(
				<MockProvider>
					<TestComponent />
				</MockProvider>
			);
			await waitFor( () => screen.getByTestId( 'product-list' ) );
			expect( screen.getByText( planOne.product_name ) ).toBeInTheDocument();
			fireEvent.click( screen.getByText( 'Click me' ) );
			await waitForElementToBeRemoved( () => screen.queryByText( planOne.product_name ) );
		} );

		it( 'returns a Promise that resolves after the update completes', async () => {
			render(
				<MockProvider>
					<TestComponent />
				</MockProvider>
			);

			await waitFor( () => screen.getByTestId( 'product-list' ) );
			expect( screen.getByText( planOne.product_name ) ).toBeInTheDocument();
			fireEvent.click( screen.getByText( 'Click me' ) );
			expect( markUpdateComplete ).not.toHaveBeenCalled();
			await waitFor( () => {
				expect( markUpdateComplete ).toHaveBeenCalled();
			} );
		} );
	} );

	describe( 'replaceProductsInCart', () => {
		const TestComponent = ( { initialProductsForReplace = undefined } ) => {
			const { replaceProductsInCart } = useShoppingCart();
			const onClick = () => {
				replaceProductsInCart( [ planTwo ] ).then( () => markUpdateComplete() );
			};
			return (
				<div>
					<ProductList
						initialProducts={ initialProductsForReplace ? undefined : [ planOne ] }
						initialProductsForReplace={ initialProductsForReplace }
					/>
					<button onClick={ onClick }>Click me</button>
				</div>
			);
		};

		afterEach( () => {
			jest.restoreAllMocks();
		} );

		it( 'replaces all products in the cart', async () => {
			render(
				<MockProvider>
					<TestComponent />
				</MockProvider>
			);
			await waitFor( () => screen.getByTestId( 'product-list' ) );
			expect( screen.getByText( planOne.product_name ) ).toBeInTheDocument();
			fireEvent.click( screen.getByText( 'Click me' ) );
			await waitForElementToBeRemoved( () => screen.queryByText( planOne.product_name ) );
			expect( screen.getByText( planTwo.product_name ) ).toBeInTheDocument();
		} );

		it( 'throws an error if a product is missing a product_id', async () => {
			jest.spyOn( console, 'error' ).mockImplementation( () => undefined );
			expect( () => {
				render(
					<MockProvider>
						<TestComponent
							initialProductsForReplace={ [ { product_slug: planOne.product_slug } ] }
						/>
					</MockProvider>
				);
			} ).toThrow( /product_id/ );
		} );

		it( 'returns a Promise that resolves after the update completes', async () => {
			render(
				<MockProvider>
					<TestComponent />
				</MockProvider>
			);

			await waitFor( () => screen.getByTestId( 'product-list' ) );
			fireEvent.click( screen.getByText( 'Click me' ) );
			expect( markUpdateComplete ).not.toHaveBeenCalled();
			await waitFor( () => {
				expect( markUpdateComplete ).toHaveBeenCalled();
			} );
		} );
	} );

	describe( 'replaceProductInCart', () => {
		const TestComponent = () => {
			const { replaceProductInCart, responseCart } = useShoppingCart();
			const onClick = () => {
				const uuid = responseCart.products.length ? responseCart.products[ 0 ].uuid : null;
				if ( uuid ) {
					replaceProductInCart( uuid, { product_id: planTwo.product_id } ).then( () =>
						markUpdateComplete()
					);
				}
			};
			return (
				<div>
					<ProductList initialProducts={ [ planOne ] } />
					<button onClick={ onClick }>Click me</button>
				</div>
			);
		};

		it( 'updates a product in the cart', async () => {
			render(
				<MockProvider>
					<TestComponent />
				</MockProvider>
			);
			await waitFor( () => screen.getByTestId( 'product-list' ) );
			expect( screen.getByText( planOne.product_slug ) ).toBeInTheDocument();
			fireEvent.click( screen.getByText( 'Click me' ) );
			await waitForElementToBeRemoved( () => screen.queryByText( planOne.product_slug ) );
			expect( screen.getByText( planTwo.product_slug ) ).toBeInTheDocument();
		} );

		it( 'returns a Promise that resolves after the update completes', async () => {
			render(
				<MockProvider>
					<TestComponent />
				</MockProvider>
			);

			await waitFor( () => screen.getByTestId( 'product-list' ) );
			fireEvent.click( screen.getByText( 'Click me' ) );
			expect( markUpdateComplete ).not.toHaveBeenCalled();
			await waitFor( () => {
				expect( markUpdateComplete ).toHaveBeenCalled();
			} );
		} );
	} );

	describe( 'applyCoupon', () => {
		const TestComponent = () => {
			const { applyCoupon } = useShoppingCart();
			const onClick = () => {
				applyCoupon( 'ABCD' ).then( () => markUpdateComplete() );
			};
			return (
				<div>
					<ProductList initialProducts={ [ planOne ] } />
					<button onClick={ onClick }>Click me</button>
				</div>
			);
		};

		it( 'adds a coupon to the cart', async () => {
			render(
				<MockProvider>
					<TestComponent />
				</MockProvider>
			);
			await waitFor( () => screen.getByTestId( 'product-list' ) );
			expect( screen.queryByText( 'Coupon: ABCD' ) ).not.toBeInTheDocument();
			fireEvent.click( screen.getByText( 'Click me' ) );
			await waitFor( () => {
				expect( screen.getByText( 'Coupon: ABCD' ) ).toBeInTheDocument();
			} );
		} );

		it( 'returns a Promise that resolves after the update completes', async () => {
			render(
				<MockProvider>
					<TestComponent />
				</MockProvider>
			);

			await waitFor( () => screen.getByTestId( 'product-list' ) );
			fireEvent.click( screen.getByText( 'Click me' ) );
			expect( markUpdateComplete ).not.toHaveBeenCalled();
			await waitFor( () => {
				expect( markUpdateComplete ).toHaveBeenCalled();
			} );
		} );
	} );

	describe( 'removeCoupon', () => {
		const TestComponent = () => {
			const { removeCoupon } = useShoppingCart();
			const onClick = () => {
				removeCoupon().then( () => markUpdateComplete() );
			};
			return (
				<div>
					<ProductList initialProducts={ [ planOne ] } initialCoupon="ABCD" />
					<button onClick={ onClick }>Click me</button>
				</div>
			);
		};

		it( 'removes a coupon from the cart', async () => {
			render(
				<MockProvider>
					<TestComponent />
				</MockProvider>
			);
			await waitFor( () => screen.getByTestId( 'product-list' ) );
			expect( screen.getByText( 'Coupon: ABCD' ) ).toBeInTheDocument();
			fireEvent.click( screen.getByText( 'Click me' ) );
			await waitForElementToBeRemoved( () => screen.queryByText( 'Coupon: ABCD' ) );
		} );

		it( 'returns a Promise that resolves after the update completes', async () => {
			render(
				<MockProvider>
					<TestComponent />
				</MockProvider>
			);

			await waitFor( () => screen.getByTestId( 'product-list' ) );
			fireEvent.click( screen.getByText( 'Click me' ) );
			expect( markUpdateComplete ).not.toHaveBeenCalled();
			await waitFor( () => {
				expect( markUpdateComplete ).toHaveBeenCalled();
			} );
		} );
	} );

	describe( 'updateLocation', () => {
		const TestComponent = () => {
			const { updateLocation } = useShoppingCart();
			const onClick = () => {
				updateLocation( {
					countryCode: 'US',
					postalCode: '10001',
					subdivisionCode: 'NY',
				} ).then( () => markUpdateComplete() );
			};
			return (
				<div>
					<ProductList initialProducts={ [ planOne ] } initialCoupon="ABCD" />
					<button onClick={ onClick }>Click me</button>
				</div>
			);
		};

		it( 'adds a location to the cart', async () => {
			render(
				<MockProvider>
					<TestComponent />
				</MockProvider>
			);
			const locationText = 'Location: 10001, US, NY';
			await waitFor( () => screen.getByTestId( 'product-list' ) );
			expect( screen.queryByText( locationText ) ).not.toBeInTheDocument();
			fireEvent.click( screen.getByText( 'Click me' ) );
			await waitFor( async () => {
				expect( screen.getByText( locationText ) ).toBeInTheDocument();
			} );
		} );

		it( 'returns a Promise that resolves after the update completes', async () => {
			render(
				<MockProvider>
					<TestComponent />
				</MockProvider>
			);

			await waitFor( () => screen.getByTestId( 'product-list' ) );
			fireEvent.click( screen.getByText( 'Click me' ) );
			expect( markUpdateComplete ).not.toHaveBeenCalled();
			await waitFor( () => {
				expect( markUpdateComplete ).toHaveBeenCalled();
			} );
		} );
	} );

	describe( 'reloadFromServer', () => {
		const TestComponent = () => {
			const { reloadFromServer } = useShoppingCart();
			const onClick = () => {
				reloadFromServer().then( () => markUpdateComplete() );
			};
			return (
				<div>
					<ProductList initialProducts={ [ planOne ] } />
					<button onClick={ onClick }>Click me</button>
				</div>
			);
		};

		it( 'reloads the cart from the server', async () => {
			render(
				<MockProvider>
					<TestComponent />
				</MockProvider>
			);
			await waitFor( () => screen.getByTestId( 'product-list' ) );
			expect( screen.getByText( planOne.product_name ) ).toBeInTheDocument();
			fireEvent.click( screen.getByText( 'Click me' ) );
			await waitFor( () => {
				expect( screen.queryByText( planOne.product_name ) ).not.toBeInTheDocument();
			} );
		} );

		it( 'returns a Promise that resolves after the update completes', async () => {
			render(
				<MockProvider>
					<TestComponent />
				</MockProvider>
			);

			await waitFor( () => screen.getByTestId( 'product-list' ) );
			fireEvent.click( screen.getByText( 'Click me' ) );
			expect( markUpdateComplete ).not.toHaveBeenCalled();
			await waitFor( () => {
				expect( markUpdateComplete ).toHaveBeenCalled();
			} );
		} );
	} );

	describe( 'when refetchOnWindowFocus is disabled', () => {
		const mockGetCart = jest.fn();

		it( 'does not trigger a refetch when the window is focused', async () => {
			mockGetCart.mockResolvedValue( { ...emptyResponseCart, products: [ planOne ] } );

			render(
				<MockProvider getCartOverride={ mockGetCart } options={ { refetchOnWindowFocus: false } }>
					<ProductList />
				</MockProvider>
			);

			await waitFor( () => screen.getByTestId( 'product-list' ) );

			mockGetCart.mockResolvedValue( { ...emptyResponseCart, products: [ planTwo ] } );

			fireEvent( window, new Event( 'focus' ) );

			await waitFor( () => {
				expect( screen.getByTestId( 'product-list' ) ).toHaveTextContent( planOne.product_name );
			} );
		} );
	} );

	describe( 'when refetchOnWindowFocus is enabled', () => {
		const mockGetCart = jest.fn();

		beforeEach( () => {
			mockGetCart.mockReset();
			jest.restoreAllMocks();
		} );

		it( 'triggers a refetch when the window is focused', async () => {
			mockGetCart.mockResolvedValue( { ...emptyResponseCart, products: [ planOne ] } );

			render(
				<MockProvider getCartOverride={ mockGetCart } options={ { refetchOnWindowFocus: true } }>
					<ProductList />
				</MockProvider>
			);

			await waitFor( () => screen.getByTestId( 'product-list' ) );

			mockGetCart.mockResolvedValue( { ...emptyResponseCart, products: [ planTwo ] } );

			fireEvent( window, new Event( 'focus' ) );

			await waitFor( () => {
				expect( screen.getByTestId( 'product-list' ) ).toHaveTextContent( planTwo.product_name );
			} );
		} );

		it( 'triggers only one refetch when the window is focused and there are multiple consumers', async () => {
			mockGetCart.mockResolvedValue( { ...emptyResponseCart, products: [ planOne ] } );

			render(
				<MockProvider getCartOverride={ mockGetCart } options={ { refetchOnWindowFocus: true } }>
					<ProductList />
					<ProductList />
					<ProductList />
					<ProductList />
				</MockProvider>
			);

			await waitFor( () => screen.getAllByTestId( 'product-list' ) );

			mockGetCart.mockResolvedValue( { ...emptyResponseCart, products: [ planTwo ] } );

			mockGetCart.mockClear();
			fireEvent( window, new Event( 'focus' ) );

			await verifyThatNever( () => expect( mockGetCart.mock.calls.length ).toBeGreaterThan( 1 ) );
			expect( mockGetCart ).toHaveBeenCalledTimes( 1 );
		} );

		it( 'does not trigger a refetch when the window is focused and the last fetch was very recent', async () => {
			const recentTime = convertMsToSecs( Date.now() );
			mockGetCart.mockResolvedValue( {
				...emptyResponseCart,
				products: [ planOne ],
				cart_generated_at_timestamp: recentTime,
			} );

			render(
				<MockProvider getCartOverride={ mockGetCart } options={ { refetchOnWindowFocus: true } }>
					<ProductList />
				</MockProvider>
			);

			await waitFor( () => screen.getByTestId( 'product-list' ) );

			mockGetCart.mockResolvedValue( {
				...emptyResponseCart,
				products: [ planTwo ],
				cart_generated_at_timestamp: recentTime,
			} );

			fireEvent( window, new Event( 'focus' ) );

			await verifyThatTextNeverAppears( planTwo.product_name );
			await waitFor( () => {
				expect( screen.getByTestId( 'product-list' ) ).toHaveTextContent( planOne.product_name );
			} );
		} );

		it( 'does not trigger a refetch when the window is focused and the cart key is no-site', async () => {
			mockGetCart.mockResolvedValue( emptyResponseCart );

			render(
				<MockProvider
					getCartOverride={ mockGetCart }
					cartKeyOverride="no-site"
					options={ { refetchOnWindowFocus: true } }
				>
					<ProductList initialProducts={ [ planOne ] } />
				</MockProvider>
			);

			await waitFor( () => screen.getByTestId( 'product-list' ) );

			mockGetCart.mockResolvedValue( { ...emptyResponseCart, products: [ planTwo ] } );

			fireEvent( window, new Event( 'focus' ) );

			await verifyThatTextNeverAppears( planTwo.product_name );
			await waitFor( () => {
				expect( screen.getByTestId( 'product-list' ) ).toHaveTextContent( planOne.product_name );
			} );
		} );

		it( 'does not trigger a refetch when the window is focused and the cart key is no-user', async () => {
			mockGetCart.mockResolvedValue( emptyResponseCart );

			render(
				<MockProvider
					getCartOverride={ mockGetCart }
					cartKeyOverride="no-user"
					options={ { refetchOnWindowFocus: true } }
				>
					<ProductList initialProducts={ [ planOne ] } />
				</MockProvider>
			);

			await waitFor( () => screen.getByTestId( 'product-list' ) );

			mockGetCart.mockResolvedValue( { ...emptyResponseCart, products: [ planTwo ] } );

			fireEvent( window, new Event( 'focus' ) );

			await verifyThatTextNeverAppears( planTwo.product_name );
			await waitFor( () => {
				expect( screen.getByTestId( 'product-list' ) ).toHaveTextContent( planOne.product_name );
			} );
		} );

		it( 'does not trigger a refetch when the window is focused and the network is offline', async () => {
			mockGetCart.mockResolvedValue( emptyResponseCart );

			render(
				<MockProvider getCartOverride={ mockGetCart } options={ { refetchOnWindowFocus: true } }>
					<ProductList initialProducts={ [ planOne ] } />
				</MockProvider>
			);

			await waitFor( () => screen.getByTestId( 'product-list' ) );

			mockGetCart.mockResolvedValue( { ...emptyResponseCart, products: [ planTwo ] } );

			jest.spyOn( navigator, 'onLine', 'get' ).mockReturnValueOnce( false );
			fireEvent( window, new Event( 'focus' ) );

			await verifyThatTextNeverAppears( planTwo.product_name );
			await waitFor( () => {
				expect( screen.getByTestId( 'product-list' ) ).toHaveTextContent( planOne.product_name );
			} );
		} );
	} );
} );
