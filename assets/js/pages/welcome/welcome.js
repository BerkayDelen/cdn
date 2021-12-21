"use strict";

// Class Definition
var KTLoginGeneral = function () {
    var signInMerchantId = $('input[name="signInMerchantId"]');
    var signInMerchantPassword = $('input[name="signInMerchantPassword"]');

    var buttonSignIn = $('#kt_login_signin_submit');

    var inputMask = function () {
        $(".toggle-password").click(function () {
            var input = $(this).parent().find("input");
            if (input.attr("type") == "password") {
                input.attr("type", "text");
                $(this).addClass("bi bi-eye");
                $(this).removeClass("bi bi-eye-slash");
            } else {
                input.attr("type", "password");
                $(this).removeClass("bi bi-eye");
                $(this).addClass("bi bi-eye-slash");
            }
        });
    }

    var loadTestdata = function () {
        // memberNumber.val("2134555");
        //memberCardNumber.val("6371533541219323");
        //memberCardCVV.val("999");
        //memberBirthdate.val("09/08/1997");

        signInMerchantId.val("198753");
        signInMerchantPassword.val("123456");
    }

    $(document).on('keypress', function (e) {
        if (e.which == 13) {
            // buttonSignIn.click();
        }
    });

    var handleSignInFormSubmit = function () {
        buttonSignIn.click(function (e) {
            //localStorageData.clear();
            e.preventDefault();
            var btn = $(this);
            var form = $(this).closest('form');
            form.validate({
                rules: {
                    signInMerchantId: {
                        required: true
                    },
                    signInMerchantPassword: {
                        required: true
                    }
                }
            });

            if (!form.valid()) {
                return;
            }

            btn.addClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', true);

            global.deviceCreateOrUpdateCheck(
                {
                    func: (response) => {
                        if (api.responseCheck({ response })) {
                            api.login(
                                {
                                    providerId: signInMerchantId.val(),
                                    password: signInMerchantPassword.val(),
                                    func: (response) => {
                                        btn.removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false);
                                        //showErrorMsg(form, 'danger', 'Incorrect username or password. Please try again.');

                                        console.log("Welcome Login");
                                        console.log(response);
                                        if (api.responseCheck({ response: response })) {
                                            //True
                                            api.token(
                                                {
                                                    authValue: response.response.authValue,
                                                    func: (tokenResponse) => {
                                                        if (api.responseCheck({ response: tokenResponse })) {
                                                            //TODO - Go Home Page

                                                            localStorageData.setMerchantProviderId({ merchantProviderId: signInMerchantId.val() })
                                                            console.log("Welcome Login Success");
                                                            redirect.homePage();
                                                        } else {
                                                        }
                                                    }
                                                }
                                            )
                                        } else {
                                            //False
                                        }
                                    }
                                }
                            )
                        } else {
                            btn.removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false);
                        }
                    }
                }
            )
        });
    }

    // Public Functions
    return {
        // public functions
        init: function () {
            loadTestdata();
            inputMask();

            handleSignInFormSubmit();
        }
    };
}();

$(function () {
    KTLoginGeneral.init();

    $.urlParam = function (name) {
        var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
        return results[1] || 0;
    }
});

const welcome = (function () {
    const deviceCreateOrUpdate = () => {
        deviceCreateOrUpdateCheck();
    }
    const setOnesignalId = ({ onesignalId }) => {
        return localStorage.setItem("onesignalid", onesignalId)
    }

    return {
        // public functions
        deviceCreateOrUpdate,
    };
})();