function ScreenshotCtrl($scope, $http, $location) {
  $scope.suites = null;
  $scope.dirs = null;
  $scope.path = null;
 
  $scope.init = function() {
	  
	  $scope.path = $location.path();
	  if (!$scope.path || $scope.path.length == 0)
		  $scope.path = '/';
	  
	  $scope.gotoDir('');
  };
  
  $scope.showItem = function(item) {
	  if (typeof(item.show) == 'undefined') return true;
	  return item.show;
  };
  
  $scope.toggleItem = function(item) {
	  item.show = !$scope.showItem(item);
  };
  
  $scope.hasFolders = function() {
	  return $scope.dirs && $scope.dirs.length > 0;
  };
  
  $scope.gotoDir = function(path) {
	  
	    $http.get('/screenshots?path=' + $scope.getPath(path))
	    .success(function(data, status, headers, config) {
	        $scope.suites = data.suites;
	        $scope.dirs = data.dirs;
	        $scope.path = data.path;
	    }).error(function(data, status, headers, config) {
	        $scope.suites = null;
	        alert('Exception has been occured: ' + status);
	    });
  };
  
  $scope.getPath = function(dirName) {
	  if ($scope.path && $scope.path.length > 0 && $scope.path[$scope.path.length - 1] != '/')
		  $scope.path += '/';
	  return $scope.path + dirName;
  };
};