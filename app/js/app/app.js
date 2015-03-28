/**
 * @author Mateusz Aniołek
 * @homepage mateusz-aniolek.com
 */

(function() {
    'use strict';

    angular.module('monitool.app.resources', ['ngResource']);
    angular.module('monitool.app.services', []);
    angular.module('monitool.app.controllers', []);
    angular.module('monitool.app.configs', []);
    angular.module('monitool.app.directives', []);
    angular.module('monitool.app', [
        'ngRoute',
        'monitool.common',
        'monitool.app.views',
        'monitool.app.resources',
        'monitool.app.services',
        'monitool.app.directives',
        'monitool.app.configs',
        'monitool.app.controllers'
    ]);
})();

