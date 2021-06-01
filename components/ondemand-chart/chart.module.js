(function () {

'use strict';

angular.module('chart', ['chart.js']).filter('elapsedYears',function() {
  return function(input) {
    if (input) {
      var startDate = new Date(input);
      var now = new Date();
      return (now - startDate) / (365.25 * 24 * 60 * 60 * 1000);
    } else {
      return '';
    }
  };
});

})();
