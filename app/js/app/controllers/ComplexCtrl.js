(function() {
    'use strict';
    
    var plot = null;

    var getMaxValue = function() {
        return parseFloat($('#chart').attr('data-value-max'));
    };
    
    var getMinValue = function() {
        return parseFloat($('#chart').attr('data-value-min'));
    };
    
    var padStr = function(i) {
        return (i < 10) ? "0" + i : "" + i;
    };
    
    var dateToString = function(date) {
        return date.getFullYear() + "-" + 
                  padStr(1 + date.getMonth()) + "-" + 
                  padStr(date.getDate()) + " " +
                  padStr(date.getHours()) + ":" + 
                  padStr(date.getMinutes());
    };
    
    var compareObj = function(a,b) {
        if (a.date > b.date)
            return -1;
        if (a.date < b.date)
            return 1;
        return 0;
    };

    
    var ComplexCtrl = BaseController.extend({
        $scope: null,
        $interval: null,

        /**
         * {@inheritdoc}
         */
        init: function($scope, $interval, $location, $routeParams, $timeout, toastr, authResource, dataResource, complexDataResource, sensorsResource, DataStorage, PromiseChain, LoadingBar, Location) {
            this.$scope = $scope;
            this.$interval = $interval;
            this.$location = $location;
            this.$routeParams = $routeParams;
            this.$timeout = $timeout;
            this.notification = toastr;
            this.resource = authResource;
            this.dataResource = dataResource;
            this.complexDataResource = complexDataResource;
            this.sensorsResource = sensorsResource;
            this.authProvider = DataStorage;
            this.promiseChain = PromiseChain;
            this.loadingBar = LoadingBar;
            this.location = Location;

            this._super($scope);
        },

        /**
         * {@inheritdoc}
         */
        defineScope: function() {
            var $scope = this.$scope;
            var $interval = this.$interval;
            var $location = this.$location;
            var $routeParams = this.$routeParams;
            var $timeout = this.$timeout;
            var notification = this.notification;
            var resource = this.resource;
            var sensorsResource = this.sensorsResource;
            var dataResource = this.dataResource;
            var complexDataResource = this.complexDataResource;
            var dataStorage = this.authProvider;
            var promiseChain = this.promiseChain;
            var loadingBar = this.loadingBar;
            var location = this.location;

            $scope.refreshChartPromise = null;
            $scope.delay = 5000;
            
            $scope.search = {
                node: "",
                startDate: "",
                endDate: "",
                todayDate: true
            };
            
            $scope.hostId = null;
            $scope.hostName = null;

            $scope.where = null;
            
            $scope.limit = 10;
            $scope.page = 0;
            
            $scope.sensorTypes = ["cpu", "mem", "disc"];
            $scope.sensorTypesColor = ["#DF2F2F", "#AB2FDF", "#5A81E5", "#5AE5BB", "#7CE271"];
            $scope.hosts = [];

            $scope.data = [];

            $scope.token = dataStorage.getToken() || null;

            $scope.chartType = 0;

            $scope.chartData = [];
            $scope.chartOptions = { 
                grid: {
                    borderColor: "#f3f3f3",
                    borderWidth: 1,
                    tickColor: "#f3f3f3",
                    hoverable: true
                },
                series: {
                    shadowSize: 0, 
                    color: "#3c8dbc"
                },
                lines: {
                    fill: true, 
                    color: "#3c8dbc"
                },
                yaxis: {
                    show: true,
                    autoscaleMargin: 0.3,
                    min: getMinValue(),
                    max: getMaxValue(),
                    tickFormatter: function(value) {
                        return value.toFixed(2);
                    }
                },
                xaxis: {
                    show: true,
                    mode: "time",
                    timezone: "browser",
                    timeformat: "%y/%m/%d %H:%M"
                }
            };
            
            $scope.changeChart = function(id) {
                $scope.chartType=id;
                $scope.preapareChart();
            };

            $scope.changeParam = function() {
                if( $scope.refreshChartPromise !== null ) {
                    $timeout.cancel($scope.refreshChartPromise);
                }
                location.skipReload().path( "/complex/" + $scope.hostName + "/"+ $scope.hostId ).replace();
                $scope.sendRequest("date ASC");
            };


            $scope.sendRequest = function(order)
            {
                var results = [];
                var filter = {
                    order:    order
                };
                
                promiseChain.addPromise(
                    sensorsResource.getComplex({
                        hostId: $scope.hostId,
                        statName: $scope.hostName,
                        access_token: $scope.token,
                        filter: JSON.stringify(filter)
                    }).$promise,
                    function(response){
                        angular.forEach(response, function(value, key){
                            results[key] = {};
                            results[key]['date'] = new Date(value['date']);
                            response[key]['date'] = new Date(value['date']);
                            for( var i in $scope.sensorTypes ) {
                                var type = $scope.sensorTypes[i];
                                results[key][type+'Load'] = value[type+'Load'];
                            }
                        });
                        
                        if( $scope.page == 0 ) {
                            var objs = results.slice(-1*($scope.limit));
                        } else if( $scope.page*$scope.limit < results.length/2 ) {
                            var objs = results.slice(-1*($scope.limit*($scope.page+1)),-1*($scope.limit*$scope.page));
                        } else {
                            var objs = results.slice(($scope.limit*($scope.page)),($scope.limit*($scope.page+1)));
                        }
                        $scope.complexData = objs.sort(compareObj);
                    }
                );

                promiseChain.addPromise(
                    complexDataResource.find({
                        where: {
                            hostId: $scope.hostId
                        },
                        access_token: $scope.token
                    }).$promise,
                    function(response){
                        $scope.complexStat = response[0];
                    }
                );

                promiseChain.resolve(function(){
                    $scope.chartData = [];
                    for( var i in $scope.sensorTypes ) {
                        $scope.chartData[i] = {min:null,max:null,series:[]};
                        $scope.chartData[i].series = {
                            label: $scope.sensorTypes[i],
                            color: $scope.sensorTypesColor[i],
                            lines: {
                                show: true,
                                fill: false,
                                lineWidth: 1
                            },
                            data: []
                        };
                    }
                    var beforeTs = null;
                    var periodTimeGap = 3600;
                    angular.forEach(results, function(value, key) {
                        var ts = new Date(value['date']).getTime();
                        if( !beforeTs ) {
                            beforeTs = ts;
                        }

                        for( var i in $scope.sensorTypes ) {
                            var type = $scope.sensorTypes[i];
                            var val = parseFloat(value[type+'Load']);

                            if($scope.chartData[i].min === null || val < $scope.chartData[i].min) {
                                $scope.chartData[i].min = val;
                            }
                            if($scope.chartData[i].max === null || val > $scope.chartData[i].max) {
                                $scope.chartData[i].max = val;
                            }

                            if( ( ts-beforeTs ) > periodTimeGap ) {
                                $scope.chartData[i].series.data.push([beforeTs, 0]);
                                $scope.chartData[i].series.data.push([ts, 0]);
                                if( $scope.chartData[i].min > 0 ) {
                                    $scope.chartData[i].min = 0;
                                }
                            }
                            $scope.chartData[i].series.data.push([ts, val]);
                        }
                        beforeTs = ts;
                    });

                    for( var i in $scope.sensorTypes ) {
                        if($scope.chartData[i].min < 0 && $scope.chartData[i].max < 0) {
                            $scope.chartData[i].min *= 1.3;
                            $scope.chartData[i].max *= 0.7;
                        }
                        if($scope.chartData[i].min > 0 && $scope.chartData[i].max > 0) {
                            $scope.chartData[i].max *= 1.3;
                            $scope.chartData[i].min *= 0.7;
                        }
                    }
                    $scope.changeChart($scope.chartType);
                    $scope.preapareChart();

                    if( $scope.refreshChartPromise !== null ) {
                        $timeout.cancel($scope.refreshChartPromise);
                    }
                    $scope.refreshChartPromise = $timeout(function() {
                        $scope.sendRequest(order);
                    },$scope.delay);
                });

            };

            $scope.preapareChart = function() {
                $scope.chartOptions = plot.getOptions();            
                $scope.chartOptions.yaxis.min = $scope.chartData[$scope.chartType].min;
                $scope.chartOptions.yaxis.max = $scope.chartData[$scope.chartType].max;
                $scope.chartOptions.yaxes[0].min = $scope.chartData[$scope.chartType].min;
                $scope.chartOptions.yaxes[0].max = $scope.chartData[$scope.chartType].max;
                $scope.chartOptions.xaxis.min = new Date($scope.search.startDate).getTime();
                $scope.chartOptions.xaxis.max = ($scope.search.endDate!==""?new Date($scope.search.endDate):new Date()).getTime();

                plot = $.plot("#chart", [$scope.chartData[$scope.chartType].series], $scope.chartOptions);

                if(typeof $scope.chartData[$scope.chartType].series.data !== "undefined" 
                        && $scope.chartData[$scope.chartType].series.data.length > 0) {
                    $('#chart').show();
                    $('#chart-message').hide();
                } else {
                    $('#chart').hide();
                    $('#chart-message').show();
                }
            };

            $scope.getData = function (skip) {
                loadingBar.start();
                
                if( typeof skip === "undefined" ) {
                    skip = 0;
                }
                var filter = {
                    limit:    $scope.limit, 
                    skip:     skip, 
                    order:    "date DESC"
                };
                filter = JSON.stringify(filter);

                promiseChain.addPromise(
                    complexDataResource.find({
                        where: {
                            hostId: $scope.hostId
                        },
                        access_token: $scope.token
                    }).$promise,
                    function(response){
                        $scope.complexStat = response[0];
                    }
                );

                promiseChain.addPromise(
                    sensorsResource.getComplex({
                        hostId: $scope.hostId,
                        statName: $scope.hostName,
                        access_token: $scope.token,
                        filter: filter
                    }).$promise,
                    function(response){
                        angular.forEach(response, function(value, key){
                            response[key]['date'] = new Date(value['date']);
                        });
                        $scope.complexData = response;
                    }
                );

                promiseChain.resolve(function(){
                    loadingBar.complete();
                    // do some stuff after request
                });



            };

            $scope.getSensors = function () {
                sensorsResource.findAll({
                    access_token: $scope.token
                }).$promise.then(
                    function(response){
                        $scope.nodes = response;
                        return response;
                    }, function(response){

                    }
                );

            };

            $scope.nextResults = function() {
                $scope.page += 1;
                $scope.getData($scope.page*$scope.limit);
            };

            $scope.prevResults = function() {
                $scope.page -= 1;
                if($scope.page >= 0) {
                    $scope.getData($scope.page*$scope.limit);
                }
            };

            $scope.parseData = function(page, limit) {
                $scope.complexData = _.slice($scope.complexData, page*limit, (page+1)*limit);
            }

            $scope.$watch('limit', function() {
                $scope.parseData($scope.page, $scope.limit)
            });

            $scope.$watch('page', function() {
                if ($scope.page > 0) {
                    $scope.parseData($scope.page, $scope.limit)
                }
            });

            $scope.getSensorName = function(sensorId) {

                if($scope.nodes == undefined) {
                    return 'MISSING_NODES';
                }
                var host = ($.grep($scope.nodes, function(e){ return e.id == sensorId; }))[0];
                if(host != undefined) {
                    return host.name;
                }
                return 'MISSING_HOST';
            };

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

            $scope.getParams = function(order,limit)
            {
                if( typeof order === "undefined" ) {
                    order = "date DESC";
                }
                var filter = {
                    "order": order,
                    "where": {}
                };
                if( typeof limit === "undefined" ) {
                    filter.limit = $scope.limit;
                } else if( limit > 0 ) {
                    filter.limit = limit;
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

                filter.where.hostId = $scope.hostId;

                var params = {
                    access_token: $scope.token
                };
                params.filter = angular.fromJson(filter);

                $scope.where = filter.where;

                return params;
            };


            $scope.goBack = function(event) {
                event.stopPropagation();
                event.preventDefault();
                $location.path( "/dashboard" ).replace();
            };

            window.onresize = function(event) {
                $scope.preapareChart();
            };
            
            $scope.hostId = $routeParams.hostId;
            $scope.hostName = $routeParams.hostName;
            // get sensors information and data for table
            $scope.getSensors();
            // init start date input with three weeks ago date
            var startDate = new Date(new Date().getTime() - 1814400000);
            var startDateStr = dateToString(startDate);
            $scope.search.startDate = startDateStr;
            // init flot chart
            plot = $.plot($('#chart'), [[]], $scope.chartOptions);
            // get data fot flot chart
            $scope.sendRequest("date ASC");
        }

    });

    ComplexCtrl.$inject = ['$scope', '$interval', '$location', '$routeParams', '$timeout', 'toastr', 'AuthResource', 'DataResource', 'ComplexDataResource', 'SensorsResource', 'DataStorage', 'PromiseChain', 'cfpLoadingBar', 'Location'];

    angular.module('monitool.app.controllers')
        .controller('ComplexCtrl', ComplexCtrl)
        .config(['$routeProvider', function($routeProvider) {
            $routeProvider.when('/complex/:hostName/:hostId',{
                templateUrl: '/assets/dist/views/dashboard/complex.html',
                controller: 'ComplexCtrl',
                reloadOnSearch: false,
                access: {
                    requiresLogin: true
                }
            });
        }]);
})();