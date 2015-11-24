var app = angular.module('respages', ['respages.services','respages.controllers','ngRoute'])
	.config(['$routeProvider', function($routeProvider) {  
	  	$routeProvider.
			when("/pages", {templateUrl: "views/page_view.html", controller: "pageViewCtrl"}).
			when("/pages/:id", {templateUrl: "views/view_full_page.html", controller: "fullPageCtrl"}).
			when("/create-page", {templateUrl: "views/insert_edit.html", controller: "insertCtrl"}).
			when("/edit-page/:id", {templateUrl: "views/insert_edit.html", controller: "editPageCtrl"}).
			otherwise({redirectTo: '/pages/'});
}]);