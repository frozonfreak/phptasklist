var tasklistApp = angular.module('tasklistApp',['ui.date']);

//Routing
tasklistApp.config(function ($routeProvider) {
    $routeProvider
        .when('/',
            {
                controller: 'tasklistMain',
                templateUrl: 'partials/home.html'
            })
        .otherwise({ redirectTo: '/' });
});

//Handle all HTTP calls to server
tasklistApp.factory('tasklistSession', function($http){
    return {
        getTaskDetails: function() {
        	return $http.post('server/retrieveTasks.php');
        },
       	updateNewTask: function(name, detail, deadLine) {
        	return $http.post('server/updateTask.php',{
        		type		: 'newTask',
        		taskName	: name,
        		taskDetail 	: detail,
        		deadLine 	: deadLine
        	});
        },
        archiveTask: function(taskID){
        	return $http.post('server/updateTask.php',{
        		type	: 'archiveTask',
        		taskID  : taskID
        	});
        },
        deleteTask: function(taskID){
        	return $http.post('server/updateTask.php',{
        		type	: 'deleteTask',
        		taskID  : taskID
        	});
        },
    }
});
//controller
tasklistApp.controller('tasklistMain', function($scope, tasklistSession){

	$scope.taskList = [];
	$scope.task;
	$scope.taskDetail;
	$scope.deadLine;
	$scope.updateTasks = function(data, status, headers, config){
		$scope.taskList = [];
		if(data['status'] == 1){
			for(var i=0;i<data['data'].length;i++)
				$scope.taskList.push(data['data'][i]);
			console.log($scope.taskList);
		}
		else
			console.log(data['message']);
	};
	$scope.archiveSuccess= function(data, status, headers, config){
		if(data['status'] == 1){
			$scope.refreshTaskList();
		}
		else
			console.log(data);
	};
	$scope.deleteSuccess= function(data, status, headers, config){
		if(data['status'] == 1){
			$scope.refreshTaskList();
		}
		else
			console.log(data['message']);
	};
	$scope.refreshTaskList = function(){
		tasklistSession.getTaskDetails().success($scope.updateTasks).error($scope.displayError);
	};
	$scope.displayError = function(data, status, headers, config){
		console.log("Error");
	};
	$scope.addTaskToList = function(data, status, headers, config){
		console.log(data);
		$scope.refreshTaskList();
		$scope.task = $scope.taskDetail = $scope.deadLine='';
	};
	$scope.archiveTasks = function(taskID){
		tasklistSession.archiveTask(taskID).success($scope.archiveSuccess).error($scope.displayError);
	};
	$scope.deleteTask = function(taskID){
		tasklistSession.deleteTask(taskID).success($scope.deleteSuccess).error($scope.displayError);
	};
	$scope.updateTaskProgress = function(taskID, progressAmount){

	};
	init();
	function init(){
		//Populate data
		tasklistSession.getTaskDetails().success($scope.updateTasks).error($scope.displayError);
	};
	$scope.addTask = function(){
		if($scope.task){
			tasklistSession.updateNewTask($scope.task, $scope.taskDetail, $scope.deadLine).success($scope.addTaskToList).error($scope.displayError);
		}
	};
});