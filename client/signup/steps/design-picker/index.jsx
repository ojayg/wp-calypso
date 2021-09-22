import DesignPicker, { isBlankCanvasDesign } from '@automattic/design-picker';
import classnames from 'classnames';
import { localize } from 'i18n-calypso';
import page from 'page';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import QueryTheme from 'calypso/components/data/query-theme';
import WebPreview from 'calypso/components/web-preview';
import { recordTracksEvent } from 'calypso/lib/analytics/tracks';
import { addQueryArgs } from 'calypso/lib/route';
import StepWrapper from 'calypso/signup/step-wrapper';
import { getStepUrl } from 'calypso/signup/utils';
import { submitSignupStep } from 'calypso/state/signup/progress/actions';
import { getRecommendedThemes as fetchRecommendedThemes } from 'calypso/state/themes/actions';
import { getRecommendedThemes, getThemeDemoUrl } from 'calypso/state/themes/selectors';
import PreviewToolbar from './preview-toolbar';
import './style.scss';

// Ideally this data should come from the themes API, maybe by a tag that's applied to
// themes? e.g. `link-in-bio` or `no-fold`
const STATIC_PREVIEWS = [ 'bantry', 'sigler', 'miller', 'pollard', 'paxton', 'jones', 'baker' ];

const EXCLUDED_THEMES = [
	// The Ryu theme doesn't currently have any annotations
	'ryu',
];

class DesignPickerStep extends Component {
	static propTypes = {
		goToNextStep: PropTypes.func.isRequired,
		signupDependencies: PropTypes.object.isRequired,
		stepName: PropTypes.string.isRequired,
		locale: PropTypes.string.isRequired,
		translate: PropTypes.func,
		largeThumbnails: PropTypes.bool,
		showOnlyThemes: PropTypes.bool,
		fetchRecommendedThemes: PropTypes.func.isRequired,
		themes: PropTypes.array.isRequired,
	};

	static defaultProps = {
		useHeadstart: true,
		largeThumbnails: false,
		showOnlyThemes: false,
	};

	state = {
		selectedDesign: null,
	};

	componentDidMount() {
		if ( this.props.showOnlyThemes ) {
			this.fetchThemes();
		}
	}

	componentDidUpdate( prevProps ) {
		if ( prevProps.stepSectionName !== this.props.stepSectionName ) {
			this.updateSelectedDesign();
		}
	}

	fetchThemes() {
		this.props.fetchRecommendedThemes( 'auto-loading-homepage' );
	}

	getDesigns() {
		// TODO fetching and filtering code should be pulled to a shared place that's usable by both
		// `/start` and `/new` onboarding flows. Or perhaps fetching should be done within the <DesignPicker>
		// component itself. The `/new` environment needs helpers for making authenticated requests to
		// the theme API before we can do this.
		// taxonomies.theme_subject probably maps to category
		return this.props.themes
			.filter( ( { id } ) => ! EXCLUDED_THEMES.includes( id ) )
			.map( ( { id, name } ) => ( {
				categories: [],
				features: [],
				is_premium: false,
				slug: id,
				template: id,
				theme: id,
				title: name,
				...( STATIC_PREVIEWS.includes( id ) && { preview: 'static' } ),
			} ) );
	}

	updateSelectedDesign() {
		const { stepSectionName } = this.props;

		this.setState( {
			selectedDesign: this.getDesigns().find( ( { theme } ) => theme === stepSectionName ),
		} );
	}

	pickDesign = ( selectedDesign ) => {
		this.submitDesign( selectedDesign );
	};

	previewDesign = ( selectedDesign ) => {
		page( getStepUrl( this.props.flowName, this.props.stepName, selectedDesign.theme ) );
	};

	submitDesign = ( selectedDesign = this.state.selectedDesign ) => {
		recordTracksEvent( 'calypso_signup_select_design', {
			theme: `pub/${ selectedDesign?.theme }`,
			template: selectedDesign?.template,
		} );

		this.props.submitSignupStep(
			{
				stepName: this.props.stepName,
			},
			{
				selectedDesign,
			}
		);

		this.props.goToNextStep();
	};

	renderDesignPicker() {
		// Use <DesignPicker>'s preferred designs by default
		let designs = undefined;

		if ( this.props.showOnlyThemes ) {
			designs = this.getDesigns();
		}

		return (
			<DesignPicker
				designs={ designs }
				theme={ this.props.isReskinned ? 'light' : 'dark' }
				locale={ this.props.locale } // props.locale obtained via `localize` HoC
				onSelect={ this.pickDesign }
				onPreview={ this.previewDesign }
				className={ classnames( {
					'design-picker-step__is-large-thumbnails': this.props.largeThumbnails,
				} ) }
				highResThumbnails
			/>
		);
	}

	renderDesignPreview() {
		const {
			demoUrl,
			signupDependencies: { siteSlug },
			translate,
		} = this.props;

		const { selectedDesign } = this.state;

		const previewUrl = demoUrl
			? addQueryArgs(
					{
						demo: true,
						iframe: true,
						theme_preview: true,
					},
					demoUrl
			  )
			: '';

		return (
			<>
				<QueryTheme siteId="wpcom" themeId={ selectedDesign.theme } />
				<WebPreview
					className="design-picker__web-preview"
					showPreview
					isContentOnly
					showUrl={ false }
					showClose={ false }
					showEdit={ false }
					externalUrl={ siteSlug }
					previewUrl={ previewUrl }
					loadingMessage={ translate(
						'{{strong}}One moment, please…{{/strong}} loading your site.',
						{ components: { strong: <strong /> } }
					) }
					toolbarComponent={ PreviewToolbar }
				/>
			</>
		);
	}

	headerText() {
		const { translate } = this.props;

		return translate( 'Choose a design' );
	}
	subHeaderText() {
		const { translate } = this.props;

		return translate( 'Pick your favorite homepage layout. You can customize or change it later.' );
	}

	render() {
		const { isReskinned, translate } = this.props;
		const { selectedDesign } = this.state;
		const headerText = this.headerText();
		const subHeaderText = this.subHeaderText();

		if ( selectedDesign ) {
			const isBlankCanvas = isBlankCanvasDesign( selectedDesign );
			const designTitle = isBlankCanvas ? translate( 'Blank Canvas' ) : selectedDesign.title;

			return (
				<StepWrapper
					{ ...this.props }
					className="design-picker__preview"
					fallbackHeaderText={ designTitle }
					headerText={ designTitle }
					fallbackSubHeaderText={ '' }
					subHeaderText={ '' }
					stepContent={ this.renderDesignPreview() }
					align={ 'center' }
					hideSkip
					hideNext={ false }
					nextLabelText={ translate( 'Start with %(designTitle)s', {
						args: { designTitle },
					} ) }
					goToNextStep={ this.submitDesign }
				/>
			);
		}

		return (
			<StepWrapper
				{ ...this.props }
				fallbackHeaderText={ headerText }
				headerText={ headerText }
				fallbackSubHeaderText={ subHeaderText }
				subHeaderText={ subHeaderText }
				stepContent={ this.renderDesignPicker() }
				align={ isReskinned ? 'left' : 'center' }
				skipButtonAlign={ isReskinned ? 'top' : 'bottom' }
			/>
		);
	}
}

export default connect(
	( state, { stepSectionName: themeId } ) => {
		return {
			demoUrl: themeId ? getThemeDemoUrl( state, themeId, 'wpcom' ) : '',
			themes: getRecommendedThemes( state, 'auto-loading-homepage' ),
		};
	},
	{ fetchRecommendedThemes, submitSignupStep }
)( localize( DesignPickerStep ) );
