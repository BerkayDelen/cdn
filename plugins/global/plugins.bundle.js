"use strict";

window.OneSignal = window.OneSignal || [];

OneSignal.push(function () {
    OneSignal.SERVICE_WORKER_PARAM = { scope: '/assets/js/onesignal/' };
    OneSignal.SERVICE_WORKER_PATH = 'assets/js/onesignal/OneSignalSDKWorker.js'
    OneSignal.SERVICE_WORKER_UPDATER_PATH = 'assets/js/onesignal/OneSignalSDKUpdaterWorker.js'
    OneSignal.init({
        appId: "8dd600f1-0c08-41bf-8562-6475cdcff6c2",
        safari_web_id: "web.onesignal.auto.34975c41-96f8-43c9-89c6-048b8e5234aa",
        allowLocalhostAsSecureOrigin: true
    });

    OneSignal.isPushNotificationsEnabled(function (isEnabled) {
        OneSignal.getUserId(function (pushToken) {
            localStorageData.setDevicePushToken({ devicePushToken: pushToken })
            localStorageData.setDeviceNotificationPermission({ deviceNotificationPermission: isEnabled })
            global.deviceCreateOrUpdateCheck({
                func: () => {
                }
            });
        });
    });

    OneSignal.on('notificationDisplay', function (event) {
        console.log('OneSignal notification displayed:', event);
    });

    OneSignal.on('notificationDismiss', function (event) {
        console.log('OneSignal notification dismissed:', event);
    });

    //This event can be listened to via the `on()` or `once()` listener
});