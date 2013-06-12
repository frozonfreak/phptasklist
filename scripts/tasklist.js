var tasklistApp = angular.module('tasklistApp',['ui.date','ui.bootstrap','ui.keypress']);

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
        updateTaskProgress: function(taskID, progressValue){
        	return $http.post('server/updateTask.php',{
        		type	: 'updateProgress',
        		taskID  : taskID,
        		progress: progressValue
        	});
        }
    }
});
//controller
tasklistApp.controller('tasklistMain', function($scope, tasklistSession){

	$scope.taskList = [];
	$scope.task;
	$scope.taskDetail;
	$scope.deadLine;
	$scope.alerts = [];
	$scope.searchText;
	$scope.updateTasks = function(data, status, headers, config){
		$scope.taskList = [];
		if(data['status'] == 1){
			for(var i=0;i<data['data'].length;i++)
				$scope.taskList.push(data['data'][i]);
			console.log($scope.taskList);
		}
		else{
			$scope.alerts=[];
			$scope.alerts.push({type: 'error', msg: 'No tasks in DB'});
			console.log(data['message']);
		}
	};
	$scope.archiveSuccess= function(data, status, headers, config){
		if(data['status'] == 1){
			$scope.refreshTaskList();
		}
		else{
			$scope.alerts=[];
			$scope.alerts.push({type: 'error', msg: data['message']});
			console.log(data['message']);
		}
	};
	$scope.deleteSuccess= function(data, status, headers, config){
		if(data['status'] == 1){
			$scope.refreshTaskList();
		}
		else{
			$scope.alerts=[];
			$scope.alerts.push({type: 'error', msg: data['message']});
			console.log(data['message']);
		}
	};
	$scope.refreshTaskList = function(){
		tasklistSession.getTaskDetails().success($scope.updateTasks).error($scope.displayError);
	};
	$scope.displayError = function(data, status, headers, config){
		console.log("Error");
	};
	$scope.addTaskToList = function(data, status, headers, config){
		if(data['status'] == 1){
			console.log(data);
			$scope.alerts=[];
			$scope.alerts.push({type: 'success', msg: 'Task Updated'});
			$scope.refreshTaskList();
			$scope.task = $scope.taskDetail = $scope.deadLine='';
		}
		else{
			$scope.alerts=[];
			$scope.alerts.push({type: 'error', msg: data['message']});
			console.log(data['message']);
		}
	};
	$scope.archiveTasks = function(taskID){
		tasklistSession.archiveTask(taskID).success($scope.archiveSuccess).error($scope.displayError);
	};
	$scope.deleteTask = function(taskID){
		tasklistSession.deleteTask(taskID).success($scope.deleteSuccess).error($scope.displayError);
	};
	$scope.statusCheckProgress = function(data, status, headers, config){
		if(data['status'] == 1){
			$scope.alerts=[];
			$scope.alerts.push({type: 'success', msg: 'Progress Updated'});
			console.log(data['message']);
			$scope.refreshTaskList();
		}
		else{
			$scope.alerts=[];
			$scope.alerts.push({type: 'error', msg: data['message']});
			console.log(data['message']);
		}
	};
	$scope.updateProgress = function($event, taskID, progressValue){
		if(progressValue>0 && progressValue<=100){
			tasklistSession.updateTaskProgress(taskID, progressValue).success($scope.statusCheckProgress).error($scope.displayError);
		}
		else{
			$scope.alerts=[];
			$scope.alerts.push({type: 'error', msg: 'Enter Progess Value between 0 and 100'});
		}
	};
	$scope.editTask = function(taskID){

	};
	$scope.closeAlert = function(index) {
    $scope.alerts.splice(index, 1);
  	};

  	//Initializer
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