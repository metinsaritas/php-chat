<?php
set_time_limit(40);
$data_source_file = 'data.txt';
while (true) {
    $last_ajax_call = isset($_GET['timestamp']) ? $_GET['timestamp'] : null;
    clearstatcache();
    $last_change_in_data_file = filemtime($data_source_file);
    if ($last_ajax_call == null || $last_change_in_data_file > $last_ajax_call) {
        $data = file_get_contents($data_source_file);
        $result = array(
            'data_from_file' => $data,
            'timestamp' => $last_change_in_data_file
        );
        $json = json_encode($result);
        echo $json;
        break;
    } else {
        sleep( 1 );
        continue;
    }
}