(function() {
  'use strict';

  angular.
    module('cardChart').
    component('cardChart', {
      templateUrl: 'components/card-chart/card-chart.template.html',
      controllerAs: 'cardChartController',
      controller: ['$http', '$rootScope', CardChartController],
      bindings: {
        canvasId: '@',
        type: '@',
        title: '@',
        titlePosition: '@',
        description: '@',
        width: '<',
        height: '<',
        source: '@',
        sourceFilter: '@',
        aggregateFunction: '@',
        aggregateField: '@',
        url: '@',
        panelIcon: '@',
        panelColor: '@',
        showLegend: '<',
        legendPosition: '@',
        groupBy: '@'
      }
    });

  function CardChartController($http, $rootScope) {
    var vm = this;

    vm.data = null;
    vm.width = vm.width || 300;
    vm.height = vm.height || 300;
    vm.aggregateFunction = vm.aggregateFunction || 'count';
    vm.showLegend = vm.showLegend || false;
    vm.titlePosition = (vm.titlePosition || 'top').toLowerCase().trim();
    vm.legendPosition = (vm.legendPosition || 'right').toLowerCase().trim();
    vm.loading = false;
    vm.calls = 0;

    // Functions

    vm.loadData = function() {
      vm.loading = true;
      vm.errorCode = 0;
      vm.errorMessage = 0;
      vm.data = null;

      var requestHeaders = {};
      requestHeaders['Accept'] = "application/fhir+json";
      if ($rootScope.useOAuth) {
        requestHeaders['Authorization'] = 'Bearer ' + $rootScope.getAccessToken();
      } else {
        requestHeaders['x-api-key'] = $rootScope.apiKey;
      }

      var url = 'https://fhir.yxlrtoae.static-test-account.isccloud.io/' + vm.source + (vm.sourceFilter ? '?' + vm.sourceFilter : '');
      vm.callAPI(url, requestHeaders, 1);

    };

    vm.callAPI = function(requestUrl, requestHeaders, count) {
        vm.calls = count;
        $http({
        method: 'GET',
        url: requestUrl,
        headers: requestHeaders
      }).then(function successCallback(response) {

          var links = response.data.link;
          var linkSelf = '';
          var linkLast = '';
          var linkNext = '';
          for (var i = 0; i < links.length; i++) {
            switch (links[i].relation) {
              case 'self':
                linkSelf = links[i].url;
                break;
              case 'last':
                linkLast = links[i].url;
                break;
              case 'next':
                linkNext = links[i].url;
                break;
              default:

            }
          }

          if (vm.aggregateFunction != 'count' && response.data.entry) {
            if (vm.tempData) {
              vm.tempData = vm.tempData.concat(response.data.entry);
            } else {
              vm.tempData = response.data.entry;
            }
          } else {
            vm.tempData = [];
          }

          if (vm.aggregateFunction == 'count' || !linkLast || linkSelf == linkLast) {
            switch (vm.aggregateFunction) {
              case 'count':
                vm.data = [{value: response.data.total}];
                break;
              case 'sum':
                //vm.data = vm.tempData;
                break;
              default:
                vm.data = [];
            }
            vm.loading = false;
            vm.endTime = Date.now();
            vm.executionTime = ((vm.endTime - vm.startTime)/1000).toFixed(3);
          } else {
            vm.callAPI(linkNext, requestHeaders, vm.calls + 1);
          }
        },
        function errorCallback(response) {
          vm.errorCode = response.status;
          vm.errorMessage = response.statusText;
          vm.loading = false;
          vm.endTime = Date.now();
          vm.executionTime = 'API Execution Time: ' + ((vm.endTime - vm.startTime)/1000).toFixed(3);
          //$scope.apply();
      });
    }

    // Main

    vm.loadData();

  }

})();
