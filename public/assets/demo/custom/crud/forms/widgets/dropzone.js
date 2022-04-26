//== Class definition

var DropzoneDemo = function () {    
    //== Private functions
    var demos = function () {

        toastr.options = {
            "closeButton": true,
            "progressBar": true,
            "showDuration": "3000",
        };

        // single file upload
        Dropzone.options.mDropzoneOne = {
            paramName: "file", // The name that will be used to transfer the file
            maxFiles: 1,
            maxFilesize: 5, // MB
            // addRemoveLinks: true,
            acceptedFiles: "image/*,.pdf,.doc,.docx",
            success: function(file, response){
                $(".nodocsmsg").hide();
                if(response.message.code == 200){
                    toastr.success(response.message.msg);
                    var docUrl = response.message.shopdocdata.docUrl
                    var name = response.message.shopdocdata.name
                    var shopId = response.message.shopdocdata.shopId
                    var docId = response.message.shopdocdata.docId
                    var eleId = "flb"+docId;
                    var rstr = '<div class="filelistbox" id="'+eleId+'" style="display: none;"><div class="row align-items-center"><div class="col m--valign-middle"><div class="fw-500 font-s-12"><a href="'+docUrl+'" target="_blank">'+name+'</a></div></div><div class="col-auto m--valign-middle text-right actiontd"><a href="/vendors/docupload/'+shopId+'/delete/'+docId+'" class="deletealert"><i class="fa fa-times"></i></a></div></div></div>';

                    $(".filelistsdiv").append(rstr);
                    $("#"+eleId).slideDown(500);
				}
				else{
					toastr.error(response.message.msg);
                }
                this.removeAllFiles(true)
            },
            error: function(xhr) {
                toastr.error("Error! Not able to upload document");
                this.removeAllFiles(true)
			}
        };
    }

    return {
        // public functions
        init: function() {
            demos(); 
        }
    };
}();

DropzoneDemo.init();