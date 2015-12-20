(function () {
    'use strict';

    angular
        .module('app')
        .controller('RestaurantController', RestaurantController);

    RestaurantController.$inject = ['RestaurantService','UserService', '$location', '$rootScope', 'FlashService'];

    function RestaurantController(RestaurantService, UserService, $location, $rootScope, FlashService) {
        var vm = this;

        vm.addRestaurant = addRestaurant;

        function addRestaurant() {
            vm.dataLoading = true;
            if (UserService.GetByUsername(vm.restaurant.username) == null) {
                FlashService.Error("Entered username doesn't have a valid session");
                vm.dataLoading = false;
            }
            else {
                RestaurantService.Create(vm.restaurant)
                    .then(function (response) {
                        if (response.success) {
                            FlashService.Success('Registration successful', true);
                            $location.path('/');
                        } else {
                            FlashService.Error(response.message);
                            vm.dataLoading = false;
                        }
                    });
                }
            }
    }

})();

