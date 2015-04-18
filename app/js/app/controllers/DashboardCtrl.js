/**
 * @author Mateusz Aniołek
 * @homepage mateusz-aniolek.com
 */
(function() {
    'use strict';

    var DashboardCtrl = BaseController.extend({
        $scope: null,

        /**
         * {@inheritdoc}
         */
        init: function($scope, toastr, authResource, DataStorage) {
            this.$scope = $scope;
            this.notification = toastr;
            this.resource = authResource;
            this.dataStorage = DataStorage;

            this._super($scope);
        },

        /**
         * {@inheritdoc}
         */
        defineScope: function() {
            var $scope = this.$scope;
            var notification = this.notification;
            var resource = this.resource;
            var dataStorage = this.dataStorage;
            $scope.test = 'asd';

            $scope.tesparam = 'aa';

            $scope.send = function()
            {
                 resource.list().$promise.then(function(response){
                     console.log(response);
                 });
            }

            $scope.logout = function() {
                dataStorage.removeToken();
            }
        }
    });

    DashboardCtrl.$inject = ['$scope', 'toastr', 'AuthResource', 'DataStorage'];

    angular.module('monitool.app.controllers')
        .controller('DashboardCtrl', DashboardCtrl)
        .config(['$routeProvider', function($routeProvider) {
            $routeProvider.when('/dashboard',{
                templateUrl: '/assets/dist/views/dashboard/dashboard.html',
                controller: 'DashboardCtrl',
                access: {
                    requiresLogin: true
                }
            });
        }]);
})();