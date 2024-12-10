<?php
// Inclou el fitxer de connexió
include('../db/db_connect.php');

// Preparar la consulta per obtenir totes les hores disponibles
$query = "SELECT * FROM hores";

// Executar la consulta
$stmt = $pdo->query($query);

// Crear un array per emmagatzemar les hores
$hores = [];

while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    $hores[] = $row;
}

// Retornar les hores com a resposta JSON
echo json_encode($hores);
?>
