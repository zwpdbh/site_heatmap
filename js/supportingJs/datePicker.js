/**
 * Created by zw on 16/01/2017.
 */

$(document).ready(function () {
    var dateFormat = "yy-mm-dd";
    var between = $("#between")
        .datepicker({
            defaultDate: "+1w",
            changeYear: true,
            dateFormat: "yy-mm-dd",
            changeMonth: true,
            numberOfMonths: 1
        })
        .on("change", function () {
            and.datepicker("option", "minDate", getDate(this));
        });

    var and = $("#and").datepicker({
        defaultDate: "+1w",
        changeYear: true,
        dateFormat: "yy-mm-dd",
        changeMonth: true,
        numberOfMonths: 1
    })
        .on("change", function () {
            between.datepicker("option", "maxDate", getDate(this));
        });

    function getDate(element) {
        var date;
        try {
            date = $.datepicker.parseDate(dateFormat, element.value);
        } catch (error) {
            date = null;
        }

        return date;
    }

});

