angular.module('respages.controllers', []).
controller('fullPageCtrl', function($scope, $routeParams, respApiservice){
 	respApiservice.getPage($routeParams.id).success(function(response){
			$scope.data = response;
			// $scope.data.type = typeArray[$scope.data.type];
	});
}).
controller('delete-page-ctrl', function($scope, respApiservice){
	respApiservice.deletePage(520).success(function(response){
		alert(angular.toJson(response));
		// JSON.stringify(response);
	})
}).
controller('pageViewCtrl', function($scope, $location, respApiservice){


	respApiservice.getAllPages().success(function(response){
		// alert(response[0].id+" -- "+response[0].description);
		$scope.datas = response;

		// alert($scope.data)
	});
	$scope.go = function ( path ) {
	  $location.path( "pages/"+path );
	};
}).
controller('editPageCtrl', function($scope, respApiservice){
		 // edit work
	  respApiservice.editPage(obj).success(function(response){
	 		alert(response);
			alert(angular.toJson(response));
		});
}).
controller('create-page-ctrl', function($scope, respApiservice){
	// createPage work
	// respApiservice.createPage(obj).success(function(response){
	// 	alert(angular.toJson(response));
	// });
}).controller('headerCtrl', function($scope, $location){
	$scope.goToPages = function () {
		$location.path('/pages');
	}
	$scope.gotToCreatePage = function(){
		$location.path('/create-page');	
	};
	 
}).controller("insertEditCtrl", function($scope, $location){
	$scope.type = "Select type";
	$scope.typeDropDown = animation("dropdown-type");
	$scope.animate = function(){
		if($scope.typeDropDown.isVisible() === 0){
			$scope.typeDropDown.slideDown();
		}
		else{
			$scope.typeDropDown.slideUp();
		};
	}
	$scope.sType = function(typeId, perentId){
		$scope.typeId = typeId;
		$scope.type = typeArray[typeId];
		$scope.typeDropDown.slideUp(perentId);
	}
	$scope.formClick = function(){
		if($scope.typeDropDown.isVisible() === 1){
			$scope.typeDropDown.slideUp();
		}
	}
	$scope.closeForm = function(){
		$location.path('/pages');	
	}
	$scope.check = function(){
		$scope.checkboxModel.val;
	}
	
});



;


 	
		






			
 
