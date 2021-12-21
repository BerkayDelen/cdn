"use strict";

// Class Definition
var sales = (function () {
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
    var btnNext = $('#next');
    var inputAmount = $('input[name="amount"]');

    var memberFullName = $('#memberFullName');
    var memberCardNumber = $('#memberCardNumber');
    var memberCardStatus = $('#memberCardStatus');
    var memberExpirationDate = $('#memberExpirationDate');

    var memberLocationBusinessName = $('#memberLocationBusinessName');
    var memberCardBalance = $('#memberCardBalance');

    var basket = [];

    var loadInputs = () => {
        var member = localStorageData.getMember();
        var memberCard = localStorageData.getMemberCard();

        console.log(member);
        var memberMiddleName = '';

        if (member.memberMiddleName != "") {
            memberMiddleName = member.memberMiddleName + " ";
        }

        memberFullName.html(member.memberFirstName + ' ' + memberMiddleName + '' + member.memberLastName);
        memberCardNumber.html(memberCard.cardNumber);

        if (memberCard.cardStatus == "Active") {
            memberCardStatus.removeClass('font-red');
            memberCardStatus.addClass('font-green');
            btnNext.prop('disabled', false);
        } else {
            memberCardStatus.addClass('font-red');
            memberCardStatus.removeClass('font-green');
            btnNext.prop('disabled', true);
        }

        memberCardStatus.html(memberCard.cardStatus);
        memberExpirationDate.html(memberCard.cardExpireDate);
        memberCardBalance.html("$" + memberCard.cardBalance.toFixed(2));

        memberLocationBusinessName.html(localStorageData.getLocation().name);

        inputAmount.inputmask('currency', {
            rightAlign: true,
            allowPlus: true,
            allowMinus: false,
            min: 0,
            prefix: ''
        }).val(0);

        //var input = document.querySelector('input'); // get the input element
        //input.addEventListener('input', resizeInput); // bind the "resizeInput" callback on "input" event
        //resizeInput.call(input); // immediately call the function

        //function resizeInput() {
        //    console.log(this.value.length);

        //}

        //inputAmount.change(function () {
        //    console.log("changed");

        //    if (!$.isNumeric($(this).val()))
        //        $(this).val('0').trigger('change');

        //});

        inputAmount.keyup(function () {
            // $(this).val(global.currencyFormat({ str: $(this).val() }));

            //  var formated = parseFloat($(this).val(), 10).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,").toString();
            // console.log(formated);
            // $(this).val(parseFloat($(this).val(), 10).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,").toString());

            /*
            let val = this.value;
            val = val.replace(/,/g, "");
            if (val.length > 3) {
                let noCommas = Math.ceil(val.length / 3) - 1;
                let remain = val.length - (noCommas * 3);
                let newVal = [];
                for (let i = 0; i < noCommas; i++) {
                    newVal.unshift(val.substr(val.length - (i * 3) - 3, 3));
                }
                newVal.unshift(val.substr(0, remain));
                this.value = newVal;
            }
            else {
                this.value = val;
            }
            */

            console.log(this.value.length);

            if (this.value.length > 4) {
                this.style.width = 2 + this.value.length + "ch";
            } else {
                this.style.width = 2 + 4 + "ch";
            }
            console.log(memberCard)
            if (Number(inputAmount.inputmask('unmaskedvalue') > memberCard.cardBalance)) {
                console.log('font-red')
                inputAmount.addClass('font-red');
                inputAmount.removeClass('font-green');
            } else {
                console.log('font-gren')
                inputAmount.removeClass('font-red');
                inputAmount.addClass('font-green');
            }
        });
        btnRefund.click(function (e) {
            console.log("Clicked");
            var transactionId = $(this).data('id');

            api.paymentRefund({
                transactionId: transactionId,
                func: (response) => {
                    if (api.responseCheck({ response: response })) {
                        //TODO - Go Home Page
                        console.log("TransactionList Success");

                        var title = `
        <div>
        <span class="font-blue font-bold">Payment Refund Success</span>
        </div>
        `;
                        var html = `
        `
                    }

                    swal.fire({
                        title: title,
                        html: html,
                        type: 'success',
                        showCancelButton: false,
                        confirmButtonColor: global.blue,
                        confirmButtonText: 'HomePage'
                    }).then(function (result) {
                        if (result.value) {
                            redirect.homePage();
                        }
                    });
                }
            });
        });

        btnNext.click(function (e) {
            console.log("Clicked");

            if (Number(inputAmount.inputmask('unmaskedvalue') <= 0)) {
                var title = `
                    <div>
                        <span class="font-blue font-bold">XXXXX</span>
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

            if (basket.length <= 0) {
                var title = `
                    <div>
                    <span class="font-blue font-bold">Please select the Product(s)</span>
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

            if (Number(inputAmount.inputmask('unmaskedvalue') > memberCard.cardBalance)) {
                var title = `
                    <div>
                    <span class="font-blue font-bold">The amount to be charged cannot be higher than Member’s balance on the CareCard.
<br>
If balance is not sufficient, please consider other payment methods for the remaining amount.</span>
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

            //Send Pay
            console.log(basket);

            localStorageData.setBasket({ basket: basket })
            localStorageData.setAmount({ amount: Number(inputAmount.inputmask('unmaskedvalue')) })

            redirect.pay()
        });
    }

    var loadProducts = () => {
        api.productList({
            func: (response) => {
                if (api.responseCheck({ response: response })) {
                    //TODO - Go Home Page
                    console.log("Product List Success");

                    var productList = response.response.productSubCategoryList;
                    var index = 0;

                    productList.forEach(function (productSubCategory) {
                        console.log(productSubCategory);
                        var productHTML = '';

                        productSubCategory.productList.forEach(function (product) {
                            productHTML +=
                                `
                                <div class="row">
                                <div class="col-md-12 col-sm-12">

                                <div class="float-left pt-15-px">
                                    <div class="row pl-3 mt-1">
                                        <div class="col-md-12 col-sm-12">
                                            <span class="font-blue font-16 font-black ">`+ product.productCode + `</span>
                                        </div>
                                    </div>
                                    <div class="row pl-3 mt-2">
                                        <div class="col-md-12 col-sm-12">
                                            <span class="font-blue font-18 font-black font-bold">`+ product.productName + `</span>
                                        </div>
                                    </div>
                               </div>

                                                <div class="float-right pt-35-px">
                                                    <button class="font-bold basket-item-button product-add-button " data-id="`+ product.productId + `" data-name="` + product.productName + `" data-code="` + product.productCode + `"><i class="fas fa-plus font-green font-30"></i></button>
                                                </div>
                                </div>
                            </div>

                             <div class="div-hr mt-3"></div>

                            `
                        })

                        productView.append(
                            `
                            <div class="card sale-card">
                                <div class="card-header sale-card-header">
                                    <div  id="collapse-title-`+ productSubCategory.subCategoryId + `" class="card-title  collapse-item font-darkgreen font-18" data-toggle="collapse" data-target="#collapse-index-` + index + `"  data-id="` + productSubCategory.subCategoryId + `"  data-index="` + productSubCategory.subCategoryId + `" aria-expanded="true" >` + productSubCategory.subCategoryName + `</div>
                                </div>
                                <div id="collapse-index-`+ productSubCategory.subCategoryId + `" class="collapse" data-parent="#accordionExample` + index + `" style=""  data-index="` + productSubCategory.subCategoryId + `" data-id="` + productSubCategory.subCategoryId + `">
                                    <div class="card-body">
                                        `+ productHTML + `
                                    </div>
                                </div>
                            </div>
                            `
                        )

                        var collapseItem = $('#collapse-title-' + productSubCategory.subCategoryId);

                        collapseItem.click(function () {
                            console.log('Clicked collapseItem');
                            var button = $(this);

                            var productSubCategoryId = button.data('id');
                            var productSubCategoryIndex = button.data('index');
                            console.log(productSubCategoryIndex);
                            var productSubCategoryTitle = $('#collapse-title-' + productSubCategoryIndex)
                            var productSubCategoryIndexDiv = $('#collapse-index-' + productSubCategoryIndex)
                            var checkShowed = productSubCategoryIndexDiv.hasClass('show');
                            if (checkShowed) {
                                productSubCategoryIndexDiv.removeClass('show');
                            } else {
                                console.log('ok');
                                console.log(productSubCategoryId);
                                productSubCategoryIndexDiv.addClass('show');
                            }
                        });

                        index++;

                        if (basket.length == 0) {
                            basketEmpty.show();
                        } else {
                            basketEmpty.hide();
                        }
                    })

                    var productAddButton = $('.product-add-button');

                    productAddButton.click(function () {
                        console.log('Clicked productAddButton');
                        var addButton = $(this);

                        var productId = addButton.data('id');
                        var productName = addButton.data('name');
                        var productCode = addButton.data('code');
                        console.log(productId)
                        console.log(productName)
                        console.log(productCode)

                        var product = {
                            productId: productId,
                            productName: productName,
                            productCode: productCode,
                        }

                        console.log(productId);

                        basketList.append(

                            `
                                <div class="row" id="basket-item-index-`+ basket.length + `" >
                                <div class="col-md-12 col-sm-12">

                                <div class="float-left">
                                    <div class="row pl-3 mt-1">
                                        <div class="col-md-12 col-sm-12">
                                            <span class="font-blue font-16 font-black font-bold">`+ product.productCode + `</span>
                                        </div>
                                    </div>
                                    <div class="row pl-3 mt-2">
                                        <div class="col-md-12 col-sm-12">
                                            <span class="font-blue font-18 font-black ">`+ product.productName + `</span>
                                        </div>
                                    </div>

                               </div>

                                                <div class="float-right p-15-px">

                                                    <button class="font-bold basket-item-button basket-remove-button" data-index="` + basket.length + `" data-id="` + product.productId + `" data-name="` + product.productName + `"><i class="fas fa-minus font-white"></i></button>
                                                    <span class="font-black" id="basket-item-text-`+ basket.length + `" data-index="` + basket.length + `" data-id="` + product.productId + `" data-name="` + product.productName + `">1</span>
                                                    <button class="font-bold basket-item-button basket-add-button" data-index="` + basket.length + `" data-id="` + product.productId + `" data-name="` + product.productName + `"><i class="fas fa-plus font-white"></i></button>
                                                    <button class="font-bold basket-item-button basket-delete-button" data-index="` + basket.length + `" data-id="` + product.productId + `" data-name="` + product.productName + `"><i class="fas fa-times font-white"></i></button>
                                                </div>
                                </div>
                                <div class="div-hr mt-3"></div>
                            </div>

                            `)

                        basket.push({
                            productIndex: basket.length,
                            productId: product.productId,
                            productName: product.productName,
                            productCode: product.productCode,
                            productQuantity: 1
                        })

                        if (basket.length == 0) {
                            basketEmpty.show();
                        } else {
                            basketEmpty.hide();
                        }

                        var basketProductAddButton = $('.basket-add-button');
                        var basketProductRemoveButton = $('.basket-remove-button');
                        var basketProductDeleteButton = $('.basket-delete-button');

                        basketProductAddButton.click(function () {
                            console.log('Clicked productAddButton');
                            var addButton = $(this);

                            var productIndex = addButton.data('index');
                            var productId = addButton.data('id');
                            var productName = addButton.data('name');
                            console.log(productIndex)
                            console.log(productId)
                            console.log(productName)

                            var basketQuantityAdd = $('#basket-item-text-' + productIndex);

                            var quantity = basketQuantityAdd.text();

                            var lastQuantity = parseInt(quantity) + 1;
                            basketQuantityAdd.text(lastQuantity);

                            var index = 0;
                            basket.forEach(function (basketItem) {
                                if (productIndex == basketItem.productIndex) {
                                    console.log("Added");
                                    basketItem.productQuantity = lastQuantity
                                    console.log(basket);
                                }
                                index++
                            })

                            if (basket.length == 0) {
                                basketEmpty.show();
                            } else {
                                basketEmpty.hide();
                            }
                        });

                        basketProductRemoveButton.click(function () {
                            console.log('Clicked basketProductRemoveButton');
                            var addButton = $(this);

                            var productIndex = addButton.data('index');
                            var productId = addButton.data('id');
                            var productName = addButton.data('name');
                            console.log(productIndex)
                            console.log(productId)
                            console.log(productName)

                            var basketQuantityAdd = $('#basket-item-text-' + productIndex);

                            var basketItemView = $('#basket-item-index-' + productIndex);

                           
                            var quantity = basketQuantityAdd.text();

                            var lastQuantity = parseInt(quantity) - 1;

                            basketQuantityAdd.text(lastQuantity);

                            var index = 0;
                            basket.forEach(function (basketItem) {
                                if (productIndex == basketItem.productIndex) {
                                    if (lastQuantity == 0) {
                                        console.log("lastQuantity: " + lastQuantity);
                                        basketItemView.remove();
                                        basket.splice(index, 1);
                                    } else {
                                        console.log("Removed");
                                        basketItem.productQuantity = lastQuantity
                                    }
                                    

                                    console.log(basket);


                                }
                                index++
                            })
                            console.log("basket Count: " + basket.length);
                            if (basket.length == 0) {
                                basketEmpty.show();
                            } else {
                                basketEmpty.hide();
                            }
                        });

                        basketProductDeleteButton.click(function () {
                            console.log('Clicked basketProductDeleteButton');
                            var addButton = $(this);

                            var productIndex = addButton.data('index');
                            var productId = addButton.data('id');
                            var productName = addButton.data('name');
                            console.log(productIndex)
                            console.log(productId)
                            console.log(productName)

                            var basketQuantityAdd = $('#basket-item-index-' + productIndex);

                            basketQuantityAdd.remove();

                            var index = 0;
                            basket.forEach(function (basketItem) {
                                if (productIndex == basketItem.productIndex) {
                                    console.log("Removed");
                                    console.log(basket);
                                    $(this).remove();
                                    basket.splice(index, 1);
                                    console.log(basket);
                                    
                                }
                                index++
                            })

                            if (basket.length == 0) {
                                basketEmpty.show();
                            } else {
                                basketEmpty.hide();
                            }
                        });
                    });
                }
            }
        });
    }

    // Public Functions
    return {
        // public functions
        loadInputs,
        loadProducts,
    };
})();

$(function () {
    sales.loadInputs();
    sales.loadProducts();
});