<?php
/**
 * Created by PhpStorm.
 * User: zw
 * Date: 15/01/2017
 * Time: 10:39 AM
 */

// use composer to import php-influxdb library
require_once '/usr/local/share/php-composer/vendor/autoload.php';
use InfluxDB\Client;


// connect to influxdb: address is localhost, port is 8086 and use heatmap database
$client = new InfluxDB\Client("localhost", "8086");
$db = $client->selectDB('heatmap');


if (isset($_POST['tag']) && !empty($_POST['tag'])) {
    $selection = $_POST['selection'];
    $tag = $_POST['tag'];

    $start = date("Y-m-d", strtotime(substr($selection[0], 0, 15)));
    $end = date("Y-m-d", strtotime(substr($selection[1], 0, 15)));

    // when user select a new year, we should update the hourly usage data
    if ($tag == "year") {
        $upperBound = $db->query('select last("bedroomsAndLounge") from powerusage')->getPoints()[0]['time'];
        $lowerBound = $db->query('select first("bedroomsAndLounge") from powerusage')->getPoints()[0]['time'];

        $start = date("Y-m-d", max(strtotime($start), strtotime($lowerBound)));
        $end = date("Y-m-d", min(strtotime($end), strtotime($upperBound)));

        $query = "SELECT mean(*) FROM powerusage WHERE TIME >= '%s' and TIME < '%s' GROUP BY TIME(1h)";
    } else {
        // otherwise, just update the usage data with persicion: per minuets.
        $query = "SELECT * FROM powerusage WHERE TIME >= '%s' and TIME < '%s'";
    }

    $queryString = sprintf($query, $start, $end);
    $usagePoints = $db->query($queryString)->getPoints();
    echo json_encode($usagePoints);
} else {
    echo "<p>Ajax Data Failed for period data selection!</p>";
}


