/**
 * @author Mateusz Aniołek
 * @homepage mateusz-aniolek.com
 */
(function() {
    'use strict';

    var LoginCtrl = BaseController.extend({
        $scope: null,

        /**
         * {@inheritdoc}
         */
        init: function($scope, toastr, $location, authProvider, UserRegisterResource, UserLoginResource) {
            this.$scope = $scope;
            this.$location = $location;
            this.notification = toastr;
            this.authProvider = authProvider;
            this.registerResource = UserRegisterResource;
            this.loginResource = UserLoginResource;

            this._super($scope);
        },

        /**
         * {@inheritdoc}
         */
        defineScope: function() {
            var $scope = this.$scope;
            var $location = this.$location;
            var notification = this.notification;
            var registerResource = this.registerResource;
            var loginResource = this.loginResource;
            var authProvider = this.authProvider;

            $scope.loginData = {};
            $scope.registerData = {};

            $scope.goTo = function(event,route) {
                event.stopPropagation();
                event.preventDefault();
                if( route === 'register' ) {
                    $location.path('/register').replace();
                } else if( route === 'login' ) {
                    $location.path('/login').replace();
                } else if( route === 'dashboard' ) {
                    $location.path('/dashboard').replace();
                }
            };
            
            $scope.register = function() {
                if($scope.registerData.password != $scope.registerData.repassword) {
                    notification.error("Given passwords are not identical!");
                    return false;
                }

                registerResource.create(
                    {
                        email: $scope.registerData.email,
                        password: $scope.registerData.password
                    }
                ).$promise.then(function(response){
                    $location.path('/login').replace();
                    $scope.loginData = {};
                    notification.success("User has been created. You can log in now!");
                }, function(response){
                    notification.error(response.data.error.message);
                });

            };

            $scope.login = function() {
                if($scope.loginData.password == "") {
                    notification.error("Password cannot be empty");
                    return false;
                }

                loginResource.login(
                    {
                        email: $scope.loginData.email,
                        password: $scope.loginData.password
                    }
                ).$promise.then(function(response){
                    authProvider.login(response.id, response.userId, $scope.loginData.email);
                    notification.success("Authorization success!");
                    $location.path('/dashboard').replace();
                }, function(response){
                    notification.error(response.data.error.message);
                });
            };

            
        }
    });

    LoginCtrl.$inject = ['$scope', 'toastr', '$location', 'AuthProvider', 'UserRegisterResource', 'UserLoginResource'];

    angular.module('monitool.app.controllers')
        .controller('LoginCtrl', LoginCtrl)
        .config(['$routeProvider', function($routeProvider) {
            $routeProvider.
                when('/login',{
                    templateUrl: '/assets/dist/views/auth/login.html',
                    controller: 'LoginCtrl',
                    access: {
                        requiresLogin: false
                    }
                }).
                when('/register',{
                    templateUrl: '/assets/dist/views/auth/register.html',
                    controller: 'LoginCtrl',
                    access: {
                        requiresLogin: false
                    }
                });
        }]);
})();
