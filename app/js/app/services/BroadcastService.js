(function() {
    'use strict';

    angular.module('monitool.app.services')
        .service('BroadcastService', BroadcastService);

    BroadcastService.$inject = ['$rootScope'];

    function BroadcastService($rootScope)
    {
        this.broadcast = function(eventName, payload) {
            $rootScope.$broadcast(eventName, payload);
        };
    }

})();
