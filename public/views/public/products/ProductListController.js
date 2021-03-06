'use strict'

angular.module('acme_supermarket').registerCtrl('ProductListCtrl', ['$scope', '$http', 'ngToast', '$translate', '$window', '$location', '$rootScope', function ($scope, $http, ngToast, $translate, $window, $location, $rootScope) {

	// DEFAULT VALUES
	// Orderings
	$scope.inverseOrder = false;
	$scope.sortProductsBy = 'name';
	// Filters
	$scope.priceFilterMode = 0;
	$scope.ratingFilterMode = 0;
	$scope.categoryFilterMode = -1;
	$scope.textSearch = null;
	// Pagination
	$scope.currentPage = 0;
	$scope.pageSize = '9';
	// Inject Math
	$scope.Math = window.Math;
	// View (anonymous'products' or supplier'myproducts')
	$scope.view = $location.path().split("/")[1];

	// INIT

	$http.get('/api/categories')
		.then( function success (response) {
			$scope.categories = response.data;
	});

	var destroyEvent = $rootScope.$on('textSearch', function(event, args) {
		$scope.search(args);
	});

	$scope.$on('$destroy', function() {
		destroyEvent(); // remove listener.
	});

	// Refresh the page (order, filter and pagination)
	$scope.refreshPage = function(callback) {

		if ($scope.view=='myproducts') {

			$http.post('/api/products/myproducts/filtered',
			{
				sort : $scope.sortProductsBy,
				order : $scope.inverseOrder ? -1 : 1,
				currentPage : $scope.currentPage,
				pageSize : $scope.pageSize,
				categoryFilter : $scope.categoryFilterMode,
				priceFilter : translatePriceFilter($scope.priceFilterMode),
				ratingFilter : $scope.ratingFilterMode,
				textSearch : $scope.textSearch
			}
			).then(function success(response2) {
				callback(response2.data);
				return;
			});

		} else {

			$http.post('/api/products/filtered',
				{
					sort : $scope.sortProductsBy,
					order : $scope.inverseOrder ? -1 : 1,
					currentPage : $scope.currentPage,
					pageSize : $scope.pageSize,
					categoryFilter : $scope.categoryFilterMode,
					priceFilter : translatePriceFilter($scope.priceFilterMode),
					ratingFilter : $scope.ratingFilterMode,
					textSearch : $scope.textSearch
				}
			).then(function success(response) {
				callback(response.data);
				return;
			});
	
		}
	};

	// Refresh the pages
	$scope.refreshCount = function(callback) {

		if ($scope.view=='myproducts') {
			$http.post('/api/products/myproducts/filtered/count',
			{
				categoryFilter : $scope.categoryFilterMode,
				priceFilter : translatePriceFilter($scope.priceFilterMode),
				ratingFilter : $scope.ratingFilterMode,
				textSearch : $scope.textSearch
			}
			).then(function success(response2) {
				callback(response2.data);
				return;
			});
		} else {

			$http.post('/api/products/filtered/count', 
			{
				categoryFilter : $scope.categoryFilterMode,
				priceFilter : translatePriceFilter($scope.priceFilterMode),
				ratingFilter : $scope.ratingFilterMode,
				textSearch : $scope.textSearch
			}
			).then(function success(response) {
				callback(response.data);
				return;
			});

		}

		
	};

	$scope.refresh = function () {
		$scope.refreshCount(function (number) {
			$scope.numberOfProducts = number;
			if ($scope.currentPage > Math.ceil($scope.numberOfProducts/parseInt($scope.pageSize))) {
				$scope.currentPage = 0;
				$scope.reload();
			}
		});
	};

	$scope.reload = function() {
		$scope.refreshPage(function (products) {
			$scope.products = products;
			$scope.refresh();
		});
	};

	$scope.search = function (text) {
		if ($scope.view=='products' || $scope.view=='myproducts') {
			$scope.textSearch = text;
			$scope.reload();
		}
	}

	// Auxiliar function: priceCode to maxPrice in filter
	var translatePriceFilter = function(code) {
		var res = '';
		code = parseInt(code)
		if (code>=0 && code<=9) {
			switch(code) {
				case 0:
					break;
				case 1:
					res = 1;
					break;
				case 2:
					res = 5;
					break;
				case 3:
					res = 10;
					break;
				case 4:
					res = 20;	
					break;
				case 5:
					res = 50;
					break;
				case 6:
					res = 100;
					break;
				case 7:
					res = 200;
					break;
				case 8:
					res = 500;
					break;
				case 9:
					break;
				default:
					break;
			}
		}
		return res;
	};

	$scope.reload();


	// FUNCTIONS

	// Delete product
	$scope.deleteProduct = function (product_id) {
		$http.delete('api/products/' + product_id)
		.then(function success(response) {
			$scope.reload();
		}, function error(response) {
			$translate(['Product.DeleteError']).then(function (translation) {
				ngToast.create({
					className: 'danger',
					content: translation['Product.DeleteError']
				});
			});
		});
	};

	// Supplier deletes a provide
	$scope.deleteProvide = function (product_id){
		$http({
			method: 'DELETE',
			url: '/api/provide/bysupplier/byproduct/' + product_id
		}).
		then(function success(response) {
			for (var i = 0; i < $scope.products.length; i++) {
				if ($scope.products[i]._id == product_id) {
					$scope.products.splice(i, 1);
				}
			}
		}, function error (response) {
			$translate(['Product.DeleteError']).then(function (translation) {
				ngToast.create({
					className: 'danger',
					content: translation['Product.DeleteError']
				});
			});
		});		
	}

	// Clear filters
	$scope.clearFilters = function(){
		$scope.priceFilterMode = 0;
		$scope.ratingFilterMode = 0;
		$scope.categoryFilterMode = -1;
		$scope.textSearch = null;
		$scope.reload();
	};

	// Change Category filter
	$scope.categoryFilter = function(mode) {
		$scope.categoryFilterMode = mode;
		$scope.reload();
	};

	// Change Price filter
	$scope.priceFilter = function(mode) {
		$scope.priceFilterMode = mode;
		$scope.reload();
	};

	// Change Rating filter
	$scope.ratingFilter = function(mode) {
		$scope.ratingFilterMode = mode;
		$scope.reload();
	};

	// Invert order button
	$scope.invertOrder = function() {
		$scope.inverseOrder = !$scope.inverseOrder;
		if ($scope.inverseOrder) {
			// Method to make image rotate
			$('.v-middle').css({
				'-webkit-transform': 'rotate(' + 180 + 'deg)',  //Safari 3.1+, Chrome  
				'-moz-transform': 'rotate(' + 180 + 'deg)',     //Firefox 3.5-15  
				'-ms-transform': 'rotate(' + 180 + 'deg)',      //IE9+  
				'-o-transform': 'rotate(' + 180 + 'deg)',       //Opera 10.5-12.00  
				'transform': 'rotate(' + 180 + 'deg)'          //Firefox 16+, Opera 12.50+  

			});
		} else {
			$('.v-middle').css({
				'-webkit-transform': 'rotate(' + 0 + 'deg)',  //Safari 3.1+, Chrome  
				'-moz-transform': 'rotate(' + 0 + 'deg)',     //Firefox 3.5-15  
				'-ms-transform': 'rotate(' + 0 + 'deg)',      //IE9+  
				'-o-transform': 'rotate(' + 0 + 'deg)',       //Opera 10.5-12.00  
				'transform': 'rotate(' + 0 + 'deg)'          //Firefox 16+, Opera 12.50+  

			});
		}

		$scope.reload();
	};

	$http({
		method: 'GET',
		url: '/api/getUserRole'
	}).
	then(function success(response) {
		$scope.role = response.data;

	}, function error(response) {
		$scope.role = "anonymous";
	});

	$http.get('/api/myRecommendations').then(function success(products) {
		$http.post('/api/product/getByIdList', { products : products}).then(
			function success(product_list) {
				$scope.recommendedProducts = product_list.data;
			}, function error(response){});
	}, function error(response) {});

}]);