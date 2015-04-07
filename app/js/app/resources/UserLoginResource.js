/**
 * @author Mateusz Aniołek
 * @homepage mateusz-aniolek.com
 */
(function() {
    'use strict';

    angular.module('monitool.app.resources').factory('UserLoginResource', UserLoginResource);

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

        );

    }
})();