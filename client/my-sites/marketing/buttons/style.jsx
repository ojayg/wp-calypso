/**
 * External dependencies
 */
import PropTypes from 'prop-types';
import { localize } from 'i18n-calypso';
import React from 'react';
import { connect } from 'react-redux';

/**
 * Internal dependencies
 */
import { recordTracksEvent } from 'lib/analytics/tracks';
import { gaRecordEvent } from 'lib/analytics/ga';
import getCurrentRouteParameterized from 'state/selectors/get-current-route-parameterized';
import { getSelectedSiteId } from 'state/ui/selectors';
import FormLabel from 'calypso/components/forms/form-label';
import FormRadio from 'calypso/components/forms/form-radio';

class SharingButtonsStyle extends React.Component {
	static displayName = 'SharingButtonsStyle';

	static propTypes = {
		onChange: PropTypes.func,
		value: PropTypes.string,
		disabled: PropTypes.bool,
	};

	static defaultProps = {
		onChange: function () {},
		disabled: false,
	};

	onChange = ( value ) => {
		const { path } = this.props;

		this.props.onChange( value );
		recordTracksEvent( 'calypso_sharing_buttons_style_radio_button_click', {
			value,
			path,
		} );
		gaRecordEvent( 'Sharing', 'Clicked Button Style Radio Button', value );
	};

	getOptions = () => {
		return [
			{
				value: 'icon-text',
				label: this.props.translate( 'Icon & Text', {
					context: 'Sharing: Sharing button option label',
				} ),
			},
			{
				value: 'icon',
				label: this.props.translate( 'Icon Only', {
					context: 'Sharing: Sharing button option label',
				} ),
			},
			{
				value: 'text',
				label: this.props.translate( 'Text Only', {
					context: 'Sharing: Sharing button option label',
				} ),
			},
			{
				value: 'official',
				label: this.props.translate( 'Official Buttons', {
					context: 'Sharing: Sharing button option label',
				} ),
			},
		].map( function ( option ) {
			return (
				<FormLabel key={ option.value }>
					<FormRadio
						name="sharing_button_style"
						checked={ option.value === this.props.value }
						onChange={ this.onChange.bind( null, option.value ) }
						disabled={ this.props.disabled }
					/>
					{ option.label }
				</FormLabel>
			);
		}, this );
	};

	render() {
		return (
			<fieldset className="sharing-buttons__fieldset">
				<legend className="sharing-buttons__fieldset-heading">
					{ this.props.translate( 'Button style', {
						context: 'Sharing: Sharing button option heading',
					} ) }
				</legend>
				{ this.getOptions() }
			</fieldset>
		);
	}
}

export default connect( ( state ) => {
	return { path: getCurrentRouteParameterized( state, getSelectedSiteId( state ) ) };
} )( localize( SharingButtonsStyle ) );
