(function() {
    'use strict';

    angular.module('monitool.app.services')
        .factory('DataStorage', DataStorage);

    DataStorage.$inject = ['$cookieStore', '$timeout'];

    function DataStorage($cookieStore, $timeout)
    {
        var items = [];
        var cookiesProvider = $cookieStore;
        return {

            addToken: function(token) {
                console.log(token);
                cookiesProvider.put('token', token);
            },

            getToken: function() {
                return cookiesProvider.get('token');
            },

            removeToken: function() {
                return cookiesProvider.remove('token');
            addIdentity: function(identity) {
                console.log(identity);
                cookiesProvider.put('identity', identity);
            },

            getIdentity: function() {
                return cookiesProvider.get('identity');
            },

            getItems: function() {
                return items;
            },

            addItem: function(name, value) {
                items.push({
                    name: name,
                    value: value
                });
            }

        };
    }

})();
