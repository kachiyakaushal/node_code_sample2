var BootstrapDatepicker = function() {
   var t;
   t = mUtil.isRTL() ? {
      leftArrow: '<i class="la la-angle-right"></i>',
      rightArrow: '<i class="la la-angle-left"></i>'
   } : {
      leftArrow: '<i class="la la-angle-left"></i>',
      rightArrow: '<i class="la la-angle-right"></i>'
   };
   return {
      init: function() {
         $("#m_datepicker_1, #m_datepicker_1_validate").datepicker({
            rtl: mUtil.isRTL(),
            todayHighlight: !0,
            autoclose: true,
            orientation: "bottom left",
            format: "yyyy-mm-dd",
            templates: t
         }), $("#m_datepicker_1_modal").datepicker({
            rtl: mUtil.isRTL(),
            todayHighlight: !0,
            autoclose: true,
            orientation: "bottom left",
            templates: t
         }), $("#m_datepicker_2, #m_datepicker_2_validate").datepicker({
            rtl: mUtil.isRTL(),
            todayHighlight: !0,
            autoclose: true,
            orientation: "bottom left",
            templates: t
         }), $("#m_datepicker_2_modal").datepicker({
            rtl: mUtil.isRTL(),
            todayHighlight: !0,
            autoclose: true,
            orientation: "bottom left",
            templates: t
         }), $("#m_datepicker_3, #m_datepicker_3_validate").datepicker({
            rtl: mUtil.isRTL(),
            todayBtn: "linked",
            clearBtn: !0,
            autoclose: true,
            todayHighlight: !0,
            templates: t
         }), $("#m_datepicker_3_modal").datepicker({
            rtl: mUtil.isRTL(),
            todayBtn: "linked",
            clearBtn: !0,
            autoclose: true,
            todayHighlight: !0,
            templates: t
         }), $("#m_datepicker_4_1").datepicker({
            rtl: mUtil.isRTL(),
            orientation: "top left",
            autoclose: true,
            todayHighlight: !0,
            templates: t
         }), $("#m_datepicker_4_2").datepicker({
            rtl: mUtil.isRTL(),
            orientation: "top right",
            autoclose: true,
            todayHighlight: !0,
            templates: t
         }), $("#m_datepicker_4_3").datepicker({
            rtl: mUtil.isRTL(),
            orientation: "bottom left",
            autoclose: true,
            todayHighlight: !0,
            templates: t
         }), $("#m_datepicker_4_4").datepicker({
            rtl: mUtil.isRTL(),
            orientation: "bottom right",
            autoclose: true,
            todayHighlight: !0,
            templates: t
         }), $("#m_datepicker_5").datepicker({
            rtl: mUtil.isRTL(),
            todayHighlight: !0,
            autoclose: true,
            templates: t
         }), $("#m_datepicker_6").datepicker({
            rtl: mUtil.isRTL(),
            todayHighlight: !0,
            autoclose: true,
            templates: t
         }),
         $(".m_datepicker").datepicker({
            rtl: mUtil.isRTL(),
            todayHighlight: !0,
            autoclose: true,
            orientation: "bottom left",
            format: "yyyy-mm-dd",
            templates: t
         }),
         $(".m_datepicker_1").datepicker({
            rtl: mUtil.isRTL(),
            todayHighlight: !0,
            autoclose: true,
            orientation: "bottom left",
            format: "yyyy-mm-dd",
            startDate: '0',
            templates: t
         }),
         $(".m_datepicker_2").datepicker({
            rtl: mUtil.isRTL(),
            todayHighlight: !0,
            autoclose: true,
            orientation: "bottom left",
            format: "yyyy-mm-dd",
            endDate: '+0d',
            templates: t
         })
      }
   }
}();
jQuery(document).ready(function() {
   BootstrapDatepicker.init()
});