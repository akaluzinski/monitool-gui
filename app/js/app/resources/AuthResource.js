(function() {
    'use strict';

    angular.module('monitool.app.resources')
        .factory('AuthResource', AuthResource);

    AuthResource.$inject = ['$resource', 'ApiUrl'];

    function AuthResource($resource, apiUrl) {
        return $resource(
            apiUrl.get('/frontend/payment/getServices'),
            {

            },
            {
                query: {
                    isArray: false
                }

            }

        );

        /*
         * Examples:

        return $resource(apiUrl.get('/foo/:bar'), {
            bar: '@bar'
        }, {
            findDog: { params: {bar: 'dog' }, method: 'POST', isArray: false },
            findCat: { params: {bar: 'cat' }, method: 'POST', isArray: false },
            save: {
                params: { action: 'save' },
                isArray: false,
                method: 'POST'
            }
        });

         */
    }
})();