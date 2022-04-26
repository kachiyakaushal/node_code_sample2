(function ($) {
	$.fn.toggleCheck = function () {
		if (this.tagName === 'INPUT') {
			$(this).prop('checked', !($(this).is(':checked')));
		}
	}

	$.fn.inputFilter = function (inputFilter) {
		return this.on("input keydown keyup mousedown mouseup select contextmenu drop", function () {
			if (inputFilter(this.value)) {
				this.oldValue = this.value;
				this.oldSelectionStart = this.selectionStart;
				this.oldSelectionEnd = this.selectionEnd;
			} else if (this.hasOwnProperty("oldValue")) {
				this.value = this.oldValue;
				this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
			}
		});
	};

	$("input, textarea").on("keypress", function (e) {
		var startPos = e.currentTarget.selectionStart;
		if (e.which === 32 && startPos == 0) {
			e.preventDefault();
		}
	});

	$.validator.addMethod('le', function (value, element, param) {
		return this.optional(element) || value < $(param).val();
	}, 'Invalid value');

	$.validator.addMethod('ge', function (value, element, param) {
		return this.optional(element) || value > $(param).val();
	}, 'Invalid value');

	$.validator.addMethod("regx", function (value, element, regexpr) {
		return regexpr.test(value);
	}, "Please enter a valid value.");

	jQuery.fn.scrollTo = function(elem) { 
		$(this).scrollTop($(this).scrollTop() - $(this).offset().top + $(elem).offset().top - 100); 
		return this; 
  	};	

}(jQuery));

toastr.options = {
	"closeButton": true,
	"progressBar": true,
	"showDuration": "3000",
};

var custloader = '<div class="custloader tierloader m-5 text-center"><div class="m-spinner m-spinner--brand m-spinner--sm"></div><div class="m-spinner m-spinner--primary m-spinner--sm"></div><div class="m-spinner m-spinner--success m-spinner--sm"></div><div class="m-spinner m-spinner--warning m-spinner--sm"></div><div class="m-spinner m-spinner--danger m-spinner--sm"></div></div>';

$("#login_form").validate({
	rules: {
		email: {
			required: true,
			email: true
		},
		password: {
			required: true,
		}
	},
});

$("#users_edit").validate({
	rules: {
		firstName: {
			required: true,
			minlength: 3
		},
		lastName: {
			required: true,
			minlength: 3
		},
		email: {
			required: true,
			email: true
		},
		phone: {
			required: true,
			minlength: 10,
			maxlength: 11
		},
		address: {
			required: true,
			minlength: 5
		},
		city: {
			required: true,
			minlength: 3
		},
		state: {
			required: true,
			minlength: 2
		},
		zipCode: {
			required: true,
			minlength: 3
		},
		// password: {
		// 	minlength: 4,
		// 	required: {
		// 		depends: function (element) {
		// 			var currentPassword = $("#newPassword").val();
		// 			if (currentPassword) {
		// 				return true;
		// 			}
		// 			return false;
		// 		}
		// 	}
		// },
		// newPassword: {
		// 	minlength: 4,
		// 	required: {
		// 		depends: function (element) {
		// 			var currentPassword = $("#currentPassword").val();
		// 			if (currentPassword) {
		// 				return true;
		// 			}
		// 			return false;
		// 		}
		// 	}
		// },
		// confirmPassword: {
		// 	minlength: 4,
		// 	equalTo: "#newPassword",
		// 	required: {
		// 		depends: function (element) {
		// 			var newPassword = $("#newPassword").val();
		// 			if (newPassword) {
		// 				return true;
		// 			}
		// 			return false;
		// 		}
		// 	}
		// }
	},
});

$("#users_password").validate({
	rules: {
		newPassword: {
			minlength: 8,
			maxlength: 100,
			required: true,
		},
		confirmPassword: {
			minlength: 8,
			maxlength: 100,
			required: true,
			equalTo: "#newPassword",
		}
	}
});

$("#shop_edit_one").validate({
	rules: {
		mxnRunningPromo: {
			required: true,
			number: true,
			min: 3,
		},
		categoryText: {
			required: true,
		},
		username: {
			required: true,
			minlength: 3
		},
		newPassword: {
			required: false,
			minlength: 8,
			maxlength: 100,
		},
		confirmPassword: {
			minlength: 8,
			maxlength: 100,
			equalTo: "#newPassword",
			required: {
				depends: function (element) {
					var newPassword = $("#newPassword").val();
					if (newPassword) {
						return true;
					}
					return false;
				}
			}
		}
	}
});

$("#shop_edit_two").validate({
	rules: {
		email: {
			email: {
				depends: function (element) {
					var newPassword = $("#email").val();
					if (newPassword) {
						return true;
					}
					return false;
				}
			},
			required: false
		},
		companyEmail: {
			email: {
				depends: function (element) {
					var newPassword = $("#companyEmail").val();
					if (newPassword) {
						return true;
					}
					return false;
				}
			},
			required: false
		},
		agentEmail: {
			email: {
				depends: function (element) {
					var newPassword = $("#agentEmail").val();
					if (newPassword) {
						return true;
					}
					return false;
				}
			},
			required: false
		},
	}
});

$("#shop_edit_tier").validate({
	rules: {
		tierName: {
			required: true
		},
		amount: {
			number: true,
			required: true
		},
	}
});

$("#my_account").validate({
	rules: {
		username: {
			required: true,
			minlength: 3
		},
		firstName: {
			required: true,
		},
		lastName: {
			required: true,
		},
		email: {
			required: true,
			email: true
		},
		phone: {
			required: true,
		},
	},
});

$("#my_account_two").validate({
	rules: {
		password: {
			required: true,
			minlength: 8,
			maxlength: 100,
		},
		newPassword: {
			required: true,
			minlength: 8,
			maxlength: 100,
		},
		confirmPassword: {
			required: true,
			minlength: 8,
			maxlength: 100,
			equalTo: "#newPassword"
		}
	}
});

$("#account_role_add").validate({
	rules: {
		firstName: {
			required: true,
		},
		lastName: {
			required: true,
		},
		username: {
			required: true,
			minlength: 3,
			remote: {
				url: '/vendors/checkUniqueField',
				type: "get",
				dataFilter: function (response) {
					var responsePar = JSON.parse(response);
					if (responsePar.message != 200) {
						return false
					}
					else {
						return true
					}
				}
			},
		},
		email: {
			required: true,
			email: true,
			remote: {
				url: '/vendors/checkUniqueField',
				type: "get",
				dataFilter: function (response) {
					var responsePar = JSON.parse(response);
					if (responsePar.message != 200) {
						return false
					}
					else {
						return true
					}
				}
			},
		},
		phone: {
			required: true,
			remote: {
				url: '/vendors/checkUniqueField',
				type: "get",
				dataFilter: function (response) {
					var responsePar = JSON.parse(response);
					if (responsePar.message != 200) {
						return false
					}
					else {
						return true
					}
				}
			},
		},
		newPassword: {
			required: true,
			minlength: 8,
			maxlength: 100,
		},
		confirmPassword: {
			required: true,
			minlength: 8,
			maxlength: 100,
			equalTo: "#newPassword"
		},
	},
	messages: {
		username: {
			remote: "Username already taken"
		},
		email: {
			remote: "Email already taken",			
		},
		phone: {
			remote: "Phone already taken"
		}
	}
});

