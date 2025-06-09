<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json');

include __DIR__ . '/../db/db_connection.php';

$course_id = $_GET['course_id'] ?? null;
if (!$course_id) {
    echo json_encode(['error' => 'Falta el course_id']);
    exit;
}

try {
    $stmt = $pdo->prepare("SELECT data FROM disponiblilitat WHERE course_id = ?");
    $stmt->execute([$course_id]);
    $disponibilitats = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $data = array_map(fn($row) => $row['data'], $disponibilitats);

    echo json_encode($data);

} catch (PDOException $e) {
    echo json_encode(['error' => 'Error a la base de dades: ' . $e->getMessage()]);
}
