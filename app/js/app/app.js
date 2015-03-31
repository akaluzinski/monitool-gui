/**
 * @author Mateusz Aniołek
 * @homepage mateusz-aniolek.com
 */

(function() {
    'use strict';

    angular.module('monitool.app.resources', ['ngResource']);
    angular.module('monitool.app.services', ['ngCookies']);
    angular.module('monitool.app.controllers', []);
    angular.module('monitool.app.configs', []);
    //angular.module('monitool.app.routes', ['ngRoute']);
    angular.module('monitool.app.directives', []);
    angular.module('monitool.app', [
        'angular-loading-bar',
        'ngRoute',
        'ngCookies',
        'monitool.common',
        'monitool.app.views',
        'monitool.app.resources',
        'monitool.app.services',
        'monitool.app.directives',
        'monitool.app.configs',
        //'monitool.app.routes',
        'monitool.app.controllers'
    ]);



})();

