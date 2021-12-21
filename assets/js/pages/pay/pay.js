"use strict";

// Class Definition
var pay = (function () {
    var pageLength = 5;

    var productListData = [];

    var paging = {
        currentPageNumber: 1,
        pageSize: pageLength
    }

    var table = $('#kt_table_1');
    var btnRefund = $('.btnRefund');
    var productView = $('#productView');
    var basketList = $('#basketList');
    var basketEmpty = $('#basket-empty');
    var btnPay = $('#btnPay');
    var inputAmount = $('input[name="amount"]');
    var inputPrivacy = $('input[name="privacy"]');
    var memberBirthdate = $('input[name="memberBirthdate"]');
    var memberBirthdateView = $('#memberBirthdateView');

    var basket = [];
    var birthDate = "";

    var loadInputs = () => {
        var member = localStorageData.getMember();
        var memberCard = localStorageData.getMemberCard();

        if (localStorageData.getQRCodeType() == 1) {//Real Card QR
            memberBirthdate.show();
            memberBirthdateView.show();
        } if (localStorageData.getQRCodeType() == 3) {//Real Card Number
            memberBirthdate.show();
            memberBirthdateView.show();
        } else {//Mobile QRCode
            memberBirthdate.hide();
            memberBirthdateView.hide();
        }

        memberBirthdate.inputmask({ "mask": "99/99/9999" });

        inputAmount.inputmask('currency', {
            rightAlign: true,
            allowPlus: true,
            allowMinus: false,
            min: 0,
            prefix: ''
        }).val(localStorageData.getAmount());

        if (inputAmount.val().length > 4) {
            inputAmount.css("width", 2 + inputAmount.val().length + "ch");
        } else {
            inputAmount.css("width", 2 + 4 + "ch");
        }

        btnPay.click(function (e) {
            console.log("Clicked");

            var checkBirthDate = false;
            if (localStorageData.getQRCodeType() == 1) {//Real Card QR
                memberBirthdate.show();
                checkBirthDate = true;
                birthDate = memberBirthdate.val();
            } if (localStorageData.getQRCodeType() == 3) {//Real Card Number
                memberBirthdate.show();
                checkBirthDate = true;
                birthDate = memberBirthdate.val();
            } else {//Mobile QRCode
                memberBirthdate.hide();
            }

            if (memberBirthdate.inputmask('unmaskedvalue').length == 0 && checkBirthDate == true) {
                var title = `
                    <div>
                    <span class="font-blue font-bold">Please enter your date of birth​</span>
                    </div>
                    `;
                var html = `
                    `

                swal.fire({
                    title: title,
                    html: html,
                    type: 'info',
                    showCancelButton: false,
                    confirmButtonColor: global.blue,
                    confirmButtonText: 'OK'
                }).then(function (result) {
                    if (result.value) {
                    }
                });

                return;
            }

            if (!inputPrivacy.prop('checked')) {
                var title = `
                    <div>
                    <span class="font-blue font-bold">To proceed with the payment, please approve the notice</span>
                    </div>
                    `;
                var html = `
                    `

                swal.fire({
                    title: title,
                    html: html,
                    type: 'info',
                    showCancelButton: false,
                    confirmButtonColor: global.blue,
                    confirmButtonText: 'OK'
                }).then(function (result) {
                    if (result.value) {
                    }
                });

                return;
            }

            var basketList = []

            localStorageData.getBasket().forEach(function (product) {
                basketList.push({
                    productId: product.productId,
                    productName: product.productName,
                    productQuantity: product.productQuantity,
                })
            })

            api.paymentCreate({
                birthDate: birthDate,
                amount: localStorageData.getAmount(),
                qrCode: localStorageData.getQRCode(),
                productList: basketList,
                func: (response) => {
                    if (api.responseCheck({ response: response })) {
                        var paymentCreateData = response.response;
                        console.log("paymentCreateData")
                        console.log(paymentCreateData)

                        var merchant = localStorageData.getMerchant();
                        console.log("Merchant");
                        console.log(merchant);

                        if (localStorageData.getQRCodeType() == 1 || localStorageData.getQRCodeType() == 3) {
                            var title = `
                                            <div>
                                            <span class="font-black ">
Payment successful.
<br>
Provider Name: `+ merchant.merchantFirstName + ` ` + merchant.merchantLastName + `

                                                                    </span>
                                            </div>
                                            `;
                            var html = `
                                            <div class="mb-4">
                                            <span class="font-black  font-22">Charged Amount: <span class="font-blue font-green"> $`+ localStorageData.getAmount().toFixed(2) + `</span></span>
                                            </div>
`

                            swal.fire({
                                title: title,
                                html: html,
                                type: 'success',
                                showCancelButton: false,
                                confirmButtonColor: global.blue,
                                confirmButtonText: 'Done'
                            }).then(function (result) {
                                if (result.value) {
                                    redirect.homePage();
                                }
                            });
                        } else {
                            swal.fire({
                                html: ``,
                                showConfirmButton: false,
                                onRender: function () {
                                    // there will only ever be one sweet alert open.
                                    swal.showLoading();
                                }
                            });

                            var timer;

                            timer = setInterval(function () {
                                api.paymenApprovaltCheck({
                                    transactionId: paymentCreateData.transactionId,
                                    func: (response) => {
                                        if (api.responseCheck({ response: response })) {
                                            var paymenApprovaltCheckData = response.response;
                                            console.log(paymenApprovaltCheckData)
                                            if (paymenApprovaltCheckData.approvalStatusCode == 5) {
                                                //Complated
                                                clearInterval(timer);

                                                if (paymenApprovaltCheckData.approvalStatus) {
                                                    var title = `
                                            <div>
                                            <span class="font-black ">
Payment successful.
<br>
Provider Name: `+ merchant.merchantFirstName + ` ` + merchant.merchantLastName + `

                                                                    </span>
                                            </div>
                                            `;
                                                    var html = `
                                            <div class="mb-4">
                                            <span class="font-black  font-22">Charged Amount: <span class="font-blue font-green"> $`+ localStorageData.getAmount().toFixed(2) + `</span></span>
                                            </div>
`

                                                    swal.fire({
                                                        title: title,
                                                        html: html,
                                                        type: 'success',
                                                        showCancelButton: false,
                                                        confirmButtonColor: global.blue,
                                                        confirmButtonText: 'Done'
                                                    }).then(function (result) {
                                                        if (result.value) {
                                                            redirect.homePage();
                                                        }
                                                    });
                                                } else {
                                                    var title = `
                                            <div class="mt-5">
                                            <span class="font-red  font-22">Payment has not been received.
<br>
Please ask the Cardholder to approve the payment.</span>
                                            </div>
                                            `;
                                                    var html = ``

                                                    swal.fire({
                                                        title: title,
                                                        html: html,
                                                        type: 'warning',
                                                        showCancelButton: false,
                                                        confirmButtonColor: global.blue,
                                                        confirmButtonText: 'OK'
                                                    }).then(function (result) {
                                                        if (result.value) {
                                                            swal.close()
                                                        }
                                                    });
                                                }
                                            }
                                        }
                                    }
                                });
                            }, 2000);

                            function stopTimer() {
                                alert("Timer stopped");
                                clearInterval(timer);
                            }
                        }
                    }
                }
            });
        });
    }

    var loadProducts = () => {
        var productHTML = "";
        console.log(localStorageData.getBasket());
        localStorageData.getBasket().forEach(function (product) {
            productHTML +=
                `
                                <div class="row">
                                <div class="col-md-12 col-sm-12 p-0">

                                <div class="float-left">
                                    <div class="row  mt-1">
                                        <div class="col-md-12 col-sm-12">
                                            <span class="font-blue font-16 font-black font-bold">`+ product.productCode + `</span>
                                        </div>
                                    </div>
                                    <div class="row mt-2">
                                        <div class="col-md-12 col-sm-12">
                                            <span class="font-blue font-18 font-black ">`+ product.productName + `</span>
                                        </div>
                                    </div>

                               </div>

                                                <div class="float-right p-15-px">
                                                    <span class="font-black">`+ product.productQuantity + `</span>
                                                </div>
                                </div>
                            </div>

                             <div class="div-hr mt-3"></div>

                            `
        })

        basketList.append(
            productHTML
        )
    }

    // Public Functions
    return {
        // public functions
        loadInputs,
        loadProducts,
    };
})();

$(function () {
    pay.loadInputs();
    pay.loadProducts();
});