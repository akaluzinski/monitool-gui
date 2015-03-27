function ServiceLocator() {}

/**
 *
 * @param serviceName
 * @param $scope
 * @returns {*}
 */
ServiceLocator.prototype.getService = function(serviceName, $scope) {
    var serviceInstance = this.$injector.get(serviceName);
    if (typeof $scope !== 'undefined' && serviceInstance.__proto__.hasOwnProperty('$scope')) {
        serviceInstance.__proto__.$scope = $scope;
    }
    return serviceInstance;
};