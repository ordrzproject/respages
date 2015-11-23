var interface;
var callBacks;
var postGet;
var validation;
var typeArray = ["Menu","Events","Content"];
function init(){
	postGet.getAllPages();
	interface.selectedButton();
}
postGet = function(){
	return{
		deletePage : function(id){
			$.ajax({
				type: "DELETE",
				contentType: "application/json",
				url: 'http://pagesmanagement.azurewebsites.net/Api/ResponsivePages/'+id,
				data: { },
				dataType: "json",
				complete: function (data) {
		       		callBacks.deletePage(data);
	       		}
		   });
		},
		getAllPages : function(){
			interface.blackScreenShow();
			interface.showLoader();
			interface.hideSelectedPage();
			interface.showPagesCont();
			$.ajax({
				type: "GET",
				contentType: "application/json",
				url: 'http://pagesmanagement.azurewebsites.net/Api/ResponsivePages',
				data: { },
				dataType: "json",
				complete: function (data) {
					interface.blackScreenHide();
					interface.hideLoader();
		       		callBacks.getAllPagesCB(data);
	       		}
			});
		},
		getSelectedPage : function(id){ 
			interface.blackScreenShow();
			interface.showLoader();
			interface.hidePagesCont();
			$.ajax({
				type: "GET",
				contentType: "application/json",
				url: 'http://pagesmanagement.azurewebsites.net/Api/ResponsivePages/'+id,
				data: { },
				dataType: "json",
				complete: function (data) {
	       			callBacks.getSelectedPageCB(data);
	       		}
		   });
		},
		createPage : function(pageInfo){
			if(validation.createPageValidation()){
				pageInfo.id = 1;
				pageInfo.publishedOn = "2015-11-18T10:25:00.5772396+00:00" ;
				$.post('http://pagesmanagement.azurewebsites.net/Api/ResponsivePages',
					pageInfo,
					function (data) {
						callBacks.createPageCB(data);
		       		}
			   ,"json");
			}
		},
		editPage : function(id){
			if(validation.createPageValidation()){
				var pageInfo = interface.getFormData();
				pageInfo.id = id;
				pageInfo.publishedOn = "2015-11-18T10:25:00.5772396+00:00" ;
				$.ajax({
					type: "PUT",
					dataType: 'json',
					url: 'http://pagesmanagement.azurewebsites.net/Api/ResponsivePages/'+id,
					data: pageInfo,
					complete: function (data) {
						callBacks.editPage(data, pageInfo);
					}
				});
			}
		}
	}
}();

callBacks = function(){
	return{
		editPage : function(data, pageInfo){
			var json = $.parseJSON(JSON.stringify(data));
			interface.closeCreatePage();
			if(callBacks.checkResponse(json) === 1 ){
				interface.updateMicroPage(pageInfo);
			}
		},
		deletePage : function(data){
			var json = $.parseJSON(JSON.stringify(data));
			interface.showDeleteDialog();
			if(this.checkResponse(json) === 1 ){
				postGet.getAllPages();
			}
		},
		createPageCB : function(data){
			interface.closeCreatePage(); 
			postGet.getAllPages();
			var json = $.parseJSON(data);
			var responseJSON;
		},
		getAllPagesCB : function(data){
			var json = $.parseJSON(JSON.stringify(data));
			var responseJSON;
			if(this.checkResponse(json) === 1 ){
				var resLength = json.responseJSON.length;
				$(".pages").empty();
				for(var i = 0; i < resLength; i++){
					$(".pages").append(pageHtml( 
						 ({
							id 			:  	json.responseJSON[i].id,
							description :  	json.responseJSON[i].description,
							title 		:	json.responseJSON[i].title,
							type 		:	json.responseJSON[i].type,
							isActive 	:	json.responseJSON[i].isActive,
							publishedOn :	json.responseJSON[i].publishedOn
						})
				 	));
				}
				$(".pages").append("<div class='clear'></div>");
			}
		},
		getSelectedPageCB : function(data){
			var json = $.parseJSON(JSON.stringify(data));
			interface.blackScreenHide();
			interface.hideLoader();
			interface.showSelectedPage();
			if(this.checkResponse(json) === 1 ){
				interface.fillSelectedPage({
					id 			:  	json.responseJSON.id,
					description :  	json.responseJSON.description,
					title 		:	json.responseJSON.title,
					type 		:	json.responseJSON.type,
					isActive 	:	json.responseJSON.isActive,
					published :	json.responseJSON.publishedOn
				});
			}
		},
		checkResponse : function(json){
			if(json.status === 200 && json.statusText === "OK"){
				return 1;
			}
			else{
				interface.showErrorDialog();
				return 0;
			}
		}
	}
}();

