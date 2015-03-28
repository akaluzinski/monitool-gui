(function() {
    'use strict';

    angular.module('monitool.app.resources')
        .factory('UserLoginResource', UserLoginResource);

    UserLoginResource.$inject = ['$resource', 'RelativeUrl'];

    function UserLoginResource($resource, relativeUrl) {
        return $resource(
            relativeUrl.get('http://monitool.herokuapp.com:80/api/Users/login'),
            {
                email: '@email',
                password: '@password'
            },
            {
                login: {
                    method: 'POST',
                    isArray: false
                }
            }
        //5516a0cc71cc640300aaa470
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