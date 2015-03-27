(function() {
    'use strict';

    angular.module('monitool.common.services')
        .provider('Config', Config);

    /**
     * Returns configuration from html element
     * @constructor
     */
    function Config() {
        var html = angular.element("html");
        var config = {};
        var keys = ['api-root'];
        _.each(keys, function (key) {
            var val = html.attr('data-' + key);
            config[key.replace("-", "_")] = val;
        });

        /**
         *
         * @type {*[]}
         */
        this.$get = [function () {
            return config;
        }];
    }
})();