interface = function(){
	return{
		createPage : function(){
			this.blackScreenShow();
			$(".create-page").fadeIn();
			this.resetFields();
			$("#submit-create-page").attr("onclick","postGet.createPage( interface.getFormData())");
		},
		closeCreatePage : function(){
			$(".create-page").fadeOut();
			this.blackScreenHide();
		},
		resetFields : function(){
			this.showTypeList();
			$("#create-page-form input[type=text], textarea").val("").removeClass("red-border") ;
			$("#selected-type-item").text("Selecte page type").attr("data-tid","").parent().removeClass("red-border");
			$("#submit-create-page").val("Submit");
			$("#submit-create-page").attr("onclick","");
			this.hideTypeList();
			this.resetStatusBtn();
			statusBtnFlag = false;
		},
		resetStatusBtn : function(){
			$("#circle-btn").attr("style","");
			$(".on-button").attr("style","");
			$(".off-button").attr("style","");
		},
		showTypeList : function(){
			if($(".drop-down-type").is(":visible"))
				$(".drop-down-type").slideUp();
			else
				$(".drop-down-type").slideDown();
		},
		hideTypeList : function(){
			$(".drop-down-type").css("display","none");
		},
		selectTypeList : function(element){
			$("#selected-type-item").text(element.text());
			$("#selected-type-item").attr("data-tid",element.attr("data-val"));
			this.showTypeList();
		},
		deletePageBtn : function(e){
			$("#delete-page").attr("data-id","");
			$("#delete-page").attr("data-id", $(e).attr("data-pid"));
			this.showDeleteDialog();
			
		},
		editPageBtn : function(e){
			var id = $(e).attr("data-pid");
			this.createPage();
			$("#submit-create-page").val("Update").attr("onclick","postGet.editPage("+id+")");
			$("#create-page-title").val($("#title-"+id).text());
			$("#create-page-description").val($("#desc-"+id).text());
			var tp = parseInt($("#type-"+id).attr("data-tid"));
			if( $.isNumeric( tp ) ){
				// type[tp]
				if(tp === 0){
					$("#selected-type-item").attr("data-tid",0).text(typeArray[0]);
				}
				else if(tp === 1){
					$("#selected-type-item").attr("data-tid",1).text(typeArray[1]);
				}
				else if(tp === 2){
					$("#selected-type-item").attr("data-tid",2).text(typeArray[2]);
				}
			}
			if($("#status-"+id).text() === "true"){
				statusBtnFlag = true;
				$(".on-button").css("left", 100);
				$(".off-button").css("left", 100);
				$("#circle-btn").css("left", 60);
			}
			else{
				this.resetStatusBtn();
				statusBtnFlag = false;
			}
		},
		showDeleteDialog : function(){
			if($("#delete-dialog").is(":visible")){
				$("#delete-dialog").fadeOut();
				this.blackScreenHide();
			}
			else{
				this.blackScreenShow();
				$("#delete-dialog").fadeIn();
				$("#del-msg").text("Are you sure you want to delete this page?");	
			}
		},
		cancelDelDialog :function(){
			$("#delete-page").attr("data-id","");
			this.showDeleteDialog();
		},
		blackScreenShow : function(){
			$("#black-screen").fadeIn();
		},
		blackScreenHide :function(){
			$("#black-screen").fadeOut();
		},
		showLoader :function(){
			$("#black-screen img").fadeIn();
		},
		hideLoader :function(){
			$("#black-screen img").fadeOut();
		},
		getFormData : function(){
			return {
		  		title 		: $("#create-page-title").val(),
				description : $("#create-page-description").val(),
				type 		: $("#selected-type-item").attr("data-tid"),
				isActive	: statusBtnFlag
			}
		},
		updateMicroPage : function(pageInfo){
			$("#title-"+pageInfo.id).text(pageInfo.title);
			$("#desc-"+pageInfo.id).text(pageInfo.description);
			$("#type-"+pageInfo.id).text(typeArray[pageInfo.type]).attr("data-tid",pageInfo.type);
			$("#status-"+pageInfo.id).text(pageInfo.isActive);
		},
		fillSelectedPage : function(pageInfo){
			$("#view-title").text(pageInfo.title);
			$("#view-desc").text(pageInfo.description);
			$("#view-type").text(typeArray[pageInfo.type]);
			$("#view-status").text(pageInfo.isActive);
			$("#view-published").text(pageInfo.published);
			$("#view-edit").attr("data-pid", pageInfo.id);
			$("#view-delete").attr("data-pid", pageInfo.id);
		},
		hidePagesCont : function(){
			$(".pages").addClass("none");
			interface.deselectedButton();
		},
		showPagesCont : function(){
			$(".pages").removeClass("none");
			interface.selectedButton();
		},
		showSelectedPage : function(){
			$(".view-selected-page").removeClass("none");
		},
		hideSelectedPage :function() {
			$(".view-selected-page").addClass("none");
		},
		selectedButton : function(){
			$("#btn-view-pages").addClass("nav-selected-button");
		},
		deselectedButton : function(){
			$("#btn-view-pages").removeClass("nav-selected-button");
		},
		showErrorDialog : function(){
			this.blackScreenShow();
			$(".error-dialog").fadeIn();
		},
		hideErrorDialog : function(){
			this.blackScreenHide();
			$(".error-dialog").fadeOut();
		},
		okErrorDialogBnt :function(){
			this.hideErrorDialog();
		}
	}
}();
 			
