"use strict";

// Class Definition
var findAProvider = (function () {
    var pageLength = 5;

    var paging = {
        currentPageNumber: 1,
        pageSize: pageLength
    }

    var table = $('#kt_table_1');

    var countryId = "";

    var btnDental = $('input[name="btn-dental"]');
    var btnHearing = $('input[name="btn-hearing"]');
    var btnVision = $('input[name="btn-vision"]');

    var selectStateList = $('select[name="stateList"]');
    var selectCityList = $('select[name="cityList"]');
    var selectCountyList = $('select[name="countyList"]');

    var btnSearch = $('input[name="search"]');
    var inputSearchValue = $('input[name="searchValue"]');
    var toggleSearch = $(".toggle-search");
    var map = null;
    var locationList = [];
    var typeList = [];
    var typeListData = [];

    var selectStateListSelect2 = null;
    var selectCityListSelect2 = null;
    var selectCountyListSelect2 = null;

    var productCategoryButton = () => {
        btnDental.click(function () {
            checkboxButton({ button: $(this) })
        });

        btnHearing.click(function () {
            checkboxButton({ button: $(this) })
        });
        btnVision.click(function () {
            checkboxButton({ button: $(this) })
        });

        toggleSearch.click(function () {
            inputSearchValue.val("")
            toggleSearch.addClass("fa-search");
            toggleSearch.removeClass("fa-times");
        });

        inputSearchValue.keyup(function () {
            console.log("toggleSearch");
            //var input = $(this).parent().find("input");
            if (inputSearchValue.val().length == 0) {
                toggleSearch.addClass("fa-search");
                toggleSearch.removeClass("fa-times");
            } else {
                toggleSearch.removeClass("fa-search");
                toggleSearch.addClass("fa-times");
            }
        });
    }

    var checkboxButton = ({ button }) => {
        console.log(button.data('checkbox'));
        var checkboxName = button.data('checkbox');
        var checkbox = $('input[name="' + checkboxName + '"]');
        var val = checkbox.val();

        checkbox.prop('checked', !checkbox.prop('checked'));
        if (checkbox.prop('checked')) {
            console.log("checked");
            button.removeClass('btn-outline-primary');
            button.addClass('btn-primary');
            typeList.push(val)
        } else {
            console.log("unchecked");
            button.removeClass('btn-primary');
            button.addClass('btn-outline-primary');

            const index = typeList.indexOf(val);
            console.log("Deleted 0");
            console.log(val);
            if (index > -1) {
                console.log("Deleted 1");
                console.log(index);
                typeList.splice(index, 1);
            }
        }
        console.log(typeList);
    }

    var searchButton = () => {
        btnSearch.click(function () {
            console.log("typeList");
            console.log(typeList);
            typeListData = [];
            typeList.forEach((type) => {
                console.log(type);
                typeListData.push({ typeId: type })
            });
            console.log("typeList");
            console.log(typeList);

            reloadDataTable()
        });
    }

    var countryList = () => {
        selectStateListSelect2 = selectStateList.select2({
            placeholder: "Please select from the dropdown menu",
            data: []
        }).on("change", function (e) {
            console.log("change State");
            console.log(e);
            var stateId = selectStateList.val();
            selectCountyListSelect2.empty();
            selectCountyListSelect2.val("");
            selectCountyListSelect2 = selectCountyList.select2({
                placeholder: "Please select from the dropdown menu",
                data: []
            });

            cityList({
                stateId: stateId
            })
        });

        selectCityListSelect2 = selectCityList.select2({
            placeholder: "Please select from the dropdown menu",
            data: cityListData
        }).on("change", function (e) {
            console.log(e);
            console.log("change");

            var cityId = selectCityList.val();

            countyList({
                cityId: cityId
            })
        });;

        selectCountyListSelect2 = selectCountyList.select2({
            placeholder: "Please select from the dropdown menu",
            data: []
        });

        api.countryList({
            func: (response) => {
                countryId = response.response.list[0].id;
                console.log(countryId);
                stateList({ countryId: countryId });
            }
        })
    }

    var stateList = ({ countryId }) => {
        var stateListData = [];

        api.stateList({
            countryId: countryId, func: (response) => {
                var stateList = response.response.list;

                stateList.forEach(function (state) {
                    stateListData.push(
                        {
                            id: state.id,
                            text: state.name
                        }
                    )
                });

                console.log(stateListData);
                /*
                selectStateListSelect2.trigger({
                    type: 'select2:select',
                    params: {
                        data: stateListData
                    }
                });
                */

                selectStateListSelect2.val("")

                selectStateListSelect2 = selectStateListSelect2.select2({
                    placeholder: "Please select from the dropdown menu",
                    data: stateListData
                });
            }
        })
    }
    var cityListData = [];
    var cityList = ({ stateId }) => {
        cityListData = []
        api.cityList({
            stateId: stateId, func: (response) => {
                var cityList = response.response.list;
                cityListData.push(
                    {
                        id: "",
                        text: ""
                    }
                )
                cityList.forEach(function (city) {
                    cityListData.push(
                        {
                            id: city.id,
                            text: city.name
                        }
                    )
                });
                console.log("cityListData");
                console.log(cityListData);

                selectCityListSelect2.empty()
                selectCityListSelect2.val("")
                selectCityListSelect2.select2({
                    placeholder: "Please select from the dropdown menu",
                    data: cityListData
                })

                selectCountyList.select2({
                    placeholder: "Please select from the dropdown menu",
                    data: []
                })
            }
        })
    }
    var countyListData = [];
    var countyList = ({ cityId }) => {
        countyListData = []

        api.countyList({
            cityId: cityId,
            func: (response) => {
                var countyList = response.response.list;
                countyListData.push(
                    {
                        id: "",
                        text: ""
                    }
                )
                countyList.forEach(function (county) {
                    countyListData.push(
                        {
                            id: county.id,
                            text: county.name
                        }
                    )
                });
                console.log(countyListData);
                selectCountyListSelect2.empty();
                selectCountyListSelect2.val("")
                selectCountyListSelect2.select2({
                    placeholder: "Please select from the dropdown menu",
                    data: countyListData
                }).on("change", function (e) {
                    console.log(e);
                    console.log("change");
                });
            }
        })
    }

    var reloadDataTable = () => {
        table.DataTable().ajax.reload();
    }
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
                "info": "Search Result(s) _START_ to _END_ of _TOTAL_ entries",
            },

            headerCallback: function (thead, data, start, end, display) {
            },
            drawCallback: function (settings) {
                console.log("Removed.");
                $("thead").remove();
                table.addClass("m-0");
            },
            columnDefs: [
                {
                    targets: 0,
                    render: function (data, type, full, meta) {
                        console.log(full);

                        var address = "";
                        var county = "";
                        var city = "";
                        var state = "";
                        var zipCode = "";

                        if (full.locationAddress != undefined) {
                            address = full.locationAddress;
                        }
                        if (full.locationCounty != undefined) {
                            county = full.locationCounty;
                        }
                        if (full.locationCity != undefined) {
                            city = full.locationCity;
                        }
                        if (full.LocationState != undefined) {
                            state = full.LocationState;
                        }
                        if (full.locationZipCode != undefined) {
                            zipCode = full.locationZipCode;
                        }

                        var locationItem = `
<div class="row location-item ">
    <div class="col-md-12 col-sm-12 font-16">
       <span class="font-black font-bold">`+ full.locationBusiness.name + `</span>
    </div>
    <div class="col-md-12 col-sm-12 mt-1">
       <span class="font-black"> <i class="fas fa-clinic-medical font-skyblue mr-1"></i> `+ address + " " + county + " " + city + " " + state + " " + zipCode + `</span>
    </div>
    <div class="col-md-12 col-sm-12 mt-1">
       <span class="font-black"> <i class="fas fa-phone-alt font-skyblue  mr-1"></i> `+ full.locationPhone + `+1 112 12122</span>
    </div>
    <div class="div-hr col-md-6 mt-2"></div>
<div>

                        `;

                        return locationItem;
                    },
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

                var countyListData = [];

                if (selectCountyList.val() != "") {
                    countyListData.push({ countyId: selectCountyList.val() });
                }

                console.log(paging);
                api.locationList({
                    searchValue: inputSearchValue.val(),
                    countryId: countryId,
                    stateId: selectStateList.val(),
                    cityId: selectCityList.val(),
                    countyList: countyListData,
                    typeList: typeListData,
                    paging: paging,
                    func: (response) => {
                        if (api.responseCheck({ response: response })) {
                            //TODO - Go Home Page
                            console.log("TransactionList Success");
                            var member = response.response.member;
                            var card = response.response.memberCard;
                            var paging = response.response.paging;

                            locationList = response.response.locationList;
                            // initMap();
                            callback({
                                recordsTotal: paging.totalCount,
                                recordsFiltered: paging.totalCount,
                                data: response.response.locationList
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

    // Initialize and add the map
    var initMap = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                //var lat = position.coords.latitude;
                //var lng = position.coords.longitude;

                var lng = -80.07723479350864;
                var lat = 26.62791840216616;

                // The location of Uluru
                const myLocation = { lat: lat, lng: lng };
                // The map, centered at Uluru
                map = new google.maps.Map(document.getElementById("map"), {
                    zoom: 15,
                });
                // The marker, positioned at Uluru

                console.log(locationList);

                var bounds = new google.maps.LatLngBounds();
                var infowindow = new google.maps.InfoWindow();

                for (var i = 0; i < locationList.length; i++) {
                    var locationItem = locationList[i];

                    console.log("locationItem");
                    console.log(locationItem.locationLatitude);
                    console.log(locationItem.locationLongitude);

                    if (locationItem.locationLatitude != 0 && locationItem.locationLongitude != 0) {
                        const marker = new google.maps.Marker({
                            position: { lat: locationItem.locationLatitude, lng: locationItem.locationLongitude },
                            map: map,
                        });
                        //extend the bounds to include each marker's position
                        bounds.extend(marker.position);

                        google.maps.event.addListener(marker, 'click', (function (marker, i) {
                            return function () {
                                infowindow.setContent(locationItem.locationPartner.name);
                                infowindow.open(map, marker);
                            }
                        })(marker, i));
                    };
                    //now fit the map to the newly inclusive bounds
                    map.fitBounds(bounds);
                    /*
                //(optional) restore the zoom level after the map is done scaling
                var listener = google.maps.event.addListener(map, "idle", function () {
                    map.setZoom(10);
                    google.maps.event.removeListener(listener);
                });
                    */
                }
            }, function (error) {
            });
        }
    }

    // Public Functions
    return {
        // public functions
        productCategoryButton,
        countryList,
        stateList,
        cityList,
        countyList,
        initDataTable,
        reloadDataTable,
        searchButton,
        // initMap
    };
})();

$(function () {
    findAProvider.productCategoryButton();
    findAProvider.searchButton();
    findAProvider.countryList();
    findAProvider.initDataTable();
    //  findAProvider.initMap();
});