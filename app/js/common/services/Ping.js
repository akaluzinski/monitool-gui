(function() {
    'use strict';

    angular.module('monitool.common.services')
        .provider('Ping', Ping);

    /**
    * Ping indicated endpoint on specified time interval
    * @constructor
    */
    function Ping() {
        /**
         * Default time interval
         * @type {number}
         */
        var timeout = 60000;
        /**
         * Default end point url
         * @type {string}
         */
        var endPoint = '/ping';
        /**
         * Defines event fired when server responds with error
         * @type {{onError: Function}}
         */
        var eventsListener = {
            onError: function() {}
        };

        /**
         * Changes time interval
         * @param value
         */
        this.setTimeout = function(value) {
            timeout = value;
        };

        /**
         * Changes endpoint to poll
         * @param value
         */
        this.setEndPoint = function(value) {
            endPoint = value;
        };


        /**
         * Provider interface
         * Usage
         *
         * <code>
         * app.controller('Foo', ['ping', function(ping) {
         *      ping.eventsListener.onError = function() {
         *          alert('Server down');
         *      };
         *      ping.run();
         * }
         * </code>
         *
         * @param $http
         * @param ApiUrl
         * @param $timeout
         * @type {*[]}
         */
        this.$get = [
            '$http', 'ApiUrl', '$timeout',
            function($http, apiUrl, $timeout) {

                /**
                 * Sends request on specified end point
                 * When server response is success then new request is sending again
                 * after specified time interval
                 * Otherwise onError event is fired
                 *
                 * @param $http
                 * @param apiUrl
                 * @param $timeout
                 */
                var send = function() {
                    $http.get(apiUrl.get(endPoint))
                        .success(function(response) {
                            $timeout(send, timeout);
                        })
                        .error(function() {
                            return eventsListener.onError();
                        });
                };

                return {
                    run: send,
                    eventsListener: {
                        onError: function(event) {
                            eventsListener.onError = event;
                        }
                    }
                }
            }
        ];
    };
})();