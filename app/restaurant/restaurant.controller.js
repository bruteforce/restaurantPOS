(function () {
    'use strict';

    angular
        .module('app')
        .controller('RestaurantController', RestaurantController);

    RestaurantController.$inject = ['RestaurantService','UserService', '$location', '$rootScope', 'FlashService'];

    function RestaurantController(RestaurantService, UserService, $location, $rootScope, FlashService) {
        var vm = this;

        vm.addRestaurant = addRestaurant;
        vm.deleteRestaurant = deleteRestaurant;
        vm.openEditRestaurant = openEditRestaurant;
        vm.updateRestaurant = updateRestaurant;
        vm.resetForm = resetForm;
        vm.restaurant={};

        RestaurantService.GetAll().then(function(data) {
            vm.restaurantList = data;
        });

        function deleteRestaurant(id){
            RestaurantService.Delete(id);
            RestaurantService.GetAll().then(function(data) {
                vm.restaurantList = data;
            });
        }

        function updateRestaurant()
        {
            vm.dataLoading = true;
            RestaurantService.Update(vm.restaurant)
                .then(function (response) {
                    FlashService.Success('Item updated successful', true);
                    RestaurantService.GetAll().then(function(data) {
                        vm.restaurantList = data;
                    });
                    $('#editModal').modal('toggle');
                });
            resetForm();
        }

        function resetForm()
        {
            vm.restaurant.restaurantName = "";
            vm.restaurant.restaurantAddress = "";
            vm.restaurant.restaurantMobile = "";
            vm.restaurant.id = "";
            vm.dataLoading = false;
        }

        function openEditRestaurant(id)
        {
            for(var key in vm.restaurantList) {
                if(vm.restaurantList[key].id==id) {
                    vm.restaurant.restaurantName = vm.restaurantList[key].restaurantName;
                    vm.restaurant.restaurantAddress = vm.restaurantList[key].restaurantAddress;
                    vm.restaurant.restaurantMobile = vm.restaurantList[key].restaurantMobile;
                    vm.restaurant.id = id;
                }
            }
            $('#editModal').modal('toggle');
        }

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
                            $location.path('/manageRestaurant');
                        } else {
                            FlashService.Error(response.message);
                            vm.dataLoading = false;
                        }
                        $('#adModal').modal('toggle');
                    });
                }
            }
    }

})();

