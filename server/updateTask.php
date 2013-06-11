<?php

	//Decode received JSON data
	$data = file_get_contents("php://input");
	$receivedData = json_decode($data);

	include_once 'db_function.php';
	$db = new DB_Functions();

	if(isset($receivedData->{"type"})){
		$response = '';
		switch ($receivedData->{"type"}) {
		    case 'newTask':
		        if(isset($receivedData->{"taskName"})){
		        	$taskName 	= $receivedData->{"taskName"};
		        	$taskDetail = $receivedData->{"taskDetail"};
		        	$res = $db->storeTaskDetails($taskName, $taskDetail);

		        	if($res)
		        	    $response = array("status" => 1,
		        	                      "message"=> "Success");
		        	else
		        	    $response = array("status" => 0,
		        	                      "message"=> "Error updating to DB");
		        }
		        else{
		        	$response = array("status" => 0,
	                      "message"=> "All fields needs to be set");
		        }
		        echo json_encode($response);
		    break;
		    case 'archiveTask':
		    	if(isset($receivedData->{"taskID"})){
		    		$taskID = $receivedData->{"taskID"};
					$res = $db->archiveTask($taskID);

					if($res)
		        	    $response = array("status" => 1,
		        	                      "message"=> "Success");
		        	else
		        	    $response = array("status" => 0,
		        	                      "message"=> "Error updating to DB");
		    	}
		    	else{
		        	$response = array("status" => 0,
	                      "message"=> "All fields needs to be set");
		        }
		        echo json_encode($response);
		    break;
		    case 'deleteTask':
		    	if(isset($receivedData->{"taskID"})){
		    		$taskID = $receivedData->{"taskID"};
					$res = $db->deleteTask($taskID);

					if($res)
		        	    $response = array("status" => 1,
		        	                      "message"=> "Success");
		        	else
		        	    $response = array("status" => 0,
		        	                      "message"=> "Error updating to DB");
		    	}
		    	else{
		        	$response = array("status" => 0,
	                      "message"=> "All fields needs to be set");
		        }
		        echo json_encode($response);
		    break;
		}
	}
	else {

	    $response = array("status" => 0,
	                      "message"=> "All fields needs to be set");
	    echo json_encode($response);
	}
?>