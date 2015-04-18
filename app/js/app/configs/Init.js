(function() {
    'use strict';

    angular.module('monitool.app.configs')
        .run([
            '$rootElement', 'Config', '$rootScope', '$location', 'AuthProvider',
            function ($rootElement, Config, $rootScope, $location, AuthProvider) {
                var config = {};
                _.each($rootElement[0].attributes, function(attr) {
                    Config[attr.name.replace('data-', '')] = attr.value;
                });
                
                $rootScope.$on('$routeChangeStart', function (event, next) {
                    var authorised;
                    if (next.access !== undefined) {
                        authorised = AuthProvider.isLoggedIn(); 
                        var route = next.$$route.originalPath.replace('/','');
                        if (authorised) {
                            if( route === 'login' || route === 'register' ) {
                                $location.path('/dashboard').replace();
                            }
                        } else {
                            if( route === 'register' ) {
                                $location.path('/register').replace();
                            } else {
                                $location.path('/login').replace();                            
                            }
                        }
                    }
                });
            }
        ]);
})();