describe('LoginController', function() {
  beforeEach(angular.mock.module('app'));


      beforeEach(inject(function ($rootScope, $controller) {
          scope = $rootScope.$new();

          createController = function() {
              return $controller('NavCtrl', {
                  '$scope': scope
              });
          };
      }));

  describe('Login with invalid credentials', function() {
    it('User provides invalid credentials', function() {
    });
  });
});
