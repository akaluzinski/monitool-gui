/**
 * @author Mateusz Aniołek
 * @homepage mateusz-aniolek.com
 */
(function() {
    'use strict';

    angular.module('monitool.app.resources').factory('UserRegisterResource', UserRegisterResource);

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
                },
                findToken : {
                    params: {

                    },
                    method: 'GET',
                    isArray: true
                }
            }
        );

    }
})();
