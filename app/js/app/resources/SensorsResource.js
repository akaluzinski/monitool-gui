(function() {
    'use strict';

    angular.module('monitool.app.resources')
        .factory('SensorsResource', SensorsResource);

    SensorsResource.$inject = ['$resource', 'RelativeUrl'];

    function SensorsResource($resource, relativeUrl) {
        return $resource(
            relativeUrl.get('http://monitool.herokuapp.com:80/api/hosts'),
            {
                access_token: '@access_token'
            },
            {
                findAll: {
                    method: 'GET',
                    isArray: true
                },
                find: {
                    params: {
                        filter: ''
                    },
                    method: 'GET',
                    isArray: true
                }
            }
        );

    }
})();