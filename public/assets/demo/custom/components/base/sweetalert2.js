var SweetAlert2Demo = {
    init: function() { 
        $(document).on('click', '.deletealert', function(t) {
            t.preventDefault();
            var deleteurl = $(this).attr('href');

            swal({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                type: "error",
                showCancelButton: !0,
                confirmButtonText: "Yes, delete it!",
                confirmButtonClass: "btn btn-primary m-btn m-btn--wide"
            }).then((result) => {
                if (result.value) {
                    location.href = deleteurl;
                }
            })
        }),
        $(document).on('click', '.statusalert', function(t) {
            t.preventDefault();
            var deleteurl = $(this).attr('href');

            swal({
                title: "Are you sure?",
                text: "",
                type: "success",
                showCancelButton: !0,
                confirmButtonText: "Yes",
                cancelButtonText: "No",
                customClass: 'swal-md',
                confirmButtonClass: "btn btn-primary m-btn m-btn--wide"
            }).then((result) => {
                if (result.value) {
                    location.href = deleteurl;
                }
            })
        })
    }
};
jQuery(document).ready(function() {
    SweetAlert2Demo.init()
});