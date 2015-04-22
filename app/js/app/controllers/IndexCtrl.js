/**
 * @author Mateusz Aniołek
 * @homepage mateusz-aniolek.com
 */
(function() {
    'use strict';

    var IndexCtrl = BaseController.extend({
        $scope: null,
        authProvider: null,
        dataStorage: null,

        /**
         * {@inheritdoc}
         */
        init: function($scope, toastr, $location, authProvider, dataStorage, broadcast) {
            this.$scope = $scope;
            this.$location = $location;
            this.notification = toastr;
            this.authProvider = authProvider;
            this.dataStorage = dataStorage;
            this.broadcast = broadcast;

            this._super($scope);
        },

        /**
         * {@inheritdoc}
         */
        defineScope: function() {
            var $scope = this.$scope;
            var $location = this.$location;
            var authProvider = this.authProvider;
            var dataStorage = this.dataStorage;
            var broadcast = this.broadcast;

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

            $scope.storage = $scope.storage || {};

            $scope.logout = function() {
                authProvider.logout();
                $scope.isLogged = authProvider.isLoggedIn();
                $scope.storage = {};
                $location.path('/login').replace();
            };

            //$scope.isLogged = authProvider.isLoggedIn() == true ? '1' : '0';
            $scope.isLogged = authProvider.isLoggedIn();

            if($scope.isLogged) {
                $scope.storage = {
                    email: dataStorage.getEmail(),
                    token: dataStorage.getToken()
                };
            }

            $scope.$on('Logged', function(event, args){
                $scope.isLogged = authProvider.isLoggedIn();
                $scope.storage = {
                    email: args.email,
                    token: args.token
                };
            });

        }
    });

    IndexCtrl.$inject = ['$scope', 'toastr', '$location', 'AuthProvider', 'DataStorage', 'BroadcastService'];

    angular.module('monitool.app.controllers')
        .controller('IndexCtrl', IndexCtrl);
})();
