angular.module('defects4j-website', ['ui.bootstrap', 'anguFixedHeaderTable'])
	.controller('bugController', function($uibModalInstance, bug, classifications) {
		var $ctrl = this;
		$ctrl.bug = bug
		$ctrl.classifications = classifications;

		$ctrl.patternName = function (key) {
			for(var i in $ctrl.classifications['Repair Patterns']) {
				if ($ctrl.classifications['Repair Patterns'][i][key] != null) {
					return $ctrl.classifications['Repair Patterns'][i][key].name;
				}
			}
			return null;
		};

		$ctrl.ok = function () {
			$uibModalInstance.close();
		};
	})
	.controller('mainController', function($scope, $http, $uibModal) {
		$scope.sortType     = ['project', 'bugId']; // set the default sort type
		$scope.sortReverse  = false;
		$scope.match  = "any";
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

		$scope.openBug = function (bug) {
			var modalInstance = $uibModal.open({
				animation: true,
				ariaLabelledBy: 'modal-title',
				ariaDescribedBy: 'modal-body',
				templateUrl: 'modelBug.html',
				controller: 'bugController',
				controllerAs: '$ctrl',
				size: "800px",
				resolve: {
					bug: bug,
					classifications: $scope.classifications
				}
			});
		};

		$scope.sort = function (sort) {
			if (sort == $scope.sortType || (sort[0] == 'project' && $scope.sortType[0] == 'project')) {
				$scope.sortReverse = !$scope.sortReverse; 
			} else {
				$scope.sortType = sort;
				$scope.sortReverse = false; 
			}
			return false;
		}

		$scope.countBugs = function (key, filter) {
			if (filter.count) {
				return filter.count;
			}
			var count = 0;
			for(var i = 0; i < $scope.bugs.length; i++) {
				if ($scope.bugs[i][key] === true) {
					count++;
				}
			}
			filter.count = count;
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
				if ($scope.filter[i] === true) {
					if (value[i] === true) {
						if ($scope.match=="any") {
							return true;
						}
					} else if ($scope.match=="all"){
						return false;
					}
				}
			}
			if ($scope.match=="any") {
				return false;
			} else {
				return true;
			}
		};
	});