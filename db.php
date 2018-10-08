<?php

if ($_SERVER['HTTP_HOST'] == 'sztechat-metinsaritas.c9users.io') {
    R::setup('mysql:host=localhost;dbname=c9','metinsaritas', '');
} else {
    R::setup('mysql:host=localhost;dbname=sztechat','root', '');
}
