(function() {
    'use strict';

    angular.module('monitool.common.services')
        .provider('RelativeUrl', RelativeUrl);

    /**
     * Service
     * @returns {Function}
     */
    function RelativeUrl() {
        /**
         * Returns relative URL to API
         * @param string    urls
         * @return string
         */
        this.$get =[
            'Config',
            function(Config) {
                return {
                    get: function(url) {
                        return url;
                    }
                }
            }
        ];
    }

})();