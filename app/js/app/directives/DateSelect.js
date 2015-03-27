(function() {
    'use strict';

    angular.module('monitool.app.directives')
        .directive('dateSelect', DateSelect);

    DateSelect.$inject = [];

    /**
     * @require momentjs
     * @constructor
     */
    function DateSelect() {
        return {
            restrict: 'E',
            scope: {
                model: '=model',
                yearFieldName: '=yearFieldName',
                monthFieldName: '=monthFieldName',
                dayFieldName: '=dayFieldName',
                dayHasError: '=dayHasError',
                monthHasError: '=monthHasError',
                yearHasError: '=yearHasError'
            },
            templateUrl: '/views/app/frontend/directives/dateSelect.html',
            link: function(scope, element, attrs) {
                if (typeof scope.model === 'undefined') {
                    scope.model = {};
                }
                if (typeof scope.model.month === 'undefined') {
                    scope.model.month = 1;
                }
                if (typeof scope.model.year === 'undefined') {
                    scope.model.year = moment().year();
                }
                if (typeof scope.model.day === 'undefined') {
                    scope.model.day = 1;
                }
                /**
                 * Updates days of month
                 */
                scope.$watch('model.month', function(month) {
                    scope.daysInMonth = scope.getDaysInMonth(month);
                });

                /**
                 *
                 * @returns {Array}
                 */
                scope.getDaysInMonth = function(month) {
                    return _.map(_.range(0, moment(month, "MM").daysInMonth()), function(d) {
                        return {value: d + 1, label: d + 1};
                    });
                };
                /**
                 *
                 * @type {Array}
                 */
                scope.months = _.map(moment.months(), function(m, i) {
                    return {value: i + 1, label: m};
                });

                /**
                 *
                 * @type {Array}
                 */
                scope.years = _.map(_.range(moment().year() - 110, moment().year() + 1).reverse(), function(y) {
                    return {value: y, label: y};
                });
            }
        }
    }
})();