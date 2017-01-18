<?php
/**
 * Created by PhpStorm.
 * User: zw
 * Date: 15/01/2017
 * Time: 10:39 AM
 */

require __DIR__ . '/vendor/autoload.php';
use InfluxDB\Client;

if (isset($_POST['between']) && !empty($_POST['between'])) {
    $between = $_POST['between'];
    $and = $_POST['and'];

    $client = new InfluxDB\Client("influxdb", "8086");
    $db = $client->selectDB('heatmap');

    $upperBound = $db->query('SELECT * FROM powerusage order by time desc LIMIT 1')->getPoints()[0]['time'];
    $lowerBound = $db->query('SELECT * FROM powerusage order by time asc LIMIT 1')->getPoints()[0]['time'];

    $peroid = getPeriod($upperBound, $lowerBound, $between, $and);

    $query = "SELECT mean(*) FROM powerusage WHERE TIME > '%s' and TIME < '%s' GROUP BY TIME(1h)";
    echo "<br>";
    echo "Period is: ".$peroid[0]." ~ ".$peroid[1];
    echo "<br>";


    $queryString = sprintf($query, $peroid[0], $peroid[1]);
    $usagePoints = $db->query($queryString)->getPoints();

    echo "<br>";
    print_r(json_encode($usagePoints));

} else {
    echo "<p>Ajax Data Failed for period data selection!</p>";
}


function getPeriod($upperLimit, $lowerrLimit, $start, $end) {
    echo "<br>";
    echo "upperLimit: ".$upperLimit;
    echo "<br>";
    echo "lowerLimit: ".$lowerrLimit;
    echo "<br>";
    echo "between: ".$start;
    echo "<br>";
    echo "and: ".$end;
    echo "<br>";

    $start = min(max(strtotime($start), strtotime($lowerrLimit)), strtotime($upperLimit));
    $end = max(min(strtotime($end), strtotime($upperLimit)), strtotime($lowerrLimit));
    return [date('Y-m-d H:i:s', $start), date('Y-m-d H:i:s', $end)];
}