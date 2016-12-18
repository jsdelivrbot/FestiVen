describe('LoginCtrl', function() {

    var controller,
        deferredLogin,
        loginServiceMock,
        angularToastyMock,
        stateMock,
        ngFbMock,
        ionicLoadingMock

    // Load the App Module
    beforeEach(module('starter.controllers'));


    // Instantiate the Controller and Mocks
    beforeEach(inject(function($controller, $q){
      deferredLogin = $q.defer();

      // mock the login service
      loginServiceMock = {
        login: jasmine.createSpy('login spy')
                      .and.returnValue(deferredLogin.promise)
      }

      // state Mock
      stateMock = jasmine.createSpyObj('$state spy', ['go']);


      // toasty Mock
      angularToastyMock = jasmine.createSpyObj('toasty spy', ['error']);

      //ionic loading Mock
      ionicLoadingMock = jasmine.createSpyObj('$ionicLoading spy', ['show', 'hide']);

      //ngFB Mock
      ngFbMock = jasmine.createSpy('ngFB spy');

      //instantiate login controller

      controller = $controller('LoginCtrl', {
        $state: stateMock,
        ngFB: ngFbMock,
        $ionicLoading: ionicLoadingMock,
        LoginService: loginServiceMock,
        toasty: angularToastyMock
      })
    }))


    describe('#login', function() {

        // Call login on the Controller
        beforeEach(inject(function(_$rootScope_) {
            $rootScope = _$rootScope_;
            controller.login();
        }));

        it('controller to be defained', function() {
            expect(controller).toBeDefined();
        });

        // it('should call login on loginService', function() {
        //     expect(loginServiceMock.login).toHaveBeenCalled();
        // });

        describe('when the login is executed,', function() {
            it('if successful, should change state to tab.map', function() {

                // Mock the login response from LoginService
                deferredLogin.resolve();
                $rootScope.$digest();

                expect(stateMock.go).toHaveBeenCalledWith('tab.map');
            });

            it('if unsuccessful, should show a toast', function() {

                // Mock the login response from LoginService
                deferredLogin.reject();
                $rootScope.$digest();

                expect(angularToastyMock.error).toHaveBeenCalled();
            });
        });
    })
});
