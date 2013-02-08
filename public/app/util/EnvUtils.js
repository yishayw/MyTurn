Ext.define('testing.util.EnvUtils', {
	alternateClassName: 'EnvUtils',
	singleton: true,
	isNative: function() {
		var result = typeof(device) !== 'undefined' && device && device.name;
		return result;
	}
});