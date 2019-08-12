<?php

$chart_id = htmlspecialchars($_GET['id']);
$contents = file_get_contents("charts.json");
$charts   = json_decode($contents);
$selected_chart = $charts->$chart_id;

$title = $selected_chart->title;
$additional_settings = isset($selected_chart->additional_settings) ? $selected_chart->additional_settings : [];

function get_display_style($id) {
    global $additional_settings;
    if (in_array($id, $additional_settings))
        echo '';
    else
        echo 'style="display:none;"'; 
}

?>