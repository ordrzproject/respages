var controllers = angular.module('respages.controllers', []);

controllers.controller('fullPageCtrl', function($scope, $routeParams, $location, respApiservice, showHideSearch){

	showHideSearch.setSearchFlag(true);
 	respApiservice.getPage($routeParams.id).then(function(response) {
		$scope.goEditPage = function ( id ) {
		  	$location.path( "/edit-page/"+id );
		};
		if(response.status === 200 && response.statusText === "OK"){
	 		$scope.data = response.data;
		}
		else{
			alert("error");
		}
	} )

})
controllers.controller('pageViewCtrl', function($scope, $location, respApiservice, myService, searchData,showHideSearch, showHideDialog, showHideBlScreen, dialogWindowMode, deleteId, showHideDgLeftBtn){
	respApiservice.getAllPages().then(function(response) {
		// alert(angular.toJson( response.data)+"  "+response.type);
		if(response.status === 200 && response.statusText === "OK"){
			// $scope.datas.type = typeArray[response.data.type];
	 		$scope.datas = response.data;
		}
		else{
			alert("error");
		}
	})
	showHideSearch.setSearchFlag(false);
	$scope.$watch(function () { return searchData.getSearch(); }, function (newValue, oldValue) {
		// alert("new: "+newValue);
		// if (newValue!=oldValue)
		// alert(newValue+"  ---  "+oldValue);
         if (newValue!=oldValue) $scope.query = newValue;
    });
	$scope.goFullPage = function ( id ) {
		
	  	$location.path( "pages/"+id );
	};
	$scope.goEditPage = function ( id ) {
	  	$location.path( "/edit-page/"+id );
	};
	$scope.deletePage = function(id){
		showHideDialog.setDialogFlag(false);
		showHideBlScreen.setBlScreenFlag(false)
		dialogWindowMode.setDgMode(1);
		deleteId.setDeleteId(id);
		showHideDgLeftBtn.setDgLeftBtn(false);
	}

})
controllers.controller('headerCtrl', function($scope, $location, searchData, showHideSearch){
	// $scope.query = "";
	$scope.$watch( function(){ return showHideSearch.getSearchFlag()}, function(newVal,oldVal){ 
	  	if (newVal!=oldVal) $scope.searchCont = newVal;
	})

	$scope.$watch('query', function (newValue, oldValue) {
		 if (newValue!=oldValue) searchData.setSearch(newValue);
	});

	$scope.goToPages = function () {
		$location.path('/pages');
	}
	$scope.gotToCreatePage = function(){
		$location.path('/create-page');	
	};
	 
})
controllers.controller('editPageCtrl', function($scope, $routeParams, $location, respApiservice, myService, showHideSearch){
	$scope.buttonName = "Update";
	$scope.pageTitile = "Edit Page";
	showHideSearch.setSearchFlag(true);
	respApiservice.getPage($routeParams.id).then(function(response) {

		if(response.status === 200 && response.statusText === "OK"){
	 		// $scope.datas = response.data;
	 		$scope.id 			 = response.data.id;
	 		$scope.title 		 = response.data.title;
	 		$scope.desc 		 = response.data.description;
	 		$scope.type			 = typeArray[response.data.type];
	 		$scope.publishedOn	 = response.data.publishedOn;
	 		$scope.checkboxModel =  response.data.isActive;
		}
		else{
			alert("error");
		}
	} )

	// $scope.update = function(){
	// 	// alert($scope.desc +" -- "+ $scope.title);
	// }
	$scope.animate = function(){
		myService.animate($scope,"dropdown-type");
	}
	$scope.sType = function(typeId, perentId){
	  	myService.sType($scope,typeId, perentId);
	}
	$scope.closeForm = function(){
		myService.closeForm($location);
	}
	$scope.getData = function(){
	 // alert($scope.editCreateForm.$invalid);


	respApiservice.editPage({
		id 			: $routeParams.id,
		description : $scope.desc,
		title 		: $scope.title,
		type 		: $scope.typeId,
		isActive 	: $scope.checkboxModel,
		publishedOn : "2015-11-18T10:25:00.5772396+00:00"
	})
	.then(function(response) {
		if(response.status === 200 && response.statusText === "OK"){
	 		// $scope.datas = response.data;
	 		alert("success");
		}
		else{
			alert("error");
		}
	} );




	 // edit work
//  	respApiservice.editPage(obj).success(function(response){
// 		alert(response);
// 	alert(angular.toJson(response));
	// });
	}
})
controllers.controller("insertCtrl", function($scope, $location, respApiservice, myService, showHideSearch ){
	var isDef = 0;
	$scope.type = "Select type";
	$scope.buttonName = "Submit";
	$scope.pageTitile = "Create Page";
	$scope.checkboxModel = false;
	showHideSearch.setSearchFlag(true);
	$scope.animate = function(){
		myService.animate($scope, "dropdown-type");
		isDef = 1;
	}

	$scope.sType = function(typeId, perentId){
	  	myService.sType($scope,typeId, perentId);
	}

	$scope.formClick = function(){
		if( isDef !== 0 && $scope.typeDropDown.isVisible() === 1 ){
			$scope.typeDropDown.slideUp();
		}
	}
	$scope.closeForm = function(){
		myService.closeForm($location);
	}
	$scope.getData = function(){
		 // alert($scope.editCreateForm.$invalid);
		respApiservice.createPage({
			id 			: 5,
			description : $scope.desc,
			title 		: $scope.title,
			type 		: $scope.typeId,
			isActive 	: $scope.checkboxModel,
			publishedOn : "2015-11-18T10:25:00.5772396+00:00"
		})
		.then(function(response) {
		if(response.status === 201 && response.statusText === "Created"){
	 		// $scope.datas = response.data;
	 		alert("success");
		}
		else{
			alert("error");
		}
	})




		// alert($scope.desc +" -- "+ $scope.title+"  "+$scope.checkboxModel+" -id:  "+$scope.typeId);
	}
	$scope.dropdownStatus = function(){
		if( isNaN(parseInt($scope.typeId)) ){
			return true;
		}
		return false;
	}
	
})
controllers.controller("dialogCtrl", function($scope, showHideDialog, showHideBlScreen, dialogWindowMode, showHideDialogAndBlScreen, showHideDgLeftBtn, deleteRequest){
	
	
	// $scope.leftDialogVsb = false;
	// $scope.rightDialogVsb = false;
	$scope.dialogVisibility = true;
	$scope.$watch(function(){return showHideDialog.getDialogFlag();}, function(newVal, oldVal){
     	if (newVal!=oldVal) $scope.dialogVisibility = newVal;
	})

	$scope.$watch(function(){return showHideDgLeftBtn.getDgLeftBtn();}, function(newVal, oldVal){
     	if (newVal!=oldVal) $scope.leftDialogVsb = newVal;
	})
	$scope.$watch(function(){return dialogWindowMode.getDgMode();}, function(newVal, oldVal){
     	if (newVal!=oldVal) {
     		if(newVal === 0){//error dialog
     			// $scope.dialogVisibility = newVal;
     			$scope.leftDialogVsb = true;
     			$scope.msg = "Bad request! Try again.";
     			$scope.rightDgButton = "Ok";
     		}
     		else if(newVal === 1){//delete dialog
     			$scope.leftDialogVsb = false;
     			$scope.leftDgButton = "Delete";
				$scope.rightDgButton = "Cancel";
				$scope.msg = "Are you sure you want to delete this page?";
				showHideDialogAndBlScreen.show();
     		}
     	}
	})
	$scope.rightBtnClick = function (){
		showHideDialogAndBlScreen.hide();
	}
	$scope.leftBtnClick = function (){
		if(dialogWindowMode.getDgMode() === 1){
			deleteRequest.delete();
		}
	}
})
controllers.controller("blackScreen", function($scope, showHideBlScreen){
	$scope.bScreen = true;
	$scope.$watch(function(){ return showHideBlScreen.getBlScreenFlag(); }, function(newVal, oldVal){  
		if(newVal!=oldVal) $scope.bScreen = newVal;
	});

})
controllers.controller("loadingCtrl", function($scope, loader){
	$scope.loading = true;
	$scope.$watch(function(){return loader.getLoaderFlag();},function(newVal, oldVal){  
		if(newVal!=oldVal) $scope.loading = newVal;
	});
});
