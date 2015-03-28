(function() {
    'use strict';

    angular.module('monitool.common.services')
        .provider('ApiUrl', ApiUrl);

    /**
     * Service
     * @returns {Function}
     */
    function ApiUrl() {
        /**
         * Returns absolute URL to API
         * @param string    urls
         * @return string
         */
        this.$get =[
            'Config',
            function(Config) {
                return {
                    get: function(url) {
                        return Config.api_root + url;
                    }
                }
            }
        ];
    }

})();