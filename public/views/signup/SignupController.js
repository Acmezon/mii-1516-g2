'use strict'

angular.module('acme_supermarket').registerCtrl('SignupCtrl', ['$scope', '$http', function ($scope, $http) {
	
	// Function invoked by login submit
	$scope.submitSignUp = function() {
		console.log($scope.customer);

		return false;
	}

}]);