(function() {
  'use strict';

  angular.module('demoApp', [
    'authorization',
    'authorizationCallback',
    'responsiveTable',
    'chart',
    'listChart',
    'cardChart'
  ]).run(['$rootScope', function ($rootScope) {
      $rootScope.clockSkew = 60; // seconds
      $rootScope.useOAuth = false;
      $rootScope.apiKey = 'kSJKJT5t1X7AtBSijoKqpSKATwJyaZm5dOXksaB3';
      $rootScope.clientID = '';
      $rootScope.clinetSecret = '';
      $rootScope.tokenUrl = '';
      $rootScope.accessToken = '';
      $rootScope.refreshToken = '';
      $rootScope.accessTokenExpirationDate = 0;
      $rootScope.refreshTokenExpirationDate = 0;
      $rootScope.getAccessToken = function() {
        var now = Date.now();
        if ($rootScope.accessToken && ($rootScope.accessTokenExpirationDate == 0 || $rootScope.accessTokenExpirationDate - $rootScope.clockSkew * 1000 > now)) {
          return $rootScope.accessToken;
        } else {
          if ($rootScope.refreshToken && ($rootScope.refreshTokenExpirationDate == 0 || $rootScope.refreshTokenExpirationDate - $rootScope.clockSkew * 1000 > now)) {
            // get new access token
          } else {
            // get access abd refresh token
          }
        }
      }
    }
  ]);

})();
