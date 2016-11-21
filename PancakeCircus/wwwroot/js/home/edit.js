console.log("I did stuff");
var editInst = new Vue({
    el: "#editInv",
    data: {
        items: [ new Item("Eggs", 20, "Cartoons"), new Item("Flour", 10, "Lbs") ]
    },
    methods: {
        incrementItem: function(item) {
            item.amount += 1;
        },
        decrementItem: function (item) {
            if (item.amount > 0)
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

$("#itemUnits")
    .keyup(function(e) {
        if (e.which !== 13 || e.keyCode !== 13) return;

        e.preventDefault();
        addNewItem();
        $("#addItemModal").modal("hide");
    });

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

    if (isNaN(parseFloat(itemInitAmount)) || !isFinite(itemInitAmount) || itemInitAmount < 0)
        return;

    editInst.addItem(new Item(itemName, itemInitAmount, itemUnits));

    $("#itemName").val('');
    $("#itemUnits").val('');
    $("#itemInitAmount").val('');
}