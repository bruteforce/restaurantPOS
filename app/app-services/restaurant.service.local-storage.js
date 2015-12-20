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
            var restaurant = filtered.length ? filtered[0] : null;
            deferred.resolve(restaurant);
            return deferred.promise;
        }

        function GetByRestaurantname(restaurantname) {
            var deferred = $q.defer();
            var filtered = $filter('filter')(getRestaurants(), { restaurantname: restaurantname });
            var restaurant = filtered.length ? filtered[0] : null;
            deferred.resolve(restaurant);
            return deferred.promise;
        }

        function Create(restaurant) {
            var deferred = $q.defer();

            // simulate api call with some timeout
            $timeout(function () {
                GetByRestaurantname(restaurant.restaurantName)
                    .then(function (duplicateRestaurant) {
                        if (duplicateRestaurant !== null) {
                            deferred.resolve({ success: false, message: 'Restaurantname "' + restaurant.restaurantname + '" is already taken' });
                        } else {
                            var restaurants = getRestaurants();

                            // assign id
                            var lastRestaurant = restaurants[restaurants.length - 1] || { id: 0 };
                            restaurant.id = lastRestaurant.id + 1;

                            // save to local storage
                            restaurants.push(restaurant);
                            setRestaurants(restaurants);

                            deferred.resolve({ success: true });
                        }
                    });
            }, 1000);

            return deferred.promise;
        }

        function Update(restaurant) {
            var deferred = $q.defer();

            var restaurants = getRestaurants();
            for (var i = 0; i < restaurants.length; i++) {
                if (restaurants[i].id === restaurant.id) {
                    restaurants[i] = restaurant;
                    break;
                }
            }
            setRestaurants(restaurants);
            deferred.resolve();
            return deferred.promise;
        }

        function Delete(id) {
            var deferred = $q.defer();

            var restaurants = getRestaurants();
            for (var i = 0; i < restaurants.length; i++) {
                var restaurant = restaurants[i];
                if (restaurant.id === id) {
                    restaurants.splice(i, 1);
                    break;
                }
            }
            setRestaurants(restaurants);
            deferred.resolve();

            return deferred.promise;
        }

        // private functions

        function getRestaurants() {
            if(!localStorage.restaurants){
                localStorage.restaurants = JSON.stringify([]);
            }

            return JSON.parse(localStorage.restaurants);
        }

        function setRestaurants(restaurants) {
            localStorage.restaurants = JSON.stringify(restaurants);
        }
    }
})();