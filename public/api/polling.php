<?php
header('Content-Type: application/json');
@session_start();
if (empty(@$_SESSION['email'])) 
die_json([
	'error' => true,
	'message' => 'You must log in'
]);

$email = $_SESSION['email'];

session_write_close();
ignore_user_abort(false);
set_time_limit(40);

try {

	if (!isset($_COOKIE['lastUpdate'])) {
		setcookie('lastUpdate', 0);
		$_COOKIE['lastUpdate'] = 0;
	}

	$lastUpdate = $_COOKIE['lastUpdate'];
	$file = '../../polling/all.json';

	if (!file_exists($file)) {
		throw new Exception("$file Does not exist");
	}

	while (true) {

		$fileModifyTime = filemtime($file);

		if ($fileModifyTime === false) {
			throw new Exception('Could not read last modification time');
		}

		if ($fileModifyTime > $lastUpdate) {
			setcookie('lastUpdate', $fileModifyTime);

			$fileRead = file_get_contents($file);

			$fileAsArr = json_decode($fileRead, true);

			$messages = eliminateByTime($fileAsArr); 
			die_json([
				'error' => false,
				'time' => $fileModifyTime, 
				'content' => $messages
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