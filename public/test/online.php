<?php
header('Content-Type: application/json');
@session_start();
ignore_user_abort(true);
session_write_close();
set_time_limit(40);


if (empty(@$_SESSION['email'])) 
die_json([
	'error' => true,
	'message' => 'You must log in'
]);

$ofile = '../../polling/online.json';
$file = '../../polling/all.json';

function connectionControl () {
    if (connection_aborted()) {        
        $email = $_SESSION['email'];
        setOfflineUser($email);
        exit();   
    }
}

function setOfflineUser ($email) {
	$ofile = $GLOBALS["ofile"];
    $onlineRead = @file_get_contents($ofile);
    if ($onlineRead === false) {
        //throw new Exception('Could not read file');
        return;
    }
    $onlineAsArr = json_decode($onlineRead, true);
    unset($onlineAsArr[$email]);
	
	//file_put_contents('test.tmp', $email);
    $updatedJson = json_encode($onlineAsArr, JSON_PRETTY_PRINT);
    @file_put_contents($ofile, $updatedJson, LOCK_EX);    
}


try {
	
    $ofileModifyTime = filemtime($ofile);
	$fileModifyTime = filemtime($file);
	
    $olastUpdate = $ofileModifyTime + 1;
	$lastUpdate = $fileModifyTime + 1;
	
    $_COOKIE['olastUpdate'] = $olastUpdate;
    $_COOKIE['lastUpdate'] = $lastUpdate;

	while (true) {
		
		$ofileModifyTime = filemtime($ofile);
		$fileModifyTime = filemtime($file);

        
        
        flush();
        ob_flush();
		echo "\t";
        
        connectionControl();

		if ($fileModifyTime > $lastUpdate) {
            
			$fileRead = file_get_contents($file);

			$fileAsArr = json_decode($fileRead, true);

			$messages = eliminateByTime($fileAsArr); 
			die_json([
				'error' => false,
				'time' => $fileModifyTime, 
				'type' => 'messages',
				'content' => $messages
			]);

		}

		if ($ofileModifyTime > $olastUpdate) {
            
			$ofileRead = file_get_contents($ofile);

			$ofileAsArr = json_decode($ofileRead, true);
			die_json([
				'error' => false,
				'time' => $ofileModifyTime,
				'type' => 'online',
				'content' => $ofileAsArr
			]);

		}

		clearstatcache();

		sleep(1);
		
	}

} catch (Exception $e) {
	die_json([
		'error' => true,
		'message' => $e -> getMessage()
	]);
}

function die_json ($arr) {
	die(json_encode($arr, JSON_PRETTY_PRINT));
	exit();
}


function eliminateByTime ($arr) {
	$cookieTime = @$_COOKIE["lastUpdate"];
	if ($cookieTime <= 0) return $arr;

	$rMessages = [];
	$messages = $arr['messages'];

	foreach ($messages as $keytime => $data) {
		$sender = $data['sender'];
		$message = $data['message'];
		$time = $data['time'];

		if ($time <= $cookieTime) continue; 

		$rMessages[$keytime] = $data;
	}

	return ['messages' => $rMessages];
}
exit();