$("#account_role_edit").validate({
	rules: {
		firstName: {
			required: true,
		},
		lastName: {
			required: true,
		},
		newPassword: {
			required: false,
			minlength: 8,
			maxlength: 100,
		},
		confirmPassword: {
			minlength: 8,
			maxlength: 100,
			equalTo: "#newPassword",
			required: {
				depends: function (element) {
					var newPassword = $("#newPassword").val();
					if (newPassword) {
						return true;
					}
					return false;
				}
			}
		},
	},
	messages: {
		username: {
			remote: "Username already taken"
		},
		email: {
			remote: "Email already taken",			
		},
		phone: {
			remote: "Phone already taken"
		}
	}
});

$("#shop_add").validate({
	rules: {
		username: {
			required: true,
			minlength: 3,
			remote: {
				url: '/vendors/checkUniqueField',
				type: "get",
				dataFilter: function (response) {
					var responsePar = JSON.parse(response);
					if (responsePar.message != 200) {
						return false
					}
					else {
						return true
					}
				}
			},
		},
		email: {
			required: true,
			email: true,
			remote: {
				url: '/vendors/checkUniqueField',
				type: "get",
				dataFilter: function (response) {
					var responsePar = JSON.parse(response);
					if (responsePar.message != 200) {
						return false
					}
					else {
						return true
					}
				}
			},
		},
		phone: {
			required: true,
			digits: true,
			remote: {
				url: '/vendors/checkUniqueField',
				type: "get",
				dataFilter: function (response) {
					var responsePar = JSON.parse(response);
					if (responsePar.message != 200) {
						return false
					}
					else {
						return true
					}
				}
			},
		},
		newPassword: {			
			required: true,
			minlength: 8,
			maxlength: 100,
		},
		confirmPassword: {
			required: true,
			minlength: 8,
			maxlength: 100,
			equalTo: "#newPassword"
		},
		shopName: {
			required: true,
		},
		shopPhoneNo: {
			required: true,
			digits: true,
		},
		contactPersonNumber: {
			digits: true,
		},
		latitude: {
			required: true,
			number: true,
		},
		longtitude: {
			required: true,
			number: true,
		},
		companyEmail: {
			email: {
				depends: function (element) {
					var newPassword = $("#companyEmail").val();
					if (newPassword) {
						return true;
					}
					return false;
				}
			},
			required: false
		},
		companyPhone: {
			digits: true,
		},
		agentEmail: {
			email: {
				depends: function (element) {
					var newPassword = $("#agentEmail").val();
					if (newPassword) {
						return true;
					}
					return false;
				}
			},
			required: false
		},
		agentPhoneNo: {
			digits: true,
		},
		expiryDate: {
			required: true,
		},
		businessSsm: {
			required: true,
		},
		mxnRunningPromo: {
			required: true,
			number: true,
			min: 3,
		},
		categoryText: {
			required: true,
		},
	},
	messages: {
		username: {
			remote: "Username already taken"
		},
		email: {
			remote: "Email already taken",			
		},
		phone: {
			remote: "Phone already taken"
		},
	}	
});

$("#promotions_edit").validate({
	rules: {
		// startDate: {
		// 	required: true,
		// },
		// endDate: {
		// 	required: true
		// },
		title: {
			required: true,
		},
		description: {
			required: true,
		}
	}
});

$("#promotions_add").validate({
	rules: {
		// startDate: {
		// 	required: true,
		// },
		// endDate: {
		// 	required: true
		// },
		title: {
			required: true,
		},
		description: {
			required: true,
		}
	}
});

$("#inactivepromo_add").validate({
	rules: {
		declineMessage: {
			required: true,
		}
	}
});

$("#pushnotifications_edit").validate({
	rules: {
		title: {
			required: true,
		},
		date: {
			required: true,
		},
		time: {
			required: true,
		},
		description: {
			required: true,
		},
	}
});

$("#pushnotifications_add").validate({
	rules: {
		title: {
			required: true,
		},
		date: {
			required: true,
		},
		time: {
			required: true,
		},
		description: {
			required: true,
		},
		type: {
			required: true,
		}
	}
});


// $("select[name='limit']").change(function(){
$(document).on("change", "select[name='limit'], select[name='sortBy']", function () {
	this.form.submit();
});

$(document).on("click", ".ctriggerclick", function () {
	var sortby = $(this).attr("data-sortby");
	var sortorder = $(this).attr("data-sortorder");

	$("input[name='sortBy']").val(sortby);
	$("input[name='sortOrder']").val(sortorder);

	$("select[name='limit']").trigger('change');
});

$(document).on("click", ".ctriggerclicktwo", function () {
	var sortby = $(this).attr("data-sortby");
	var sortorder = $(this).attr("data-sortorder");

	$("select[name='sortBy']").val(sortby);
	$("input[name='sortOrder']").val(sortorder);

	$("select[name='sortBy']").trigger('change');
});

$('.statusbtn').on('change', function (e) {
	var cvalue = e.target.checked;
	var form = $(this).closest('form');
	if (cvalue == false) {
		$(form).find("input[name='status']").val(0);
	}
	else {
		$(form).find("input[name='status']").val(1);
	}
});

$(document).on("change", ".vsajaxbtn", function (e) {

	var ctag = e.target;
	var shopId = ctag.getAttribute('data-cvalue');

	var checked = ctag.checked;
	var status = 0;
	if (checked == true) {
		status = 1;
	}
	var loaderClass = ".vsajaxloader";
	$(loaderClass).removeClass("hide");

	$.ajax('/vendors/editStatus/' + shopId + '/status/' + status, {
		type: 'GET',
		data: {},
		success: function (returnValues, status, xhr) {
			toastr.success(returnValues.message);

			$(loaderClass).addClass("hide");
		},
		error: function (jqXhr, textStatus, errorMessage) {
			toastr.error(textStatus + " - " + errorMessage);

			if (checked == true) {
				$(ctag).prop('checked', false);
			}
			else {
				$(ctag).prop('checked', true);
			}
			
			$(loaderClass).addClass("hide");
		}
	});
});

$(document).on("change", ".tierajaxbtn", function (e) {

	var ctag = e.target;
	var tierId = ctag.getAttribute('data-cvalue');
	var tiercheck = '.tiercheck' + tierId;
	var checked = ctag.checked;
	var status = 0;
	if (checked == true) {
		status = 1;
	}
	var loaderClass = ".tierl" + tierId;
	$(loaderClass).removeClass("hide");

	$.ajax('/vendors/tier/' + tierId + '/status/' + status, {
		type: 'GET',
		data: {},
		success: function (returnValues, status, xhr) {
			toastr.success(returnValues.message);

			$(loaderClass).addClass("hide");
		},
		error: function (jqXhr, textStatus, errorMessage) {
			toastr.error(textStatus + " - " + errorMessage);

			if (checked == true) {
				$(tiercheck).prop('checked', false);
			}
			else {
				$(tiercheck).prop('checked', true);
			}
			$(loaderClass).addClass("hide");
		}
	});
});

