<?php


if (false) {

    $user = R::dispense('user');
    $user->email = 'test@test.com';
    $user->password = '123';
    $user->date = date("Y-m-d H:i:s");
    $id = R::store($user);
}

$id = 1;
$user = R::load('user', $id);

$user->email = 'degisti';
R::store($user);

var_dump('Oke');