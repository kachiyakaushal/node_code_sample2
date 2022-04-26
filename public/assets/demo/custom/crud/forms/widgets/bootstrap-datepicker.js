//== Class definition

var BootstrapDatepicker = function () {

    var arrows;
    if (mUtil.isRTL()) {
        arrows = {
            leftArrow: '<i class="la la-angle-right"></i>',
            rightArrow: '<i class="la la-angle-left"></i>'
        }
    } else {
        arrows = {
            leftArrow: '<i class="la la-angle-left"></i>',
            rightArrow: '<i class="la la-angle-right"></i>'
        }
    }
    
    //== Private functions
    var demos = function () {
        // minimum setup
        $('.upcomingdates').datepicker({
            rtl: mUtil.isRTL(),
            todayHighlight: true,
            orientation: "bottom left",
            templates: arrows,
            format: "yyyy-mm-dd",
            startDate: '0',
            autoclose: true,
        });

        $(".pastdates").datepicker({
            rtl: mUtil.isRTL(),
            todayHighlight: true,
            orientation: "bottom left",
            templates: arrows,
            format: "yyyy-mm-dd",
            endDate: '+0d',
            autoclose: true,
        }),

        $(".m_datepicker").datepicker({
            rtl: mUtil.isRTL(),
            todayHighlight: true,
            orientation: "bottom left",
            templates: arrows,
            format: "yyyy-mm-dd",
            autoclose: true,
        })

    }

    return {
        // public functions
        init: function() {
            demos(); 
        }
    };
}();

jQuery(document).ready(function() {    
    BootstrapDatepicker.init();
});