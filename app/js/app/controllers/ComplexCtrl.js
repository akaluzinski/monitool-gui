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
        init: function($scope, $interval, $location, $routeParams, $timeout, toastr, authResource, complexDataResource, sensorsResource, DataStorage, PromiseChain, LoadingBar, Location) {
            this.$scope = $scope;
            this.$interval = $interval;
            this.$location = $location;
            this.$routeParams = $routeParams;
            this.$timeout = $timeout;
            this.notification = toastr;
            this.resource = authResource;
            this.complexDataResource = complexDataResource;
            this.sensorsResource = sensorsResource;
            this.authProvider = DataStorage;
            this.promiseChain = PromiseChain;
            this.loadingBar = LoadingBar;
            this.location = Location;

            $('#chart-container').height(($(document).height() - $('#chart-container').offset().top) * 0.9);
            $('#chart-container').width(($(document).width() - $('#chart-container').offset().left) * 0.9);

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

            $scope.where = null;
            
            $scope.limit = 10;
            $scope.page = 0;
            
            $scope.sensorTypes = ["cpu", "mem", "disc"];
            $scope.sensorTypesColor = ["#DF2F2F", "#AB2FDF", "#5A81E5", "#5AE5BB", "#7CE271"];
            $scope.hosts = [];

            $scope.data = [];

            $scope.token = dataStorage.getToken() || null;

            $scope.chartType = 0;

            console.log(dataStorage.getIdentity());
            console.log(dataStorage.getToken());

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
                location.skipReload().path( "/complex/" + $scope.hostId ).replace();
                $scope.sendRequest("date ASC");
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

            $scope.getData = function () {
                loadingBar.start();
                
                var params = {
                    access_token: $scope.token,
                    filter: ''
                };
                var filter = {
                    order:    "date DESC"
                };
                
                if( $scope.where !== null && $scope.where !== "" ) {
                    $scope.where.id = $scope.hostId;
                    filter.where = $scope.where;
                } else {
                    filter.where = {};
                    filter.where.id = $scope.hostId;
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
                        $scope.complexData = [];
                        $scope.data = response[0];
                        angular.forEach($scope.data['data'], function(value, key){
                            $scope.data['data'][key]['date'] = new Date(value['date']);
                        });
                        $scope.parseData($scope.page, $scope.limit)
                        angular.forEach($scope.sensorTypes, function(value, key){
                            if($scope.data['itemType'].indexOf(value) >= 0) {
                                $scope.chartType = key;
                            }
                        });
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
            };

            $scope.prevResults = function() {
                $scope.page -= 1;
            };

            $scope.parseData = function(page, limit) {
                $scope.complexData = _.slice($scope.data['data'], page*limit, (page+1)*limit);
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
            
            $scope.goBack = function(event) {
                event.stopPropagation();
                event.preventDefault();
                $location.path( "/dashboard" ).replace();
            };

            window.onresize = function(event) {
                $('#chart-container').width(($(window).width() - $('#chart-container').offset().left) * 0.9);
                $scope.preapareChart();
            };
            
            $scope.hostId = $routeParams.hostId;
            // get sensors information and data for table
            $scope.getSensors();
            // init start date input with three weeks ago date
            var startDate = new Date(new Date().getTime() - 1814400000);
            var startDateStr = dateToString(startDate);
            $scope.search.startDate = startDateStr;
            // init flot chart
            plot = $.plot($('#chart'), [[]], $scope.chartOptions);
            // get data fot flot chart
            $scope.getData();
        }

    });

    ComplexCtrl.$inject = ['$scope', '$interval', '$location', '$routeParams', '$timeout', 'toastr', 'AuthResource', 'ComplexDataResource', 'SensorsResource', 'DataStorage', 'PromiseChain', 'cfpLoadingBar', 'Location'];

    angular.module('monitool.app.controllers')
        .controller('ComplexCtrl', ComplexCtrl)
        .config(['$routeProvider', function($routeProvider) {
            $routeProvider.when('/complex/:hostId',{
                templateUrl: '/assets/dist/views/dashboard/complex.html',
                controller: 'ComplexCtrl',
                reloadOnSearch: false,
                access: {
                    requiresLogin: true
                }
            });
        }]);
})();