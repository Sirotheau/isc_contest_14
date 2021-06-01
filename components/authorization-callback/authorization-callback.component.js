(function() {
  'use strict';

  angular.
    module('authorizationCallback').
    component('authorizationCallback', {
      templateUrl: 'components/authorization-callback/authorization-callback.template.html',
      controllerAs: 'authorizationCallbackController',
      controller: ['$http', '$rootScope', AuthorizationCallbackController],
      bindings: {

      }
    });

  function getCookie(cname) {
    var name = cname + '=';
    var decodedCookies = decodeURIComponent(document.cookie);
    var cookies = decodedCookies.split(';');
    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i];
      while (cookie.charAt(0) == ' ') {
        cookie = cookie.substring(1);
      }
      if (cookie.indexOf(name) == 0) {
        return cookie.substring(name.length, cookie.length);
      }
    }
    return '';
  }

  function AuthorizationCallbackController($http, $rootScope) {
    var vm = this;

    $rootScope.clockSkew = 60; // seconds
    $rootScope.apiKey = 'kSJKJT5t1X7AtBSijoKqpSKATwJyaZm5dOXksaB3';
    $rootScope.clientID = '3ljdd90a25jbucspd7b1cd1imr';
    $rootScope.clientSecret = 'op313fmp3btav05pks95c96eqk4qta41sj6jh24usfg0377tuee';
    $rootScope.authUrl = 'https://yxlrtoae.auth.us-east-2.amazoncognito.com/oauth2/authorize';
    $rootScope.tokenUrl = 'https://yxlrtoae.auth.us-east-2.amazoncognito.com/oauth2/token';
    $rootScope.redirectUrl = 'https://portal.trial.isccloud.io/callback';
    $rootScope.issuer = 'https://cognito-idp.us-east-2.amazonaws.com/us-east-2_zw289g2Al';
    $rootScope.scopes = 'openid profile user/*.*';
    $rootScope.accessToken = '';
    $rootScope.refreshToken = '';
    $rootScope.accessTokenExpirationDate = 0;
    $rootScope.refreshTokenExpirationDate = 0;

    // Functions

    vm.getAccessToken = function() {
      vm.loading = true;
      vm.errorCode = 0;
      vm.errorMessage = '';
      vm.data = null;

      var urlParams = new URLSearchParams(window.location.search);
      var code = urlParams.get('code');
      if (code) {

        $http({
          method: 'POST',
          url: $rootScope.tokenUrl,
          headers: {
             'Content-Type': 'application/x-www-form-urlencoded'
           },
           data: 'grant_type=authorization_code&code=' + code + '&client_id=' + $rootScope.clientID + '&client_secret=' + $rootScope.clientSecret + '&redirect_uri=' + encodeURIComponent($rootScope.redirectUrl)
        }).then(function successCallback(response) {
            vm.data = response.data;
            if (vm.data.access_token) {
              var accessToken = atob(vm.data.access_token.split('.')[1]);
              var iss = accessToken.iss;
              if (iss != $rootScope.issuer) {
                vm.errorCode = '-1';
                vm.errorMessage = 'Invalid Issuer';
                vm.loading = false;
                return;
              }
              var exp = accessToken.exp;
              var expUTC = new Date(exp).toUTCString();
              document.cookie = 'accessToken=' + vm.data.access_token +'; expires=' + expUTC;
              document.cookie = 'authorizationMethod=oidc; expires=' + expUTC;

              if (vm.data.refresh_token) {
                alert('refresh_token: ' + atob(vm.data.refresh_token.split('.')[1]));
              }
            }


            window.location.href = 'index.html';
          },
          function errorCallback(response) {
            vm.errorCode = response.status;
            vm.errorMessage = response.statusText;
            vm.loading = false;
        });

      }
    };

    // Main
    vm.getAccessToken();

  }

})();
