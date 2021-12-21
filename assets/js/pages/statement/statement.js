"use strict";

// Class Definition
var statement = (function () {
    var pageLength = 5;

    var paging = {
        currentPageNumber: 1,
        pageSize: pageLength
    }

    var table = $('#kt_table_1');

    var initDataTable = () => {
        // begin first table
        table.DataTable({
            ordering: false,
            responsive: true,
            autoWidth: true,
            // DOM Layout settings
            dom: `<'row'<'col-sm-12'tr>>
			<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7 dataTables_pager'lp>>`,

            lengthMenu: [5, 10, 25, 50],
            language: {
                'lengthMenu': 'Display _MENU_',
            },

            headerCallback: function (thead, data, start, end, display) {
            },

            columnDefs: [
                {
                    targets: 0,
                    render: function (data, type, full, meta) {
                        var info = table.DataTable().page.info();
                        return "<div class='text-center p-3 mt-1 mb-1'>" + ((meta.row + 1) + ((info.page) * (info.length))) + "</span>";
                    },
                },
                {
                    targets: 1,
                    render: function (data, type, full, meta) {
                        return full.transactionDate;
                    },
                },
                {
                    targets: 2,
                    render: function (data, type, full, meta) {
                        var status = {
                            1: { 'title': 'Spending', 'class': 'var(--blue)' },
                            2: { 'title': 'Refund', 'class': 'var(--red)' },
                            3: { 'title': 'Top Up', 'class': 'var(--green)' },
                        };
                        if (typeof status[full.transactionType] === 'undefined') {
                            return full.transactionType;
                        }
                        //return '<span class="kt-badge ' + status[data].class + ' kt-badge--inline kt-badge--pill">' + status[data].title + '</span>';
                        return '<span class="font-bold" style="color: ' + status[full.transactionType].class + '">' + status[full.transactionType].title + '</span>';
                    },
                },
                {
                    targets: 3,
                    render: function (data, type, full, meta) {
                        var status = {
                            1: { 'title': 'Spending', 'class': 'var(--blue)' },
                            2: { 'title': 'Refund', 'class': 'var(--red)' },
                            3: { 'title': 'Top Up', 'class': 'var(--green)' },
                        };
                        //return '<span class="kt-badge ' + status[data].class + ' kt-badge--inline kt-badge--pill">' + status[data].title + '</span>';
                        return '<span class="font-bold text-right d-block" style="color: ' + status[full.transactionType].class + '">$' + full.transactionBalance.toFixed(2) + '</span>';
                    },
                },
                {
                    targets: 4,
                    render: function (data, type, full, meta) {
                        return full.business.name;
                    },
                },
                {
                    targets: 5,
                    render: function (data, type, full, meta) {
                        return full.location.name;
                    },
                },
                {
                    targets: 6,
                    render: function (data, type, full, meta) {
                        return full.productList.map(function (item) {
                            return item.productCode;
                        }).join(", ");
                    }
                }

            ],
            progressing: true,
            serverSide: true,
            pageLength: pageLength,
            ajax: function (data, callback, settings) {
                var info = table.DataTable().page.info();
                console.log(info);

                paging.currentPageNumber = info.page + 1;
                paging.pageSize = info.length;

                console.log(paging);
                api.paymentList({
                    locationList: localStorageData.getLocationList(),
                    memberId: "",
                    memberCardId: "",
                    type: localStorageData.getSearchType(),
                    paging: paging,
                    func: (response) => {
                        if (api.responseCheck({ response: response })) {
                            //TODO - Go Home Page
                            console.log("TransactionList Success");
                            //  var member = response.response.member;
                            //  var card = response.response.memberCard;
                            var paging = response.response.paging;

                            //   cardBalance.val("$" + card.cardBalance.toFixed(2) );
                            // cardSpending.val("$" + card.cardTotalSpendingAmount.toFixed(2) );

                            callback({
                                recordsTotal: paging.totalCount,
                                recordsFiltered: paging.totalCount,
                                data: response.response.transactionList
                            });
                            //recordsTotal = paging.totalCount;
                            //recordsFiltered = response.response.transactionList.length;

                            /*
                            data: data.Data,
                                recordsTotal: data.TotalRecords,
                                    recordsFiltered: data.RecordsFiltered
                                    */
                        } else {
                        }
                    }
                })
            }
        });

        table.on('change', '.kt-group-checkable', function () {
            var set = $(this).closest('table').find('td:first-child .kt-checkable');
            var checked = $(this).is(':checked');

            $(set).each(function () {
                if (checked) {
                    $(this).prop('checked', true);
                    $(this).closest('tr').addClass('active');
                }
                else {
                    $(this).prop('checked', false);
                    $(this).closest('tr').removeClass('active');
                }
            });
        });

        table.on('change', 'tbody tr .kt-checkbox', function () {
            $(this).parents('tr').toggleClass('active');
        });
    }

    // Public Functions
    return {
        // public functions
        initDataTable
    };
})();

$(function () {
    statement.initDataTable();
});