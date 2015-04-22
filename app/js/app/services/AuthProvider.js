(function() {
    'use strict';

    angular.module('monitool.app.services')
        .factory('AuthProvider', AuthProvider);

    AuthProvider.$inject = [ 'DataStorage' ];

    function AuthProvider(DataStorage)
    {
        var dataStorage = DataStorage;
        
        return {

            logout: function() {
                dataStorage.removeToken();
                dataStorage.removeIdentity();
                dataStorage.removeEmail();
            },

            login: function(token, identity, email) {
                dataStorage.addToken(token);
                dataStorage.addIdentity(identity);
                dataStorage.addEmail(email);
            },

            isLoggedIn: function() {
                //return dataStorage.getToken() == true ? true : false;;
                console.log(typeof dataStorage.getToken());
                return typeof dataStorage.getToken() == "undefined" ? false : true;
            }

        };
    }

})();