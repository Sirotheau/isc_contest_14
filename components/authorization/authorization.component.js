(function() {
  'use strict';

  angular.
    module('authorization').
    component('authorization', {
      templateUrl: 'components/authorization/authorization.template.html',
      controllerAs: 'authorizationController',
      controller: ['$http', '$rootScope', AuthorizationController],
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

  function AuthorizationController($http, $rootScope) {
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

    var accessToken = getCookie('accessToken');
    if (accessToken) {
      $rootScope.useOAuth = true;
      vm.method = 'oidc';
    } else {
      $rootScope.useOAuth = false;
      vm.method = 'api-key';
    }

    // Functions

    vm.setAuthorization = function(method) {
      if (method == 'oidc') {
        var accessToken = getCookie('accessToken');
        if (accessToken) {
          $rootScope.accessToken = accessToken;
          vm.method = 'oidc';
          $rootScope.useOAuth = true;
        } else {
          var authUrl = $rootScope.authUrl + '?response_type=code&client_id=' + $rootScope.clientID + '&redirect_uri=' + $rootScope.redirectUrl + '&scope=' + $rootScope.scopes;
          window.location.href = authUrl;
        }
      } else {
        $rootScope.useOAuth = false;
        $rootScope.accessToken = '';
      }
    };

    // Main

  }

})();