validation = function(){
	return{
		createPageValidation : function(){
			var pageVal = new Array();
			var title = $("#create-page-title");
			var desc = $("#create-page-description");
			pageVal.push(this.emptyField( title )) ;
			pageVal.push(this.emptyField( desc )) ;
			if( $("#selected-type-item").attr("data-tid").length > 0 ) {
				$(".head-drop-down").removeClass("red-border");
			}
			else{
				$(".head-drop-down").addClass("red-border");
				pageVal.push(0);
			}
			if(!this.limit(title, 50)){
				$("#title-limit").removeClass("none");
				title.addClass("red-border");
				pageVal.push(0);
			}
			else{
				$("#title-limit").addClass("none");
			}

			if(!this.limit(desc, 200)){
				$("#desc-limit").removeClass("none");
				desc.addClass("red-border");
				pageVal.push(0);
			}
			else{
				$("#desc-limit").addClass("none");
			}
			return this.checkArray(pageVal);
		},
		emptyField : function(element){
			if(element.val().length > 0){
				element.removeClass("red-border");
				return 1 ;
			}
			else{
				element.addClass("red-border");
				return 0;
			}
		},
		limit : function(element, limit){
			if(element.val().length > (limit+1) ){
				return 0;
			}
			return 1;
		},
		checkArray : function(array){
			for(var i = 0; i < array.length; i++){
				if(array[i] === 0){
					return 0;
				}
			}
			return 1;
		}
	}
}();

function pageHtml(obj){ 			
   return 	"<div class='left'>"+
	   			"<div id='pg-"+obj.id+"'class='left micro-page'>"+
					"<div onclick='postGet.getSelectedPage("+obj.id+")' class='view-page-msg hand'>"+
						"<p>View</p>"+
					"</div>"+
					"<div>"+
					 	"<p class='left'>Title:</p>"+
					 	"<div class='right info-padding-width' id='title-"+obj.id+"'>"+obj.title+"</div>"+
					"</div>"+
					"<div class='clear'></div>"+
					"<div>"+
					 	"<p class='left'>Description:</p>"+
					 	"<div class='right info-padding-width' id='desc-"+obj.id+"'>"+obj.description+"</div>"+
					"</div>"+
					"<div class='clear'></div>"+
					"<div>"+
					 	"<p class='left'>Type:</p>"+
					 	"<div class='right info-padding-width' id='type-"+obj.id+"' data-tid='"+obj.type+"'>" +typeArray[obj.type]+"</div>"+
					"</div>"+
					"<div class='clear'></div>"+
				 	"<div>"+
					 	"<p class='left'>Status:</p>"+
					 	"<div class='right info-padding-width' id='status-"+obj.id+"'>"+obj.isActive+"</div>"+
					"</div>"+
					"<div class='clear'></div>"+
					"<div>"+
						"<p class='left published'>PublishedOn:</p>"+
					 	"<div class='right info-padding-width' id='published-"+obj.id+"'>"+obj.publishedOn+"</div>"+
					"</div>"+
				"</div>" +
			 	"<div class='mod-buttons'>"+
					"<div data-pid='"+obj.id+"' class='left edit-page hand' onclick='interface.editPageBtn(this)'>Edit</div>"+
					"<div data-pid='"+obj.id+"' class='left delete-page hand' onclick='interface.deletePageBtn(this)'>Delete</div>"+
				"</div>"+
			"</div>"
}