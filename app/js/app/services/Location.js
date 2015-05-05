(function() {
    'use strict';

    angular.module('monitool.app.services')
        .factory('Location', Location);

    Location.$inject = [ '$location', '$route', '$rootScope' ];

    function Location($location, $route, $rootScope)
    {
        $location.skipReload = function () {
            var lastRoute = $route.current;
            var un = $rootScope.$on('$locationChangeSuccess', function () {
                $route.current = lastRoute;
                un();
            });
            return $location;
        };
        return $location;
    }
})();