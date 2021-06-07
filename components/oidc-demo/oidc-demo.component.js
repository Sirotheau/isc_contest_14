(function() {
  'use strict';

  angular.
    module('oidcDemo').
    component('oidcDemo', {
      templateUrl: 'components/oidc-demo/oidc-demo.template.html',
      controllerAs: 'oidcDemoController',
      controller: ['$http', '$rootScope', OIDCDemoController],
      bindings: {

      }
    });

  function OIDCDemoController($http, $rootScope) {
    var vm = this;

    $rootScope.clockSkew = 60; // seconds
    $rootScope.apiKey = 'kSJKJT5t1X7AtBSijoKqpSKATwJyaZm5dOXksaB3';
    $rootScope.clientID = '3ljdd90a25jbucspd7b1cd1imr';
    $rootScope.clientSecret = 'op313fmp3btav05pks95c96eqk4qta41sj6jh24usfg0377tuee';
    $rootScope.authUrl = 'https://yxlrtoae.auth.us-east-2.amazoncognito.com/oauth2/authorize';
    $rootScope.tokenUrl = 'https://yxlrtoae.auth.us-east-2.amazoncognito.com/oauth2/token';
    $rootScope.redirectUrl = 'https://portal.trial.isccloud.io/callback';
    $rootScope.scopes = 'openid profile user/*.*';
    $rootScope.accessToken = '';
    $rootScope.refreshToken = '';
    $rootScope.accessTokenExpirationDate = 0;
    $rootScope.refreshTokenExpirationDate = 0;

    var authUrl = $rootScope.authUrl + '?response_type=code&client_id=' + $rootScope.clientID + '&redirect_uri=' + $rootScope.redirectUrl + '&scope=' + $rootScope.scopes;
    window.location.href = authUrl;

    // Main

  }

})();
