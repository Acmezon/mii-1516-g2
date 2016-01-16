'use strict';

/* Filters */

var filters = angular.module('acme_supermarket.filters', []);

filters.filter('interpolate', function (version) {
	return function (text) {
		return String(text).replace(/\%VERSION\%/mg, version);
	};
});

filters.filter("htmlSafe", ['$sce', function($sce) {
	return function(htmlCode){
		return $sce.trustAsHtml(htmlCode);
	};
}]);

filters.filter('startFrom', function() {
    return function(input, start) {
    	if (input) {
    		start = +start; //parse to int
        	return input.slice(start);
    	}
    }
});