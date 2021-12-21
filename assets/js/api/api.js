"use strict";

var api = (function () {
    var getBaseURL = function () {
         return "https://carecardmerchantapi.elspay.com/api";
    }

    const responseCheck = ({ response }) => {
        if (response.responseResult.result == true) {
            return response.responseResult.result;
        } else {
            if (response.responseResult.code == 2) {
                swal.fire({
                    heightAuto: false,

                    title: "Info",
                    html: response.responseResult.exceptionDetail,
                    icon: "warning",
                });
            } else if (response.responseResult.code == 3) {
                swal.fire({
                    heightAuto: false,

                    title: "Info",
                    html: response.responseResult.exceptionDetail,
                    icon: "warning",
                });
            }
            return response.responseResult.result;
        }
    }

    const fail = (jqXHR) => {
        if (jqXHR.status == 500 || jqXHR.status == 0) {
            // internal server error or internet connection broke
            localStorageData.clear();
            redirect.welcome();
        } else if (jqXHR.status == 401 || jqXHR.status == 0) {
            // internal server error or internet connection broke
            localStorageData.clear();
            redirect.welcome();
        } else {
            localStorageData.clear();
            redirect.welcome();
        }
    }

    var deviceCreateOrUpdate = ({ deviceType, deviceBrand, deviceModel, deviceNotificationPermission, devicePushToken, deviceToken, deviceOSVersion, deviceLanguage, func }) => {
        console.log("Device Type: " + deviceType);
        console.log("Device Brand: " + deviceBrand);
        console.log("Device Mode: " + deviceModel);
        console.log("Device Notificaiton Permission: " + deviceNotificationPermission);
        console.log("Device Push Token: " + devicePushToken);
        console.log("Device Token: " + deviceToken);
        console.log("Device OS Version: " + deviceOSVersion);
        console.log("Device Language: " + deviceLanguage);

        var data = {
            "deviceType": deviceType,
            "deviceBrand": deviceBrand,
            "deviceModel": deviceModel,
            "deviceNotificationPermission": deviceNotificationPermission,
            "devicePushToken": devicePushToken,
            "deviceToken": deviceToken,
            "deviceOSVersion": deviceOSVersion,
            "deviceLanguage": deviceLanguage
        };

        var settings = {
            "url": getBaseURL() + "/Device/CreateOrUpdate",
            "method": "POST",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json"
            },
            "data": JSON.stringify(data),
        };

        $.ajax(settings).done(function (response) {
            if (responseCheck({ response })) { }

            func(response);
        });
    }

    const login = ({ providerId, password, func }) => {
        var data = {
            "deviceId": localStorageData.getDeviceId(),
            "providerId": providerId,
            "password": password
        };
        var settings = {
            "url": getBaseURL() + "/Login",
            "method": "POST",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json"
            },
            "data": JSON.stringify(data),
        };

        $.ajax(settings).done(function (response) {
            if (responseCheck({ response })) {
                var merchant = response.response;
                if (merchant != null) {
                    localStorageData.setMerchant({ merchant });
                }
            }

            func(response);
        });
    }

    const token = ({ authValue, func }) => {
        var data = {
            "deviceId": localStorageData.getDeviceId(),
            "merchantId": localStorageData.getMerchantId(),
            "authValue": authValue
        };

        var settings = {
            "url": getBaseURL() + "/Token/Get",
            "method": "POST",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json"
            },
            "data": JSON.stringify(data),
        };

        $.ajax(settings).done(function (response) {
            if (responseCheck({ response })) {
                localStorageData.setToken({ token: response.response.accessToken });
            }

            func(response);
        });
    }
    const logout = ({ func }) => {
        var data = {
            "deviceId": localStorageData.getDeviceId(),
            "merchantId": localStorageData.getMerchantId()
        };

        var settings = {
            "url": getBaseURL() + "/Logout",
            "method": "POST",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorageData.getToken(),
            },
            "data": JSON.stringify(data),
        };

        $.ajax(settings).done(function (response) {
            if (responseCheck({ response })) {
            }

            func(response);
        }).fail(fail);
    }

    const locationList = ({ func }) => {
        var data = {
            "deviceId": localStorageData.getDeviceId(),
            "merchantId": localStorageData.getMerchantId(),
        };

        var settings = {
            "url": getBaseURL() + "/Location/List",
            "method": "POST",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorageData.getToken(),
            },
            "data": JSON.stringify(data),
        };

        $.ajax(settings).done(function (response) {
            if (responseCheck({ response })) {
            }

            func(response);
        }).fail(fail);
    }

    const memberSearch = ({ qrCode, func }) => {
        var data = {
            "deviceId": localStorageData.getDeviceId(),
            "merchantId": localStorageData.getMerchantId(),
            "locationId": localStorageData.getLocationId(),
            "qrCode": qrCode,
        };

        var settings = {
            "url": getBaseURL() + "/Member/Search",
            "method": "POST",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorageData.getToken(),
            },
            "data": JSON.stringify(data),
        };

        $.ajax(settings).done(function (response) {
            if (responseCheck({ response })) {
            }

            func(response);
        }).fail(fail);
    }

    const productList = ({ func }) => {
        var data = {
            "deviceId": localStorageData.getDeviceId(),
            "merchantId": localStorageData.getMerchantId(),
            "locationId": localStorageData.getLocationId(),
        };

        var settings = {
            "url": getBaseURL() + "/Product/SubCategory/List",
            "method": "POST",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorageData.getToken(),
            },
            "data": JSON.stringify(data),
        };

        $.ajax(settings).done(function (response) {
            if (responseCheck({ response })) {
            }

            func(response);
        }).fail(fail);
    }

    const paymentCreate = ({ birthDate, amount, qrCode, productList, func }) => {
        var data = {
            "deviceId": localStorageData.getDeviceId(),
            "merchantId": localStorageData.getMerchantId(),
            "locationId": localStorageData.getLocationId(),
            "memberId": localStorageData.getMemberId(),
            "memberCardId": localStorageData.getMemberCardId(),
            "birthDate": birthDate,
            "amount": amount,
            "qrCode": qrCode,
            "productList": productList,
        };

        var settings = {
            "url": getBaseURL() + "/Payment/Create",
            "method": "POST",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorageData.getToken(),
            },
            "data": JSON.stringify(data),
        };

        $.ajax(settings).done(function (response) {
            if (responseCheck({ response })) {
            }

            func(response);
        }).fail(fail);
    }

    const paymentRefund = ({ transactionId, func }) => {
        var data = {
            "deviceId": localStorageData.getDeviceId(),
            "merchantId": localStorageData.getMerchantId(),
            "locationId": localStorageData.getLocationId(),
            "memberId": localStorageData.getMemberId(),
            "memberCardId": localStorageData.getMemberCardId(),
            "trancactionId": transactionId
        };

        var settings = {
            "url": getBaseURL() + "/Payment/Refund",
            "method": "POST",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorageData.getToken(),
            },
            "data": JSON.stringify(data),
        };

        $.ajax(settings).done(function (response) {
            if (responseCheck({ response })) {
            }

            func(response);
        }).fail(fail);
    }

    const paymentList = ({ locationList, memberId, memberCardId, type, paging, func }) => {
        var data = {
            "deviceId": localStorageData.getDeviceId(),
            "merchantId": localStorageData.getMerchantId(),
            "locationId": localStorageData.getLocationId(),
            "locationList": locationList,
            "memberId": memberId,
            "memberCardId": memberCardId,
            "type": type,
            "paging": paging
        };

        var settings = {
            "url": getBaseURL() + "/Payment/List",
            "method": "POST",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorageData.getToken(),
            },
            "data": JSON.stringify(data),
        };

        $.ajax(settings).done(function (response) {
            if (responseCheck({ response })) {
            }

            func(response);
        }).fail(fail);
    }

    const paymenApprovaltCheck = ({ transactionId, func }) => {
        var data = {
            "deviceId": localStorageData.getDeviceId(),
            "merchantId": localStorageData.getMerchantId(),
            "locationId": localStorageData.getLocationId(),
            "memberId": localStorageData.getMemberId(),
            "memberCardId": localStorageData.getMemberCardId(),
            "transactionId": transactionId
        };

        var settings = {
            "url": getBaseURL() + "/Payment/Approval/Check",
            "method": "POST",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorageData.getToken(),
            },
            "data": JSON.stringify(data),
        };

        $.ajax(settings).done(function (response) {
            if (responseCheck({ response })) {
            }

            func(response);
        });
    }

    return {
        // public functions
        responseCheck,
        deviceCreateOrUpdate,
        login,
        token,
        logout,
        locationList,
        memberSearch,
        productList,
        paymentCreate,
        paymentRefund,
        paymentList,
        paymenApprovaltCheck
    };
})();