<?php
$t = @$_COOKIE["lastUpdate"];

if ($t <= 0) echo('e'); else echo('h');


var_dump($t);