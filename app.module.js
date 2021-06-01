(function() {
  'use strict';

  angular.module('demoApp', [
    'responsiveTable'
  ]).run(['$rootScope', '$http', '$q', function ($rootScope, $http, $q) {
      $rootScope.clockSkew = 60; // seconds
      $rootScope.useOAuth = false;
      $rootScope.apiKey = 'kSJKJT5t1X7AtBSijoKqpSKATwJyaZm5dOXksaB3';
      $rootScope.clientID = '1gf4u84inf7chgvbcisc7cn0iu';
      $rootScope.clientSecret = '1mft6ef71fj1h8j7at7ags5lmc2oie1ue3bad8o5ehp92u8rtsup';
      $rootScope.authUrl = 'https://yxlrtoae.auth.us-east-2.amazoncognito.com/oauth2/authorize';
      $rootScope.tokenUrl = 'https://yxlrtoae.auth.us-east-2.amazoncognito.com/oauth2/token';
      $rootScope.redirectUrl = 'https://portal.trial.isccloud.io/callback';
      $rootScope.scopes = 'openid profile';
      $rootScope.accessToken = 'yJraWQiOiJJcmV5bGtRaEw0U2pHeG0xeU9pXC9BKzFna0lqXC9GQ3kxQ1phdEZtaVk3RVU9IiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiJkYjFjNDA4My05YTRhLTQ1YzUtOTI4ZC0zZGE2NzczZjVmMTYiLCJ0b2tlbl91c2UiOiJhY2Nlc3MiLCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIHVzZXJcLyouKiIsImF1dGhfdGltZSI6MTYyMjQ0NDUzMCwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLWVhc3QtMi5hbWF6b25hd3MuY29tXC91cy1lYXN0LTJfencyODlnMkFsIiwiZXhwIjoxNjIyNDQ4MTMwLCJpYXQiOjE2MjI0NDQ1MzIsInZlcnNpb24iOjIsImp0aSI6IjE3OTBmODk4LWQ2YzAtNGExNS04N2YzLTE3N2E0ZGE0ZDk4ZCIsImNsaWVudF9pZCI6IjNsamRkOTBhMjVqYnVjc3BkN2IxY2QxaW1yIiwidXNlcm5hbWUiOiJ0ZXN0In0.gkMT_QVOkG8HqAkovtusz6TydCtTjRWQ5Bz6l7yr2RYN3yF8ijfXw6MgC6LLvd-NGfCOr_FBanHGipX3bskjAiKG3xWwFRYRPaA8IqzVVHXrrG22Z7-Y4pqEfTPC0LMs_73OT0mZv5qZCQpif4C22E2u6Okp17MXywJ8F8tExHlKy5CIjRtzBd4tLZnUsvOxGipEulCzNj_HJLs61009zhiWo9XMowMxxdVDpO_asfP7zoy6KL7EE7bMrncq8iqCXZW6etItGKYJVNLmksXcAllQsJe9YC9M6E2qE4SWx_cZ7gGztOeG0NyXvmACkSJTqHJS3SZNCS9qRRCCWem9SA';
      $rootScope.refreshToken = '';
      $rootScope.accessTokenExpirationDate = 0;
      $rootScope.refreshTokenExpirationDate = 0;
      $rootScope.getAccessToken3 = function() {


        var request = new XMLHttpRequest();
        var url = $rootScope.authUrl + '?response_type=code&client_id=' + $rootScope.clientID + '&redirect_uri=' + $rootScope.redirectUrl + '&scope=' + $rootScope.scopes;
        request.open('GET', url, false);
        request.send({});

        if (request.status === 200) {
          $rootScope.value = 'ok';
        } else if (request.status === 302) {
          alert('redirect:' + request.getResponseHeader("Location"));
          $rootScope.value = 'redirect';
        } else {
          $rootScope.value = 'error';
        }

        console.log('test=' + $rootScope.value);
        return $rootScope.value;
      }
      $rootScope.getAccessToken = function() {

        var now = Date.now();
        if ($rootScope.accessToken && ($rootScope.accessTokenExpirationDate == 0 || $rootScope.accessTokenExpirationDate - $rootScope.clockSkew * 1000 > now)) {
          return $rootScope.accessToken;
        } else {
          if ($rootScope.refreshToken && ($rootScope.refreshTokenExpirationDate == 0 || $rootScope.refreshTokenExpirationDate - $rootScope.clockSkew * 1000 > now)) {
            // get new access token
            return $rootScope.refreshAccessToken();
          } else {
            // get access and refresh token
            var myPromise = $rootScope.obtainAccessAndRefreshToken();
            // wait until the promise return resolve or eject
            //"then" has 2 functions (resolveFunction, rejectFunction)
            myPromise.then(function(resolve){
                alert(resolve);
                }, function(reject){
                alert(reject)
            });


            return '2342342342342';
          }
        }

      };
      $rootScope.obtainAccessAndRefreshToken = function() {
        var deferred = $q.defer();
        $http({
          url: 'ajax.php',
          method: 'GET',
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
          })
          //if request is successful
          .success(function(data,status,headers,config){

              //resolve the promise
              $rootScope.value = 'ok';
              deferred.resolve('request successful');

          })
          //if request is not successful
          .error(function(data,status,headers,config){
              //reject the promise
              $rootScope.value = 'error';
              deferred.reject('ERROR');
          });

        //return the promise
        return deferred.promise;

      };

    }
  ]);

})();