$(document).on("change", ".promotionajaxbtn", function (e) {

	var ctag = e.target;
	var promotionId = ctag.getAttribute('data-cvalue');
	var promotioncheck = '.promotioncheck' + promotionId;
	var checked = ctag.checked;
	var status = 4;
	if (checked == true) {
		status = 1;
	}
	//var loaderClass = ".tierl" + promotionId;
	//$(loaderClass).removeClass("hide");

	$.ajax('/promotions/promotion/' + promotionId + '/status/' + status, {
		type: 'GET',
		data: {},
		success: function (returnValues, status, xhr) {
			// toastr.success(returnValues.message);
			toastr.options.onHidden = function () { location.reload() };
			if (returnValues.success == true) {
				toastr.success(returnValues.message);
			}
			else {
				toastr.error(returnValues.message);
			}
			//$(loaderClass).addClass("hide");
		},
		error: function (jqXhr, textStatus, errorMessage) {
			toastr.error(textStatus + " - " + errorMessage);

			if (checked == true) {
				$(promotioncheck).prop('checked', false);
			}
			else {
				$(promotioncheck).prop('checked', true);
			}
			//$(loaderClass).addClass("hide");
		}
	});
});

$(document).on("click", ".viewpassword", function () {
	var arrtType = $(this).parent().find('input').attr('type');
	var inputTag = $(this).parent().find('input');
	var thisFa = $(this).find('i');

	if ('password' == arrtType) {
		inputTag.prop('type', 'text');
		thisFa.addClass("la-eye-slash").removeClass("la-eye");
	}
	else {
		inputTag.prop('type', 'password');
		thisFa.addClass("la-eye").removeClass("la-eye-slash");
	}
});

$(".tablesortable tbody").sortable({
	axis: "y",
	update: function (event, ui) {
		var promotionids = $(this).children().get().map(function (el) {
			return parseInt(el.getAttribute('data-promotionid'));
		});

		var promotionsequence = $(this).children().get().map(function (el) {
			return parseInt(el.getAttribute('data-sequence'));
		});

		var promotionsequenceSortA = Array.from(promotionsequence);
		var promotionsequenceSort = promotionsequenceSortA.sort((a, b) => a - b);

		$.ajax('/promotions/updateorder', {
			type: 'POST',
			data: { promotionids: promotionids, promotionsequence: promotionsequenceSort },
			success: function (returnValues, status, xhr) {
				toastr.success(returnValues.message);
			},
			error: function (jqXhr, textStatus, errorMessage) {
				toastr.error(textStatus + " - " + errorMessage);
			}
		});
	}
});

function updateVLogo(input, imgAsset) {

	var url = input.value;
	var ext = url.substring(url.lastIndexOf('.') + 1).toLowerCase();
	if (input.files && input.files[0] && (ext == "gif" || ext == "png" || ext == "jpeg" || ext == "jpg")) {
		var reader = new FileReader();

		var oldUrl = $('#' + imgAsset).attr('src');

		reader.onload = function (e) {
			$('#' + imgAsset).attr('src', e.target.result);
		}

		reader.readAsDataURL(input.files[0]);

		var form = $(input).closest('form');
		$(form).ajaxSubmit({
			url: '/vendors/editvendorlogo',
			type: 'POST',
			error: function (xhr) {
				toastr.error("Error! Not able to upload image");
				$('#' + imgAsset).attr('src', oldUrl);
			},
			success: function (response) {
				if (response.message.code == 200) {
					toastr.success(response.message.msg);
				}
				else {
					$('#' + imgAsset).attr('src', oldUrl);
					toastr.error(response.message.msg);
				}
			}
		});

	}
	else if (input.files && input.files[0] && (ext != "gif" && ext != "png" && ext != "jpeg" && ext != "jpg")) {
		toastr.error("Invalid image format");
	}
}

function updateULogo(input, imgAsset) {

	var url = input.value;
	var ext = url.substring(url.lastIndexOf('.') + 1).toLowerCase();
	if (input.files && input.files[0] && (ext == "gif" || ext == "png" || ext == "jpeg" || ext == "jpg")) {
		var reader = new FileReader();

		var oldUrl = $('#' + imgAsset).attr('src');

		reader.onload = function (e) {
			$('#' + imgAsset).attr('src', e.target.result);
		}

		reader.readAsDataURL(input.files[0]);

		var form = $(input).closest('form');
		$(form).ajaxSubmit({
			url: '/users/edituserlogo',
			type: 'POST',
			error: function (xhr) {
				toastr.error("Error! Not able to upload image");
				$('#' + imgAsset).attr('src', oldUrl);
			},
			success: function (response) {
				if (response.message.code == 200) {
					toastr.success(response.message.msg);
				}
				else {
					$('#' + imgAsset).attr('src', oldUrl);
					toastr.error(response.message.msg);
				}
			}
		});

	}
	else if (input.files && input.files[0] && (ext != "gif" && ext != "png" && ext != "jpeg" && ext != "jpg")) {
		toastr.error("Invalid image format");
	}
}

function updatePImg(input, imgAsset) {

	var url = input.value;
	var ext = url.substring(url.lastIndexOf('.') + 1).toLowerCase();
	if (input.files && input.files[0] && (ext == "gif" || ext == "png" || ext == "jpeg" || ext == "jpg")) {
		var reader = new FileReader();

		var oldUrl = $('#' + imgAsset).attr('src');

		reader.onload = function (e) {
			$('#' + imgAsset).attr('src', e.target.result);
		}

		reader.readAsDataURL(input.files[0]);

		var form = $(input).closest('form');
		$(form).ajaxSubmit({
			url: '/promotions/editpimg',
			type: 'POST',
			error: function (xhr) {
				toastr.error("Error! Not able to upload image");
				$('#' + imgAsset).attr('src', oldUrl);
			},
			success: function (response) {
				if (response.message.code == 200) {
					toastr.success(response.message.msg);
				}
				else {
					$('#' + imgAsset).attr('src', oldUrl);
					toastr.error(response.message.msg);
				}
			}
		});

	}
	else if (input.files && input.files[0] && (ext != "gif" && ext != "png" && ext != "jpeg" && ext != "jpg")) {
		toastr.error("Invalid image format");
	}
}

function addPImg(input, imgAsset) {

	var url = input.value;
	var ext = url.substring(url.lastIndexOf('.') + 1).toLowerCase();
	if (input.files && input.files[0] && (ext == "gif" || ext == "png" || ext == "jpeg" || ext == "jpg")) {
		var reader = new FileReader();

		var oldUrl = $('#' + imgAsset).attr('src');

		reader.onload = function (e) {
			$('#' + imgAsset).attr('src', e.target.result);
		}

		reader.readAsDataURL(input.files[0]);

		var form = $(input).closest('form');
		$(form).ajaxSubmit({
			url: '/promotions/addpimg',
			type: 'POST',
			error: function (xhr) {
				toastr.error("Error! Not able to upload image");
				$('#' + imgAsset).attr('src', oldUrl);
			},
			success: function (response) {
				if (response.message.code == 200) {
					toastr.success(response.message.msg);
					$("input[name='" + imgAsset + "']").val(response.message.promotionImageUrl);
				}
				else {
					$('#' + imgAsset).attr('src', oldUrl);
					toastr.error(response.message.msg);
				}
			}
		});
	}
	else if (input.files && input.files[0] && (ext != "gif" && ext != "png" && ext != "jpeg" && ext != "jpg")) {
		toastr.error("Invalid image format");
	}
}

