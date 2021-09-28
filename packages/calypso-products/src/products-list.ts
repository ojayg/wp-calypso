import { translate } from 'i18n-calypso';
import {
	FEATURE_ACTIVITY_LOG_1_YEAR_V2,
	FEATURE_ADVANCED_STATS_V2,
	FEATURE_AKISMET_V2,
	FEATURE_ANTISPAM_V2,
	FEATURE_BACKUP_DAILY_V2,
	FEATURE_BACKUP_REALTIME_V2,
	FEATURE_FILTERING_V2,
	FEATURE_INSTANT_EMAIL_V2,
	FEATURE_JETPACK_1TB_BACKUP_STORAGE,
	FEATURE_JETPACK_20GB_BACKUP_STORAGE,
	FEATURE_JETPACK_CLOUD_BASED_BACKUPS,
	FEATURE_JETPACK_ONE_CLICK_RESTORES_1_YEAR,
	FEATURE_JETPACK_ONE_CLICK_RESTORES_30_DAYS,
	FEATURE_JETPACK_REAL_TIME_BACKUPS,
	FEATURE_LANGUAGE_SUPPORT_V2,
	FEATURE_ONE_CLICK_FIX_V2,
	FEATURE_ONE_CLICK_RESTORE_V2,
	FEATURE_SCAN_V2,
	FEATURE_SEARCH_V2,
	FEATURE_SECURE_STORAGE_V2,
	FEATURE_SPAM_BLOCK_V2,
	FEATURE_SPELLING_CORRECTION_V2,
	PLAN_ANNUAL_PERIOD,
	PLAN_MONTHLY_PERIOD,
	PRODUCT_JETPACK_ANTI_SPAM,
	PRODUCT_JETPACK_ANTI_SPAM_MONTHLY,
	PRODUCT_JETPACK_BACKUP_DAILY,
	PRODUCT_JETPACK_BACKUP_DAILY_MONTHLY,
	PRODUCT_JETPACK_BACKUP_REALTIME,
	PRODUCT_JETPACK_BACKUP_REALTIME_MONTHLY,
	PRODUCT_JETPACK_BACKUP_T1_YEARLY,
	PRODUCT_JETPACK_BACKUP_T1_MONTHLY,
	PRODUCT_JETPACK_BACKUP_T2_YEARLY,
	PRODUCT_JETPACK_BACKUP_T2_MONTHLY,
	PRODUCT_JETPACK_SCAN,
	PRODUCT_JETPACK_SCAN_MONTHLY,
	PRODUCT_JETPACK_SCAN_REALTIME,
	PRODUCT_JETPACK_SCAN_REALTIME_MONTHLY,
	PRODUCT_JETPACK_SEARCH,
	PRODUCT_JETPACK_SEARCH_MONTHLY,
	PRODUCT_WPCOM_SEARCH,
	PRODUCT_WPCOM_SEARCH_MONTHLY,
	TERM_ANNUALLY,
	TERM_MONTHLY,
} from './constants';
import { getJetpackProductsShortNames } from './translations';
import type { ProductSlug, JetpackProductSlug, WPComProductSlug, Product } from './types';

const PRODUCT_SHORT_NAMES = getJetpackProductsShortNames();

export const JETPACK_SITE_PRODUCTS_WITH_FEATURES: Record<
	Exclude< JetpackProductSlug, WPComProductSlug >,
	Product
