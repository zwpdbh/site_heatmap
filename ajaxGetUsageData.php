<?php
/**
 * Created by PhpStorm.
 * User: zw
 * Date: 15/01/2017
 * Time: 10:39 AM
 */

require_once '/usr/local/share/php-composer/vendor/autoload.php';

use InfluxDB\Client;

$client = new InfluxDB\Client("localhost", "8086");
$db = $client->selectDB('heatmap');

$testQueryString = "select mean(*) from powerusage where time >= '2014-07-14' and time < '2015-07-18' group by time(1h)";

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $upperBound = $db->query('select last("bedroomsAndLounge") from powerusage')->getPoints()[0]['time'];
    $lowerBound = $db->query('select first("bedroomsAndLounge") from powerusage')->getPoints()[0]['time'];


    $query = "SELECT mean(*) FROM powerusage WHERE TIME >= '%s' and TIME < '%s' GROUP BY TIME(1h)";
    $queryString = sprintf($query, $lowerBound, $upperBound);

    $allUsagePoint = $db->query($testQueryString)->getPoints();
    echo json_encode($allUsagePoint);

} else if (isset($_POST['between']) && !empty($_POST['between'])) {
    $between = $_POST['between'];
    $and = $_POST['and'];

    $upperBound = $db->query('select last("bedroomsAndLounge") from powerusage')->getPoints()[0]['time'];
    $lowerBound = $db->query('select first("bedroomsAndLounge") from powerusage')->getPoints()[0]['time'];

    $peroid = getPeriod($upperBound, $lowerBound, $between, $and);

    // if the get tag == "detail", then query with precision with every mins
    if ($_POST['tag'] == "detail") {
        $query = "SELECT * FROM powerusage WHERE TIME >= '%s' and TIME <= '%s'";

    } else {
        $query = "SELECT mean(*) FROM powerusage WHERE TIME >= '%s' and TIME < '%s' GROUP BY TIME(1h)";
    }

    $queryString = sprintf($query, $between, $and);
    echo $queryString;
    echo "<br>";
    $usagePoints = $db->query($queryString)->getPoints();

//    echo json_encode($usagePoints);
} else {
    echo "<p>Ajax Data Failed for period data selection!</p>";
}


function getPeriod($upperLimit, $lowerrLimit, $start, $end) {
    $start = min(max(strtotime($start), strtotime($lowerrLimit)), strtotime($upperLimit));
    $end = max(min(strtotime($end), strtotime($upperLimit)), strtotime($lowerrLimit));
    return [date('Y-m-d H:i:s', $start), date('Y-m-d H:i:s', $end)];
}