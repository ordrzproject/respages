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
services.factory('types', function(){
	return  ["Menu","Events","Content"] ;
});
services.factory('texts',function(){
	return{
		requestError  : "Bad request! Try again.",
		deleteBnt	  : "Delete",
		editButton	  : "Edit",
		deleteQuest   : "Are you sure you want to delete this page?",
		cancel		  : "Cancel",
		ok 			  : "OK",
		typeDropDown  : "Select type",
		submit		  : "Submit",
		createPage	  : "Create Page",
		update		  : "Update",
		editPage	  : "Edit page",
		appName       : "Admin App",
		userName      : "Jimis",
		viewPagesBtn  : "View All Pages ",
		createPageBtn : "Create Page"
	}
})
services.factory('dataObj', function(){
	var data = [];
	return {
		setData : function(dt){
			data = dt;
		},
		getData : function(){
			return data;
		}
	}
});
services.factory('SuccessAlert',function(){
	var flag = true;
	return{
		show : function(){
			flag = false;
		},
		hide : function(){
			flag = true;
		},
		getFlag : function(){
			return flag;
		}
	}
})
services.factory('myService', ['types', function(types){
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
			scope.type = types[typeId];
			scope.typeDropDown.slideUp(perentId);
		},
		closeForm : function(location){
			location.path('/pages');	
		} 
	}
}]);
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
services.factory('showHideLoaderBlScreen',['showHideBlScreen','loader',function(showHideBlScreen,loader){
	return {
		show : function(){  
			showHideBlScreen.setBlScreenFlag(false);
			loader.setLoaderFlag(false);
		},
		hide : function(){
			showHideBlScreen.setBlScreenFlag(true);
			loader.setLoaderFlag(true);
		}
	}
}]);
services.factory('errorDialog',['dialogWindowMode','showHideDialogAndBlScreen',function(dialogWindowMode,showHideDialogAndBlScreen){
	return{
		show : function(){
			dialogWindowMode.setDgMode(0);
			showHideDialogAndBlScreen.show();
		}
	}
}]);
services.factory('successDelete',function(){
	var successDel = false;
	return {
		setSuccessDel : function(flg){
			successDel = flg;
		},
		getSuccessDel : function(){
			return successDel;
		},
	}
});
services.factory('deleteRequest', [ '$location','respApiservice','showHideDialogAndBlScreen','deleteId','dialogWindowMode','successDelete','SuccessAlert', 
	function( $location,respApiservice, showHideDialogAndBlScreen, deleteId, dialogWindowMode,successDelete,SuccessAlert){
	return {
		delete : function(){
			showHideDialogAndBlScreen.hide();
		 	$location.path( "/pages" );
			respApiservice.deletePage(deleteId.getDeleteId()).then(function(response) {
			if(response.status === 200 && response.statusText === "OK"){
		 		successDelete.setSuccessDel(true);
		 		SuccessAlert.show();
			} 
			},function(data){
				errorDialog.show();
			})
			successDelete.setSuccessDel(false);
		}
	}
}]);
services.factory('deletePage',['showHideDialog','showHideBlScreen', 'dialogWindowMode', 'deleteId', 'showHideDgLeftBtn', function(showHideDialog,showHideBlScreen, dialogWindowMode, deleteId, showHideDgLeftBtn){
	return{
		show : function(id){
			showHideDialog.setDialogFlag(false);
			showHideBlScreen.setBlScreenFlag(false)
			dialogWindowMode.setDgMode(1);
			deleteId.setDeleteId(id);
			showHideDgLeftBtn.setDgLeftBtn(false);
		}
	}
}]);