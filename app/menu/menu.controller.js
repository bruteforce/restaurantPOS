(function () {
    'use strict';

    angular
        .module('app')
        .controller('MenuController', MenuController);

    MenuController.$inject = ['RestaurantService','ItemService', '$location', '$rootScope', 'FlashService'];
    function MenuController(RestaurantService, ItemService, $location, $rootScope, FlashService) {
        var vm = this;
        vm.addItem = addItem;
        vm.deleteItem = deleteItem;
        vm.openEditItem = openEditItem;
        vm.updateItem = updateItem;
        vm.resetForm = resetForm;
        vm.item={};
        ItemService.GetAll().then(function(data) {
            vm.itemList = data;
        });

        function deleteItem(id){
            ItemService.Delete(id);
            ItemService.GetAll().then(function(data) {
                vm.itemList = data;
            });
        }

        function updateItem()
        {
            vm.dataLoading = true;
            ItemService.Update(vm.item)
                .then(function (response) {
                        FlashService.Success('Item updated successful', true);
                        ItemService.GetAll().then(function(data) {
                            vm.itemList = data;
                        });
                        $('#editModal').modal('toggle');
                });
            resetForm();
        }

        function resetForm()
        {
            vm.item.itemName = "";
            vm.item.itemCategory = "";
            vm.item.itemPrice = "";
            vm.item.id = "";
            vm.dataLoading = false;
        }

        function openEditItem(id)
        {
            for(var key in vm.itemList) {
                if(vm.itemList[key].id==id) {
                    vm.item.itemName = vm.itemList[key].itemName;
                    vm.item.itemCategory = vm.itemList[key].itemCategory;
                    vm.item.itemPrice = vm.itemList[key].itemPrice;
                    vm.item.id = id;
                }
            }
            $('#editModal').modal('toggle');
        }

        function addItem() {
            vm.dataLoading = true;
            ItemService.Create(vm.item)
                .then(function (response) {
                    if (response.success) {
                        FlashService.Success('Item added successful', true);
                        $location.path('/manageMenu');
                        ItemService.GetAll().then(function(data) {
                            vm.itemList = data;
                        });
                    } else {
                        FlashService.Error(response.message);
                        vm.dataLoading = false;
                    }
                    $('#adModal').modal('toggle');
                });
        }
    }

})();