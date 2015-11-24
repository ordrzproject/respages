var services = angular.module('respages.services',[]);
services.factory('respApiservice', function($http){
	var resApi = {};
	resApi.getAllPages = function(){
		return $http({
			method: 'GET',
			url: 'http://pagesmanagement.azurewebsites.net/Api/ResponsivePages'
		});
	},
	resApi.getPage = function(id){
		return $http({
			method: 'GET',
			url: 'http://pagesmanagement.azurewebsites.net/Api/ResponsivePages/'+id,
		})
	},
	resApi.deletePage = function(id){
		return $http({
			method: 'DELETE',
			url: 'http://pagesmanagement.azurewebsites.net/Api/ResponsivePages/'+id,
		})
	},
	resApi.editPage = function(pageInfo){
		return $http({
			method: 'PUT',
			data:pageInfo,
			url: 'http://pagesmanagement.azurewebsites.net/Api/ResponsivePages/'+pageInfo.id
		});
	},
	resApi.createPage = function(pageInfo){
		return $http({
			method: 'POST',
			data:pageInfo,
			url: 'http://pagesmanagement.azurewebsites.net/Api/ResponsivePages'
		});
	}

	return resApi;
});
services.factory('myService', function(){
	// this.data = [];
	return{
		animate : function(scope, id){
			scope.typeDropDown = animation(id);
			if(scope.typeDropDown.isVisible() === 0){
				scope.typeDropDown.slideDown();
			}
			else{
				scope.typeDropDown.slideUp();
			} 
		},
		sType : function(scope,typeId, perentId){
			scope.typeId = typeId;
			scope.type = typeArray[typeId];
			scope.typeDropDown.slideUp(perentId);
		},
		closeForm : function(location){
			location.path('/pages');	
		} 
	}
});
services.factory('searchData', function(){

	var data = { search: '' };

    return {
        getSearch: function () {
            return data.search;
        },
        setSearch: function (search) {
            data.search = search;
        }
    };
});
services.factory('showHideSearch', function(){
	var searchFlag = false;
	return {
		setSearchFlag : function(flg){
			searchFlag = flg;
		},
		getSearchFlag : function(){
			return searchFlag;
		}
	}
});
services.factory('showHideDialog', function(){
	var dialogFlag = true;
	return {
		setDialogFlag : function(flg){
			dialogFlag = flg;
		},
		getDialogFlag : function(){
			return dialogFlag;
		}
	}
});
services.factory('showHideBlScreen', function(){
	var BlScreenFlag = true;
	return {
		setBlScreenFlag : function(flg){
			BlScreenFlag = flg;
		},
		getBlScreenFlag: function(){
			return BlScreenFlag;
		}
	}
});
services.factory('showHideDgLeftBtn', function(){
	var dgLeftBtn = true;
	return {
		setDgLeftBtn : function(flg){
			dgLeftBtn = flg;
		},
		getDgLeftBtn: function(){
			return dgLeftBtn;
		}
	}
})
;
services.factory('dialogWindowMode', function(){
	// 0->error dialog, 1->delete dialog
	var dgMode = 0;
	return {
		setDgMode : function(mode){
			dgMode = mode;
		},
		getDgMode: function(){
			return dgMode;
		}
	}
});
services.factory('showHideDialogAndBlScreen', ['showHideDialog','showHideBlScreen',function(showHideDialog, showHideBlScreen){
	return {
		hide : function(){
			showHideDialog.setDialogFlag(true);
			showHideBlScreen.setBlScreenFlag(true);
		},
		show : function(){
			showHideDialog.setDialogFlag(false);
			showHideBlScreen.setBlScreenFlag(false);
		}
	}
	
}]);
services.factory('deleteId',function(){
	var deleteId;
	return{
		setDeleteId : function(id){
			deleteId = id;
		},
		getDeleteId : function(){
			return deleteId;
		}
	}
});
services.factory('loader',function(){
	var loaderFlag = true;
	return {
		setLoaderFlag : function(flg){
			loaderFlag = flg;
		},
		getLoaderFlag : function(){
			return loaderFlag;
		}

	}
});
services.factory('deleteRequest', ['respApiservice','showHideDialogAndBlScreen','deleteId','dialogWindowMode', function(respApiservice, showHideDialogAndBlScreen, deleteId, dialogWindowMode){
	// var data = {response: 0, error : 0};
	// respApiservice.deletePage(deleteId.getDeleteId).then(function(response){
	return {
		delete : function(){
			showHideDialogAndBlScreen.hide();
			respApiservice.deletePage(deleteId.getDeleteId()).then(function(response) {

			if(response.status === 200 && response.statusText === "OK"){
		 		 alert("del - success");
			} 
			},function(data){
				dialogWindowMode.setDgMode(0);
				showHideDialogAndBlScreen.show();
			})
			

			// return data;
		}
	}
}]);









