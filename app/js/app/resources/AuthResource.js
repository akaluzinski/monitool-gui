/**
 * @author Mateusz Aniołek
 * @homepage mateusz-aniolek.com
 */
(function() {
    'use strict';

    angular.module('monitool.app.resources')
        .factory('AuthResource', AuthResource);

    AuthResource.$inject = ['$resource', 'RelativeUrl'];

    function AuthResource($resource, relativeUrl) {
        return $resource(
            relativeUrl.get('http://monitool.herokuapp.com:80/api/data?access_token=a6wI9F7yeCyVhgN9yXvTCflOEAgitgh8Qorn7mGGEymD9F14X6L0NiWVoOCdK9Sw'),
            {
            },
            {
                list: {
                    method: 'GET',
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