(function (_, $, angular) {
    'use strict';

    var TOP_LEVEL_NAMESPACE = 'monitool';
    var DEFAULT_MODULES = ['ng', 'angular.filter', 'monitool.common'];

    $(document).ready(function () {
        _.each(($('*[data-monitool-app]')), function (elem, idx) {
            var moduleName = TOP_LEVEL_NAMESPACE + '.' + $(elem).attr('data-monitool-app');
            angular.bootstrap(elem, DEFAULT_MODULES.concat([moduleName]));
        });
    });

})(window._, window.jQuery, window.angular);