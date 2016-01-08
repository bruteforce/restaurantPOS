(function () {
    'use strict';

    angular
        .module('app')
        .controller('RestaurantController', RestaurantController);

    RestaurantController.$inject = ['RestaurantService', 'UserService','ItemService', '$location', '$rootScope', 'FlashService'];

    function RestaurantController(RestaurantService, UserService, ItemService, $location, $rootScope, FlashService) {
        var vm = this;
        vm.itemObjectUpdate = itemObjectUpdate;
        vm.restaurantItemObjectUpdate = restaurantItemObjectUpdate;
        vm.addItemToMenu = addItemToMenu;
        vm.removeItemToMenu = removeItemToMenu;
        vm.addRestaurant = addRestaurant;
        vm.deleteRestaurant = deleteRestaurant;
        vm.openEditRestaurant = openEditRestaurant;
        vm.openManageRestaurant = openManageRestaurant;
        vm.updateRestaurant = updateRestaurant;
        vm.resetForm = resetForm;
        vm.updateRestaurantMenuMapping = updateRestaurantMenuMapping;
        vm.restaurant={};
        vm.restaurant.username = $rootScope.globals.currentUser.username;
        vm.activeRestaurant = {};

        vm.itemList = [];
        vm.item="";
        vm.itemObject = {};

        vm.restaurantItem = "";
        vm.restaurantItemList = [];
        vm.restaurantItemObject = {};


        ItemService.GetAll().then(function(data) {
            vm.itemList = data;
        });

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

        function openManageRestaurant(id)
        {
            for(var key in vm.restaurantList) {
                if(vm.restaurantList[key].id==id) {
                    vm.activeRestaurant.restaurantName = vm.restaurantList[key].restaurantName;
                    vm.activeRestaurant.restaurantAddress = vm.restaurantList[key].restaurantAddress;
                    vm.activeRestaurant.restaurantMobile = vm.restaurantList[key].restaurantMobile;
                    vm.activeRestaurant.id = id;
                }
            }
            var storageRestaurantMenuList = JSON.parse(localStorage.getItem("resmenu"+vm.activeRestaurant.id));
            vm.restaurantItemList =  storageRestaurantMenuList!== null ? storageRestaurantMenuList: [];
            $('#manageModal').modal('toggle');
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
                            FlashService.Success('Restaurant added successfully', true);
                            $location.path('/manageRestaurant');
                            RestaurantService.GetAll().then(function(data) {
                                vm.restaurantList = data;
                            });
                        } else {
                            FlashService.Error(response.message);
                            vm.dataLoading = false;
                        }
                        $('#adModal').modal('toggle');
                    });
                }
        }



        function addItemToMenu()
        {
            vm.itemObject=jQuery.parseJSON(vm.itemObject);
            vm.restaurantItemList.push(vm.itemObject);
            vm.updateRestaurantMenuMapping();
            vm.item="";
            vm.restaurantItem="";

        }
        function removeItemToMenu()
        {
            vm.itemObject=jQuery.parseJSON(vm.restaurantItemObject);
            vm.restaurantItemList.pop(vm.restaurantItemObject);
            vm.updateRestaurantMenuMapping();
            vm.item="";
            vm.restaurantItem="";
        }

        function updateRestaurantMenuMapping()
        {
            localStorage.setItem("resmenu"+vm.activeRestaurant.id,JSON.stringify(vm.restaurantItemList));
        }

        function restaurantItemObjectUpdate(item)
        {
            vm.restaurantItemObject = item;
        }

        function itemObjectUpdate(item)
        {
            vm.itemObject = item;
        }
    }

})();

