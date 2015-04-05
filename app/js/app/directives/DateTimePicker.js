(function() {
    'use strict';

    angular.module('monitool.app.directives')
        .directive('dateTimePicker', DateTimePicker);

    DateTimePicker.$inject = [];

    /**
     * @require momentjs
     * @constructor
     */
    function DateTimePicker() {
        return {
            restrict: 'E',
            require: ['ngModel'],
            replace: true,
            scope: {
                ngModel: '=',
                id: '@id',
                class: '@class'
            },
            template:
                '<div class="input-group date" id="{{id}}">' +
                    '<input type="text" ngModel class="form-control" data-date-format="YYYY-MM-DD HH:mm" >' +
                    '<span class="input-group-addon" >' + 
                        '<span class="glyphicon glyphicon-calendar"></span>' +
                    '</span>' +
                '</div>',
            link: function(scope, element, attrs) {
                element.datetimepicker();

                element.find('input').bind('blur keyup change', function(){
                    scope.ngModel = element.find('input').val();
                    scope.$apply();
                });
            }
        }
    }
})();