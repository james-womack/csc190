﻿console.log("I did stuff");
var editInst = new Vue({
    el: "#editInv",
    data: {
        items: [ new Item("Eggs", 20, "Cartoons"), new Item("Flour", 10, "Lbs") ]
    },
    methods: {
        incrementItem: function(item) {
            item.amount += 1;
        },
        decrementItem: function(item) {
            item.amount -= 1;
        },
        removeItem: function(item) {
            this.items.splice(this.items.indexOf(item), 1);
        },
        addItem: function(item) {
            this.items.push(item);
        }
    }
});

// Constructor for an item
function Item (name, amount, units) {
    this.name = name;
    this.amount = amount;
    this.units = units;
}

// Adds a new item to the vue instance
function addNewItem() {
    var itemName = $("#itemName").val();
    var itemUnits = $("#itemUnits").val();
    var itemInitAmount = $("#itemInitAmount").val();

    // Validate Inputs
    if (!itemName || !itemName.trim().length)
        return;

    if (!itemUnits || !itemUnits.trim().length)
        return;

    if (isNaN(parseFloat(itemInitAmount)) || !isFinite(itemInitAmount))
        return;

    editInst.addItem(new Item(itemName, itemInitAmount, itemUnits));
}