"use strict";

// Class Definition
var index = (function () {
    var btnSales = $('#btnSales');
    var btnRefund = $('#btnRefund');
    var btnStatement = $('#btnStatement');
    var providerId = $('#providerId');
    var providerFullName = $('#providerFullName');

    var btnList = [btnSales, btnRefund, btnStatement]

    var selectLocationList = $('select[name="locationList"]');
    var selectLocationListSelect2 = null;
    var locationListData = [];

    var loadButtons = () => {
        var merchant = localStorageData.getMerchant();

        providerId.html(localStorageData.getMerchantProviderId);
        providerFullName.html(merchant.merchantFirstName + ` ` + merchant.merchantLastName);

        btnSales.click(function (e) {
            if (localStorageData.getLocationId() != null) {
                localStorageData.setSearchType({ searchType: 1 })
                redirect.search()
            }
        });
        btnRefund.click(function (e) {
            if (localStorageData.getLocationId() != null) {
                localStorageData.setSearchType({ searchType: 2 })
                redirect.search()
            }
        });
        btnStatement.click(function (e) {
            if (localStorageData.getLocationId() != null) {
                localStorageData.setSearchType({ searchType: 3 })
                redirect.statement()
            }
        });
    }

    var enableButtons = () => {
        btnList.forEach(function (btn) {
            btn.prop('disabled', false);

            btn.addClass('btn-primary');
            btn.removeClass('btn-disabled');

            btn.addClass('cursor-pointer');
            btn.removeClass('cursor-disabled');

            var type = btn.data('type');
            if (type == 1) {
                btn.addClass('bg-indexsales');
            } else if (type == 2) {
                btn.addClass('bg-indexrefund');
            } else if (type == 3) {
                btn.addClass('bg-indexstatement');
            }
        });
    }
    var disableButtons = () => {
        btnList.forEach(function (btn) {
            btn.prop('disabled', true)

            btn.removeClass('btn-primary');
            btn.addClass('btn-disabled');

            btn.removeClass('cursor-pointer');
            btn.addClass('cursor-disabled');

            var type = btn.data('type');
            if (type == 1) {
                btn.removeClass('bg-indexsales');
            } else if (type == 2) {
                btn.removeClass('bg-indexrefund');
            } else if (type == 3) {
                btn.removeClass('bg-indexstatement');
            }
        });
    }

    var getLocationList = () => {
        api.locationList({
            func: (response) => {
                if (api.responseCheck({ response: response })) {
                    //TODO - Go Home Page
                    console.log("HomePage Success");
                    var member = response.response.member;
                    var card = response.response.memberCard;

                    locationListData = [];

                    var locationListStatementData = []

                    var locationList = response.response.locationList;

                    var checkLocation = false;
                    locationList.forEach(function (location) {
                        if (localStorageData.getLocation()) {
                            if (localStorageData.getLocationId() == location.locationId) {
                                checkLocation = true;
                                enableButtons();
                            }
                        }

                        locationListData.push(
                            {
                                id: location.locationId,
                                text: location.locationName
                            }
                        )

                        locationListStatementData.push(
                            {
                                locationId: location.locationId
                            }
                        )
                    });

                    localStorageData.setLocationList({ locationList: locationListStatementData })

                    selectLocationListSelect2 = selectLocationList.select2({
                        placeholder: "<Location List>",
                        data: locationListData,
                        dropdownCssClass: "font-20 font-black"
                    }).on("change", function (e) {
                        console.log("change Location");
                        console.log(e);
                        var selectedLocationItem = selectLocationListSelect2.select2('data');
                        console.log(selectedLocationItem[0])
                        console.log(selectedLocationItem.length);
                        if (selectedLocationItem.length > 0) {
                            var selectedLocationItemData = {
                                name: selectedLocationItem[0].text,
                                id: selectedLocationItem[0].id,
                            }
                            console.log(selectedLocationItemData);
                            localStorageData.setLocation({ location: selectedLocationItemData });

                            //Visible Buttons
                            enableButtons()
                        }
                    });

                    if (localStorageData.getLocation()) {
                        if (localStorageData.getLocationId() != undefined && localStorageData.getLocationId() != null && localStorageData.getLocationId() != "") {
                            if (checkLocation = true) {
                                selectLocationList.val(localStorageData.getLocationId());
                                selectLocationList.trigger('change');
                            }
                        }
                    }
                } else {
                }
            }
        })
    }

    // Public Functions
    return {
        // public functions
        getLocationList,
        disableButtons,
        loadButtons
    };
})();

$(function () {
    index.getLocationList();
    index.loadButtons();
    index.disableButtons();
});