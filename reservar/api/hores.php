<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
header('Content-Type: application/json');

if (!isset($_GET['course_id'], $_GET['data'])) {
    echo json_encode(["error" => "Falten paràmetres"]);
    exit;
}

$course_id = intval($_GET['course_id']);
$data = $_GET['data']; // Ja ve com string 'YYYY-MM-DD'

$conn = new mysqli("localhost", "root", "", "reserves_cursos");

if ($conn->connect_error) {
    echo json_encode(["error" => "Connexió fallida"]);
    exit;
}

$sql = "
    SELECT h.hora
    FROM disponiblilitat a
    JOIN hores h ON a.hour_id = h.id
    WHERE a.course_id = ? AND a.data = ?
    ORDER BY h.hora ASC
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("is", $course_id, $data);
$stmt->execute();

$result = $stmt->get_result();

$hores = [];
while ($row = $result->fetch_assoc()) {
    $hores[] = $row['hora'];
}

echo json_encode($hores);
