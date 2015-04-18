(function() {
    'use strict';

    angular.module('monitool.app.services')
        .factory('AuthProvider', AuthProvider);

    AuthProvider.$inject = [ 'DataStorage' ];

    function AuthProvider(DataStorage)
    {
        var dataStorage = DataStorage;
        
        return {

            isLoggedIn: function() {
                return typeof dataStorage.getToken() !== "undefined" ? true : false;
            }

        };
    }

})();