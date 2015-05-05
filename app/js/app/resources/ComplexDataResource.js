(function() {
    'use strict';

    angular.module('monitool.app.resources')
        .factory('ComplexDataResource', ComplexDataResource);

    ComplexDataResource.$inject = ['$resource', 'RelativeUrl'];

    function ComplexDataResource($resource, relativeUrl) {
        return $resource(
            relativeUrl.get('http://monitool.herokuapp.com:80/api/complexStat'),
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
                },
                findById: {
                    url: 'http://monitool.herokuapp.com:80/api/complexStat/:id',
                    params: {
                        id: '@id'
                    },
                    method: 'GET',
                    isArray: false
                },
                remove: {
                    method: 'DELETE',
                    isArray: true
                }
            }
        );

    }
})();