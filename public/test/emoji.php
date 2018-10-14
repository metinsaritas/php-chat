<?php
return;

set_time_limit(0);
$emoji = file_get_contents('../css/emoji.css');
preg_match_all('/url\("(.*?)"/i', $emoji, $match);
$matches = $match[1];
foreach ($matches as $url) {
    $exp = explode('/', $url);
    $name = end($exp);
    copy($url, "../emoji/{$name}");
    echo($url);
}