(function() {
    'use strict';

    angular.module('monitool.app.services')
        .factory('DataStorage', DataStorage);

    DataStorage.$inject = [];

    function DataStorage()
    {
        var items = [];

        return {

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