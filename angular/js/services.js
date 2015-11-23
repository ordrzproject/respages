angular.module('respages.services',[]).
factory('respApiservice', function($http){
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
})