$(document).on("click", ".approvepromo", function (e) {
	var promotionId = $(this).attr('data-cvalue');
	var status = 1;

	$.ajax('/promotions/promotion/' + promotionId + '/status/' + status, {
		type: 'GET',
		data: {},
		success: function (returnValues, status, xhr) {
			toastr.options.onHidden = function () { location.reload() };
			if (returnValues.success == true) {
				toastr.success(returnValues.message);
			}
			else {
				toastr.error(returnValues.message);
			}
		},
		error: function (jqXhr, textStatus, errorMessage) {
			toastr.options.onHidden = function () { location.reload() };
			toastr.error(textStatus + " - " + errorMessage);
		}
	});
});

$(document).on("click", ".declinepromo", function () {
	var promotionId = $(this).attr('data-cvalue');
	$("#inactivepromo .promotionId").val(promotionId);

	$("#inactivepromo").modal();
});

$(document).on("click", ".pntyperadios input[name='type']", function () {
	var typeval = $(this).val();
	if (typeval == 1) {
		$('#userpopupone').modal({ backdrop: 'static', keyboard: true, show: true });

		uporesults_1();
	}
	else if (typeval == 2) {
		$('#vendorpopupone').modal({ backdrop: 'static', keyboard: true, show: true });

		vponpbuttons();

		vporesults_1();
	}
});

$(document).on("click", ".deleteUserBtn", function () {
	var id = $(this).attr('data-id');
	var username = $(this).attr('data-username')
	$(".removeemailtxt").empty().html(username);
	$('#deleteuserId').val(id);
});

function cleartype() {
	$('input[name="userIdArray"]').val('');
	$('input[name="shopIdArray"]').val('');
	$("input[name='type']").prop('checked', false);
}

// Pick Vendor Selection POPUP 
function uporesults_1() {
	$('.uporesults_1').html(custloader);
	var uposearch = $(".uposearch").val();
	var uposearchin = $(".uposearchin").val();

	var shopids = $('input[name="shopIdArray"]').val();
	if (shopids) {
		var shopIdArray = shopids.split(",");
	}
	else {
		var shopIdArray = Array();
	}

	$.ajax('/pushnotifications/vendorselection', {
		type: 'GET',
		data: {
			shopName: uposearch,
			categoryText: uposearchin,
			selectedshops: shopIdArray
		},
		success: function (returnValues, status, xhr) {
			$('.uporesults_1').html(returnValues.message);
		},
		error: function (jqXhr, textStatus, errorMessage) {
			toastr.error(textStatus + " - " + errorMessage);
		}
	});
}

$(document).on("click", ".upocancel", function () {
	cleartype();
	$('.uposelected_1').html('');
	$('.upoconfirm').prop("disabled", true);
	$('#userpopupone').modal('hide');
});
$(document).on("click", ".upoconfirm", function () {
	$('#userpopupone').modal('hide');
});

$(document).on("input select", ".uposearch, .uposearchin", function () {
	uporesults_1();
});

$(document).on("change", ".upocheckall", function () {
	if ($(this).prop("checked") == true) {
		$(this).closest('table').find(".upocheck").prop('checked', true).trigger('change');
	}
	else{
		$(this).closest('table').find(".upocheck").prop('checked', false).trigger('change');
	}	
});

$(document).on("change", ".upocheck", function () {
	var shopids = $('input[name="shopIdArray"]').val();
	if (shopids) {
		var shopIdArray = shopids.split(",");
	}
	else {
		var shopIdArray = Array();
	}
	var shopname = $(this).closest('tr').find(".shopname").text();
	var checkval = $(this).val();
	if ($(this).prop("checked") == true) {
		if(!$('.selshop' + checkval).length){
			shopIdArray.push(checkval);
			$(".uposelected_1").append('<button type="button" class="btn btn-metal m-btn m-btn--custom blackfont fw-600 mr-2 mb-2 selshop' + checkval + '">' + shopname + '</button>');
		}		
	}
	else {
		shopIdArray.splice(shopIdArray.indexOf(checkval), 1);
		$('.selshop' + checkval).remove();
	}

	$('input[name="shopIdArray"]').val(shopIdArray.toString());
	var shopidslatest = $('input[name="shopIdArray"]').val();
	if (shopidslatest) {
		$('.upoconfirm').prop("disabled", false);
	}
	else {
		$('.upoconfirm').prop("disabled", true);
	}
});
// Ends Pick Vendor Selection POPUP 

// Pick User Selection POPUP 
function vporesults_1() {
	var vopshopsidarray = $(".vpocheck:checked").map(function (el) {
		return $(this).val();
	});
	var vopshopsids = Array.from(vopshopsidarray);

	$('.vporesults_1').html(custloader);
	var vposearch = $(".vposearch").val();
	var vposearchin = $(".vposearchin").val();
	
	$.ajax('/pushnotifications/userselection', {
		type: 'GET',
		data: {
			shopName: vposearch,
			categoryText: vposearchin,
			selectedshops: vopshopsids
		},
		success: function (returnValues, status, xhr) {
			$('.vporesults_1').html(returnValues.message);
		},
		error: function (jqXhr, textStatus, errorMessage) {
			toastr.error(textStatus + " - " + errorMessage);
		}
	});
}

function vpousers_1() {
	$('.vpousers_1').html(custloader);
	var vposearchuser = $(".vposearchuser").val();

	var userids = $('input[name="userIdArray"]').val();
	if (userids) {
		var userIdArray = userids.split(",");
	}
	else {
		var userIdArray = Array();
	}

	var vopshopsidarray = $(".vpocheck:checked").map(function (el) {
		return $(this).val();
	});
	var vopshopsids = Array.from(vopshopsidarray);
	
	var vpogenderarray = $("input[name='vpogender']:checked").map(function (el) {
		return $(this).val();
	});
	var vpogender = Array.from(vpogenderarray);

	var vpoaccountactarray = $("input[name='vpoaccountact']:checked").map(function (el) {
		return $(this).val();
	});
	var vpoaccountact = Array.from(vpoaccountactarray);

	var vpotpstart = $("#vpotpstart").val();
	var vpotpend = $("#vpotpend").val();

	$.ajax('/pushnotifications/userselectionfilter', {
		type: 'GET',
		data: {
			vposearchuser: vposearchuser,
			vopshopsids: vopshopsids,
			vpogender: vpogender,
			vpoaccountact: vpoaccountact,
			vpotpstart: vpotpstart,
			vpotpend: vpotpend,
			selectedusers: userIdArray
		},
		success: function (returnValues, status, xhr) {
			$('.vpousers_1').html(returnValues.message);
		},
		error: function (jqXhr, textStatus, errorMessage) {
			toastr.error(textStatus + " - " + errorMessage);
		}
	});	
}

