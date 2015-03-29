(function() {
    'use strict';

    angular.module('monitool.app.resources')
        .factory('SensorsResource', SensorsResource);

    SensorsResource.$inject = ['$resource', 'RelativeUrl'];

    function SensorsResource($resource, relativeUrl) {
        return $resource(
            relativeUrl.get('http://monitool.herokuapp.com:80/api/sensors'),
            {
                access_token: '@access_token'
            },
            {
                find: {
                    method: 'GET',
                    isArray: true
                }
            }
        );

    }
})();