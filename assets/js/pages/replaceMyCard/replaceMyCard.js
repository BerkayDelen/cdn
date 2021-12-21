"use strict";

// Class Definition
var replaceMyCard = (function () {
    var pageLength = 5;

    var paging = {
        currentPageNumber: 1,
        pageSize: pageLength
    }

    var table = $('#kt_table_1');

    var address = $('textarea[name="address"]');

    var radioReplacementType = $("input[name='replacementType']:checked");
    var radiomailingType = $("input[name='mailingType']:checked");

    var btnCardReplace = $('#btnCardReplace');

    var btnLost = $('input[name="btn-lost"]');
    var btnStolen = $('input[name="btn-stolen"]');
    var btnOther = $('input[name="btn-other"]');

    var btnMailingYes = $('input[name="btn-mailing-yes"]');
    var btnMailingNo = $('input[name="btn-mailing-no"]');

    var replacementTypeButtonList = [];
    var mailingTypeButtonList = [];
    var replacementSelectedType = "";
    var mailingSelectedType = "";

    var replacementTypeButtons = () => {
        replacementTypeButtonList.push(btnLost);
        replacementTypeButtonList.push(btnStolen);
        replacementTypeButtonList.push(btnOther);

        btnLost.click(function () {
            replacementTypeButton({ button: $(this) })
        });

        btnStolen.click(function () {
            replacementTypeButton({ button: $(this) })
        });
        btnOther.click(function () {
            replacementTypeButton({ button: $(this) })
        });
    }

    var mailingTypeButtons = () => {
        mailingTypeButtonList.push(btnMailingYes);
        mailingTypeButtonList.push(btnMailingNo);

        btnMailingYes.click(function () {
            mailingTypeButton({ button: $(this) })
        });

        btnMailingNo.click(function () {
            mailingTypeButton({ button: $(this) })
        });
    }

    var replacementTypeButton = ({ button }) => {
        var dataId = button.data('id');

        replacementSelectedType = dataId;
        replacementTypeButtonList.forEach(function (button) {
            console.log(dataId);
            console.log(button.data('id'));
            if (button.data('id') == dataId) {
                button.removeClass('btn-outline-primary-skyblue');
                button.addClass('btn-primary-skyblue');
            } else {
                button.addClass('btn-outline-primary-skyblue');
                button.removeClass('btn-primary-skyblue');
            }
        });
    }

    var mailingTypeButton = ({ button }) => {
        var dataId = button.data('id');

        mailingSelectedType = dataId;
        mailingTypeButtonList.forEach(function (button) {
            console.log(dataId);
            console.log(button.data('id'));
            if (button.data('id') == dataId) {
                button.removeClass('btn-outline-primary-skyblue');
                button.addClass('btn-primary-skyblue');
            } else {
                button.addClass('btn-outline-primary-skyblue');
                button.removeClass('btn-primary-skyblue');
            }
        });
    }

    var replaceMyCardButton = () => {
        btnCardReplace.click(function (e) {
            if (replacementSelectedType == 0) {
                swal.fire({
                    heightAuto: false,
                    title: "Notice",
                    html: "Please select your CareCard replacement reason",
                    icon: "warning",
                });
            } else if (mailingSelectedType == 0) {
                swal.fire({
                    heightAuto: false,
                    title: "Notice",
                    html: "Please confirm your mailing address",
                    icon: "warning",
                });
            } else {
                replaceMyCard({ replacementType: replacementSelectedType, mailingType: mailingSelectedType })
            }
        })
    }

    var profile = () => {
        api.profile({
            func: (response) => {
                var member = response.response.member;
                address.val(member.memberAddress);
                console.log(member.memberAddress)
            }
        });
    }

    var replaceMyCard = ({ replacementType, mailingType }) => {
        api.cardReplace({
            replacementType: replacementType,
            mailingType: mailingType,
            func: (response) => {
                if (api.responseCheck({ response: response })) {
                    var title = ""
                    var html = ""
                    if (mailingType == 1) {
                        title = `
<div>
<span class="font-blue font-bold">Thank you.</span>
<br>
<span class="font-blue">Your CareCard replacement card request was successfully processed.</span>

</div>
`;
                        html = `
        <p class="font-black">
                   Your current physical card is deactivated
                   and a new card will be mailed to your
                   mailing address. You may continue to use
                   your virtual card, available on your mobile
                   app, to access
                   your CarePlus CareCard benefits.
        </p>
                  `
                    } else {
                        title = `
        <div>
        <span class="font-blue font-bold">Thank you.</span>
        <br>
        <span class="font-red">
Your CareCard replacement card request is not complete.
</span>

        </div>
        `;
                        html = `
        <p class="font-black">
                  Please contact CarePlus Member Services
<br>
at <a class="font-bold font-blue" href="tel:18883433345">1-877-800-0505</a> (TTY: 711)<br>to update your mailing address and complete your replacement card request.
<br>
<br>
Your physical card has been deactivated;
<br>
however you may continue to use your virtual card, available on your mobile app to access your CarePlus CareCard benefits.
        </p>
                  `
                    }

                    swal.fire({
                        title: title,
                        html: html,
                        type: 'success',
                        showCancelButton: false,
                        confirmButtonColor: global.red,
                        confirmButtonText: 'My Profile'
                    }).then(function (result) {
                        if (result.value) {
                            redirect.homePage();
                        }
                    });
                }
            }
        })
    }

    // Public Functions
    return {
        // public functions
        profile,
        replaceMyCard,
        replaceMyCardButton,
        replacementTypeButtons,
        mailingTypeButtons
    };
})();

$(function () {
    replaceMyCard.profile();
    replaceMyCard.replaceMyCardButton();
    replaceMyCard.replacementTypeButtons();
    replaceMyCard.mailingTypeButtons();
});