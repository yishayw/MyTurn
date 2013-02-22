Ext.define('testing.util.UrlUtils', {
	singleton: true,
	getBaseUrl: function() {
		var isNative = EnvUtils.isNative();
		var url = isNative ? 'http://mturn.hp.af.cm/' : '';
		return url;
	}
});