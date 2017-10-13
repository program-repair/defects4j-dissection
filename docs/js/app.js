angular.module('defects4j-website', ['ui.bootstrap', 'anguFixedHeaderTable'])
	.directive('keypressEvents', [
		'$document',
		'$rootScope',
		function($document, $rootScope) {
			return {
				restrict: 'A',
				link: function() {
					$document.bind('keydown', function(e) {
						$rootScope.$broadcast('keypress', e);
						$rootScope.$broadcast('keypress:' + e.which, e);
					});
				}
			};
		}
	]).directive('diff', ['$http', function ($http) {
		return {
			restrict: 'A',
			link: function (scope, elem, attrs) {
				scope.$watch("$ctrl.bug.diff", function () {
					var diff2htmlUi = new Diff2HtmlUI({ diff: scope["$ctrl"].bug.diff });
					diff2htmlUi.draw($(elem), {inputFormat: 'java', showFiles: false, matching: 'lines'});
					diff2htmlUi.highlightCode($(elem));
				});
			}
		}
	  }])
	.controller('bugController', function($rootScope, $uibModalInstance, bugs, index, classifications) {
		var $ctrl = this;
		$ctrl.index = index;
		$ctrl.bug = bugs[index];
		$ctrl.classifications = classifications;

		$ctrl.patternName = function (key) {
			for(var i in $ctrl.classifications['Repair Patterns']) {
				if ($ctrl.classifications['Repair Patterns'][i][key] != null) {
					if ($ctrl.classifications['Repair Patterns'][i][key].fullname) {
						return $ctrl.classifications['Repair Patterns'][i][key].fullname;
					}
					return $ctrl.classifications['Repair Patterns'][i][key].name;
				}
			}
			return null;
		};
		$ctrl.repairName = function (key) {
			var repairNames = $ctrl.classifications['Runtime Information']["Automatic Repair"];
			if (repairNames[key] != null) {
				if (repairNames[key].fullname) {
					return repairNames[key].fullname;
				}
				return repairNames[key].name;
			}
			return null;
		};
		$rootScope.$on('keypress:39', function(onEvent, keypressEvent) {
			$rootScope.$apply(function () {
				$ctrl.next();
			});
		});
		$rootScope.$on('keypress:37', function(onEvent, keypressEvent) {
			$rootScope.$apply(function () {
				$ctrl.previous();
			});
		});
		$ctrl.next = function () {
			$ctrl.index++;
			if ($ctrl.index == bugs.length)  {
				$ctrl.index = 0;
			}
			$ctrl.bug = bugs[$ctrl.index];
			return false;
		};
		$ctrl.previous = function () {
			$ctrl.index--;
			if ($ctrl.index < 0) {
				$ctrl.index = bugs.length -1;
			}
			$ctrl.bug = bugs[$ctrl.index];
			return false;
		};
		$ctrl.ok = function () {
			$uibModalInstance.close();
		};
	})
	.controller('mainController', function($scope,$rootScope, $http, $uibModal) {
		$scope.sortType     = ['project', 'bugId']; // set the default sort type
		$scope.sortReverse  = false;
		$scope.match  = "all";
		$scope.filter   = {};

		// create the list of sushi rolls 
		$scope.bugs = [];
		$scope.classifications = [];

		$http.get("data/classification.json").then(function (response) {
			$scope.classifications = response.data;
		});

		$http.get("data/defects4j-bugs.json").then(function (response) {
			$scope.bugs = response.data;

			var exceptions = {};
			$scope.classifications["Runtime Information"]["Exceptions"] = exceptions;

			for (var i = 0; i < $scope.bugs.length; i++) {
				for (var j = 0; j < $scope.bugs[i].failingTests.length; j++) {
					var exception = $scope.bugs[i].failingTests[j].error.substring($scope.bugs[i].failingTests[j].error.lastIndexOf(".") + 1)
					if (exceptions[exception] == null) {
						exceptions[exception] = {
							"name": exception,
							"fullname": exception
						}
					}
					$scope.bugs[i][exception] = true;
				}
			}

			var element = angular.element(document.querySelector('#menu')); 
			var height = element[0].offsetHeight;

			angular.element(document.querySelector('#mainTable')).css('height', (height-160)+'px');
		});

		$scope.filterName = function (filterKey) {
			for (var j in $scope.classifications) {
				for(var i in $scope.classifications[j]) {
					if ($scope.classifications[j][i][filterKey] != null) {
						if ($scope.classifications[j][i][filterKey].fullname) {
							return $scope.classifications[j][i][filterKey].fullname;
						}
						return $scope.classifications[j][i][filterKey].name;
					}
				}
			}
			return filterKey;
		}

		$scope.openWelcome = function () {
			var modalInstance = $uibModal.open({
				animation: true,
				ariaLabelledBy: 'modal-title',
				ariaDescribedBy: 'modal-body',
				templateUrl: 'welcome.html',
				controller: 'bugController',
				controllerAs: '$ctrl',
				size: "lg",
				resolve: {
					bugs: {},
					index: {},
					classifications: {}
				}
			});
		};
		$scope.openWelcome();


		$scope.openBug = function (bug) {
			var modalInstance = $uibModal.open({
				animation: true,
				ariaLabelledBy: 'modal-title',
				ariaDescribedBy: 'modal-body',
				templateUrl: 'modelBug.html',
				controller: 'bugController',
				controllerAs: '$ctrl',
				size: "lg",
				resolve: {
					bugs: function () {return $scope.filteredBug;},
					index: $scope.filteredBug.indexOf(bug),
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