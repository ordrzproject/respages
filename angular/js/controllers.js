var controllers = angular.module('respages.controllers', []);
controllers.controller('fullPageCtrl', function($scope, $filter, $routeParams, $location, respApiservice, showHideSearch, errorDialog,showHideLoaderBlScreen, deletePage, types, dataObj){
	showHideSearch.setSearchFlag(true);
	showHideLoaderBlScreen.show();
	var dataArray = dataObj.getData();
 	respApiservice.getPage($routeParams.id).then(function(response) {
		if(response.status === 200 && response.statusText === "OK"){
			showHideLoaderBlScreen.hide();
	 		$scope.data = response.data;
	 		$scope.data.type = types[$scope.data.type];
		$filter('filter')(dataArray, function(value, index) {
			if(value.id == $scope.data.id) {
				$scope.index = index;
				return index; 
			}
		});
		}
	} , function(data){
			showHideLoaderBlScreen.hide();
			errorDialog.show();
	})
 	if(dataArray.length === 0){
 		$scope.hidePreNextBtn = true;
 	}
 	else{
 		$scope.hidePreNextBtn = false;	
 	}
	$scope.goEditPage = function ( id ) {
	  	$location.path( "/edit-page/"+id );
	};

 	$scope.deletePage = function(id){
		deletePage.show(id);
	}
	$scope.prev = function(){ //filter
		$scope.index -= 1;
		if($scope.index < 0){
			$scope.index = 0;
		}
		$scope.fillData();
	}
	$scope.next = function(){
		$scope.index += 1;
		if($scope.index > dataArray.length-1){
			$scope.index = dataArray.length-1;
		}
		$scope.fillData();
	}
	$scope.fillData = function(){
		$scope.data = $filter('filter')(dataArray, function(value, index) {return index == ($scope.index);})[0];
	}
})
controllers.controller('pageViewCtrl', function($scope, $location, $filter, respApiservice, myService, searchData,showHideSearch, showHideLoaderBlScreen, deletePage, successDelete, dataObj){
	showHideLoaderBlScreen.show();
	respApiservice.getAllPages().then(function(response) {
		// alert(angular.toJson( response.data)+"  "+response.type);
		
		if(response.status === 200 && response.statusText === "OK"){
			// $scope.datas.type = typeArray[response.data.type];
			showHideLoaderBlScreen.hide();
	 		$scope.datas = response.data;
	 		dataObj.setData($scope.datas);
		}
	},function(data){
		showHideLoaderBlScreen.hide();
		errorDialog.show();
	})
	showHideSearch.setSearchFlag(false);
	$scope.$watch(function () { return searchData.getSearch(); }, function (newValue, oldValue) {
         if (newValue!=oldValue) $scope.query = newValue;
    });
	$scope.goFullPage = function ( id ) {
	  	$location.path( "pages/"+id );
	};
	$scope.goEditPage = function ( id  ) {
	  	$location.path( "/edit-page/"+id );
	};
	$scope.deletePage = function(id){
		deletePage.show(id);
		$scope.$watch(function(){return successDelete.getSuccessDel()},function(newVal,oldVal){
			if (newVal  !== oldVal && newVal === true){
			 	$scope.datas = $filter('filter')($scope.datas, function(value, index) {return value.id !== id;},true);
			}
		})
	}
})
controllers.controller('headerCtrl', function($scope, $location, searchData, showHideSearch,texts){
	$scope.appName = texts.appName;               
	$scope.userName = texts.userName;             
	$scope.viewPagesBtn = texts.viewPagesBtn;    
	$scope.createPageBtn = texts.createPageBtn;   
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
controllers.controller('editPageCtrl', function($scope, $routeParams, $location, respApiservice, myService, showHideSearch, showHideLoaderBlScreen, errorDialog, texts, types, SuccessAlert){
	$scope.buttonName = texts.update; 
	$scope.pageTitile = texts.editPage; 
	showHideSearch.setSearchFlag(true);
	showHideLoaderBlScreen.show();
	respApiservice.getPage($routeParams.id).then(function(response) {
		if(response.status === 200 && response.statusText === "OK"){
	 		// $scope.datas = response.data;
	 		$scope.id 			 = response.data.id;
	 		$scope.title 		 = response.data.title;
	 		$scope.desc 		 = response.data.description;
	 		$scope.type			 = types[response.data.type];
	 		$scope.publishedOn	 = response.data.publishedOn;
	 		$scope.checkboxModel =  response.data.isActive;
	 		showHideLoaderBlScreen.hide();
		}
	},function(data){
		showHideLoaderBlScreen.hide();
		errorDialog.show();
	});
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
	 	showHideLoaderBlScreen.show();
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
		 		showHideLoaderBlScreen.hide();
		 		SuccessAlert.show();
		 		$location.path( "/pages" );
			}
		},function(data){
			showHideLoaderBlScreen.hide();
			errorDialog.show();
		});
	}
})
controllers.controller("insertCtrl", function($scope, $location, respApiservice, myService, showHideSearch, showHideLoaderBlScreen, errorDialog, texts, SuccessAlert){
	var isDef = 0;
	$scope.type = texts.typeDropDown;
	$scope.buttonName = texts.submit;
	$scope.pageTitile = texts.createPage;
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
		showHideLoaderBlScreen.show();
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
	 		SuccessAlert.show();
	 		showHideLoaderBlScreen.hide();
	 		$location.path( "/pages" );
		}
		},function(data){
			showHideLoaderBlScreen.hide();
			errorDialog.show();
		})
	}
	$scope.dropdownStatus = function(){
		if( isNaN(parseInt($scope.typeId)) ){
			return true;
		}
		return false;
	}
})
controllers.controller("dialogCtrl", function($scope, showHideDialog, showHideBlScreen, dialogWindowMode, showHideDialogAndBlScreen, showHideDgLeftBtn, deleteRequest, texts){
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
     			$scope.msg = texts.requestError;
     			$scope.rightDgButton = texts.ok;
     			$scope.rightBtnClass = "center-button";
     		}
     		else if(newVal === 1){//delete dialog
     			$scope.leftDialogVsb = false;
     			$scope.leftDgButton = texts.deleteBnt;
				$scope.rightDgButton = texts.cancel;
				$scope.msg = texts.deleteQuest;
				$scope.rightBtnClass = "";
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
controllers.controller("alertController", function($scope,SuccessAlert, $timeout){	
	$scope.vAlert = true;
	$scope.$watch(function(){return SuccessAlert.getFlag();}, function(newVal,oldVal){
		if(newVal!=oldVal && newVal === false) {
			$scope.vAlert = newVal;
			$scope.alertClass = "fade in";
		 	$scope.hideAlert = function() {
		         $scope.alertClass = "fade out";
		    }
		    $timeout( function(){ $scope.hideAlert(); }, 3000);
		    $timeout( function(){ SuccessAlert.hide(); }, 3200);
		}
		else{
			$scope.vAlert = true;
		}
	})
})