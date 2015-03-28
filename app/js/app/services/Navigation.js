(function() {
    'use strict';

    angular.module('monitool.app.services')
        .provider('Navigation', Navigation);

    function Navigation() {
        /**
         * Location url for steps
         * @type {{}}
         */
        var stepsUrls = {};

        /**
         * Determines which steps are finished
         * @type {{}}
         */
        var finishedSteps = {};

        /**
         * Order of steps
         * @type {string[]}
         */
        var stepsOrder = [];

        /**
         * Determines which steps are required for specific step
         * @type {{}}
         */
        var stepsRequirements = {};

        /**
         *
         * @param $location
         * @constructor
         */
        var NavigationService = function ($location) {
            /**
             * Validates steps required for the given step
             * If step is not specified then it takes a current step
             * @param stepName
             * @returns {boolean}
             */
            this.validateRequiredSteps = function (stepName) {
                if (typeof stepName === 'undefined') {
                    stepName = this.currentStep;
                }
                var requirements = stepsRequirements[stepName];
                var notFinishedSteps = [];
                _.each(requirements, function (step) {
                    if (!finishedSteps[step]) {
                        notFinishedSteps.push(step);
                    }
                });

                return notFinishedSteps.length === 0;
            };
            /**
             * Determines if step is finished
             *
             * @param stepName
             * @returns {boolean}
             */
            this.isStepFinished = function (stepName) {
                var result = false;
                if (this.validateRequiredSteps(stepName)) {
                    if (finishedSteps[stepName]) {
                        result = true;
                    }
                }

                return result;
            };
            /**
             * Determines if navigation can move forward
             * @returns {boolean|*}
             */
            this.canGoForward = function () {
                return this.isStepFinished(this.currentStep);
            };
            /**
             * Determines if navigation can move backward
             * @returns {boolean}
             */
            this.canGoBackward = function () {
                return stepsRequirements[this.currentStep].length > 0;
            };
            /**
             * Finishes current step
             */
            this.finishCurrentStep = function () {
                finishedSteps[this.currentStep] = true;
            };
            /**
             * Sets current step
             * @param stepName
             */
            this.setCurrentStep = function (stepName) {
                this.currentStep = stepName;
            };
            /**
             * Moves forward to the next step
             * @returns {boolean}
             */
            this.goForward = function () {
                if (this.canGoForward()) {
                    $location.url(
                        stepsUrls[stepsOrder[stepsOrder.indexOf(this.currentStep) + 1]]
                    );
                } else {
                    return false;
                }
            };
            /**
             * Moves backward to the previous step
             * @returns {boolean}
             */
            this.goBackward = function () {
                if (this.canGoBackward()) {
                    $location.url(
                        stepsUrls[stepsOrder[stepsOrder.indexOf(this.currentStep) - 1]]
                    );
                } else {
                    return false;
                }
            };
        };

        return {
            /**
             * Defines custom steps order
             * @param customStepsOrder
             */
            setStepsOrder: function (customStepsOrder) {
                stepsOrder = customStepsOrder;
            },
            /**
             * Defines custom steps requirements
             * @param customStepsRequirements
             */
            setStepsRequirements: function (customStepsRequirements) {
                stepsRequirements = customStepsRequirements;
                _.keys(customStepsRequirements, function (key) {
                    finishedSteps[key] = false;
                });
            },
            /**
             * Defines customs steps urls
             * @param customStepsUrls
             */
            setStepsUrls: function (customStepsUrls) {
                stepsUrls = customStepsUrls;
            },
            /**
             *
             */
            $get: [
                '$location',
                function ($location) {
                    return new NavigationService($location);
                }
            ]
        };
    }
})();