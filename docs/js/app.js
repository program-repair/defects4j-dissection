angular.module('defects4j-website', ['ui.bootstrap', 'anguFixedHeaderTable'])
	.controller('mainController', function($scope, $http) {
		$scope.sortType     = 'name'; // set the default sort type
		$scope.sortReverse  = false;  // set the default sort order
		$scope.filter   = {};

		// create the list of sushi rolls 
		$scope.bugs = [];
		$scope.classifications = [];

		$http.get("data/bugs.json").then(function (response) {
			$scope.bugs = response.data;

			var element = angular.element(document.querySelector('#menu')); 
			var height = element[0].offsetHeight;

			angular.element(document.querySelector('#mainTable')).css('height', (height-160)+'px');
		});

		$http.get("data/classification.json").then(function (response) {
			$scope.classifications = response.data;
		});

		$scope.countBugs = function (key) {
			var count = 0;
			for(var i = 0; i < $scope.bugs.length; i++) {
				if ($scope.bugs[i][key] === true) {
					count++;
				}
			}
			return count;
		};

		$scope.bugsFilter = function (value, index, array) {
			var allFalse = true;
			for (var i in $scope.filter) {
				if ($scope.filter[i] === true) {
					allFalse = false;
					break;
				}
			}
			if (allFalse) {
				return true;
			}
			for (var i in $scope.filter) {
				if ($scope.filter[i] === true && value[i] === true) {
					return true;
				}
			}
			return false;
		};
	});