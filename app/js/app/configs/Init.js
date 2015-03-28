(function() {
    'use strict';

    angular.module('monitool.app.configs')
        .run([
            '$rootElement', 'Config',
            function ($rootElement, Config) {
                var config = {};
                _.each($rootElement[0].attributes, function(attr) {
                    Config[attr.name.replace('data-', '')] = attr.value;
                });
            }
        ]);
})();