<?php
ini_set('display_errors', 0);  // NO mostrar errors a pantalla
ini_set('log_errors', 1);      // Sí loguejar errors
error_reporting(E_ALL);
header('Content-Type: application/json');

include __DIR__ . '/../db/db_connection.php';

$input = json_decode(file_get_contents("php://input"), true);

// Afegir debug aquí
error_log("Input rebut a eliminar.php: " . print_r($input, true));

if (!isset($input['course_id']) || !isset($input['data']) || !isset($input['hour_id'])) {
    echo json_encode(["success" => false, "message" => "Falten dades: course_id, data o hour_id"]);
    exit;
}

$course_id = intval($input['course_id']);
$data = trim($input['data']);
$hour_id = intval($input['hour_id']);

// Consulta SQL
$sql = "DELETE FROM disponiblilitat WHERE course_id = ? AND data = ? AND hour_id = ?";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    error_log("Error en preparar consulta: " . $conn->error);
    echo json_encode(["success" => false, "message" => "Error en preparar consulta"]);
    exit;
}

$stmt->bind_param("isi", $course_id, $data, $hour_id);
$stmt->execute();

error_log("Consulta SQL executada: $sql amb params: course_id=$course_id, data=$data, hour_id=$hour_id");
error_log("Files afectades: " . $stmt->affected_rows);

if ($stmt->affected_rows > 0) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "message" => "No s'ha eliminat cap disponibilitat"]);
}
