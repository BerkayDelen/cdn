'use strict';

const redirect = (function () {
    const welcome = () => {
        // window.location.href = '/Welcome';
    };

    const homePage = () => {
        window.location.href = '/';
    };
    const search = () => {
        window.location.href = '/Search';
    };
    const statement = () => {
        window.location.href = '/Statement';
    };

    const sales = () => {
        window.location.href = '/Sales';
    };

    const refund = () => {
        window.location.href = '/Refund';
    };

    const pay = () => {
        window.location.href = '/Pay';
    };

    return {
        // public functions
        homePage,
        welcome,
        search,
        statement,
        sales,
        refund,
        pay
    };
})();