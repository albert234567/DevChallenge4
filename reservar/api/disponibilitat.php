<?php
require_once '../db/db_connect.php';

$course_id = $_GET['course_id'] ?? null;

if (!$course_id) {
    http_response_code(400);
    echo json_encode(['error' => 'Falta el course_id']);
    exit;
}

$stmt = $pdo->prepare("SELECT * FROM availabilities WHERE course_id = ?");
$stmt->execute([$course_id]);
$disponibilitats = $stmt->fetchAll(PDO::FETCH_ASSOC);

header('Content-Type: application/json');
echo json_encode($disponibilitats);
?>
