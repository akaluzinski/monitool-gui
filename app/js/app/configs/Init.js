(function() {
    'use strict';

    angular.module('monitool.app.configs')
        .run([
            '$rootElement', 'Config', '$rootScope', '$location',
            function ($rootElement, Config, $rootScope, $location) {
                var config = {};
                _.each($rootElement[0].attributes, function(attr) {
                    Config[attr.name.replace('data-', '')] = attr.value;
                });
                
                $rootScope.$on('$routeChangeStart', function (event, next) {
                    var authorised;
                    if (next.access !== undefined) {
                        authorised = true; // get authentication data from auth services
                        
                        if (authorised) {
                            $location.path(next.$$route.originalPath);
                        } else if (authorised) {
                            $location.path('/login').replace();
                        }
                    }
                });
            }
        ]);
})();