var interface;
var callBacks;
var postGet;
var validation;
function init(){
	postGet.getAllPages();
}

postGet = function(){
	return{
		deletePage : function(id){
			alert(id);
			$.ajax({
				type: "DELETE",
				contentType: "application/json",
				url: 'http://pagesmanagement.azurewebsites.net/Api/ResponsivePages/'+id,
				data: { },
				dataType: "json",
				complete: function (data) {
					alert(JSON.stringify(data));
		       		callBacks.deletePage(data);
	       		}
		   });
		},
		getAllPages : function(){
			// pagesmanagement.azurewebsites.net/Api/ResponsivePages/id
			interface.whiteScreenShow();
			$.ajax({
					type: "GET",
					contentType: "application/json",
					url: 'http://pagesmanagement.azurewebsites.net/Api/ResponsivePages',
					data: { },
					dataType: "json",
					complete: function (data) {
						interface.whiteScreenShow();
			       		callBacks.getAllPagesCB(data);
		       		}
			});
		},
		getSelectedPage : function(id){
			$.ajax({
				type: "GET",
				contentType: "application/json",
				url: 'http://pagesmanagement.azurewebsites.net/Api/ResponsivePages/'+id,
				data: { },
				dataType: "json",
				complete: function (data) {
					alert(JSON.stringify(data));
		       		callBacks.getSelectedPageCB(data);
	       		}
		   });
		},
		createPage : function(pageInfo){
			// alert("test");
			if(validation.createPageValidation()){
				$.post('http://pagesmanagement.azurewebsites.net/Api/ResponsivePages',
					{ "id" : 333,
						"title": pageInfo.title, 
						"description": pageInfo.description,
						"type": pageInfo.type,
						"isActive" : pageInfo.isActive,
						"publishedOn" : "2015-11-18T10:25:00.5772396+00:00" 
					},
					function (data) {
						callBacks.createPageCB(data);
		       		}
			   ,"json");
			}
		}
	}
}();

callBacks = function(){
	return{
		deletePage : function(data){
			var json = $.parseJSON(JSON.stringify(data));
			var responseJSON;
			interface.showDeleteDialog();
			if(this.checkResponse(json) === 1 ){
				postGet.getAllPages();
			}
		},
		createPageCB : function(data){
			interface.closeCreatePage(); 
			postGet.getAllPages();
			alert(JSON.stringify(data));
			var json = $.parseJSON(data);
			var responseJSON;
		},
		getAllPagesCB : function(data){
			var json = $.parseJSON(JSON.stringify(data));
			var responseJSON;
			if(this.checkResponse(json) === 1 ){
				// responseJSON = json.responseJSON;
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
			var responseJSON;
			if(this.checkResponse(json) === 1 ){
				alert("json-- selected page cb");
				responseJSON = json.responseJSON;
			}
		},
		checkResponse : function(json){
			if(json.status === 200 && json.statusText === "OK"){
				return 1;
			}
			else{
				alert("error");
				return 0;
			}
		}
	}
}();

interface = function(){
	return{
		createPage : function(){
			if(!$(".create-page").is(":visible") ){
				$(".create-page").fadeIn();
				this.resetFields();
			}
			// return;
		},
		closeCreatePage : function(){
			if($(".create-page").is(":visible") ){
				$(".create-page").fadeOut();
				// this.resetFields();
			}
			
		},
		resetFields : function(){
			$("#create-page-form input[type=text], textarea").val("").removeClass("red-border") ;
			$("#selected-type-item").text("Selecte page type").attr("data-tid","").parent().removeClass("red-border");
			$("#circle-btn").attr("style","");
			$(".on-button").attr("style","");
			$(".off-button").attr("style","");

			statusBtnFlag = false;

		},
		submitCreatePage : function(){

		},
		showTypeList : function(){
			if($(".drop-down-type").is(":visible"))
				$(".drop-down-type").toggle(400);
			else
				$(".drop-down-type").fadeIn();
		},
		selectTypeList : function(element){
			// alert(this.text());
			$("#selected-type-item").text(element.text());
			$("#selected-type-item").attr("data-tid",element.attr("data-val"));
			this.showTypeList();
		},
		deletePageBtn : function(e){
			// alert($(e).attr("data-pid"));
			$("#delete-page").attr("data-id","");
			$("#delete-page").attr("data-id", $(e).attr("data-pid"));
			this.showDeleteDialog();
		},
		editPageBtn : function(e){
			alert($(e).attr("data-pid"));

			
		},
		showDeleteDialog : function(){
			if($("#delete-dialog").is(":visible")){
				$("#delete-dialog").fadeOut();
			}
			else{
				$("#delete-dialog").fadeIn();
				$(".del-msg").text("Are you sure you want to delete the page?");	
			}
		},
		cancelDelDialog :function(){
			$("#delete-page").attr("data-id","");
			this.showDeleteDialog();
		},
		whiteScreenShow : function(){
			if($("#white-screen").is(":visible")){
				$("#white-screen").fadeOut();
			}
			else{
				$("#white-screen").fadeIn(1);
			}
		}

	}
}();
 			
validation = function(){
	return{
		createPageValidation : function(){
			var pageVal = new Array();
			pageVal.push(this.emptyField($("#create-page-title"))) ;
			pageVal.push(this.emptyField($("#create-page-description"))) ;
			if( $("#selected-type-item").attr("data-tid").length > 0 ) {
				$(".head-drop-down").removeClass("red-border");
				pageVal.push(1);
			}
			else{
				$(".head-drop-down").addClass("red-border");
				pageVal.push(0);
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
	   			"<div class='left micro-page'>"+
					"<div class='view-page-msg hand'>"+
						"<p>View</p>"+
					"</div>"+
					"<div>"+
					 	"<p class='left'>Title</p>"+
					 	"<div class='right info-padding-width'>"+obj.title+"</div>"+
					"</div>"+
					"<div class='clear'></div>"+
					"<div>"+
					 	"<p class='left'>Desc</p>"+
					 	"<div class='right info-padding-width'>"+obj.description+"</div>"+
					"</div>"+
					"<div class='clear'></div>"+
					"<div>"+
					 	"<p class='left'>Type</p>"+
					 	"<div class='right info-padding-width'>"+obj.type+"</div>"+
					"</div>"+
					"<div class='clear'></div>"+
				 	"<div>"+
					 	"<p class='left'>Status</p>"+
					 	"<div class='right info-padding-width'>"+obj.isActive+"</div>"+
					"</div>"+
					"<div class='clear'></div>"+
					"<div>"+
						"<p class='left published'>PublishedOn</p>"+
					 	"<div class='right info-padding-width'>"+obj.publishedOn+"</div>"+
					"</div>"+
				"</div>" +
			 	"<div class='mod-buttons'>"+
					"<div data-pid='"+obj.id+"' class='left edit-page hand' onclick=interface.editPageBtn(this)>Edit</div>"+
					"<div data-pid='"+obj.id+"' class='left delete-page hand' onclick='interface.deletePageBtn(this)'>Delete</div>"+
				"</div>"+
			"</div>"
}









