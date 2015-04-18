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
        init: function($scope, $interval, $location, toastr, authResource, dataResource, complexDataResource, userRegisterResource, sensorsResource, DataStorage, PromiseChain, LoadingBar) {
            this.$scope = $scope;
            this.$interval = $interval;
            this.$location = $location;
            this.notification = toastr;
            this.resource = authResource;
            this.dataResource = dataResource;
            this.complexDataResource = complexDataResource;
            this.userRegisterResource = userRegisterResource;
            this.sensorsResource = sensorsResource;
            this.dataStorage = DataStorage;
            this.promiseChain = PromiseChain;
            this.loadingBar = LoadingBar;

            this._super($scope);
        },

        /**
         * {@inheritdoc}
         */
        defineScope: function() {
            var $scope = this.$scope;
            var $location = this.$location;
            var $interval = this.$interval;
            var notification = this.notification;
            var resource = this.resource;
            var sensorsResource = this.sensorsResource;
            var dataResource = this.dataResource;
            var userRegisterResource = this.userRegisterResource;
            var complexDataResource = this.complexDataResource;
            var dataStorage = this.dataStorage;
            var promiseChain = this.promiseChain;
            var loadingBar = this.loadingBar;

            $scope.search = {
                node: "",
                nodeName: "",
                startDate: "",
                endDate: "",
                todayDate: false
            };

            $scope.searchNode = '';
            $scope.searchId = '!!';

            $scope.activeTable = 0;
            
            $scope.where = null;
            
            $scope.page = 0;
            $scope.limit = 5;
            $scope.complexPage = 0;
            $scope.complexLimit = 5;

            $scope.sensorTypes = ["cpu", "mem", "disc"];
            $scope.hosts = [];

            $scope.token = dataStorage.getToken() || null;

            $scope.sendRequest = function()
            {
                promiseChain.addPromise(
                    dataResource.find($scope.getParams()).$promise,
                    function(response){
                        $scope.page = 0;
                        $scope.primaryData = response;
                        angular.forEach($scope.primaryData, function(value, key){
                            $scope.primaryData[key]['sensorName'] = $scope.getSensorName(value['sensorId']);
                            $scope.primaryData[key]['date'] = new Date(value['date']);
                        });
                    }
                );
                promiseChain.resolve(function(){
                    // do some stuff after request
                });

            };


            $scope.getParams = function()
            {
                var filter = {
                    limit: $scope.limit,
                    order: "date DESC",
                    where: {}
                };

                if($scope.search.nodeName != "") {
                    var sensorsId = $scope.getSensorId($scope.search.nodeName, false);
                    if( sensorsId.length > 1 ) {
                        delete filter.where.sensorId;
                        filter.where.or = [];
                        for( var i in sensorsId ) {
                            filter.where.or.push({'sensorId':sensorsId[i]});
                        }
                    } else {
                        delete filter.where.or;
                        filter.where.sensorId = sensorsId[0];
                    }
                }

                if($scope.search.node != "") {
                    filter.where.sensorId = $scope.search.node;
                }

                var startDate = null, endDate = null;
                if($scope.search.startDate != "") {
                    startDate = { 'gt': new Date($scope.search.startDate) };
                }
                
                if(!$scope.search.todayDate && $scope.search.endDate != "" && !$scope.search.todayDate) {
                    endDate = { 'lt': new Date($scope.search.endDate) };
                } else {
                    endDate = { 'lt': new Date() };
                }
                
                if( startDate !== null && endDate !== null ) {
                    delete filter.where.date;
                    filter.where.and = [];
                    filter.where.and.push({'date':startDate});
                    filter.where.and.push({'date':endDate});
                } else if( startDate !== null ) {
                    delete filter.where.and;
                    filter.where.date = startDate;
                } else if( endDate !== null ) {
                    delete filter.where.and;
                    filter.where.date = endDate;
                }

                var params = {
                    access_token: $scope.token
                };
                params.filter = angular.fromJson(filter);

                $scope.where = filter.where;
                
                return params;
            };


            $scope.getData = function (skip) {
                loadingBar.start();

                var params = {
                    access_token: $scope.token,
                    filter: ''
                };
                var filter = {
                    limit:    $scope.limit,
                    skip:     skip,
                    order:    "date DESC"
                };
                if( $scope.where !== null && $scope.where !== "" ) {
                    filter.where = $scope.where;
                }
                params.filter = JSON.stringify(filter);

                promiseChain.addPromise(
                    sensorsResource.findAll({ access_token: $scope.token }).$promise,
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
                            $scope.primaryData[key]['date'] = new Date(value['date']);
                        });
                    }
                );
                promiseChain.resolve(function(){
                    loadingBar.complete();
                    // do some stuff after request
                });

            };

            $scope.getComplexData = function (skip) {
                loadingBar.start();

                var params = {
                    access_token: $scope.token,
                    filter: ''
                };
                var filter = {
                    limit:    $scope.limit,
                    skip:     skip,
                    order:    "date DESC"
                };
                if( $scope.where !== "" ) {
                    filter.where = $scope.where;
                }
                params.filter = JSON.stringify(filter);

                promiseChain.addPromise(
                    sensorsResource.findAll({ access_token: $scope.token }).$promise,
                    function(response){
                        $scope.nodes = response;
                    }
                );

                promiseChain.addPromise(
                    complexDataResource.find(params).$promise,
                    function(response){
                        var user_id = dataStorage.getIdentity();
                        $scope.complexData = response;
                        angular.forEach($scope.complexData, function(value, key){
                            $scope.complexData[key]['sensorName'] = $scope.getSensorName(value['sensorId']);
                            $scope.complexData[key]['date'] = new Date(value['date']);
                            $scope.complexData[key]['removeAllow'] = (user_id == value['userId'] ? true : false);
                        });
                    }
                );
                promiseChain.resolve(function(){
                    loadingBar.complete();
                    // do some stuff after request
                });

            };

            $scope.removeComplexData = function(id) {
                complexDataResource.remove({id: id}).$promise.then(
                    function(response) {
                        $scope.getData($scope.page);
                        $scope.getComplexData($scope.page);
                    },function(response) {
                        notification.error(response);
                    }

                );
            };

            $scope.getSensors = function () {
                sensorsResource.findAll({
                    access_token: $scope.token
                }).$promise.then(
                    function(response){
                        console.log( response );
                        return response;
                    }, function(response){

                    }
                );

            };

            $scope.nextResults = function()
            {
                $scope.page += 1;
                $scope.getData($scope.page*$scope.limit);
            };

            $scope.prevResults = function()
            {
                $scope.page -= 1;
                if($scope.page >= 0) {
                    $scope.getData($scope.page*$scope.limit);
                }
            };
            
            $scope.nextComplexResults = function()
            {
                $scope.complexPage += 1;
                $scope.getData($scope.complexPage*$scope.complexLimit);
            };

            $scope.prevComplexResults = function()
            {
                $scope.complexPage -= 1;
                if($scope.complexPage >= 0) {
                    $scope.getData($scope.complexPage*$scope.complexLimit);
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
            /**
             * 
             * @param string hostName
             * @param bool first true (default) - getting first sensorId, false - getting array of sensorIds
             * @returns string|array
             */
            $scope.getSensorId = function(hostName, first) {
                var hosts = ($.grep($scope.nodes, function(e){ return e.name.toLowerCase().indexOf( hostName.toLowerCase() ) !== -1; }));
                if( typeof first !== "undefined" ) {
                    var ids = [];
                    for( var i in hosts ) {
                        var host = hosts[i];
                        if(host != undefined) {
                            ids.push( host.id );
                        }
                    }
                    return ids;
                }
                var host = hosts[0];
                if(host != undefined) {
                    return host.id;
                }
                return "";
            };

            $scope.statDetails = function(hostId) {
                console.log( hostId );
                // FIXME: change after merge with route branch
                window.location.href = "/measurement.html?hostId="+hostId;
//                $location.path( "/measurement" );
            };

            $scope.getData($scope.page);
            $scope.getComplexData($scope.page);

            $scope.logout = function() {
                dataStorage.removeToken();
            }
        }

    });

    DashboardCtrl.$inject = ['$scope', '$interval', '$location', 'toastr', 'AuthResource', 'DataResource', 'ComplexDataResource', 'UserRegisterResource', 'SensorsResource', 'DataStorage', 'PromiseChain', 'cfpLoadingBar'];

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
