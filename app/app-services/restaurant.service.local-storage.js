(function () {
    'use strict';

    angular
        .module('app')
        .factory('RestaurantService', RestaurantService);

    RestaurantService.$inject = ['$timeout', '$filter', '$q'];
    function RestaurantService($timeout, $filter, $q) {

        var service = {};

        service.GetAll = GetAll;
        service.GetById = GetById;
        service.GetByRestaurantname = GetByRestaurantname;
        service.Create = Create;
        service.Update = Update;
        service.Delete = Delete;

        return service;

        function GetAll() {
            var deferred = $q.defer();
            deferred.resolve(getRestaurants());
            return deferred.promise;
        }

        function GetById(id) {
            var deferred = $q.defer();
            var filtered = $filter('filter')(getRestaurants(), { id: id });
            var irestaurant = filtered.length ? filtered[0] : null;
            deferred.resolve(irestaurant);
            return deferred.promise;
        }

        function GetByRestaurantname(irestaurantname) {
            var deferred = $q.defer();
            var filtered = $filter('filter')(getRestaurants(), { irestaurantname: irestaurantname });
            var irestaurant = filtered.length ? filtered[0] : null;
            deferred.resolve(irestaurant);
            return deferred.promise;
        }

        function Create(irestaurant) {
            var deferred = $q.defer();

            // simulate api call with some timeout
            $timeout(function () {
                GetByRestaurantname(irestaurant.irestaurantname)
                    .then(function (duplicateRestaurant) {
                        if (duplicateRestaurant !== null) {
                            deferred.resolve({ success: false, message: 'Restaurantname "' + irestaurant.irestaurantname + '" is already taken' });
                        } else {
                            var irestaurants = getRestaurants();

                            // assign id
                            var lastRestaurant = irestaurants[irestaurants.length - 1] || { id: 0 };
                            irestaurant.id = lastRestaurant.id + 1;

                            // save to local storage
                            irestaurants.push(irestaurant);
                            setRestaurants(irestaurants);

                            deferred.resolve({ success: true });
                        }
                    });
            }, 1000);

            return deferred.promise;
        }

        function Update(irestaurant) {
            var deferred = $q.defer();

            var irestaurants = getRestaurants();
            for (var i = 0; i < irestaurants.length; i++) {
                if (irestaurants[i].id === irestaurant.id) {
                    irestaurants[i] = irestaurant;
                    break;
                }
            }
            setRestaurants(irestaurants);
            deferred.resolve();
            return deferred.promise;
        }

        function Delete(id) {
            var deferred = $q.defer();

            var irestaurants = getRestaurants();
            for (var i = 0; i < irestaurants.length; i++) {
                var irestaurant = irestaurants[i];
                if (irestaurant.id === id) {
                    irestaurants.splice(i, 1);
                    break;
                }
            }
            setRestaurants(irestaurants);
            deferred.resolve();

            return deferred.promise;
        }

        // private functions

        function getRestaurants() {
            if(!localStorage.irestaurants){
                localStorage.irestaurants = JSON.stringify([]);
            }

            return JSON.parse(localStorage.irestaurants);
        }

        function setRestaurants(irestaurants) {
            localStorage.irestaurants = JSON.stringify(irestaurants);
        }
    }
})();