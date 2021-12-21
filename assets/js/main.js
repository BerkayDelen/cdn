//Customer Info - Start

if (localStorage.length == 0 && localStorage.getItem("user") == null) {
    localStorage.clear();
    window.location.href = '/Login';
}

var userData = JSON.parse(localStorage.getItem("user"));
console.log(userData);
var userName = localStorage.getItem("userName");

$('#FirstNameLastName').html(userName + "&nbsp; <i class='fa fa-times' id='logout' style='cursor: pointer;'></i>");
//$('#Store').text(userData.Merchant.Brand.Name + " - " + userData.Merchant.StoreId);

$('#Store').text("BK Cafe");

$('#logout').click(function () {
    localStorage.clear();
    window.location.href = "/Login";
})

var hours = 24; // Reset when storage is more than 24hours
var now = Date.now();
var setupTime = localStorage.getItem('setupTime');
if (setupTime == null) {
    localStorage.setItem('setupTime', now)
} else if (now - setupTime > hours * 60 * 60 * 1000) {
    localStorage.clear()
    localStorage.setItem('setupTime', now);
    window.location.href = "/Login";
}

//Customer Info - End

const formatToCurrency = amount => {
    var formattedOutput = new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY',
        minimumFractionDigits: 2,
    });

    return formattedOutput.format(amount).replace('₺', '') + " ₺";
};