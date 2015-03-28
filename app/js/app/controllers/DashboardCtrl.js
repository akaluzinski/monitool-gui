/**
 * @author Mateusz Aniołek
 * @homepage mateusz-aniolek.com
 */
(function() {
    'use strict';
    
    $(document).ready(function() {
//        $('#primaryStats').dataTable();
        $('#dataStart').datetimepicker();
        $('#dataEnd').datetimepicker();
    });
    
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
            $scope.searchNode = '';
            $scope.searchId = '!!';
            
            var hosts = [];
            hosts = [
                {
                    "name": "gsdgd",
                    "dateJoined": "2015-03-01 00:00:00",
                    "id": 123
                },
                {
                    "name": "jfgj",
                    "dateJoined": "2015-03-01 00:00:00",
                    "id": 124
                },
                {
                    "name": "vzsdvs",
                    "dateJoined": "2015-03-01 00:00:00",
                    "id": 125
                },
                {
                    "name": "mfgmg",
                    "dateJoined": "2015-03-01 00:00:00",
                    "id": 126
                },
                {
                    "name": "cvsdv",
                    "dateJoined": "2015-03-01 00:00:00",
                    "id": 123
                }
            ];
//            $http.get('/sensors/').
//            success(function(data, status, headers, config) {
//                hosts = data;
//            }).
//            error(function(data, status, headers, config) {
//                
//            });
            $scope.hostslist = hosts;
        
            $scope.test = 'dashboar';
            $scope.sensorTypes = ["cpu","mem"];
            // get hosts from server
            var primaryData = [];
            primaryData = [
                {
                    "sensorID": 123,
                    "id": "654634645634",
                    "date": "2015-03-01 00:00:00",
                    "cpuLoad": 1.42,
                    "memLoad": 0.12
                },
                {
                    "sensorID": 124,
                    "id": "747464",
                    "date": "2015-03-01 00:01:00",
                    "cpuLoad": 4.53,
                    "memLoad": 0.123
                },
                {
                    "sensorID": 125,
                    "id": "523526",
                    "date": "2015-03-01 00:01:00",
                    "cpuLoad": 2.75,
                    "memLoad": 3.763
                },
                {
                    "sensorID": 126,
                    "id": "78547",
                    "date": "2015-03-01 01:00:00",
                    "cpuLoad": 9.43,
                    "memLoad": 3.54
                },
                {
                    "sensorID": 123,
                    "id": "654634645634",
                    "date": "2015-03-01 01:01:00",
                    "cpuLoad": 7.43,
                    "memLoad": 83.43
                },
            ];
//            $http.get('/data/').
//            success(function(data, status, headers, config) {
//                primaryData = data;
//            }).
//            error(function(data, status, headers, config) {
//                
//            });
            $scope.primaryData = primaryData;
            
            
            
            $scope.getSensorName = function(hostId) {
                console.log( hostId );
                var host = ($.grep(hosts, function(e){ return e.id == hostId; }))[0];
                console.log( host );
                return host.name;
            };
            $scope.statDetails = function(hostId) {
                console.log( hostId );
            }
        }
    });

    DashboardCtrl.$inject = ['$scope', 'toastr', '$http'];

    angular.module('monitool.app.controllers')
        .controller('DashboardCtrl', DashboardCtrl);
})();