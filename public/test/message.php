<?php

$newmessage = @$_GET["message"] ?? "Merhablar size ".rand(300,500)." hey";
$newsender = "session@get.com";
$newtime = date_timestamp_get(date_create());
$newkeytime = $newtime."@". rand(10000,99999);

$read = file_get_contents('../../polling/all.json');

$jsonArr = json_decode($read, true);
$messages = $jsonArr['messages'];

$messages[$newkeytime] = [
    "sender" => $newsender,
    "message" => $newmessage,
    "time" => $newtime
];

header('Content-Type: application/json');
$jsonFinal = json_encode(["messages" => $messages], JSON_PRETTY_PRINT);
die($jsonFinal);
/*
foreach ($messages as $time => $data) {
    $sender = $data['sender'];
    $message = $data['message'];
    $time = $data['time'];

       
}*/