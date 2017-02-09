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

//$testQueryString = "select mean(*) from powerusage where time >= '2014-07-14' and time < '2015-07-18' group by time(1h)";

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $upperBound = $db->query('select last("bedroomsAndLounge") from powerusage')->getPoints()[0]['time'];
    $lowerBound = $db->query('select first("bedroomsAndLounge") from powerusage')->getPoints()[0]['time'];


    $query = "SELECT mean(*) FROM powerusage WHERE TIME >= '%s' and TIME < '%s' GROUP BY TIME(1h)";
    $queryString = sprintf($query, $lowerBound, $upperBound);

    $allUsagePoint = $db->query($queryString)->getPoints();
    echo json_encode($allUsagePoint);
} else if (isset($_POST['tag']) && !empty($_POST['tag'])) {
    $selection = $_POST['selection'];
    $tag = $_POST['tag'];


    $start = date("Y-m-d", strtotime(substr($selection[0], 0, 15)));
    $end = date("Y-m-d", strtotime(substr($selection[1], 0, 15)));

    if ($tag == "year") {
        $upperBound = $db->query('select last("bedroomsAndLounge") from powerusage')->getPoints()[0]['time'];
        $lowerBound = $db->query('select first("bedroomsAndLounge") from powerusage')->getPoints()[0]['time'];

        $start = date("Y-m-d", max(strtotime($start), strtotime($lowerBound)));
        $end = date("Y-m-d", min(strtotime($end), strtotime($upperBound)));

        $query = "SELECT mean(*) FROM powerusage WHERE TIME >= '%s' and TIME <= '%s' GROUP BY TIME(1h)";
    } else {
        $query = "SELECT * FROM powerusage WHERE TIME >= '%s' and TIME < '%s'";
    }

    $queryString = sprintf($query, $start, $end);
//    print_r($queryString);
//    echo "<br>";
    $usagePoints = $db->query($queryString)->getPoints();

    echo json_encode($usagePoints);
} else {
    echo "<p>Ajax Data Failed for period data selection!</p>";
}


