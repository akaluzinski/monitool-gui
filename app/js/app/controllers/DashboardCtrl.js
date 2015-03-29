/**
 * @author Mateusz Aniołek
 * @homepage mateusz-aniolek.com
 */
(function() {
    'use strict';

    var DashboardCtrl = BaseController.extend({
        $scope: null,
        $interval: null,

        /**
         * {@inheritdoc}
         */
        init: function($scope, $interval, toastr, authResource, dataResource, sensorsResource, DataStorage) {
            this.$scope = $scope;
            this.$interval = $interval;
            this.notification = toastr;
            this.resource = authResource;
            this.dataResource = dataResource;
            this.sensorsResource = sensorsResource;
            this.dataStorage = DataStorage;

            $('#startDate').datetimepicker();
            $('#endDate').datetimepicker();

            this._super($scope);
        },

        /**
         * {@inheritdoc}
         */
        defineScope: function() {
            var $scope = this.$scope;
            var $interval = this.$interval;
            var notification = this.notification;
            var resource = this.resource;
            var sensorsResource = this.sensorsResource;
            var dataResource = this.dataResource;
            var dataStorage = this.dataStorage;

            $scope.search = {
                nodeName: "",
                startDate: "",
                endDate: "",
                todayDate: false
            };

            $scope.searchNode = '';
            $scope.searchId = '!!';

            $scope.page = 1;
            $scope.limit = 10;

            $scope.sensorTypes = ["cpu", "mem", "disc"];
            $scope.hosts = [];

            $scope.token = dataStorage.getToken() || null;

            $scope.sendRequest = function()
            {
                $scope.data = [];

                var filter = {
                    "limit": $scope.limit,
                    "where": {}
                };

                if($scope.search.nodeName != "") {
                    filter.where.sensorId = $scope.getSensorId($scope.search.nodeName);
                }

                if($scope.search.node != "") {
                    filter.where.sensorId = $scope.search.node;
                }

                if($scope.search.startDate != "") {
                    filter.where.startDate = { gt : Date($scope.search.startDate) };
                }
                console.log($scope.search);
                if(!$scope.search.todayDate && $scope.search.endDate != "") {
                    filter.where.endDate = { lt : Date($scope.search.endDate) };
                }



                var params = {
                    access_token: $scope.token
                };
                params.filter = angular.fromJson(filter);
                console.log(params);
                dataResource.find(params).$promise.then(
                    function(response){
                        $scope.primaryData = response;
                    },
                    function(response){

                    }
                );
            };


            $scope.getData = function () {

                var params = {
                    access_token: $scope.token,
                    filter: '{ "limit": '+1+' }'
                };

                dataResource.find(params).$promise.then(
                    function(response){
                        $scope.primaryData = response;
                    }, function(response){

                    }
                );

            };

            $scope.getSensors = function () {
                sensorsResource.find({
                    access_token: $scope.token
                }).$promise.then(
                    function(response){
                        $scope.nodes = response;
                    }, function(response){

                    }
                );

            };
            $scope.getSensors();
            $scope.getData();

            $scope.getSensorName = function(hostId) {
                var host = ($.grep($scope.nodes, function(e){ return e.name.toLowerCase() == hostName.toLowerCase(); }))[0];
                if(host != undefined) {
                    return host.name;
                }
                return 'MISSING_HOST';
            };

            $scope.getSensorId = function(hostName) {
                var host = ($.grep($scope.nodes, function(e){ return e.name.toLowerCase() == hostName.toLowerCase(); }))[0];
                if(host != undefined) {
                    return host.id;
                }
                return "";
            };
            $scope.statDetails = function(hostId) {
                console.log( hostId );
            }

        }

    });

    DashboardCtrl.$inject = ['$scope', '$interval', 'toastr', 'AuthResource', 'DataResource', 'SensorsResource', 'DataStorage'];

    angular.module('monitool.app.controllers')
        .controller('DashboardCtrl', DashboardCtrl);
})();