import { I18n } from '@wordpress/i18n';

import { LanguageGroup } from './Language';

export const createLanguageGroups = ( __: I18n[ '__' ] ): LanguageGroup[] => [
	{
		id: 'popular',
		name: () => __( 'Popular languages', __i18n_text_domain__ ),
	},
	{
		id: 'africa-middle-east',
		name: () => __( 'Africa and Middle East', __i18n_text_domain__ ),
		subTerritories: [ '145', '002' ],
		countries: [
			'AE',
			'AM',
			'AO',
			'AZ',
			'BF',
			'BH',
			'BI',
			'BJ',
			'BW',
			'CD',
			'CF',
			'CG',
			'CI',
			'CM',
			'CV',
			'CY',
			'DJ',
			'DZ',
			'EA',
			'EG',
			'EH',
			'ER',
			'ET',
			'GA',
			'GE',
			'GH',
			'GM',
			'GN',
			'GQ',
			'GW',
			'IC',
			'IL',
			'IQ',
			'JO',
			'KE',
			'KM',
			'KW',
			'LB',
			'LR',
			'LS',
			'LY',
			'MA',
			'MG',
			'ML',
			'MR',
			'MU',
			'MW',
			'MZ',
			'NA',
			'NE',
			'NG',
			'OM',
			'PS',
			'QA',
			'RE',
			'RW',
			'SA',
			'SC',
			'SD',
			'SH',
			'SL',
			'SN',
			'SO',
			'SS',
			'ST',
			'SY',
			'SZ',
			'TD',
			'TG',
			'TN',
			'TR',
			'TZ',
			'UG',
			'YE',
			'YT',
			'ZA',
			'ZM',
			'ZW',
		],
	},
	{
		id: 'americas',
		name: () => __( 'Americas', __i18n_text_domain__ ),
		subTerritories: [ '019' ],
		countries: [
			'AG',
			'AI',
			'AR',
			'AW',
			'BB',
			'BL',
			'BM',
			'BO',
			'BQ',
			'BR',
			'BS',
			'BZ',
			'CA',
			'CL',
			'CO',
			'CR',
			'CU',
			'CW',
			'DM',
			'DO',
			'EC',
			'FK',
			'GD',
			'GF',
			'GL',
			'GP',
			'GT',
			'GY',
			'HN',
			'HT',
			'JM',
			'KN',
			'KY',
			'LC',
			'MF',
			'MQ',
			'MS',
			'MX',
			'NI',
			'PA',
			'PE',
			'PM',
			'PR',
			'PY',
			'SR',
			'SV',
			'SX',
			'TC',
			'TT',
			'US',
			'UY',
			'VC',
			'VE',
			'VG',
			'VI',
		],
	},
	{
		id: 'asia-pacific',
		default: true,
		name: () => __( 'Asia-Pacific', __i18n_text_domain__ ),
		subTerritories: [ '143', '009', '030', '034', '035' ],
		countries: [
			'AC',
			'AF',
			'AQ',
			'AS',
			'AU',
			'BD',
			'BN',
			'BT',
			'BV',
			'CC',
			'CK',
			'CN',
			'CP',
			'CX',
			'DG',
			'FJ',
			'FM',
			'GS',
			'GU',
			'HK',
			'HM',
			'ID',
			'IN',
			'IO',
			'IR',
			'JP',
			'KG',
			'KH',
			'KI',
			'KP',
			'KR',
			'KZ',
			'LA',
			'LK',
			'MH',
			'MM',
			'MN',
			'MO',
			'MP',
			'MV',
			'MY',
			'NC',
			'NF',
			'NP',
			'NR',
			'NU',
			'NZ',
			'PF',
			'PG',
			'PH',
			'PK',
			'PN',
			'PW',
			'QO',
			'SB',
			'SG',
			'TA',
			'TF',
			'TH',
			'TJ',
			'TK',
			'TL',
			'TM',
			'TO',
			'TV',
			'TW',
			'UM',
			'UZ',
			'VN',
			'VU',
			'WF',
			'WS',
		],
	},
	{
		id: 'eastern-europe',
		name: () => __( 'Eastern Europe', __i18n_text_domain__ ),
		subTerritories: [ '151' ],
		countries: [ 'BG', 'BY', 'CZ', 'HU', 'MD', 'PL', 'RO', 'RU', 'SK', 'UA' ],
	},
	{
		id: 'western-europe',
		name: () => __( 'Western Europe', __i18n_text_domain__ ),
		subTerritories: [ '154', '155', '039' ],
		countries: [
			'AD',
			'AL',
			'AT',
			'AX',
			'BA',
			'BE',
			'CH',
			'DE',
			'DK',
			'EE',
			'ES',
			'FI',
			'FO',
			'FR',
			'GB',
			'GG',
			'GI',
			'GR',
			'HR',
			'IE',
			'IM',
			'IS',
			'IT',
			'JE',
			'LI',
			'LT',
			'LU',
			'LV',
			'MC',
			'ME',
			'MK',
			'MT',
			'NL',
			'NO',
			'PT',
			'RS',
			'SE',
			'SI',
			'SJ',
			'SM',
			'VA',
			'XK',
		],
	},
];
