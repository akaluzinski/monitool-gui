(function() {
    'use strict';

    angular.module('monitool.app.resources')
        .factory('DataResource', DataResource);

    DataResource.$inject = ['$resource', 'RelativeUrl'];

    function DataResource($resource, relativeUrl) {
        return $resource(
            relativeUrl.get('http://monitool.herokuapp.com:80/api/data'),
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
                        filter: '{ "limit": 10 }'
                    },
                    method: 'GET',
                    isArray: true
                }
            }
        );

    }
})();