require( 'mocha' );
const { step } = require( 'mocha-steps' );
const { assert } = require( 'chai' );
const webdriver = require( 'selenium-webdriver' );
const chrome = require( 'selenium-webdriver/chrome' );
const LoginPage = require( './lib/pages/login-page' );
const SignupStepsPage = require( './lib/pages/signup-steps-page' );
const NavBarComponent = require( './lib/components/nav-bar-component' );
const ProfilePage = require( './lib/pages/profile-page' );
const ReaderPage = require( './lib/pages/reader-page' );
const PostPreviewComponent = require( './lib/components/post-preview-component' );
const CheckoutPage = require( './lib/pages/checkout-page' );
const GutenbergEditorComponent = require( './lib/components/gutenberg-editor-component' );

const dataHelper = require( './lib/data-helper' );
const options = new chrome.Options();
options.addArguments(
	'user-agent=Mozilla/5.0 (wp-e2e-tests) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.128 Electron/8.3.0 Safari/537.36'
);
const driverConfig = new webdriver.Builder()
	.usingServer( 'http://localhost:9515' )
	.setChromeOptions( options )
	.withCapabilities( {
		chromeOptions: {
			// Here is the path to your Electron binary.
			binary: process.env.BINARY_PATH,
			args: [ '--disable-renderer-backgrounding', '--disable-http-cache', '--start-maximized' ],
			debuggerAddress: '127.0.0.1:9222',
		},
	} )
	.forBrowser( 'electron' );

let loggedInUrl;
let driver;

before( async function () {
	this.timeout( 30000 );
	driver = await driverConfig.build();
	return await driver.sleep( 2000 );
} );

describe( 'User Can log in', function () {
	this.timeout( 30000 );

	step( 'Clear local storage', async function () {
		await driver.executeScript( 'window.localStorage.clear();' );
		return await driver.sleep( 3000 );
	} );

	step( 'Can log in', async function () {
		const loginPage = await LoginPage.Expect( driver );
		return await loginPage.login( process.env.E2EGUTENBERGUSER, process.env.E2EPASSWORD );
	} );

	step( 'Can see Reader Page after logging in', async function () {
		await ReaderPage.Expect( driver );
		return ( loggedInUrl = await driver.getCurrentUrl() );
	} );
} );

describe( 'Publish a New Post', function () {
	this.timeout( 30000 );
	const blogPostTitle = dataHelper.randomPhrase();
	const blogPostQuote =
		'???Whenever you find yourself on the side of the majority, it is time to pause and reflect.??? Mark Twain';

	step( 'Can navigate to post editor', async function () {
		const navbarComponent = await NavBarComponent.Expect( driver );
		return await navbarComponent.clickCreateNewPost();
	} );

	step( 'Can enter post title and content', async function () {
		const gEditorComponent = await GutenbergEditorComponent.Expect( driver );
		await gEditorComponent.enterTitle( blogPostTitle );
		await gEditorComponent.enterText( blogPostQuote + '\n' );

		const errorShown = await gEditorComponent.errorDisplayed();
		return assert.strictEqual( errorShown, false, 'There is an error shown on the editor page!' );
	} );

	step( 'Can publish and preview content', async function () {
		const gEditorComponent = await GutenbergEditorComponent.Expect( driver );
		await gEditorComponent.ensureSaved();
		await gEditorComponent.publish();
		return gEditorComponent.launchPreview();
	} );

	step( 'Can see correct page title in preview', async function () {
		const postPreviewComponent = await PostPreviewComponent.Expect( driver );
		await postPreviewComponent.displayed();
		const actualPageTitle = await postPreviewComponent.postTitle();
		assert.strictEqual(
			actualPageTitle.toUpperCase(),
			blogPostTitle.toUpperCase(),
			'The post preview title is not correct'
		);
	} );

	step( 'Can see correct page content in preview', async function () {
		const postPreviewComponent = await PostPreviewComponent.Expect( driver );
		const content = await postPreviewComponent.postContent();
		assert.equal(
			content.indexOf( blogPostQuote ) > -1,
			true,
			'The post preview content (' +
				content +
				') does not include the expected content (' +
				blogPostQuote +
				')'
		);
	} );

	step( 'Can return to reader', async function () {
		return await driver.get( loggedInUrl );
	} );
} );

describe( 'Can Log Out', function () {
	this.timeout( 30000 );

	step( 'Can view profile to log out', async function () {
		const navbarComponent = await NavBarComponent.Expect( driver );
		return await navbarComponent.clickProfileLink();
	} );

	step( 'Can logout from profile page', async function () {
		const profilePage = await ProfilePage.Expect( driver );
		return await profilePage.clickSignOut();
	} );

	step( 'Can see app login page after logging out', async function () {
		return await LoginPage.Expect( driver );
	} );
} );

// FIXME: flakey, should fix
describe.skip( 'Can Sign up', function () {
	this.timeout( 90000 );
	const blogName = dataHelper.getNewBlogName();
	const emailAddress = blogName + '@e2edesktop.test';

	step( 'Clear local storage', async function () {
		await driver.executeScript( 'window.localStorage.clear();' );
		return await driver.sleep( 3000 );
	} );

	step( 'Can navigate to Create account', async function () {
		const loginPage = await LoginPage.Expect( driver );
		await loginPage.hideGdprBanner();
		return await loginPage.openCreateAccountPage();
	} );

	step( 'Can see the "Site Topic" page, and enter the site topic', async function () {
		const signupStepsPage = await SignupStepsPage.Expect( driver );
		return await signupStepsPage.aboutSite();
	} );

	step( 'Choose a theme page', async function () {
		const signupStepsPage = await SignupStepsPage.Expect( driver );
		return await signupStepsPage.selectTheme();
	} );

	step(
		'Can search for a blog name, can see and select a free .wordpress address',
		async function () {
			const signupStepsPage = await SignupStepsPage.Expect( driver );
			return await signupStepsPage.selectDomain( blogName );
		}
	);

	step( 'Can see the plans page and pick Business plan', async function () {
		const signupStepsPage = await SignupStepsPage.Expect( driver );
		return await signupStepsPage.selectPlan( 'business' );
	} );

	step( 'Can see the account page, enter account details and submit', async function () {
		const signupStepsPage = await SignupStepsPage.Expect( driver );
		return await signupStepsPage.enterAccountDetailsAndSubmit(
			emailAddress,
			blogName,
			process.env.E2EPASSWORD
		);
	} );

	step( 'Can see checkout page', async function () {
		const checkoutPage = await CheckoutPage.Expect( driver );
		await checkoutPage.isShoppingCartPresent();
	} );
} );

after( async function () {
	this.timeout( 30000 );
	await driver.executeScript( 'window.localStorage.clear();' );
	return await driver.quit();
} );
