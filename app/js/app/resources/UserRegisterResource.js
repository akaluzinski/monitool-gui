(function() {
    'use strict';

    angular.module('monitool.app.resources')
        .factory('UserRegisterResource', UserRegisterResource);

    UserRegisterResource.$inject = ['$resource', 'RelativeUrl'];

    function UserRegisterResource($resource, relativeUrl) {
        return $resource(
            relativeUrl.get('http://monitool.herokuapp.com:80/api/Users/'),
            {
                email: '@email',
                password: '@password'
            },
            {
                create: {
                    method: 'POST',
                    isArray: true
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