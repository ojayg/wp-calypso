/**
 * External dependencies
 */
import { By } from 'selenium-webdriver';

/**
 * Internal dependencies
 */
import * as driverHelper from '../driver-helper';
import * as driverManager from '../driver-manager';
import AsyncBaseContainer from '../async-base-container';

export default class StoreSidebarComponent extends AsyncBaseContainer {
	constructor( driver ) {
		super( driver, By.css( '.store-sidebar__sidebar' ) );
		this.productsLinkSelector = By.css( 'li.products a' );
		this.ordersLinkSelector = By.css( 'li.orders a' );
		this.settingsLinkSelector = By.css( 'li.settings a' );
	}

	async _postInit() {
		return await this.displayComponentIfNecessary();
	}

	// this is necessary on mobile width screens
	async displayComponentIfNecessary() {
		const mobileLeftArrowSelector = By.css( '.action-header button' );
		if ( driverManager.currentScreenSize() === 'mobile' ) {
			const mobileLeftArrowElement = await this.driver.findElement( mobileLeftArrowSelector );
			const displayed = await mobileLeftArrowElement.isDisplayed();
			if ( displayed === true ) {
				return await driverHelper.clickWhenClickable( this.driver, mobileLeftArrowSelector );
			}
		}
	}

	productsLinkDisplayed() {
		return driverHelper.isEventuallyLocatedAndVisible( this.driver, this.productsLinkSelector );
	}

	ordersLinkDisplayed() {
		return driverHelper.isEventuallyLocatedAndVisible( this.driver, this.ordersLinkSelector );
	}

	selectProducts() {
		return driverHelper.clickWhenClickable( this.driver, this.productsLinkSelector );
	}

	selectOrders() {
		return driverHelper.clickWhenClickable( this.driver, this.ordersLinkSelector );
	}

	addProduct() {
		this.selectProducts();
		return driverHelper.clickWhenClickable( this.driver, {
			locator: By.css( '.button' ),
			text: 'Add a product',
		} );
	}

	settingsLinkDisplayed() {
		return driverHelper.isEventuallyLocatedAndVisible( this.driver, this.settingsLinkSelector );
	}

	selectSettings() {
		return driverHelper.clickWhenClickable( this.driver, this.settingsLinkSelector );
	}
}
