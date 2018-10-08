<?php
header('Content-Type: application/json');
$route = @$_GET['url'];

$jsonArr = [
    "error" => true,
    "message" => "Route param is empty"
];


if (!$route) return die(json_encode($jsonArr, JSON_PRETTY_PRINT));
@session_start();
require '../../rb.php';
require 'Request.php';

R::setup('mysql:host=localhost;dbname=sztechat','root', '');
$router = new Request();

$router->post('/login', function ($self) {
    if (!empty($_SESSION["email"])) 
        return $self->success('You have already log in');

    extract($_POST);
    if (!(@$email && @$password))
        return $self->error('Fill the areas!');

    $hashed_password = md5($password);

    $user = R::findOne('user', 'email = ? and password = ?', [$email, $hashed_password]);
    if (!$user)
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

$router->post('/signup', function($self) {
    extract($_POST);
    if (!(@$email && @$password && @$passwordr) || !(trim($email) && trim($password) && trim($passwordr)))
        return $self->error('Fill the areas!');

    $email = trim($email);
    $password = trim($password);
    $passwordr = trim($passwordr);

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) return $self->error('E-mail is incorrect!', [$email]);
    if ($password != $passwordr) return $self->error('Passwords are not same');

    $exists = R::findOne('user', 'email = ?', [$email]);
    if ($exists) return $self->error('This e-mail account already taken');

    $user = R::dispense('user');
    $user->email = $email;
    $user->password = md5($password);
    $user->date = date("Y-m-d H:i:s");
    $id = R::store($user);

    if (!$id) return $self->error('An error occured, please try again later');

    return $self->success("An activation link has been sent to {$email}.");
});

$jsonArr = $router->result($_SERVER);

echo json_encode($jsonArr, JSON_PRETTY_PRINT);;