function vponpbuttons(clickedbtn = null) {	
	if(clickedbtn){
		var tabtype = clickedbtn.attr('data-tabtype');
		var ctab = clickedbtn.attr('data-ctab');

		if (tabtype == "next" && ctab == 2) {
			if (!($('.vpocheck').is(":checked"))) {
				alert("Please select atleast one vendor from the list");
				return;	
			}

			var usermaxpointarray = $(".vpocheck:checked").map(function (el) {
				var usermaxpoint = $(this).attr('data-usermaxpoint');
				if(usermaxpoint == 'null'){
					usermaxpoint = 0;
				}
				return usermaxpoint;
			});
			var vpomaxtotal = Math.max.apply(null, usermaxpointarray);
			if(vpomaxtotal > 0){
				var slider = document.getElementById('m_nouislider_t');
				slider.noUiSlider.updateOptions({
					range: {'min': 0, 'max': vpomaxtotal}
				});
				slider.noUiSlider.set([0, vpomaxtotal]);
			}
		}

		clickedbtn.hide();
		$('#vendorpopupone .tab-pane').removeClass("active");
		$('#vendorpopupone_'+ctab).addClass("active");

		$('#vendorpopupone .vponext').hide();
		$('#vendorpopupone .vpoprev').hide();
		$('#vendorpopupone .vpoconfirm').hide();

		$('.vposearchbar .vposearchinvendor').hide();
		$('.vposearchbar .vposearchinuser').hide();

		if ((tabtype == "next" && ctab == 2) || (tabtype == "prev" && ctab == 2)) {
			$('#vendorpopupone .vpoprev[data-ctab="1"]').show();
			$('#vendorpopupone .vponext[data-ctab="3"]').show();
		}
		else if (tabtype == "next" && ctab == 3) {
			$('#vendorpopupone .vpoprev[data-ctab="2"]').show();
			$('#vendorpopupone .vpoconfirm').show();

			vpousers_1();

			$('.vposearchbar .vposearchinuser').show();
		}
		else if (tabtype == "prev" && ctab == 1) {
			$('#vendorpopupone .vponext[data-ctab="2"]').show();

			$('.vposearchbar .vposearchinvendor').show();
		}
	}
	else{
		$('#vendorpopupone .tab-pane').removeClass("active");
		$('#vendorpopupone_1').addClass("active");

		$('#vendorpopupone .vponext').hide();
		$('#vendorpopupone .vpoprev').hide();
		
		if($(".vposelected_1").text().length > 0){
			$('#vendorpopupone .vpoconfirm').show();
		}
		else{
			$('#vendorpopupone .vpoconfirm').hide();
		}		

		$('#vendorpopupone .vponext[data-ctab="2"]').show();
	}
}

$(document).on("click", ".vpocancel", function () {
	cleartype();
	$('.vposelected_1').html('');
	$('#vendorpopupone').modal('hide');
});
$(document).on("click", ".vpoconfirm", function () {
	$('#vendorpopupone').modal('hide');
});

$(document).on("input select", ".vposearch, .vposearchin", function () {
	vporesults_1();
});

$(document).on("input select", ".vposearchuser", function () {
	vpousers_1();
});

$(document).on("click", ".vponext, .vpoprev", function () {
	vponpbuttons( $(this) );
});

$(document).on("change", ".vpocheckall", function () {
	if ($(this).prop("checked") == true) {
		$(this).closest('table').find(".vpocheck").prop('checked', true);
	}
	else{
		$(this).closest('table').find(".vpocheck").prop('checked', false);
	}	
});

$(document).on("click", ".vposeeall", function () {
	$(this).closest('table').find(".vpocheck").prop('checked', false);
	$(this).closest('tr').find(".vpocheck").prop('checked', true);
	//$('#vendorpopupone .vponext[data-ctab="2"]').trigger('click');

	$('#vendorpopupone .vpoprev[data-ctab="1"]').show();
	$('#vendorpopupone .vponext[data-ctab="2"]').hide();
	$('#vendorpopupone .vpoconfirm').hide();
	
	$('.vposearchbar .vposearchinvendor').hide();
	$('.vposearchbar .vposearchinuser').show();

	$('#vendorpopupone .tab-pane').removeClass("active");
	$('#vendorpopupone_3').addClass("active");

	$('.vposearchuser').val('');
	$("input[name='vpogender']").prop('checked', false);
	$("input[name='vpoaccountact']").prop('checked', false);
	$("input[name='vpotpstart']").val('');
	$("input[name='vpotpend']").val('');

	vpousers_1();
});

$(document).on("change", ".vpocheckalluser", function () {
	if ($(this).prop("checked") == true) {
		$(this).closest('table').find(".vpocheckuser").prop('checked', true).trigger('change');
	}
	else{
		$(this).closest('table').find(".vpocheckuser").prop('checked', false).trigger('change');
	}	
});

$(document).on("change", ".vpocheckuser", function () {
	var userids = $('input[name="userIdArray"]').val();
	if (userids) {
		var userIdArray = userids.split(",");
	}
	else {
		var userIdArray = Array();
	}
	var username = $(this).closest('tr').find(".username").text();
	var checkval = $(this).val();
	if ($(this).prop("checked") == true) {
		if(!$('.seluser' + checkval).length){
			userIdArray.push(checkval);
			$(".vposelected_1").append('<button type="button" class="btn btn-metal m-btn m-btn--custom blackfont fw-600 mr-2 mb-2 seluser' + checkval + '">' + username + '</button>');
		}		
	}
	else {
		userIdArray.splice(userIdArray.indexOf(checkval), 1);
		$('.seluser' + checkval).remove();
	}

	$('input[name="userIdArray"]').val(userIdArray.toString());
	var useridslatest = $('input[name="userIdArray"]').val();
	if (useridslatest) {
		$('.vpoconfirm').prop("disabled", false).show();
	}
	else {
		$('.vpoconfirm').prop("disabled", true);
	}
});

function totalpointsslider(maxnumber = 1000){
	var slider = document.getElementById('m_nouislider_t');

	noUiSlider.create(slider, {
		start: [ 0, maxnumber ],
		step: 1,
		range: {
			'min': 0,
			'max': maxnumber
		},
		format: wNumb({
			decimals: 0 
		}),
		tooltips: [true, wNumb({ decimals: 0 })],
		connect: true,	
	});
	
	// init slider input
	var sliderInput0 = document.getElementById('vpotpstart');
	var sliderInput1 = document.getElementById('vpotpend');
	var sliderInputs = [sliderInput0, sliderInput1];        

	slider.noUiSlider.on('update', function( values, handle ) {
		sliderInputs[handle].value = values[handle];
	});
}
if($("#m_nouislider_t").length > 0){
	totalpointsslider();
}
// Ends Pick User Selection POPUP

