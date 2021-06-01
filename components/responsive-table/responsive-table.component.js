(function() {
  'use strict';

  angular.
    module('responsiveTable').
    component('responsiveTable', {
      templateUrl: 'components/responsive-table/responsive-table.template.html',
      controllerAs: 'responsiveTable',
      controller: ['$scope', '$http', '$filter', '$window', '$location', '$rootScope', ResponsiveTableController],
      bindings: {
        id: '@',
        title: '@',
        source: '@',
        sourceFilter: '@',
        uniqueColumn: '@',
        orderBy: '@',
        reverse: '<',
        pageSize: '<',
        paginationSize: '<',
        hideHeader: '<',
        timezoneSelector: '<',
        timezoneUTC: '<',
        loadingMessage: '@',
        collapsed: '<',
        buttons: '<',
        fields: '<'
      }
    });

  function ResponsiveTableController($scope, $http, $filter, $window, $location, $rootScope) {
    var vm = this;

  //  this.$onInit = function() {

      vm.data = null;
      vm.filteredData = [];
      vm.fields = vm.fields || [];
      vm.buttons = vm.buttons || [];
      vm.page = 1;
      vm.title = vm.title || 'Table Title';
      vm.hideHeader = vm.hideHeader || false;
      vm.pageSize = vm.pageSize || '10';
      vm.orderBy = vm.orderBy || 'description';
      vm.reverse = vm.reverse || false;
      vm.timezoneSelector = vm.timezoneSelector || false;
      vm.timezoneUTC = vm.timezoneUTC || false;
      vm.loadingMessage = vm.loadingMessage || 'Loading';
      vm.collapsed = vm.collapsed || false;
      vm.loading = false;
      vm.uniqueColumn = vm.uniqueColumn || 'resource.id';
      vm.currentId = null;
      vm.pagination = [];
      vm.paginationSize = vm.paginationSize || 10;
      vm.startPage = 1;
      vm.endPage = 1;
      vm.totalPages = 1;
      vm.calls = 0;

      // Functions

      vm.formatData = function(data, filter, options) {
        filter = filter.toLowerCase();
        options = options || {};
        switch(filter) {
          case 'date':
            return $filter(filter)(data, options.format, options.timezone);
          case 'datetimezone':
            if (!data) {
              return '';
            }
            if (vm.timezoneUTC) {
              options.dateFormat.timeZone = 'UTC';
            } else {
              delete options.dateFormat.timeZone;
            }
            return new Date(data).toLocaleDateString(options.locale || navigator.language || navigator.userLanguage, options.dateFormat);
          case 'timetimezone':
            if (!data) {
              return '';
            }
            if (vm.timezoneUTC) {
              options.timeFormat.timeZone = 'UTC';
            } else {
              delete options.timeFormat.timeZone;
            }
            return new Date(data).toLocaleTimeString(options.locale || navigator.language || navigator.userLanguage, options.timeFormat).replace('GMT', 'UTC');
          case 'datetimetimezone':
            if (!data) {
              return '';
            }
            if (vm.timezoneUTC) {
              options.dateFormat.timeZone = 'UTC';
              options.timeFormat.timeZone = 'UTC';
            } else {
              delete options.dateFormat.timeZone;
              delete options.timeFormat.timeZone;
            }
            return new Date(data).toLocaleDateString(options.locale || navigator.language || navigator.userLanguage, options.dateFormat) + (options.separator || ' ') + new Date(data).toLocaleTimeString(options.locale || navigator.language || navigator.userLanguage, options.timeFormat).replace('GMT', 'UTC');
          case 'duration':
            var hours = Math.floor(data);
            var minutes = Math.round(60 * (data - hours));
            return Math.floor(data) + ':' + (minutes < 10 ? '0' + minutes : minutes);
          case 'currency':
            return $filter(filter)(data, options.symbol, options.fractionSize);
          case 'number':
            return $filter(filter)(data, options.fractionSize);
          case 'integer':
            return $filter('number')(data, '0');
          case 'reference':
            var display = data.display || '(Empty)';
            if (options.displayUniqueColumn) {
              return display + ' (' + data.reference.split('/')[1] + ')';
            } else {
              return display;
            }
          default:
            return data;
        }
      };

      vm.refreshPagination = function(length, reset) {
        if (reset) {
          vm.setPage(1);
        }
        vm.totalPages = Math.ceil(length / vm.pageSize);
        if (vm.totalPages <= vm.paginationSize) {
          vm.startPage = 1;
          vm.endPage = vm.totalPages;
        } else {
          //vm.startPage = vm.page <= 6 ? 1 : (vm.totalPages - vm.page >= 5 ? vm.page - 5 : vm.totalPages - vm.paginationSize + 1);
          vm.startPage = vm.totalPages - vm.page >= Math.round((vm.paginationSize - 1) / 2) ? Math.max(vm.page - Math.round((vm.paginationSize - 1) / 2), 1) : vm.totalPages - vm.paginationSize + 1;
          vm.endPage = vm.startPage + vm.paginationSize - 1;
        }
        vm.pagination = [];
        for (var i = vm.startPage; i <= vm.endPage; i++) {
          vm.pagination.push(i);
        }
      };

      vm.setOrderBy = function(field) {
        vm.setPage(1);
        if (vm.orderBy == field) {
          vm.reverse = !vm.reverse;
        } else {
          vm.orderBy = field;
          vm.reverse = false;
        }
      };

      vm.setPage = function(page) {
        if (page >= 1 && page <= vm.totalPages) {
          vm.page = page;
          vm.refreshPagination($scope.filteredData ? $scope.filteredData.length : 0, false);
        }
      };

      vm.setPageSize = function(size) {
        vm.pageSize = size;
        vm.setPage(1);
      };

      vm.newRecord = function() {
        $('#' + vm.id + '-form').modal('show');
      };

      vm.viewRecord = function(id) {
        $window.location.href = vm.source.toLowerCase() + '-record.html#?id=' + id;
        //alert(id);
      };

      vm.loadData = function() {
        vm.startTime = Date.now();
        vm.loading = true;
        vm.errorCode = 0;
        vm.errorMessage = '';
        vm.data = null;
        vm.tempData = null;

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
            //if (!linkLast || linkSelf == linkLast || count >= 10) {
              vm.data = vm.tempData;
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

      $scope.$watch('filteredData.length', function() {
        vm.refreshPagination($scope.filteredData ? $scope.filteredData.length : 0, true);
      });

      vm.loadData();

    //}

  }

})();
