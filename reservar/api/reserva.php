<?php
header('Content-Type: application/json');
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Llegir el JSON rebut
$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    echo json_encode(['success' => false, 'message' => 'Dades no vàlides']);
    exit;
}

// Validar dades
if (empty($data['course_id']) || empty($data['date']) || empty($data['hour']) ||
    empty($data['name']) || empty($data['email']) || empty($data['phone'])) {
    echo json_encode(['success' => false, 'message' => 'Falten camps obligatoris']);
    exit;
}

$mysqli = new mysqli("localhost", "root", "", "reserves_cursos");
if ($mysqli->connect_errno) {
    echo json_encode(['success' => false, 'message' => 'Error connexió BD']);
    exit;
}

$stmt = $mysqli->prepare("INSERT INTO reserves (course_id, date, time, name, email, phone) VALUES (?, ?, ?, ?, ?, ?)");
if (!$stmt) {
    echo json_encode(['success' => false, 'message' => 'Error en preparar consulta']);
    exit;
}

$stmt->bind_param("isssss",
    $data['course_id'],
    $data['date'],
    $data['hour'],
    $data['name'],
    $data['email'],
    $data['phone']
);

if (!$stmt->execute()) {
    echo json_encode(['success' => false, 'message' => 'Error en guardar la reserva']);
    exit;
}

// Evita enviar headers o qualsevol output abans d'això!
ob_start(); // Començar buffer d’output per capturar qualsevol error que mail() pugui generar

$to = $data['email'];
$subject = "Confirmació de la teva reserva a l'Institut Baix Camp";
$message = "Hola " . $data['name'] . ",\n\n";
$message .= "La teva reserva ha estat registrada correctament.\n";
$message .= "Detalls:\n";
$message .= "Curs: " . $data['course_id'] . "\n";
$message .= "Data: " . $data['date'] . "\n";
$message .= "Hora: " . $data['hour'] . "\n\n";
$message .= "Gràcies per utilitzar el servei.\nInstitut Baix Camp";
$headers = "From: no-reply@insbaixcamp.org";

$mailSent = mail($to, $subject, $message, $headers);

$output = ob_get_clean(); // Captura qualsevol output (warnings, errors) durant mail()

if (!$mailSent) {
    error_log("Error enviant correu: $output");
    // Pots també enviar resposta d’error, però normalment no aturem la reserva
    // echo json_encode(['success' => false, 'message' => 'Error enviant correu']);
    // exit;
}

echo json_encode(['success' => true]);
?>
