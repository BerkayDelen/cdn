"use strict";
var KTDatatablesBasicBasic = function () {
    var initTable1 = function () {
        var table = $('#kt_table_1');

        // begin first table
        table.DataTable({
            responsive: true,

            autoWidth: true,
            // DOM Layout settings
            dom: `<'row'<'col-sm-12'tr>>
			<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7 dataTables_pager'lp>>`,

            lengthMenu: [5, 10, 25, 50],

            pageLength: 10,

            language: {
                'lengthMenu': 'Display _MENU_',
            },

            // Order settings
            order: [[0, 'asc']],

            headerCallback: function (thead, data, start, end, display) {
            },

            columnDefs: [
                {
                    targets: -2,
                    render: function (data, type, full, meta) {
                        var status = {
                            1: { 'title': 'Spending', 'class': '#578201' },
                            2: { 'title': 'Refund', 'class': ' #fd397a' },
                            3: { 'title': 'Canceled', 'class': ' btn-primary' },
                            4: { 'title': 'Success', 'class': ' btn-success' },
                            5: { 'title': 'Info', 'class': ' btn-info' },
                            6: { 'title': 'Danger', 'class': ' btn-danger' },
                            7: { 'title': 'Top Up', 'class': ' #ffb822' },
                        };
                        if (typeof status[data] === 'undefined') {
                            return data;
                        }
                        //return '<span class="kt-badge ' + status[data].class + ' kt-badge--inline kt-badge--pill">' + status[data].title + '</span>';
                        return '<button type="button" class="btn  btn-elevate btn-pill font-bold " style="color: ' + status[data].class + '">' + status[data].title + '</button>';
                    },
                }
            ],
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
    };

    return {
        //main function to initiate the module
        init: function () {
            initTable1();
        },
    };
}();

jQuery(document).ready(function () {
});