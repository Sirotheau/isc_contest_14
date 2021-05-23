(function () {
  'use strict';

  describe('launchList', function() {

    // Load the module that contains the 'launchList' component before each test
    beforeEach(module('launchList'));

    // Test the controller
    describe('LaunchListController', function() {

      it('should create a \'launches\' model with 3 launches', inject(function($componentController) {
        var ctrl = $componentController('launchList');

        expect(ctrl.launches.length).toBe(3);
      }));

    });

  });

})();
