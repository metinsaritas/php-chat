<?php
header('Content-Type: application/json');
@session_start();
set_time_limit(40);
ini_set('display_errors', '0');

$email = @$_SESSION["email"];

if (!$email) die_json([
	'error' => true,
	'message' => 'You must log in'
]);


function die_json ($arr) {
	die(json_encode($arr, JSON_PRETTY_PRINT));
	exit();
}

function shutdown () {
	$err = error_get_last();
	if ($err)
	die_json([
		"error" => true,
		"message" => "shutdown"
	]);
}

register_shutdown_function("shutdown");

$file = '../../polling/online.json';
$lastUpdate = filemtime($file) + 1;

while (true) {

	$filemtime = filemtime($file);
	if ($filemtime > $lastUpdate) {
		$fileRead = file_get_contents($file);
		$fileAsArr = json_decode($fileRead, true);

		die_json([
			"error" => false,
			"message" => "Success",
			"content" => $fileAsArr 
		]);
		exit();
		return;
	}

	clearstatcache();
    sleep(1);
}