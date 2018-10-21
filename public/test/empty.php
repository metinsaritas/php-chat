<?php
$tag = "<div>  s   </div>";

$p = $tag;
$p = $p ? strip_tags($p) : null;
$p = trim($p);
if ($p) {
    echo("{$p}y");
} else {
    echo("h");
}

return;
$des = 'merhaba&nbsp;<span contenteditable="false" data-type="emoji" class="em em-flag-hu emoji" title=":flag-hu:">:flag-hu:</span>&nbsp;deneme';

$pattern = '/<span(.*?)data-type="emoji"(.*?)>(.*?)<\/span>/i';
//$pattern = '/url\("(.*?)"/i';
//$clear = trim(preg_replace('/ +/', ' ', preg_replace('/[^A-Za-z0-9 ]/', ' ', urldecode(html_entity_decode(strip_tags($des))))));
preg_match_all($pattern, $des, $match);

print_r(strip_tags($des));
//print_r($match);