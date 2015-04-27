(function() {
    'use strict';

    angular.module('monitool.app.services')
        .factory('DataStorage', DataStorage);

    DataStorage.$inject = ['$cookieStore', '$timeout'];

    function DataStorage($cookieStore, $timeout)
    {
        //A8zwDvzcgeTOMrzh6AoAFAC9TFk40mmkmih2vVh6WQNUiXL7RgKA6ews3YTLwdNC
        var items = [];
        var cookiesProvider = $cookieStore;
        return {

            addToken: function(token) {
                cookiesProvider.put('token', token);
            },

            getToken: function() {
                return cookiesProvider.get('token');
            },

            removeToken: function() {
                return cookiesProvider.remove('token');
            },

            addIdentity: function(identity) {
                cookiesProvider.put('identity', identity);
            },

            getIdentity: function() {
                return cookiesProvider.get('identity');
            },

            removeIdentity: function() {
                return cookiesProvider.remove('identity');
            },

            addEmail: function(email) {
                cookiesProvider.put('email', email);
            },

            getEmail: function() {
                return cookiesProvider.get('email');
            },

            removeEmail: function() {
                return cookiesProvider.remove('email');
            },

            getItems: function() {
                return items;
            },

            getItem: function(name) {
                return $.grep(items, function(e){ return e.name === name; })[0].value;
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