$(document).on("change", ".commoncheckall", function () {
	if ($(this).prop("checked") == true) {
		$(this).closest('table').find(".commoncheck").prop('checked', true);
		$(this).closest('table').find("tbody tr").removeClass("excludethis");
		$(".commonactiondiv").removeClass("hide");
	}
	else{
		$(this).closest('table').find(".commoncheck").prop('checked', false);
		$(this).closest('table').find("tbody tr").addClass("excludethis");

		$(".commonactiondiv").addClass("hide");
	}	
});
$(document).on("change", ".commoncheck", function () {
	if ($(this).prop("checked") == true) {
		$(this).closest('tr').removeClass("excludethis");
	}
	else {
		$(this).closest('tr').addClass("excludethis");
	}

	if($(".commoncheck:checked").length > 0) {
		$(".commonactiondiv").removeClass("hide");
	}
	else {
		$(".commonactiondiv").addClass("hide");
	}

	if($(this).closest('table').find(".commoncheck").length == $(this).closest('table').find(".commoncheck:checked").length) {
		$(this).closest('table').find(".commoncheckall").prop('checked', true);
	}
	else{
		$(this).closest('table').find(".commoncheckall").prop('checked', false);
	}
});

$(document).on("click", ".commonactive, .commoninactive", function () {
	var status = $(this).attr('data-status');

	var custloaderclone = custloader.replace (/m-5/g, "");	
	$('.loaderspan').removeClass('hide').addClass('d-inline-block').html(custloaderclone);

	var commoncheckarray = $(".commoncheck:checked").map(function (el) {
		return $(this).val();
	});
	var commoncheckids = Array.from(commoncheckarray);

	var commoncheckarrayunm = $(".commoncheck:checked").map(function (el) {
		return $(this).attr('data-username');
	});
	var commoncheckusernames = Array.from(commoncheckarrayunm);

	var commoncheckarrayrole = $(".commoncheck:checked").map(function (el) {
		return $(this).attr('data-role');
	});
	var commoncheckarrayrole = Array.from(commoncheckarrayrole);

	$.ajax('/users/multiplestatuses', {
		type: 'POST',
		data: {
			status: status,
			selectedusers: commoncheckids,
			selectedusernames: commoncheckusernames,
			selectedroles: commoncheckarrayrole,
		},
		success: function (returnValues, status, xhr) {
			$('.loaderspan').removeClass('d-inline-block').addClass('hide').html(custloaderclone);
			toastr.options.onHidden = function () { location.reload() };
			if (returnValues.success == true) {
				toastr.success(returnValues.message);
			}
			else {
				toastr.error(returnValues.message);
			}
		},
		error: function (jqXhr, textStatus, errorMessage) {
			toastr.error(textStatus + " - " + errorMessage);
		}
	});
});

$(document).on("click", ".ntfactive, .ntfdelete", function () {
	var status = $(this).attr('data-status');

	var custloaderclone = custloader.replace (/m-5/g, "");	
	$('.loaderspan').removeClass('hide').addClass('d-inline-block').html(custloaderclone);

	var commoncheckarray = $(".commoncheck:checked").map(function (el) {
		return $(this).val();
	});
	var commoncheckids = Array.from(commoncheckarray);

	$.ajax('/notifications/multiplestatuses', {
		type: 'POST',
		data: {
			status: status,
			selectedids: commoncheckids,
		},
		success: function (returnValues, status, xhr) {
			$('.loaderspan').removeClass('d-inline-block').addClass('hide').html(custloaderclone);
			toastr.options.onHidden = function () { location.reload() };
			if (returnValues.success == true) {
				toastr.success(returnValues.message);
			}
			else {
				toastr.error(returnValues.message);
			}
		},
		error: function (jqXhr, textStatus, errorMessage) {
			toastr.error(textStatus + " - " + errorMessage);
		}
	});
});

$(document).on("click", ".commonpublishnotif, .commondraftnotif", function () {
	var status = $(this).attr('data-status');

	var custloaderclone = custloader.replace (/m-5/g, "");	
	$('.loaderspan').removeClass('hide').addClass('d-inline-block').html(custloaderclone);

	var commoncheckarray = $(".commoncheck:checked").map(function (el) {
		return $(this).val();
	});
	var commoncheckids = Array.from(commoncheckarray);

	var commoncheckarraytitle = $(".commoncheck:checked").map(function (el) {
		return $(this).attr('data-title');
	});
	var commonchecktitles = Array.from(commoncheckarraytitle);

	var commoncheckarraydate = $(".commoncheck:checked").map(function (el) {
		return $(this).attr('data-date');
	});
	var commoncheckdates = Array.from(commoncheckarraydate);

	var commoncheckarraytime = $(".commoncheck:checked").map(function (el) {
		return $(this).attr('data-time');
	});
	var commonchecktimes = Array.from(commoncheckarraytime);

	var commoncheckarraytype = $(".commoncheck:checked").map(function (el) {
		return $(this).attr('data-type');
	});
	var commonchecktypes = Array.from(commoncheckarraytype);

	$.ajax('/pushnotifications/multiplestatuses', {
		type: 'POST',
		data: {
			status: status,
			selectednotifications: commoncheckids,
			selectedtitles: commonchecktitles,
			selecteddates: commoncheckdates,
			selectedtimes: commonchecktimes,
			selectedtypes: commonchecktypes,
		},
		success: function (returnValues, status, xhr) {
			$('.loaderspan').removeClass('d-inline-block').addClass('hide').html(custloaderclone);
			toastr.options.onHidden = function () { location.reload() };
			if (returnValues.success == true) {
				toastr.success(returnValues.message);
			}
			else {
				toastr.error(returnValues.message);
			}
		},
		error: function (jqXhr, textStatus, errorMessage) {
			toastr.error(textStatus + " - " + errorMessage);
		}
	});
});

$(document).on("click", ".exportbutton", function () {
	var exporttable = $(this).attr('data-export');

	if($(exporttable + " .commoncheck:checked").length > 0) {
		let options = {
			"separator": ",",
			"newline": "\n",
			"quoteFields": true,
			"excludeColumns": ".excludecheckbox, .excludeactions",
			"excludeRows": ".excludethis",
			"trimContent": true,
			"filename": exporttable+".csv",
			"appendTo": ""
		}

		$(exporttable).table2csv('download', options);
	}
	else {
		alert("Please check atleast one or more records to export CSV");
	}
});

$('#promoImageModal').on('show.bs.modal', function (event) {
	var button = $(event.relatedTarget) // Button that triggered the modal
	var vendorname = button.data('vendorname') // Extract info from data-* attributes
	var imageurl = button.data('imageurl') // Extract info from data-* attributes
	
	var modal = $(this);
	modal.find('.modal-header #exampleModalLabel').html(vendorname);
	modal.find('.modal-body img').attr("src", imageurl);
 })
 $('#vendorImageModal').on('show.bs.modal', function (event) {
 //	$('.modal-body').css('max-height',$( window ).height()*0.8);
	var button = $(event.relatedTarget) // Button that triggered the modal
	var vendorname = button.data('vendorname') // Extract info from data-* attributes
	var imageurl = button.data('imageurl') // Extract info from data-* attributes
	
	var modal = $(this);
	modal.find('.modal-header #exampleModalLabel').html(vendorname);
	modal.find('.modal-body img').attr("src", imageurl);
 })

