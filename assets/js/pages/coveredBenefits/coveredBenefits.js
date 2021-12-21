"use strict";

// Class Definition
var coveredBenefits = (function () {
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

    var btnDental = $('#btnDental');
    var btnHearing = $('#btnHearing');
    var btnVision = $('#btnVision');

    var accordionList = $('#accordionList');

    var replacementTypeButtonList = [];

    var coveredBenefitsButtons = () => {
        console.log('Runed');

        replacementTypeButtonList.push(btnDental);
        replacementTypeButtonList.push(btnHearing);
        replacementTypeButtonList.push(btnVision);

        btnDental.click(function () {
            console.log('Clicked');
            productSubCategoryList({ button: $(this) })
        });

        btnHearing.click(function () {
            console.log('Clicked');
            productSubCategoryList({ button: $(this) })
        });
        btnVision.click(function () {
            console.log('Clicked');
            productSubCategoryList({ button: $(this) })
        });
    }
    var productSubCategoryList = ({ button }) => {
        var productCategoryId = button.data('id');
        console.log(productCategoryId);

        replacementTypeButtonList.forEach(function (button) {
            if (button.data('id') == productCategoryId) {
                button.removeClass('btn-outline-primary');
                button.addClass('btn-primary');
            } else {
                button.addClass('btn-outline-primary');
                button.removeClass('btn-primary');
            }
        });

        api.productSubCategory({
            productCategoryId: productCategoryId,
            func: (response) => {
                if (api.responseCheck({ response: response })) {
                    var productSubCategoryList = response.response.list;
                    console.log(productSubCategoryList);
                    accordionList.empty();

                    var index = 0;
                    productSubCategoryList.forEach(function (productSubCategory) {
                        // do something with `item`

                        accordionList.append(
                            `
                            <div class="card">
                                <div class="card-header">
                                    <div  id="collapse-title-`+ productSubCategory.id + `" class="card-title  collapse-item font-red font-bold font-18" data-toggle="collapse" data-target="#collapse-index-` + index + `"  data-id="` + productSubCategory.id + `"  data-index="` + productSubCategory.id + `" aria-expanded="true" >` + productSubCategory.name + `</div>
                                </div>
                                <div id="collapse-index-`+ productSubCategory.id + `" class="collapse" data-parent="#accordionExample` + index + `" style=""  data-index="` + productSubCategory.id + `" data-id="` + productSubCategory.id + `">
                                    <div class="card-body">
                                    </div>
                                </div>
                            </div>
                            `
                        )

                        var collapseItem = $('#collapse-title-' + productSubCategory.id);

                        collapseItem.click(function () {
                            console.log('Clicked collapseItem');
                            productList({ button: $(this) })
                        });

                        index++;
                    });
                }
            }
        });
    }

    var productList = ({ button }) => {
        console.log("productList");

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
            api.productList({
                productSubCategoryId: productSubCategoryId,
                func: (response) => {
                    if (api.responseCheck({ response: response })) {
                        var productListResponse = response.response.productList;
                        console.log(productListResponse);
                        //accordionList.empty();
                        productSubCategoryIndexDiv.empty();
                        productSubCategoryIndexDiv.addClass('show');
                        var index = 0;
                        productListResponse.forEach(function (product) {
                            // do something with `item`

                            //console.log(productSubCategoryIndexDiv);
                            //
                            productSubCategoryIndexDiv.append(

                                `

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

<div class="div-hr col-md-6 mt-2 ml-3"></div>

                            `
                            )
                            /*

                            var collapseItem = $('#collapse-item');

                            collapseItem.click(function () {
                                console.log('Clicked');
                                productList({ button: $(this) })
                            });

                            */

                            index++;
                        });
                    }
                }
            });
        }
    }
    // Public Functions
    return {
        // public functions
        coveredBenefitsButtons,
    };
})();

$(function () {
    coveredBenefits.coveredBenefitsButtons();
});