> = {
	[ PRODUCT_JETPACK_BACKUP_DAILY ]: {
		product_name: PRODUCT_SHORT_NAMES[ PRODUCT_JETPACK_BACKUP_DAILY ],
		product_slug: PRODUCT_JETPACK_BACKUP_DAILY,
		type: PRODUCT_JETPACK_BACKUP_DAILY,
		term: TERM_ANNUALLY,
		bill_period: PLAN_ANNUAL_PERIOD,
		getFeatures: () => [
			FEATURE_BACKUP_DAILY_V2,
			FEATURE_ONE_CLICK_RESTORE_V2,
			FEATURE_SECURE_STORAGE_V2,
		],
	},
	[ PRODUCT_JETPACK_BACKUP_DAILY_MONTHLY ]: {
		product_name: PRODUCT_SHORT_NAMES[ PRODUCT_JETPACK_BACKUP_DAILY_MONTHLY ],
		product_slug: PRODUCT_JETPACK_BACKUP_DAILY_MONTHLY,
		type: PRODUCT_JETPACK_BACKUP_DAILY,
		term: TERM_MONTHLY,
		bill_period: PLAN_MONTHLY_PERIOD,
		getFeatures: () => [
			FEATURE_BACKUP_DAILY_V2,
			FEATURE_ONE_CLICK_RESTORE_V2,
			FEATURE_SECURE_STORAGE_V2,
		],
	},
	[ PRODUCT_JETPACK_BACKUP_REALTIME ]: {
		product_name: PRODUCT_SHORT_NAMES[ PRODUCT_JETPACK_BACKUP_REALTIME ],
		product_slug: PRODUCT_JETPACK_BACKUP_REALTIME,
		type: PRODUCT_JETPACK_BACKUP_REALTIME,
		term: TERM_ANNUALLY,
		bill_period: PLAN_ANNUAL_PERIOD,
		getFeatures: () => [
			FEATURE_BACKUP_REALTIME_V2,
			FEATURE_ONE_CLICK_RESTORE_V2,
			FEATURE_SECURE_STORAGE_V2,
			FEATURE_ACTIVITY_LOG_1_YEAR_V2,
		],
	},
	[ PRODUCT_JETPACK_BACKUP_REALTIME_MONTHLY ]: {
		product_name: PRODUCT_SHORT_NAMES[ PRODUCT_JETPACK_BACKUP_REALTIME_MONTHLY ],
		product_slug: PRODUCT_JETPACK_BACKUP_REALTIME_MONTHLY,
		type: PRODUCT_JETPACK_BACKUP_REALTIME,
		term: TERM_MONTHLY,
		bill_period: PLAN_MONTHLY_PERIOD,
		getFeatures: () => [
			FEATURE_BACKUP_REALTIME_V2,
			FEATURE_ONE_CLICK_RESTORE_V2,
			FEATURE_SECURE_STORAGE_V2,
			FEATURE_ACTIVITY_LOG_1_YEAR_V2,
		],
	},
	[ PRODUCT_JETPACK_SCAN ]: {
		product_name: PRODUCT_SHORT_NAMES[ PRODUCT_JETPACK_SCAN ],
		product_slug: PRODUCT_JETPACK_SCAN,
		type: PRODUCT_JETPACK_SCAN,
		term: TERM_ANNUALLY,
		bill_period: PLAN_ANNUAL_PERIOD,
		getFeatures: () => [ FEATURE_SCAN_V2, FEATURE_ONE_CLICK_FIX_V2, FEATURE_INSTANT_EMAIL_V2 ],
	},
	[ PRODUCT_JETPACK_SCAN_MONTHLY ]: {
		product_name: PRODUCT_SHORT_NAMES[ PRODUCT_JETPACK_SCAN_MONTHLY ],
		product_slug: PRODUCT_JETPACK_SCAN_MONTHLY,
		type: PRODUCT_JETPACK_SCAN,
		term: TERM_MONTHLY,
		bill_period: PLAN_MONTHLY_PERIOD,
		getFeatures: () => [ FEATURE_SCAN_V2, FEATURE_ONE_CLICK_FIX_V2, FEATURE_INSTANT_EMAIL_V2 ],
	},
	// SCAN_REALTIME is not publically offered as an individual add-on product at this time
	[ PRODUCT_JETPACK_SCAN_REALTIME ]: {
		product_name: PRODUCT_SHORT_NAMES[ PRODUCT_JETPACK_SCAN_REALTIME ],
		product_slug: PRODUCT_JETPACK_SCAN_REALTIME,
		type: PRODUCT_JETPACK_SCAN_REALTIME,
		term: TERM_ANNUALLY,
		bill_period: PLAN_ANNUAL_PERIOD,
		getFeatures: () => [ FEATURE_SCAN_V2, FEATURE_ONE_CLICK_FIX_V2, FEATURE_INSTANT_EMAIL_V2 ],
	},
	[ PRODUCT_JETPACK_SCAN_REALTIME_MONTHLY ]: {
		product_name: PRODUCT_SHORT_NAMES[ PRODUCT_JETPACK_SCAN_REALTIME_MONTHLY ],
		product_slug: PRODUCT_JETPACK_SCAN_REALTIME_MONTHLY,
		type: PRODUCT_JETPACK_SCAN_REALTIME,
		term: TERM_MONTHLY,
		bill_period: PLAN_MONTHLY_PERIOD,
		getFeatures: () => [ FEATURE_SCAN_V2, FEATURE_ONE_CLICK_FIX_V2, FEATURE_INSTANT_EMAIL_V2 ],
	},
	[ PRODUCT_JETPACK_SEARCH ]: {
		product_name: PRODUCT_SHORT_NAMES[ PRODUCT_JETPACK_SEARCH ],
		product_slug: PRODUCT_JETPACK_SEARCH,
		type: PRODUCT_JETPACK_SEARCH,
		term: TERM_ANNUALLY,
		bill_period: PLAN_ANNUAL_PERIOD,
		getFeatures: () => [
			FEATURE_SEARCH_V2,
			FEATURE_FILTERING_V2,
			FEATURE_LANGUAGE_SUPPORT_V2,
			FEATURE_SPELLING_CORRECTION_V2,
		],
	},
	[ PRODUCT_JETPACK_SEARCH_MONTHLY ]: {
		product_name: PRODUCT_SHORT_NAMES[ PRODUCT_JETPACK_SEARCH_MONTHLY ],
		product_slug: PRODUCT_JETPACK_SEARCH_MONTHLY,
		type: PRODUCT_JETPACK_SEARCH,
		term: TERM_MONTHLY,
		bill_period: PLAN_MONTHLY_PERIOD,
		getFeatures: () => [
			FEATURE_SEARCH_V2,
			FEATURE_FILTERING_V2,
			FEATURE_LANGUAGE_SUPPORT_V2,
			FEATURE_SPELLING_CORRECTION_V2,
		],
	},
	[ PRODUCT_JETPACK_ANTI_SPAM ]: {
		product_name: PRODUCT_SHORT_NAMES[ PRODUCT_JETPACK_ANTI_SPAM ],
		product_slug: PRODUCT_JETPACK_ANTI_SPAM,
		type: PRODUCT_JETPACK_ANTI_SPAM,
		term: TERM_ANNUALLY,
		bill_period: PLAN_ANNUAL_PERIOD,
		getFeatures: () => [
			FEATURE_ANTISPAM_V2,
			FEATURE_AKISMET_V2,
			FEATURE_SPAM_BLOCK_V2,
			FEATURE_ADVANCED_STATS_V2,
		],
	},
	[ PRODUCT_JETPACK_ANTI_SPAM_MONTHLY ]: {
		product_name: PRODUCT_SHORT_NAMES[ PRODUCT_JETPACK_ANTI_SPAM_MONTHLY ],
		product_slug: PRODUCT_JETPACK_ANTI_SPAM_MONTHLY,
		type: PRODUCT_JETPACK_ANTI_SPAM,
		term: TERM_MONTHLY,
		bill_period: PLAN_MONTHLY_PERIOD,
		getFeatures: () => [
			FEATURE_ANTISPAM_V2,
			FEATURE_AKISMET_V2,
			FEATURE_SPAM_BLOCK_V2,
			FEATURE_ADVANCED_STATS_V2,
		],
	},
	[ PRODUCT_JETPACK_BACKUP_T1_YEARLY ]: {
		product_name: translate( 'Backup' ),
		product_slug: PRODUCT_JETPACK_BACKUP_T1_YEARLY,
		type: PRODUCT_JETPACK_BACKUP_T1_YEARLY,
		term: TERM_ANNUALLY,
		bill_period: PLAN_ANNUAL_PERIOD,
		getFeatures: () => [
			FEATURE_JETPACK_REAL_TIME_BACKUPS,
			FEATURE_JETPACK_CLOUD_BASED_BACKUPS,
			FEATURE_JETPACK_20GB_BACKUP_STORAGE,
			FEATURE_JETPACK_ONE_CLICK_RESTORES_30_DAYS,
		],
	},
	[ PRODUCT_JETPACK_BACKUP_T1_MONTHLY ]: {
		product_name: translate( 'Backup' ),
		product_slug: PRODUCT_JETPACK_BACKUP_T1_MONTHLY,
		type: PRODUCT_JETPACK_BACKUP_T1_YEARLY,
		term: TERM_MONTHLY,
		bill_period: PLAN_MONTHLY_PERIOD,
		getFeatures: () => [
			FEATURE_JETPACK_REAL_TIME_BACKUPS,
			FEATURE_JETPACK_CLOUD_BASED_BACKUPS,
			FEATURE_JETPACK_20GB_BACKUP_STORAGE,
			FEATURE_JETPACK_ONE_CLICK_RESTORES_30_DAYS,
		],
	},
	[ PRODUCT_JETPACK_BACKUP_T2_YEARLY ]: {
		product_name: translate( 'Backup' ),
		product_slug: PRODUCT_JETPACK_BACKUP_T2_YEARLY,
		type: PRODUCT_JETPACK_BACKUP_T2_YEARLY,
		term: TERM_ANNUALLY,
		bill_period: PLAN_ANNUAL_PERIOD,
		getFeatures: () => [
			FEATURE_JETPACK_REAL_TIME_BACKUPS,
			FEATURE_JETPACK_CLOUD_BASED_BACKUPS,
			FEATURE_JETPACK_1TB_BACKUP_STORAGE,
			FEATURE_JETPACK_ONE_CLICK_RESTORES_1_YEAR,
		],
	},
	[ PRODUCT_JETPACK_BACKUP_T2_MONTHLY ]: {
		product_name: translate( 'Backup' ),
		product_slug: PRODUCT_JETPACK_BACKUP_T2_MONTHLY,
		type: PRODUCT_JETPACK_BACKUP_T2_YEARLY,
		term: TERM_MONTHLY,
		bill_period: PLAN_MONTHLY_PERIOD,
		getFeatures: () => [
			FEATURE_JETPACK_REAL_TIME_BACKUPS,
			FEATURE_JETPACK_CLOUD_BASED_BACKUPS,
			FEATURE_JETPACK_1TB_BACKUP_STORAGE,
			FEATURE_JETPACK_ONE_CLICK_RESTORES_1_YEAR,
		],
	},
};

