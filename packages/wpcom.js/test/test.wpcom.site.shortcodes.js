const assert = require( 'assert' );

/**
 * Testing data
 */
const fixture = require( './fixture' );
const util = require( './util' );

describe( 'wpcom.site.shortcodes', function () {
	// Global instances
	const wpcom = util.wpcom();
	const site = wpcom.site( util.site() );
	let testing_media;

	// add media testing
	before( ( done ) => {
		site
			.addMediaFiles( fixture.media.files[ 0 ] )
			.then( ( data ) => {
				testing_media = data ? data.media[ 0 ] : {};
				done();
			} )
			.catch( done );
	} );

	after( ( done ) => {
		// delete media testing
		site
			.deleteMedia( testing_media.ID )
			.then( () => done() )
			.catch( done );
	} );

	describe( "wpcom.site.renderShortcode('gallery' )", function () {
		it( 'should render [gallery] shortcode', () => {
			return new Promise( ( done ) => {
				const shortcode = '[gallery ids="' + testing_media.ID + '"]';
				site
					.renderShortcode( shortcode )
					.then( ( data ) => {
						assert.equal( data.shortcode, shortcode );
						assert.ok( data.result );
						assert.ok( data.scripts );
						assert.ok( data.styles );
						done();
					} )
					.catch( done );
			} );
		} );
	} );
} );
