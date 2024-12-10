<?php
require_once '../db/db_connect.php';

$data = json_decode(file_get_contents('php://input'), true);

$course_id = $data['course_id'] ?? null;
$date = $data['date'] ?? null;
$time = $data['time'] ?? null;
$name = $data['name'] ?? null;
$email = $data['email'] ?? null;
$phone = $data['phone'] ?? null;

if (!$course_id || !$date || !$time || !$name || !$email || !$phone) {
    http_response_code(400);
    echo json_encode(['error' => 'Falten dades necessàries']);
    exit;
}

$stmt = $pdo->prepare("
    INSERT INTO appointments (course_id, date, time, name, email, phone, created_at)
    VALUES (?, ?, ?, ?, ?, ?, NOW())
");
$stmt->execute([$course_id, $date, $time, $name, $email, $phone]);

echo json_encode(['success' => true, 'message' => 'Reserva creada correctament']);
?>
