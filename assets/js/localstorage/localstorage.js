'use strict';

const localStorageData = (function () {
    const deviceIdKey = "deviceId";
    const deviceTokenKey = "deviceToken";
    const devicePushTokenKey = "devicePushToken";
    const deviceNotificationPermissionKey = "deviceNotificationPermission";
    const tokenKey = "token";
    const merchantKey = "merchant";
    const merchantProviderIdKey = "merchantProviderId";
    const locationKey = "location";
    const locationListKey = "locationList";
    const searchTypeKey = "searchType";
    const memberKey = "member";
    const memberCardKey = "memberCard";
    const basketKey = "basket";
    const amountKey = "amount";
    const qrcodeKey = "qrcode";
    const qrcodeTypeKey = "qrcodeType";

    const clear = () => {
        sessionStorage.clear()
    };

    const getDeviceId = () => {
        return localStorage.getItem(deviceIdKey);
    };

    const setDeviceId = ({ deviceId }) => {
        console.log('setDeviceId: ' + deviceId)
        return localStorage.setItem(deviceIdKey, deviceId)
    }

    const getDeviceToken = () => {
        return localStorage.getItem(deviceTokenKey);
    };

    const setDeviceToken = ({ deviceToken }) => {
        console.log('setDeviceToken: ' + deviceToken)
        return localStorage.setItem(deviceTokenKey, deviceToken)
    }

    const getDevicePushToken = () => {
        var pushToken = localStorage.getItem(devicePushTokenKey);

        if (pushToken == null) {
            return "";
        } else {
            return pushToken
        }
    };

    const setDevicePushToken = ({ devicePushToken }) => {
        console.log('setDevicePushToken: ' + devicePushToken)
        return localStorage.setItem(devicePushTokenKey, devicePushToken)
    }

    const getDeviceNotificationPermission = () => {
        return (localStorage.getItem(deviceNotificationPermissionKey) === 'true');
    };

    const setDeviceNotificationPermission = ({ deviceNotificationPermission }) => {
        console.log('setdeviceNotificationPermission: ' + deviceNotificationPermission)
        return localStorage.setItem(deviceNotificationPermissionKey, deviceNotificationPermission)
    }

    const getToken = () => {
        return sessionStorage.getItem(tokenKey);
    };

    const setToken = ({ token }) => {
        console.log('setToken: ' + token)
        return sessionStorage.setItem(tokenKey, token)
    }

    const getMerchantId = () => {
        var merchant = getMerchant();
        if (merchant) {
            return merchant.merchantId;
        } else {
            return null;
        }
    };

    const getMerchant = () => {
        return JSON.parse(sessionStorage.getItem(merchantKey));
    };

    const setMerchant = ({ merchant }) => {
        console.log('merchant: ' + merchant)
        return sessionStorage.setItem(merchantKey, JSON.stringify(merchant))
    }

    const getLocationId = () => {
        var location = getLocation();
        if (location) {
            return location.id;
        } else {
            return null;
        }
    };
    const getLocation = () => {
        return JSON.parse(sessionStorage.getItem(locationKey));
    };

    const setLocation = ({ location }) => {
        console.log('location: ' + location)
        return sessionStorage.setItem(locationKey, JSON.stringify(location))
    }

    const getLocationList = () => {
        return JSON.parse(sessionStorage.getItem(locationListKey));
    };

    const setLocationList = ({ locationList }) => {
        console.log('locationList: ' + locationList)
        return sessionStorage.setItem(locationListKey, JSON.stringify(locationList))
    }

    const getSearchType = () => {
        return sessionStorage.getItem(searchTypeKey);
    };

    const setSearchType = ({ searchType }) => {
        console.log('setSearchType: ' + searchType)
        return sessionStorage.setItem(searchTypeKey, searchType)
    }

    const getMemberId = () => {
        var member = getMember();
        if (member) {
            return member.memberCrmId;
        } else {
            return "";
        }
    };

    const getMember = () => {
        return JSON.parse(sessionStorage.getItem(memberKey));
    };

    const setMember = ({ member }) => {
        console.log('setMember: ' + member)
        return sessionStorage.setItem(memberKey, JSON.stringify(member))
    }

    const getMemberCardId = () => {
        var memberCard = getMemberCard();
        if (memberCard) {
            return memberCard.cardId;
        } else {
            return "";
        }
    };

    const getMemberCard = () => {
        return JSON.parse(sessionStorage.getItem(memberCardKey));
    };

    const setMemberCard = ({ memberCard }) => {
        console.log('setMemberCard: ' + memberCard)
        return sessionStorage.setItem(memberCardKey, JSON.stringify(memberCard))
    }

    const getBasket = () => {
        return JSON.parse(sessionStorage.getItem(basketKey));
    };

    const setBasket = ({ basket }) => {
        console.log('setPay: ' + basket)
        return sessionStorage.setItem(basketKey, JSON.stringify(basket))
    }

    const getAmount = () => {
        return JSON.parse(sessionStorage.getItem(amountKey));
    };

    const setAmount = ({ amount }) => {
        console.log('setAmount: ' + amount)
        return sessionStorage.setItem(amountKey, JSON.stringify(amount))
    }

    const getQRCode = () => {
        return sessionStorage.getItem(qrcodeKey);
    };

    const setQRCode = ({ qrcode }) => {
        console.log('setQRCode: ' + qrcode)
        return sessionStorage.setItem(qrcodeKey, qrcode)
    }

    const getQRCodeType = () => {
        return JSON.parse(sessionStorage.getItem(qrcodeTypeKey));
    };

    const setQRCodeType = ({ qrcodeType }) => {
        console.log('setQRCodeType: ' + qrcodeType)
        return sessionStorage.setItem(qrcodeTypeKey, JSON.stringify(qrcodeType))
    }

    const getMerchantProviderId = () => {
        return JSON.parse(sessionStorage.getItem(merchantProviderIdKey));
    };

    const setMerchantProviderId = ({ merchantProviderId }) => {
        console.log('setMerchantProviderId: ' + merchantProviderId)
        return sessionStorage.setItem(merchantProviderIdKey, JSON.stringify(merchantProviderId))
    }

    return {
        // public functions
        clear,

        getDeviceId,
        setDeviceId,

        getDeviceToken,
        setDeviceToken,

        getDevicePushToken,
        setDevicePushToken,

        getDeviceNotificationPermission,
        setDeviceNotificationPermission,

        getToken,
        setToken,

        getMerchantId,
        getMerchant,
        setMerchant,

        getLocationId,
        getLocation,
        setLocation,

        getLocationList,
        setLocationList,

        getSearchType,
        setSearchType,

        getMemberId,
        getMember,
        setMember,

        getMemberCardId,
        getMemberCard,
        setMemberCard,

        getBasket,
        setBasket,

        getAmount,
        setAmount,

        getQRCode,
        setQRCode,

        getQRCodeType,
        setQRCodeType,

        getMerchantProviderId,
        setMerchantProviderId,
    };
})();

const Formatter = (function () {
    const makeUppercase = (text) => {
        return text.toUpperCase();
    };
    const makeUppercase2 = (text) => {
        return text.toUpperCase();
    };

    return {
        makeUppercase,
        makeUppercase2,
    }
})();

/*
var userData = JSON.parse(sessionStorage.getItem('user'));
sessionStorage.setItem('user', JSON.stringify(response.Result))
*/