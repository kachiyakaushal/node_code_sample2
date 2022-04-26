//== Class definition

var BootstrapTimepicker = function () {
    
    //== Private functions
    var demos = function () {
        
        // minimum setup
        $('.m_timepicker').timepicker({
            minuteStep: 1,
            defaultTime: '',
            showSeconds: true,
            showMeridian: false,
            // snapToStep: true
        });
    }

    return {
        // public functions
        init: function() {
            demos(); 
        }
    };
}();

jQuery(document).ready(function() {    
    BootstrapTimepicker.init();
});