function chatDateFormat(msgdate){
	if(!msgdate){ return ""; }
	
	var todaysDate = moment();
	var oldDate = moment(msgdate);
	var diffDays = oldDate.diff(todaysDate, 'days');
	
	var retdate = moment(msgdate).format("DD MMM YYYY, hh:mm A")

	if(diffDays == 0){
	  retdate = moment(msgdate).format("hh:mm A")
	}
 
	return retdate;
}

moment.createFromInputFallback=function (config){
	config._d = new Date(config._i);
}

function lastSeenFormat(msgdate){
	if(!msgdate){ return ""; }

	var currDate = moment();
	var dateToTest = moment(msgdate);
 
	var result = currDate.diff(dateToTest, 'days');	
	
	if (result > 7) {
		var retdate = moment(msgdate).format("DD MMM YYYY, hh:mm A")
	}
	else if (result > 0) {
		var daysstr = (result == 1) ? " day " : " days ";
		var retdate = result + daysstr + "ago, " + moment(msgdate).format("hh:mm A")
	}
	else {
		var retdate = "Today, " + moment(msgdate).format("hh:mm A")
	}
 
	return retdate;
}

function generateRandomKey(length) {
	let start = 2;
	let stop = parseInt(length) + start;
	return Math.random().toString(36).substring(start, stop);
}

