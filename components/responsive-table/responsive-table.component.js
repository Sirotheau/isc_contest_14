(function() {
  'use strict';

  angular.
    module('responsiveTable').
    component('responsiveTable', {
      templateUrl: 'responsive-table/responsive-table.template.html',
      controllerAs: 'responsiveTable',
      controller: ['$scope', '$http', '$filter', 'GroundTrackService', ResponsiveTableController],
      bindings: {
        id: '@',
        title: '@',
        source: '@',
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

  function ResponsiveTableController($scope, $http, $filter, GroundTrackService) {
    var vm = this;

    vm.data = null;
    vm.filteredData = [];
    vm.fields = vm.fields || [];
    vm.buttons = vm.buttons || [];
    vm.page = 1;
    vm.title = vm.title || 'Table Title';
    vm.hideHeader = vm.hideHeader || false;
    vm.pageSize = vm.pageSize || 5;
    vm.orderBy = vm.orderBy || 'description';
    vm.reverse = vm.reverse || false;
    vm.timezoneSelector = vm.timezoneSelector || false;
    vm.timezoneUTC = vm.timezoneUTC || false;
    vm.loadingMessage = vm.loadingMessage || 'Loading';
    vm.collapsed = vm.collapsed || false;
    vm.loading = false;
    vm.currentId = null;
    vm.pagination = [];
    vm.paginationSize = vm.paginationSize || 10;
    vm.startPage = 1;
    vm.endPage = 1;
    vm.totalPages = 1;

    // Functions

    vm.viewGroundTrack = function(line0, line1, line2, type, apogee, perigee) {
      var data = {};
      data.line0 = line0;
      data.line1 = line1; //'1 25544U 98067A   17098.86053830 +.00003442 +00000-0 +59411-4 0  9995';
      data.line2 = line2; //'2 25544 051.6434 023.8590 0006670 038.3011 068.5407 15.54042428050973';
      data.type = type;
      data.apogee = apogee;
      data.perigee = perigee;
      GroundTrackService.setData(data);
    };

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
      vm.setPage(1);
      vm.pageSize = size;
    };

    vm.newRecord = function() {
      $('#' + vm.id + '-form').modal('show');
    };

    vm.viewRecord = function(id) {

    };

    vm.loadData = function() {
      vm.loading = true;
      vm.errorCode = 0;
      vm.errorMessage = '';
      vm.data = null;

//    setTimeout(function() {
      $http.get('data/' + vm.source).then(function(response) {
        vm.data = response.data;
        vm.loading = false;
      }, function(response) {
        vm.errorCode = response.status;
        vm.errorMessage = response.statusText;
        vm.loading = false;
      });
//    }, (Math.random() * 200) + 100);

    };

    // Main

    $scope.$watch('filteredData.length', function() {
      vm.refreshPagination($scope.filteredData ? $scope.filteredData.length : 0, true);
    });

    vm.loadData();

  }

})();
