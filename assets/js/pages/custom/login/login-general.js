"use strict";

// Class Definition
var KTLoginGeneral = function () {
    var login = $('#kt_login');

    var showErrorMsg = function (form, type, msg) {
        var alert = $('<div class="alert alert-' + type + ' alert-dismissible" role="alert">\
			<div class="alert-text">'+ msg + '</div>\
			<div class="alert-close">\
                <i class="flaticon2-cross kt-icon-sm" data-dismiss="alert"></i>\
            </div>\
		</div>');

        form.find('.alert').remove();
        alert.prependTo(form);
        //alert.animateClass('fadeIn animated');
        KTUtil.animateClass(alert[0], 'fadeIn animated');
        alert.find('span').html(msg);
    }

    var hideErrorMsg = function (form) {
        form.find('.alert').remove();
        //alert.animateClass('fadeIn animated');
        //KTUtil.animateClass(alert[0], 'fadeIn animated');
    }

    // Private Functions
    var displaySignUpForm = function () {
        login.removeClass('kt-login--forgot');
        login.removeClass('kt-login--signin');

        login.addClass('kt-login--signup');
        KTUtil.animateClass(login.find('.kt-login__signup')[0], 'flipInX animated');
    }

    var displaySignInForm = function () {
        login.removeClass('kt-login--forgot');
        login.removeClass('kt-login--signup');

        login.addClass('kt-login--signin');
        KTUtil.animateClass(login.find('.kt-login__signin')[0], 'flipInX animated');
        //login.find('.kt-login__signin').animateClass('flipInX animated');
    }

    var displayForgotForm = function () {
        login.removeClass('kt-login--signin');
        login.removeClass('kt-login--signup');

        login.addClass('kt-login--forgot');
        //login.find('.kt-login--forgot').animateClass('flipInX animated');
        KTUtil.animateClass(login.find('.kt-login__forgot')[0], 'flipInX animated');
    }

    var handleFormSwitch = function () {
        $('#kt_login_forgot').click(function (e) {
            e.preventDefault();
            displayForgotForm();
            var form = $(this).closest('form');
            hideErrorMsg(form);
        });

        $('#kt_login_forgot_cancel').click(function (e) {
            e.preventDefault();
            displaySignInForm();
            var form = $(this).closest('form');
            hideErrorMsg(form);
        });

        $('#kt_login_signup').click(function (e) {
            e.preventDefault();
            displaySignUpForm();
        });

        $('#kt_login_signup_cancel').click(function (e) {
            e.preventDefault();
            displaySignInForm();
            var form = $(this).closest('form');
            hideErrorMsg(form);
        });
    }

    $(document).on('keypress', function (e) {
        if (e.which == 13) {
            $('#kt_login_signin_submit').click();
        }
    });

    var handleSignInFormSubmit = function () {
        $('#kt_login_signin_submit').click(function (e) {
            localStorage.clear();
            e.preventDefault();
            var btn = $(this);
            var form = $(this).closest('form');

            form.validate({
                rules: {
                    email: {
                        required: true,
                        email: true
                    },
                    password: {
                        required: true
                    }
                }
            });

            if (!form.valid()) {
                return;
            }

            btn.addClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', true);

            //
            var ApiUrl = "https://atapos.elspay.com/TabletPosService";
            //var ApiUrl = "https://switchon.extraloyalty.com:5050/TabletPosService";
            // var ApiUrl = "http://localhost:55283";

            var settings = {
                "url": ApiUrl + "/Api/Login",
                "method": "POST",
                "timeout": 0,
                "headers": {
                    "Content-Type": "application/json"
                },
                "data": JSON.stringify({
                    "UserName": $('#username').val(),
                    "Password": $('#password').val()
                }),
            };

            $.ajax(settings).done(function (response) {
                btn.removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false);

                if (response.responseResult.result) {
                    console.log(response.response)

                    //localStorage.setItem("role","admin");
                    localStorage.setItem("user", JSON.stringify(response.response))
                    localStorage.setItem("userCrmId", response.response.crmId)
                    localStorage.setItem("userName", response.response.name)

                    window.location.href = 'Merchant';
                } else {
                    showErrorMsg(form, 'danger', response.responseResult.exceptionDetail);
                }
            });

            /*
                        form.ajaxSubmit({
                            url: '',
                            success: function(response, status, xhr, $form) {
                                // similate 2s delay
                                setTimeout(function() {
                                    btn.removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false);
                                    showErrorMsg(form, 'danger', 'Incorrect username or password. Please try again.');
                                }, 2000);
                            }
                        });

                        */
        });
    }

    var handleSignUpFormSubmit = function () {
        $('#kt_login_signup_submit').click(function (e) {
            e.preventDefault();

            var btn = $(this);
            var form = $(this).closest('form');

            form.validate({
                rules: {
                    fullname: {
                        required: true
                    },
                    email: {
                        required: true,
                        email: true
                    },
                    password: {
                        required: true
                    },
                    rpassword: {
                        required: true
                    },
                    agree: {
                        required: true
                    }
                }
            });

            if (!form.valid()) {
                return;
            }

            btn.addClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', true);

            var serviceUrl = "http://13.93.68.175:4040/AVJ/Service/api/";

            var settings = {
                "url": serviceUrl + "customer/login",
                "method": "POST",
                "timeout": 0,
                "headers": {
                    "Content-Type": "application/json"
                },
                "data": JSON.stringify({
                    "Value": $('#cardNo').inputmask('unmaskedvalue'),
                    "Password": $('#cardPasssword').val()
                }),
            };

            $.ajax(settings).done(function (response) {
                btn.removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false);

                if (response.IsSuccess) {
                    localStorage.setItem("role", "normal")
                    localStorage.setItem("user", JSON.stringify(response.Result))
                    localStorage.setItem("cardTransactions", JSON.stringify(response.Result.CardTransactions))
                    window.location.href = 'AVJ/Customer/merchant-list.html';
                } else {
                    showErrorMsg(form, 'danger', response.exceptionDetail);
                }
            });

            /*
            form.ajaxSubmit({
                url: '',
                success: function(response, status, xhr, $form) {
                    // similate 2s delay
                    setTimeout(function() {
                        btn.removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false);
                        form.clearForm();
                        form.validate().resetForm();

                        // display signup form
                        displaySignInForm();
                        var signInForm = login.find('.kt-login__signin form');
                        signInForm.clearForm();
                        signInForm.validate().resetForm();

                        showErrorMsg(signInForm, 'success', 'Thank you. To complete your registration please check your email.');
                    }, 2000);
                }
            });

            */
        });
    }

    var handleForgotFormSubmit = function () {
        $('#kt_login_forgot_submit').click(function (e) {
            e.preventDefault();

            var btn = $(this);
            var fp_type = $("#fp_type").val();
            var fp_text = $("#fp_email").inputmask('unmaskedvalue');
            var form = $(this).closest('form');

            form.validate({
                rules: {
                    email: {
                        required: true,
                        email: true
                    }
                }
            });

            if (!form.valid()) {
                return;
            }

            btn.addClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light');
            // btn.addClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', true);

            var serviceUrl = "http://13.93.68.175:4040/AVJ/Service/api/";

            var apiUrl = "";
            if (fp_type == "C") {
                apiUrl = serviceUrl + "customer/ForgetPassword?value=" + fp_text
            } else if (fp_type == "U") {
                apiUrl = serviceUrl + "user/ForgetPassword?val=" + fp_text
            }

            swal.fire({
                html: '<h5>Loading...</h5>',
                showConfirmButton: false,
                allowEscapeKey: false,
                allowOutsideClick: false,
                onRender: function () {
                }
            });

            var settings = {
                "url": apiUrl,
                "method": "POST",
                "timeout": 0,
                "headers": {
                    "Content-Type": "application/json"
                },
                "data": JSON.stringify({}),
            };

            $.ajax(settings).done(function (response) {
                btn.removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false);
                $("#fp_email").val("");
                Swal.hideLoading();
                Swal.close();

                if (response.IsSuccess) {
                    btn.removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false); // remove
                    form.clearForm(); // clear form
                    form.validate().resetForm(); // reset validation states

                    // display signup form
                    displaySignInForm();
                    var signInForm = login.find('.kt-login__signin form');
                    signInForm.clearForm();
                    signInForm.validate().resetForm();

                    showErrorMsg(signInForm, 'success', 'Cool! Password recovery instruction has been sent to your email.');
                } else {
                    showErrorMsg(form, 'danger', response.exceptionDetail);
                }
            });
        });
    }

    var handleResetPasswordSubmit = function () {
        $('#kt_resetpassword_signup_submit').click(function (e) {
            e.preventDefault();

            if ($('#kt_resetpassword_signup_submit').hasClass("disabled")) {
                return;
            }

            var btn = $(this);
            var newCardPasssword = $("#newCardPasssword").val();
            var newCardPassswordRe = $("#newCardPassswordRe").val();
            var form = $(this).closest('form');

            hideErrorMsg(form);

            if (newCardPasssword.length < 6) {
                showErrorMsg(form, 'danger', "New Password length minimum 6 digits");
                return;
            }

            if (newCardPasssword != newCardPassswordRe) {
                showErrorMsg(form, 'danger', "Your confirmation password does not match the new password");
                return;
            }

            form.validate({
                rules: {
                    email: {
                        required: true,
                        email: true
                    }
                }
            });

            if (!form.valid()) {
                return;
            }

            btn.addClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', true);

            var serviceUrl = "http://13.93.68.175:4040/AVJ/Service/api/";

            swal.fire({
                html: '<h5>Loading...</h5>',
                showConfirmButton: false,
                allowEscapeKey: false,
                allowOutsideClick: false,
                onRender: function () {
                }
            });

            var settings = {
                "url": serviceUrl + "ResetPassword",
                "method": "POST",
                "timeout": 0,
                "headers": {
                    "Content-Type": "application/json"
                },
                "data": JSON.stringify({
                    "Value": $.urlParam('value'),
                    "Type": $.urlParam('type'),
                    "Password": newCardPasssword
                }),
            };

            $.ajax(settings).done(function (response) {
                btn.removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false);
                $("#fp_email").val("");
                Swal.hideLoading();
                Swal.close();

                if (response.IsSuccess) {
                    showErrorMsg(form, 'success', 'Your password has been changed.');

                    $("#newCardPasssword").hide();
                    $("#newCardPassswordRe").hide();
                    $("#resetPasswordErrors").hide();
                    $("#kt_resetpassword_signup_submit").hide();

                    setTimeout(function () {
                        if ($.urlParam('type') == "C") {
                            window.location.href = "/tabpos/Customer/login.html";
                        } else if ($.urlParam('type') == "U") {
                            window.location.href = "/tabpos/Merchant/login.html";
                        }
                    }, 2000); localStorage.clear();
                } else {
                    showErrorMsg(form, 'danger', response.exceptionDetail);
                }
            });
        });
    }

    // Public Functions
    return {
        // public functions
        init: function () {
            handleFormSwitch();
            handleSignInFormSubmit();
            handleSignUpFormSubmit();
            handleForgotFormSubmit();
            handleResetPasswordSubmit();
        }
    };
}();

// Class Initialization
jQuery(document).ready(function () {
    KTLoginGeneral.init();

    $.urlParam = function (name) {
        var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
        return results[1] || 0;
    }
});