var pathname = window.location.pathname;
if(pathname == "/chats"){
	window.emojiPicker = new EmojiPicker({
		emojiable_selector: '[data-emojiable=true]',
		assetsPath: '/assets/app/emoji-picker/lib/img/',
		popupButtonClasses: 'far fa-smile-beam'
	});
	// Finds all elements with `emojiable_selector` and converts them to rich emoji input fields
	// You may want to delay this step if you have dynamically created input fields that appear later in the loading process
	// It can be called as many times as necessary; previously converted input fields will not be converted again
	window.emojiPicker.discover();

	var base_url = window.location.origin;	
	// console.log(process.env.CHATURL);
	
	// var socket = io.connect(base_url);	
	var socket = io.connect($(".servercharurl").val());	

	var currentuser = $(".currentuser").val();
	var currentuserimg = $(".currentuserimg").val();
	// var currentroom = $(".currentroom").val();
	// var currentoffset = $(".currentoffset").val();
	
	// on connection to server, ask for user's name with an anonymous callback
	socket.on('connect', function(){
		// call the server-side function 'adduser' and send one parameter (value of prompt)
		socket.emit('online user', currentuser);
	});

	socket.on('new message', function (data) {
		console.log('socket-> new message');
		
		chatmsgHtml(data, "receiver", "append", "scroll", "scrollbottom");
	});

	socket.on('create room', function (data) {
		console.log('socket-> update chatrooms');

		if(data && data.length > 0){
			var toRoom = data[0].room;

			socket.emit('join', toRoom);
			$(".chatfooter").removeClass('cdisabled');

			$(".currentroom").val(toRoom);
			$(".currentoffset").val(0);
			$('#conversation').empty();
			// updateChatRooms();
		}
		else{
			toastr.error("Not able to create room!");
		}		
	});

	socket.on('update chatrooms', function (data) {
		console.log('socket-> update chatrooms');	

		updateChatRooms();
	});

	socket.on('online user', function (data) {
		console.log('socket-> online user');	

		updateChatRooms();
	});

	socket.on('user joined', function (data) {
		console.log('socket-> user joined');

		updateChatRooms();
	});

	socket.on('user left', function (data) {
		console.log('socket-> user left');

		updateChatRooms();
	});

	function markasRead(){
		var currentroom = $(".currentroom").val();
		if(currentroom){			
			socket.emit('mark read', {username: currentuser, room: currentroom});
		}		
	}
	// window.setInterval(function(){
	// 	// markasRead();
	// 	// updateChatRooms();
	// }, 7000);


	function switchRoom(thisd){
		$('input[name="searchchatsroom"]').val('').trigger('input');

		var fromUsername = $(".currentuser").val();
		var toUsername = $(thisd).attr("data-username");
		var toRoom = $(thisd).attr("data-room");
		var isonline = $(thisd).attr("data-isonline");
		var lastseen = lastSeenFormat($(thisd).attr("data-lastseen"));

		$(".chatheader").addClass('bgwhite');

		var chatuserimg = $(thisd).find(".chatpimg img").attr("src");
		$(".chatheadpimg img").attr("src", chatuserimg);

		var chatusertxt = $(thisd).find(".nametxt").html();		
		$(".chatheader .nametxt").html(chatusertxt);

		lastseen = "Last seen: " + lastseen;
		if(isonline == 1){
			lastseen = "Online";	
		}
		$(".chatheader .lastseentxt").empty().html(lastseen);

		if(toRoom){
			socket.emit('join', toRoom);
			$(".chatfooter").removeClass('cdisabled');

			$(".currentroom").val(toRoom);
			$(".currentoffset").val(0);
			$('#conversation').empty();
			updateChatData("scrollbottom");	
		}
		else{
			socket.emit('create room', {adminusername: fromUsername, username: toUsername});
		}
		updateChatRooms();
	}

	function chatmsgHtml(data, utype, mtype, sctype = null, scrltype = null){
		if(utype == "receiver"){
			var imgurl = $(".chatheadpimg img").attr("src");
		}
		else{
			var imgurl = currentuserimg;
		}
		
		var msgHtml = "";
		if(data.message.type == "image"){
			msgHtml += '<div class="msgtxt"><img src="'+data.message.message+'" class="chatmsgimg img-fluid" alt="Image"/></div>';
		}
		else if(data.message.type == "pdf"){
			if(data.message.chatId !== undefined){
				var fullurl = data.message.message;
				var filename = fullurl.substring(fullurl.lastIndexOf('/')+1);
				var downloadname = filename;
			}
			else{
				var downloadname = generateRandomKey(5) + generateRandomKey(5) + generateRandomKey(5) + ".pdf";
			}			
			
			msgHtml += '<div class="msgtxt"><a href="'+data.message.message+'" class="chatmsgpdf" target="_blank" download="'+downloadname+'" ><i class="fa fa-file-pdf"></i><div class="chatmsgpdftxt">'+downloadname+'</div></a></div>';
		}
		else{	
			msgHtml += '<div class="msgtxt">'+data.message.message+'</div>';
		}

		var msghtml = '<div class="msgrow '+utype+' msgrowclass'+data.message.chatId+'"><div class="chatmsgbgclr"><img src="'+imgurl+'" class="chatusrimg" alt="">'+msgHtml+'<div class="chatmsgdate">'+chatDateFormat(data.message.createdAt)+'</div></div></div>';

		if(mtype == "append"){
			$('#conversation').append(msghtml);
		}
		else{
			$('#conversation').prepend(msghtml);
		}

		if(sctype == "scroll" && scrltype == "scrollbottom"){
			$("#conversation").animate({ scrollTop: $('#conversation').prop("scrollHeight")}, 0);
		}
		else if(scrltype != null && scrltype.includes(".msgrowclass") == true){			
			$("#conversation").scrollTo('#conversation '+ scrltype);
		}
	}

	function updateChatData(sctype = null){
		$.ajax('/chats/getmessages', {
			type: 'POST',
			data: { 
				room: $(".currentroom").val(),
				username: currentuser,
				offset: $(".currentoffset").val()
			},
			success: function (returnValues, status, xhr) {
				if(returnValues.success == true){
					$(".currentoffset").val( parseInt($(".currentoffset").val()) + 20);
					var rowsArray = returnValues.message.data.rows;
					var rowsArrayLast = rowsArray.slice(-1).pop();
					// var rowsArrayFirst = rowsArray[0];
					
					if(sctype == "noscroll"){
						var fullcalss = $("#conversation .msgrow:first-child").attr("class");
						var fullcalssnew = "." + fullcalss.split(' ').join('.');
						sctype = fullcalssnew;
					}

					rowsArray.forEach(element => {
						var dobj = {
							message: element
						};

						var scrtyp = null
						if(element.chatId == rowsArrayLast.chatId && sctype == "scrollbottom"){
							scrtyp = "scroll";
						}

						if(element.username == currentuser){
							chatmsgHtml(dobj, "sender", "prepend", scrtyp, sctype);
						}
						else{
							chatmsgHtml(dobj, "receiver", "prepend", scrtyp, sctype);
						}		
					});
				}
				else{
					toastr.error("No more messages to load");	
				}
				// socket.emit('join', returnValues.message.data.room);
				// $(".currentroom").val(returnValues.message.data.room);
				// $("#datasend").removeClass('cdisabled');
			},
			error: function (jqXhr, textStatus, errorMessage) {
				toastr.error(textStatus + " - " + errorMessage);
			}
		});	
	}

	function makeActive(){
		$( ".chatmainrow" ).each(function( index ) {
			$(this).removeClass("active");
			var getroom = $(this).find('a:first').attr("data-room");					
			if(getroom == $(".currentroom").val()){
				$(this).addClass("active");

				var isonline = $(this).find('a:first').attr("data-isonline");
				var lastseen = lastSeenFormat($(this).find('a:first').attr("data-lastseen"));
				lastseen = "Last seen: " + lastseen;
				if(isonline == 1){
					lastseen = "Online";	
				}
				$(".chatheader .lastseentxt").empty().html(lastseen);
			}

			var getnumberdiv = $(this).find('a:first .numberdiv');
			if(getnumberdiv.length > 0){
				$(this).addClass("active");
			}					
		});
	}

	function removeRoomCounts(){
		$( ".chatmainrow" ).each(function( index ) {
			// $(this).removeClass("active");
			var getroom = $(this).find('a:first').attr("data-room");					
			if(getroom == $(".currentroom").val()){
				$(this).find('a:first .numberdiv').remove();
			}					
		});
	}

	function updateChatRooms(){
		$.ajax('/chats/chatRooms', {
			type: 'GET',
			data: {},
			success: function (returnValues, status, xhr) {
				//toastr.success(returnValues.message);					
				$('#rooms').empty();
				$("#rooms").html(returnValues.message);

				makeActive();
			},
			error: function (jqXhr, textStatus, errorMessage) {
				toastr.error(textStatus + " - " + errorMessage);
			}
		});
	}
	updateChatRooms();

	function sendChatImg(input) {
		var FileSize = input.files[0].size / 1024 / 1024; // in MB
		if(FileSize > 2){
			toastr.error("Upload max file size limit is 2MB only");
			return false;	
		}

		var url = input.value;
		var ext = url.substring(url.lastIndexOf('.') + 1).toLowerCase();
		if (input.files && input.files[0] && (ext == "gif" || ext == "png" || ext == "jpeg" || ext == "jpg" || ext == "pdf")) {
			$('.datamessage').empty();

			var filetype = (ext == "pdf") ? "pdf" : "image";
			var reader = new FileReader();
			
			reader.onload = function (e) {											
				$(".datamessage").text(e.target.result);
				$("#datasend").attr("data-msgtype", filetype).trigger('click');
			}
			
			reader.readAsDataURL(input.files[0]);
		}
		else if (input.files && input.files[0] && (ext != "gif" && ext != "png" && ext != "jpeg" && ext != "jpg" && ext != "pdf")) {
			toastr.error("Only .gif, .png, .jpeg, .jpg, .pdf allowed");
		}
	}

	// when the client clicks SEND
	$(document).on('click', '#datasend', function() {
		
		// var message = $('#data').val();
		// if(!message){
		// 	return false;
		// }
		// $('#data').val('');		

		var messagestr = $('.emoji-wysiwyg-editor.datamessage').html();	
		if(!messagestr){				
			return false;
		}
		$('.datamessage').empty();
		
		messagestr = messagestr.replace(/<div>/ig,"\n");
		messagestr = messagestr.replace(/(<([^>]+)>)/ig,"");
		messagestr = messagestr.replace(/&nbsp;/ig,"");
		messagestr = messagestr.trim();

		var filetype = $(this).attr("data-msgtype");
		if(!filetype){
			filetype = "text";
		}
		$(this).attr("data-msgtype", "");

		// tell server to execute 'sendchat' and send along one parameter
		var messageObj = {
			message: messagestr,
			room: $(".currentroom").val(),
			username: "admin",
			type: filetype,
			createdAt: moment(),
		};

		var data = {
			message: messageObj
		}

		chatmsgHtml(data, "sender", "append", "scroll", "scrollbottom");
		socket.emit('new message', messageObj);
	});

	$(document).on('focus', '.datamessage', function(e) {
		markasRead();
		removeRoomCounts();
		// updateChatRooms();
	});
	// when the client hits ENTER on their keyboard
	$(document).on('keypress', '.datamessage', function(e) {
		// if(e.which == 13) {
		// 	$(this).blur();
		// 	$('#datasend').focus().click();
		// }

		var startPos = e.target.innerText.length;			
		if (e.which === 32 && startPos == 0) {
			e.preventDefault();
		}
	});

	// when the client hits ENTER on their keyboard
	$('input[name="searchchatsroom"]').on('input', function(e) { 
		
		$('#rooms').addClass('hide');
		$('#searchrooms').removeClass('hide').html(custloader);

		var thisval = $(this).val();
		if(thisval.length == 0){
			// updateChatRooms();
			$('#rooms').removeClass('hide');
			$('#searchrooms').addClass('hide').empty();	
			
			return false;
		}

		$.ajax('/chats/search/'+thisval, {
			type: 'GET',
			data: {},
			success: function (returnValues, status, xhr) {
				//toastr.success(returnValues.message);					
				$('#searchrooms').empty();
				$("#searchrooms").html(returnValues.message);
				// socket.emit('updaterooms');
			},
			error: function (jqXhr, textStatus, errorMessage) {
				toastr.error(textStatus + " - " + errorMessage);
			}
		});	
	});
	
	$("#conversation").on('scroll', function() {
		var pos = $(document).find("#conversation").scrollTop();			
		if(pos == 0 && !$('#conversation').is(':empty')){				
			updateChatData("noscroll");	
		}			
	});
	
}