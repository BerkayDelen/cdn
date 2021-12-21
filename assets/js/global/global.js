"use strict";

const global = (function () {
    var blue = "#0062a6";
    var red = "#c3202f";

    var userInfoView = $('#userinfo');

    const setUserInfoView = () => {
        var merchant = localStorageData.getMerchant();
        console.log("Merchant");
        console.log(merchant);

        if (merchant != null) {
            userInfoView.html(`` + merchant.merchantFirstName + ` ` + merchant.merchantLastName + ' - ' + localStorageData.getMerchantProviderId() + ` <i class="fas fa-sign-out-alt hover ml-2"  id="logout"></i>`)
            logout();
        } else {
            window.location.href = '/Welcome';
        }
    }

    const logout = () => {
        $('#logout').click(() => {
            swal.fire({
                title: '',
                text: "Are you sure you want to logout?",
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: red,
                confirmButtonText: 'Yes, Logout!',
                customClass: {
                    confirmButton: 'swal-button',
                    cancelButton: 'swal-button',
                }
            }).then(function (result) {
                if (result.value) {
                    console.log("logout");
                    localStorageData.clear();
                    window.location.href = '/Welcome';
                }
            });

            //api.logout()
        });
    }
    const deviceInfo = () => {
        return bowser.getParser(window.navigator.userAgent).parsedResult;
    }

    const deviceLanguage = () => {
        return navigator.language || navigator.userLanguage;
    }

    const deviceCreateOrUpdateCheck = ({ func }) => {
        var deviceToken = localStorageData.getDeviceToken();
        var devicePushToken = localStorageData.getDevicePushToken();
        var deviceNotificationPermission = localStorageData.getDeviceNotificationPermission();

        console.log("Device Token: " + deviceToken);
        console.log("Device Push Token: " + devicePushToken);

        if (deviceToken == null || deviceToken == undefined || deviceToken == "") {
            deviceToken = generateUUID();
            console.log("Device Token: " + deviceToken);
            localStorageData.setDeviceToken({ deviceToken: deviceToken });
        }

        console.log('player_id of the subscribed user is : ' + devicePushToken);
        // Make a POST call to your server with the user ID
        //Device Create Or Update
        var deviceInfo = global.deviceInfo();
        console.log(deviceInfo);
        api.deviceCreateOrUpdate({
            deviceType: 4,//Web
            deviceBrand: deviceInfo.browser.name,
            deviceModel: deviceInfo.browser.name + " - " + deviceInfo.os.name + " - " + deviceInfo.os.versionName + " - " + deviceInfo.os.version + " - " + deviceInfo.platform.type + " - " + deviceInfo.engine.name,
            deviceNotificationPermission: deviceNotificationPermission,
            devicePushToken: devicePushToken,
            deviceToken: deviceToken,
            deviceOSVersion: deviceInfo.browser.version,
            deviceLanguage: deviceLanguage(),
            func: function (response) {
                console.log(response);
                localStorageData.setDeviceId({ deviceId: response.response.deviceId })
                func(response)
            }
        })
    }

    const currencyFormat = ({ str }) => {
        var parts = (str + "").split("."),
            main = parts[0],
            len = main.length,
            output = "",
            first = main.charAt(0),
            i;

        if (first === '-') {
            main = main.slice(1);
            len = main.length;
        } else {
            first = "";
        }
        i = len - 1;
        while (i >= 0) {
            output = main.charAt(i) + output;
            if ((len - i) % 3 === 0 && i > 0) {
                output = "," + output;
            }
            --i;
        }
        // put sign back
        output = first + output;
        // put decimal part back
        if (parts.length > 1) {
            output += "." + parts[1];
        }
        return output;
    }

    return {
        // public functions
        deviceCreateOrUpdateCheck,
        deviceInfo,
        deviceLanguage,
        setUserInfoView,
        currencyFormat
    };
})();

function generateUUID() { // Public Domain/MIT
    var d = new Date().getTime();//Timestamp
    var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now() * 1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16;//random number between 0 and 16
        if (d > 0) {//Use timestamp until depleted
            r = (d + r) % 16 | 0;
            d = Math.floor(d / 16);
        } else {//Use microseconds since page-load if supported
            r = (d2 + r) % 16 | 0;
            d2 = Math.floor(d2 / 16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}