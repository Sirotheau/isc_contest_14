(function() {
  'use strict';

  angular.
    module('responsiveForm').
    component('responsiveForm', {
      templateUrl: 'components/responsive-form/responsive-form.template.html',
      controllerAs: 'responsiveForm',
      controller: ['$scope', '$http', '$filter', '$location', '$rootScope', ResponsiveFormController],
      bindings: {
        id: '@',
        recordID: '@',
        title: '@',
        source: '@',
        sourceFilter: '@',
        uniqueColumn: '@',
        focusField: '@',
        hideHeader: '<',
        timezoneSelector: '<',
        timezoneUTC: '<',
        loadingMessage: '@',
        collapsed: '<',
        buttons: '<',
        fields: '<'
      }
    });

  function ResponsiveFormController($scope, $http, $filter, $location, $rootScope) {
    var vm = this;

  //  this.$onInit = function() {

      vm.data = null;
      vm.filteredData = [];
      vm.fields = vm.fields || [];
      vm.buttons = vm.buttons || [];
      vm.title = vm.title || 'Form Title';
      vm.hideHeader = vm.hideHeader || false;
      vm.timezoneSelector = vm.timezoneSelector || false;
      vm.timezoneUTC = vm.timezoneUTC || false;
      vm.loadingMessage = vm.loadingMessage || 'Loading';
      vm.collapsed = vm.collapsed || false;
      vm.loading = false;
      vm.uniqueColumn = vm.uniqueColumn || 'resource.id';
      vm.currentId = null;
      vm.recordID = vm.recordID || $location.search().id;
      vm.status = 'Record';
      vm.errorCode = 0;

      // Functions

    //  vm.viewGroundTrack = function(line0, line1, line2, type, apogee, perigee) {
    //    var data = {};
    //    data.line0 = line0;
    //    data.line1 = line1; //'1 25544U 98067A   17098.86053830 +.00003442 +00000-0 +59411-4 0  9995';
    //    data.line2 = line2; //'2 25544 051.6434 023.8590 0006670 038.3011 068.5407 15.54042428050973';
    //    data.type = type;
    //    data.apogee = apogee;
    //    data.perigee = perigee;
    //    GroundTrackService.setData(data);
    //  };

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
          default:
            return data;
        }
      };

      vm.newRecord = function() {
        $('#' + vm.id + '-form').modal('show');
      };

      vm.deleteRecord = function() {
        $('#' + vm.id + '-delete-confirmation').modal('show');
      };

      vm.viewRecord = function(id) {
        window.location = vm.source.toLowerCase() + '-record?id=' + id;
        //alert(id);
      };

      vm.loadData = function() {
        vm.loading = true;
        vm.errorCode = 0;
        vm.errorMessage = '';
        vm.data = null;

        var requestHeaders = {};
        requestHeaders['Accept'] = "application/fhir+json";
        if ($rootScope.useOAuth) {
          requestHeaders['Authorization'] = 'Bearer ' + $rootScope.getAccessToken();
        } else {
          requestHeaders['x-api-key'] = $rootScope.apiKey;
        }

  //    setTimeout(function() {
        $http({
          method: 'GET',
          url: 'https://fhir.yxlrtoae.static-test-account.isccloud.io/' + vm.source + '/' + vm.recordID,
          headers: requestHeaders
        }).then(function successCallback(response) {
            vm.data = response.data;
            vm.loading = false;
            //$scope.$apply();
            //console.log("HTTP Code: " + response.status);
            //$scope.patients = response.data.entry;
            //$scope.count = response.data.total;
            //console.log("Array: " + $scope.patients);

          },
          function errorCallback(response) {
            vm.errorCode = response.status;
            vm.errorMessage = response.statusText;
            vm.loading = false;
        });
        //$http.get('data/' + vm.source).then(function(response) {
        //  vm.data = response.data;
        //  vm.loading = false;
        //}, function(response) {
        //  vm.errorCode = response.status;
        //  vm.errorMessage = response.statusText;
        //  vm.loading = false;
        //});
  //    }, (Math.random() * 200) + 100);

      };

      // Main

      //$scope.$watch('filteredData.length', function() {
      //  vm.refreshPagination($scope.filteredData ? $scope.filteredData.length : 0, true);
      //});

      if (vm.recordID) {
        vm.loadData();
      } else {
        vm.status = 'New Record';
      }

  }

})();
