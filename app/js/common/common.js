/**
 *
 * @param value
 * @returns {*|boolean}
 */
Boolean.parse = function(value) {
    return Boolean(angular.fromJson(value));
};

(function() {
    'use strict';

    angular.module('monitool.common.resources', ['ngResource']);
    angular.module('monitool.common.services', []);
    angular.module('monitool.common.directives', []);
    angular.module('monitool.common.configs', []);
    angular.module('monitool.common', [
        'monitool.common.services',
        'monitool.common.configs',
        'ngAnimate',
        'toastr',
        'ui.bootstrap',
    ]).run([
        '$rootElement', 'Config',
        function ($rootElement, Config) {
            var config = {};
            _.each($rootElement[0].attributes, function(attr) {
                Config[attr.name.replace('data-', '')] = attr.value;
            });
        }
    ]);
})();