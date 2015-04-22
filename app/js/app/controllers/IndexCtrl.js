/**
 * @author Mateusz Aniołek
 * @homepage mateusz-aniolek.com
 */
(function() {
    'use strict';

    var IndexCtrl = BaseController.extend({
        $scope: null,

        /**
         * {@inheritdoc}
         */
        init: function($scope, toastr, $location, authProvider) {
            this.$scope = $scope;
            this.$location = $location;
            this.notification = toastr;
            this.authProvider = authProvider;

            this._super($scope);
        },

        /**
         * {@inheritdoc}
         */
        defineScope: function() {
            var $scope = this.$scope;
            var $location = this.$location;
            var authProvider = this.authProvider;

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

            //$scope.isLogged = authProvider.isLoggedIn() == true ? '1' : '0';
            $scope.isLogged = authProvider.isLoggedIn();
            $scope.$watch(authProvider.isLoggedIn(), function() {
                $scope.isLogged = authProvider.isLoggedIn();
            });

        }
    });

    IndexCtrl.$inject = ['$scope', 'toastr', '$location', 'AuthProvider'];

    angular.module('monitool.app.controllers')
        .controller('IndexCtrl', IndexCtrl);
})();
