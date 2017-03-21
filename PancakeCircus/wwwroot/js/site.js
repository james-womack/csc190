// Write your Javascript code.
$("#pc-homeTab").click(function () {
    var hadFocus = $("#pc-homeTab").hasClass('is-active'); 

    $(".pc-navTab").removeClass('is-active');
    $(".pc-navSub").addClass('is-hidden');

    if (!hadFocus) {
        $("#pc-homeTab").addClass('is-active');
        $("#pc-homeBar").removeClass('is-hidden');
    }
});

$("#pc-ordersTab").click(function () {
    var hadFocus = $("#pc-ordersTab").hasClass('is-active');

    $(".pc-navTab").removeClass('is-active');
    $(".pc-navSub").addClass('is-hidden');

    if (!hadFocus) {
        $("#pc-ordersTab").addClass('is-active');
        $("#pc-ordersBar").removeClass('is-hidden');
    }
});

$("#pc-vendorsTab").click(function () {
    var hadFocus = $("#pc-vendorsTab").hasClass('is-active'); 

    $(".pc-navTab").removeClass('is-active');
    $(".pc-navSub").addClass('is-hidden');

    if (!hadFocus) {
        $("#pc-vendorsTab").addClass('is-active');
        $("#pc-vendorsBar").removeClass('is-hidden');
    }
});