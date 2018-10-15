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
require '../../db.php';

$router = new Request();

$router->post('/login', function ($self) {
    if (!empty(@$_SESSION["email"])) 
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

    /*$mail = new PHPMailer();
 
    $mail->IsSMTP();
    $mail->Host = "smtp.gmail.com";
    $mail->SMTPAuth = true;
    $mail->Username = "metinsaritas2@gmail.com";
    $mail->Password = "joinface";
    
    $mail->From = $email;
    $mail->FromName = "Mailer";
    $mail->AddAddress("metinsaritas2@gmail.com", "Josh Adams");
    
    $mail->WordWrap = 50;
    $mail->IsHTML(true);
    
    $mail->Subject = "İletişim Mesajı";
    $mail->Body    = "Body kısmı";
    $mail->AltBody = "Alt body kısmı"; 
    
    if(!$mail->Send())
    {
        return $self->error("An activation link has not been sent to {$email}. Try agarin", [$mail->ErrorInfo]);
    }*/

    return $self->success("An activation link has been sent to {$email}.");
});

$router->get('/photo/?', function($self) {

    $id = $self->id;
    header('Content-Type: image/jpg');
    $tempPath = '../img/profile-temp.png';
    if (empty(@$_SESSION["email"]) || !is_numeric($id)) 
    die(file_get_contents($tempPath));
    
    $exists = @file_get_contents('../../profile_photos/'.$id.'.jpg');
    if($exists) die($exists);
    die(file_get_contents($tempPath));
});

$router->get('/users', function($self) {
    $email = @$_SESSION["email"];
    if (empty($email)) 
        return $self->error('You have to log in');
    
        /* @todo: where active */
    $users = R::getAll('SELECT id, email, date, nickname FROM user');
    return $self->success('Success', ['users' => $users, 
                                      'me' => [
                                          'email' => $email
                                      ]]);
});

$router->get('/ringtone', function($self) {
    $email = @$_SESSION["email"];
    if (empty($email)) 
        return $self->error('You have to log in');

    $ringtone = '../../ringtone.mp3';
    if (@!file_exists($ringtone)) 
        return $self->error('Ringtone File is not exists');

    header('Content-Type: audio/mp3');
    die(readfile($ringtone));
});

$router->post("/sendmessage", function($self) {
    $email = @$_SESSION["email"];
    if (!isset($email)) 
        return $self->error('You have to log in');

    $newmessage = @$_POST['message'];
    if (!isset($newmessage))
        return $self->error('Message cannot be empty');

    $newsender = $email;
    $newtime = date_timestamp_get(date_create());
    $newkeytime = $newtime."@". rand(10000,99999);

    /* lock the file */
    $filepath = '../../polling/all.json';
    if (!file_exists($filepath))
        return $self->error('An error occured, please try again later');
    
    $read = file_get_contents($filepath);

    $jsonArr = json_decode($read, true);
    $messages = $jsonArr['messages'];

    $messages[$newkeytime] = [
        "sender" => $newsender,
        "message" => $newmessage,
        "time" => $newtime
    ];

    $write = ["messages" => $messages];
    $updatedJson = json_encode($write, JSON_PRETTY_PRINT);
    file_put_contents($filepath, $updatedJson, LOCK_EX); 
    return $self->success('Success');   
});

$jsonArr = $router->result($_SERVER);

echo json_encode($jsonArr, JSON_PRETTY_PRINT);;