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
                },
                createComplex: {
                    url: 'http://monitool.herokuapp.com:80/api/hosts/:hostId/complexStats',
                    params: {
                        hostId: '@hostId',
                        access_token: '@access_token'
                    },
                    method: 'POST',
                    isArray: false
                },
                removeComplex: {
                    url: 'http://monitool.herokuapp.com:80/api/hosts/:hostId/complexStats/:statId',
                    params: {
                        hostId: '@hostId',
                        statId: '@statId',
                        access_token: '@access_token'
                    },
                    method: 'DELETE',
                    isArray: false
                },
                getComplex: {
                    url: 'http://monitool.herokuapp.com:80/api/hosts/:hostId/data/:statName',
                    params: {
                        hostId: '@hostId',
                        statName: '@statName',
                        access_token: '@access_token'
                    },
                    method: 'GET',
                    isArray: true
                }
            }
        );

    }
})();