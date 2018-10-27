<?php

extract($_GET);
$n = 30;
//$number = intval($number);
if ($number < $n) {
    echo ("$number is lower than $n");
} else {
    echo ("$number is bigger than $n");
}


$dd = @$_GET["abc"] ? $_GET["abc"] : 3;
echo($dd);
