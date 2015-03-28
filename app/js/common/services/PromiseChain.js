(function() {
    'use strict';

    angular.module('monitool.common.services')
        .factory('PromiseChain', PromiseChain);

    function PromiseChain() {

        var responses = [];
        var promises = [];

        /**
         * @TODO add success and fail callback
         * @param promise
         * @param callback
         * @constructor
         */
        function PromiseWithCallback(promise, callback) {
            this.promise = promise;
            this.callback = callback;

            /**
             *
             * @param response
             */
            this.invokeCallback = function(response) {
                if (typeof this.callback === 'function') {
                    this.callback(response);
                }
            };

            /**
             *
             * @returns {*|PromiseChain.PromiseWithCallback.promise}
             */
            this.resolve = function() {
                var that = this;
                this.promise.then(function(response) {
                    that.invokeCallback(response);
                });
                return this.promise;
            };
        }

        /**
         *
         * @param promise
         * @param callback
         */
        var addPromise = function(promise, callback) {
            promises.push(new PromiseWithCallback(promise, callback));
        };

        /**
         *
         * @param promises
         * @param onFinishCallback
         */
        var resolve = function(promises, onFinishCallback) {
            if (promises.length === 0) {
                onFinishCallback();
            } else {
                var promise = promises.shift();
                promise.resolve().then(function (response) {
                    responses.push(response);
                    resolve(promises, onFinishCallback);
                });
            }
        };

        return {
            /**
             * Adds promise on the end of the queue
             */
            addPromise: addPromise,
            /**
             *
             * @param onFinishCallback
             */
            resolve: function(onFinishCallback) {
                resolve(promises, onFinishCallback);
            },
            /**
             *
             * @returns {Array}
             */
            getResponses: function() {
                return promises;
            }
        }
    }
})();