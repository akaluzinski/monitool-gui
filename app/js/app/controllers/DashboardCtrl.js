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
        init: function($scope, $interval, toastr, authResource, dataResource, sensorsResource, DataStorage, PromiseChain, LoadingBar) {
            this.$scope = $scope;
            this.$interval = $interval;
            this.notification = toastr;
            this.resource = authResource;
            this.dataResource = dataResource;
            this.sensorsResource = sensorsResource;
            this.dataStorage = DataStorage;
            this.promiseChain = PromiseChain;
            this.loadingBar = LoadingBar;

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
            var promiseChain = this.promiseChain;
            var loadingBar = this.loadingBar;

            $scope.search = {
                nodeName: "",
                startDate: "",
                endDate: "",
                todayDate: false
            };

            $scope.searchNode = '';
            $scope.searchId = '!!';

            $scope.page = 0;
            $scope.limit = 10;

            $scope.sensorTypes = ["cpu", "mem", "disc"];
            $scope.hosts = [];

            $scope.token = dataStorage.getToken() || null;

            $scope.sendRequest = function()
            {
                promiseChain.addPromise(
                    dataResource.find($scope.getParams()).$promise,
                    function(response){
                        console.log(response);
                    }
                );
                promiseChain.resolve(function(){
                    // do some stuff after request
                });

            };


            $scope.getParams = function()
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

                return params;
            };


            $scope.getData = function (skip) {


                loadingBar.start();

                var params = {
                    access_token: $scope.token,
                    filter: '{ "limit": '+$scope.limit+', "skip": '+skip+', "order": "date DESC"  }'
                };

                promiseChain.addPromise(
                    sensorsResource.find({ access_token: $scope.token }).$promise,
                    function(response){
                        $scope.nodes = response;
                    }
                );

                promiseChain.addPromise(
                    dataResource.find(params).$promise,
                    function(response){
                        $scope.primaryData = response;
                        angular.forEach($scope.primaryData, function(value, key){
                            $scope.primaryData[key]['sensorName'] = $scope.getSensorName(value['sensorId']);
                        });
                    }
                );
                promiseChain.resolve(function(){
                    loadingBar.complete();
                    // do some stuff after request
                });



            };

            $scope.getSensors = function () {
                sensorsResource.find({
                    access_token: $scope.token
                }).$promise.then(
                    function(response){
                        return response;
                    }, function(response){

                    }
                );

            };

            $scope.getData($scope.page);

            $scope.nextResults = function()
            {
                $scope.page += 1;
                $scope.getData($scope.page*$scope.limit);
            };

            $scope.prevResults = function()
            {
                $scope.page -= 1;
                if($scope.page > 0) {
                    $scope.getData($scope.page*$scope.limit);
                }
            };

            $scope.getSensorName = function(sensorId) {

                if($scope.nodes == undefined) {
                    return 'MISSING_NODES';
                }
                var host = ($.grep($scope.nodes, function(e){ return parseInt(e.id) == parseInt(sensorId); }))[0];
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

    DashboardCtrl.$inject = ['$scope', '$interval', 'toastr', 'AuthResource', 'DataResource', 'SensorsResource', 'DataStorage', 'PromiseChain', 'cfpLoadingBar'];

    angular.module('monitool.app.controllers')
        .controller('DashboardCtrl', DashboardCtrl);
})();