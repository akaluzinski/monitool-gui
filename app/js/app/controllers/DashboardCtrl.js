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
        init: function($scope, toastr) {
            this.$scope = $scope;
            this.notification = toastr;

            this._super($scope);
        },

        /**
         * {@inheritdoc}
         */
        defineScope: function() {
            var $scope = this.$scope;
            var notification = this.notification;

            $scope.test = 'asd';

        }
    });

    DashboardCtrl.$inject = ['$scope', 'toastr'];

    angular.module('monitool.app.controllers')
        .controller('DashboardCtrl', DashboardCtrl);
})();