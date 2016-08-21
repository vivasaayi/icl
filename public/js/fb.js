define(['facebook'], function () {
	FB.init({
		appId: '876934722326703',
		version: 'v2.3',
		xfbml: true  // parse XFBML
	});
	FB.getLoginStatus(function (response) {
		console.log(response);
	});
});