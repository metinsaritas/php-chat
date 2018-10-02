<?php
header('Content-Type: application/json');
@session_start();
require 'Request.php';

$jsonArr = [
    "error" => true,
    "message" => "Empty!"
];

$router = new Request();

$router->post('/login', function ($self) {
    if (!empty($_SESSION["email"])) 
        return $self->success('You have already log in');

    extract($_POST);
    if (!(@$email && @$password))
        return $self->error('Fill the areas!');

    if (!($email === "metin" && $password == 123))
        return $self->error('E-mail or password is wrong!');

    
    $_SESSION["email"] = $email;
    return [
        "error" => false,
        "message" => "Success"
    ];
});

$router->delete('/logout', function($self) {
    session_destroy();
    return $self->success('Success');
});

$jsonArr = $router->result($_SERVER);

echo json_encode($jsonArr, JSON_PRETTY_PRINT);;