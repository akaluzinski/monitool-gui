(function() {
    'use strict';

    angular.module('monitool.app.directives')
        .directive('showtab', ShowTab);

    ShowTab.$inject = [];

    /**
     * @constructor
     */
    function ShowTab() {
        return {
            link: function (scope, element, attrs) {
                element.click(function(e) {
                    e.preventDefault();
                    $(element).tab('show');
                });
            }
        };
    }
})();