<?php
header('Content-Type: application/json');
include __DIR__ . '/../db/db_connection.php';

if (!isset($_GET['hora'])) {
    echo json_encode(['success' => false, 'message' => 'Falta la hora']);
    exit;
}

$hora = $_GET['hora'];

$sql = "SELECT id FROM hours WHERE hora LIKE CONCAT(?, '%') LIMIT 1";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $hora);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    echo json_encode(['success' => true, 'hour_id' => intval($row['id'])]);
} else {
    echo json_encode(['success' => false, 'message' => 'No s\'ha trobat el hour_id']);
}
