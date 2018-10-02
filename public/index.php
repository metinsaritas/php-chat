<?php
@session_start();
if (!empty($_SESSION["email"]))
return require '../Views/loggedView.php';
return require '../Views/loginView.php';