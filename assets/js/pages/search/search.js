"use strict";

// Class Definition
var index = (function () {
    var inputSearch = $('input[name="search"]');
    var inputSeearchValue = $('input[name="memberSearch"]');

    var loadInputs = () => {
        $(document).on('keypress', function (e) {
            if (e.which == 13) {
                inputSearch.click();
            }
        });

        inputSeearchValue.inputmask({
            mask: ["9999-9999", "9999-9999-9999-9999"],
            keepStatic: true
        });

        //memberCardNumber.inputmask('unmaskedvalue')
        inputSearch.click(function (e) {
            getMemberSearch()
        });
    }

    var getMemberSearch = () => {
        var qrCode = "";

        if (inputSeearchValue.val().length > 9) {
            qrCode = inputSeearchValue.inputmask('unmaskedvalue')
        } else {
            qrCode = inputSeearchValue.val()
        }

        api.memberSearch({
            qrCode: qrCode,
            func: (response) => {
                if (api.responseCheck({ response: response })) {
                    //TODO - Go Home Page
                    console.log("HomePage Success");
                    var member = response.response;
                    var memberCard = response.response.memberCard;

                    localStorageData.setQRCode({ qrcode: qrCode })
                    localStorageData.setQRCodeType({ qrcodeType: response.response.transactionApprovalStatus })
                    localStorageData.setMember({ member: member })
                    localStorageData.setMemberCard({ memberCard: memberCard })

                    if (localStorageData.getSearchType() == 1) {
                        redirect.sales();
                    } else {
                        redirect.refund();
                    }
                } else {
                }
            }
        })
    }

    // Public Functions
    return {
        // public functions
        getMemberSearch,
        loadInputs
    };
})();

$(function () {
    index.loadInputs();
});