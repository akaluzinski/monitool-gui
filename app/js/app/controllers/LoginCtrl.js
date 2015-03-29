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
        init: function($scope, toastr, $location, DataStorage, UserRegisterResource, UserLoginResource) {
            this.$scope = $scope;
            this.$location = $location;
            this.notification = toastr;
            this.dataStorage = DataStorage;
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
            var dataStorage = this.dataStorage;

            $scope.loginData = {};
            $scope.registerData = {};

            $scope.login = true;

            $scope.showLoginForm = function() {
                $scope.login = true;
            };

            $scope.showRegisterForm = function() {
                $scope.login = false;
            };

            $scope.register = function() {
                registerResource.create({email: $scope.registerData.email, password: $scope.registerData.password }).$promise.then(function(response){
                    notification.info("User has been created. You can log in now!");
                    $scope.login = true;
                    $scope.loginData = {};
                }, function(response){
                    notification.info('Error');
                });

            };

            $scope.login = function() {
                loginResource.login({email: $scope.loginData.email, password: $scope.loginData.password }).$promise.then(function(response){
                    dataStorage.addToken(response.id);

                    /**
                     * @TODO move to dashboard
                     */

                }, function(response){
                    notification.info('Error');
                });
            };


        }
    });

    LoginCtrl.$inject = ['$scope', 'toastr', '$location', 'DataStorage', 'UserRegisterResource', 'UserLoginResource'];

    angular.module('monitool.app.controllers')
        .controller('LoginCtrl', LoginCtrl);
})();