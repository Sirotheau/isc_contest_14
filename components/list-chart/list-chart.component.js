(function() {
  'use strict';

  angular.
    module('listChart').
    component('listChart', {
      templateUrl: 'components/list-chart/list-chart.template.html',
      controllerAs: 'listChart',
      controller: ['$http', '$filter', '$rootScope', ListChartController],
      bindings: {
        title: '@',
        source: '@',
        groupBy: '@',
        units: '@',
        fractionSize: '<',
        hideHeader: '<',
        showSum: '<',
        showAverage: '<',
        showPercentage: '<',
        showPercentageBar: '<',
        extendPercentageBar: '<',
        others: '<',
        buttonIcon: '@',
        buttonMessage: '@',
        buttonLink: '@',
        sortType: '@',
        buckets: '<',
        filter: '@'
      }
    });

  function ListChartController($http, $filter, $rootScope) {
    var vm = this;

    vm.data = null;
    vm.loading = false;
    vm.fractionSize = vm.fractionSize || 0;
    vm.hideHeader = vm.hideHeader || false;
    vm.showSum = vm.showSum || false;
    vm.showAverage = vm.showAverage || false;
    vm.showPercentage = vm.showPercentage || false;
    vm.showPercentageBar = vm.showPercentageBar || false;
    vm.others = vm.others || 0;
    vm.extendPercentageBar = vm.extendPercentageBar || false;
    vm.sortType = vm.sortType || 'none';

    // Functions

    vm.loadData = function() {
      vm.startTime = Date.now();
      vm.loading = true;
      vm.errorCode = 0;
      vm.errorMessage = '';
      vm.data = null;
      vm.tempData = null;
      vm.sum = 0;
      vm.avg = 0;
      vm.min = 0;
      vm.max = 0;
      vm.sumOthers = 0;

      if (vm.sourceFilter) {
          var regex = /\[(.*?)\]/g;
          var group;
          while ((group = regex.exec(vm.sourceFilter)) !== null) {
              if (group.index === regex.lastIndex) {
                  regex.lastIndex++;
              }
              var value = $location.search()[group[1]];
              if (value) {
                var regex2 = new RegExp('\\[' + group[1] + '\\]', 'g');
                vm.sourceFilter = vm.sourceFilter.replace(regex2, value);
              }
          }
      }

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

          if (response.data.entry) {
            if (vm.tempData) {
              vm.tempData = vm.tempData.concat(response.data.entry);
            } else {
              vm.tempData = response.data.entry;
            }
          } else {
            vm.tempData = [];
          }

          if (!linkLast || linkSelf == linkLast) {

            var groups = new Map();
            if (vm.buckets) {
              for (var i = 0; i < vm.buckets.length; i++) {
                groups.set(vm.buckets[i].label, {label: vm.buckets[i].label, qty: 0, lowerLimit: vm.buckets[i].lowerLimit, upperLimit: vm.buckets[i].upperLimit});
                //console.log('Bucket: ' + JSON.stringify(vm.buckets[i]));
              }
            }
            for (var j = 0; j < vm.tempData.length; j++) {
              var group;
              var key = '';
              var fieldValue = eval('vm.tempData[j].' + vm.groupBy);
              if (vm.filter) {
                fieldValue = $filter(vm.filter)(fieldValue);
              }
              if (vm.buckets) {
                for (var bucket of groups.values()) {
                  if (!isNaN(fieldValue) && parseFloat(fieldValue) >= bucket.lowerLimit && parseFloat(fieldValue) < bucket.upperLimit) {
                    key = bucket.label;
                    break;
                  }
                }
                if (key) {
                  group = groups.get(key);
                  if (group) {
                    groups.set(key, {label: bucket.label, qty: (group.qty + 1), lowerLimit: group.lowerLimit, upperLimit: group.upperLimit});
                  }
                }
              }  else {
                key = fieldValue || '(Empty))';
                group = groups.get(key);
                if (group) {
                  groups.set(key, {label: key, qty: (group.qty + 1)});
                } else {
                  groups.set(key, {label: key, qty: 1});
                }
              }
            }

            if (groups.size > 0) {

              vm.data = [];
              for (var value of groups.values()) {
              	vm.data.push(value);
              }

              switch (vm.sortType.toLowerCase()) {
                case 'asc-label':
                  vm.data.sort((a, b) => (a.label > b.label) ? 1 : -1);
                  break;
                case 'desc-label':
                  vm.data.sort((a, b) => (a.label > b.label) ? -1 : 1);
                  break;
                case 'asc-qty':
                  vm.data.sort((a, b) => (parseInt(a.qty) > parseInt(b.qty)) ? 1 : (parseInt(a.qty) === parseInt(b.qty)) ? ((a.label > b.label) ? 1 : -1) : -1 );
                  break;
                case 'desc-qty':
                  vm.data.sort((a, b) => (parseInt(a.qty) > parseInt(b.qty)) ? -1 : (parseInt(a.qty) === parseInt(b.qty)) ? ((a.label > b.label) ? 1 : -1) : 1 );
                  break;
                default:

              }

              for (var i = 0; i < vm.data.length; i++) {
                vm.sum += vm.data[i].qty;
                if (vm.data[i].qty < vm.min) {
                  vm.min = vm.data[i].qty;
                }
                if (vm.data[i].qty > vm.max) {
                  vm.max = vm.data[i].qty;
                }
                if (vm.others && i >= vm.others) {
                  vm.sumOthers += vm.data[i].qty;
                }
              }
              if (vm.others) {
                vm.data = vm.data.slice(0, vm.others);
                var dataOthers = {};
                dataOthers.label = 'Others';
                dataOthers.qty = vm.sumOthers;
                vm.data.push(dataOthers);
              }
              vm.avg = vm.sum / (vm.data.length || 1);
            } else {
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
