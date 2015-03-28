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
        init: function($scope, toastr, authResource) {
            this.$scope = $scope;
            this.notification = toastr;
            this.resource = authResource;

            this._super($scope);
        },

        /**
         * {@inheritdoc}
         */
        defineScope: function() {
            var $scope = this.$scope;
            var notification = this.notification;
            var resource = this.resource;
            $scope.test = 'asd';

            $scope.tesparam = 'aa';

            $scope.send = function()
            {
                 resource.list().$promise.then(function(response){
                     console.log(response);
                 });
            }

        }
    });

    DashboardCtrl.$inject = ['$scope', 'toastr', 'AuthResource'];

    angular.module('monitool.app.controllers')
        .controller('DashboardCtrl', DashboardCtrl);
})();