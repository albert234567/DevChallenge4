<?php
// Incloure la connexió a la base de dades
include __DIR__ . '/../db/db_connection.php';
$slot = isset($_GET['slot']) ? $_GET['slot'] : '';  // Obtenim la franja horària (matí/tarda)

// Comprovem que la franja horària sigui vàlida
if ($slot != 'mati' && $slot != 'tarda') {
    echo json_encode(['error' => 'Franja horària invàlida']);
    exit;
}

// Consulta SQL per obtenir els cursos segons la franja horària
$query = "SELECT id, nom, franja_horaria FROM cursos WHERE franja_horaria = :slot";
$stmt = $pdo->prepare($query);
$stmt->bindParam(':slot', $slot, PDO::PARAM_STR);
$stmt->execute();

// Obtenim els cursos i els retornem com a JSON
$cursos = $stmt->fetchAll(PDO::FETCH_ASSOC);

if ($cursos) {
    echo json_encode($cursos);  // Retornem els cursos en format JSON
} else {
    echo json_encode(['error' => 'No s\'han trobat cursos per aquesta franja horària']);
}
?>