export const PRODUCTS_LIST: Record< ProductSlug, Product > = {
	...JETPACK_SITE_PRODUCTS_WITH_FEATURES,
	[ PRODUCT_WPCOM_SEARCH ]: {
		product_name: PRODUCT_SHORT_NAMES[ PRODUCT_WPCOM_SEARCH ],
		product_slug: PRODUCT_WPCOM_SEARCH,
		type: PRODUCT_WPCOM_SEARCH,
		term: TERM_ANNUALLY,
		bill_period: PLAN_ANNUAL_PERIOD,
	},
	[ PRODUCT_WPCOM_SEARCH_MONTHLY ]: {
		product_name: PRODUCT_SHORT_NAMES[ PRODUCT_WPCOM_SEARCH_MONTHLY ],
		product_slug: PRODUCT_WPCOM_SEARCH_MONTHLY,
		type: PRODUCT_WPCOM_SEARCH,
		term: TERM_MONTHLY,
		bill_period: PLAN_MONTHLY_PERIOD,
	},
};

export function objectIsProduct( item: unknown ): item is Product {
	if ( item !== null && typeof item === 'object' ) {
		const product = item as Product;
		if ( product.product_slug && product.product_name && product.term && product.bill_period ) {
			return true;
		}
	}
	return false;
}
