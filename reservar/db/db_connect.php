<?php
// db_connect.php

$host = 'localhost'; // o l'adreça del teu servidor de base de dades
$dbname = 'reserves_cursos'; // Nom de la nova base de dades
$username = 'root'; // El teu usuari de la base de dades (normalment 'root' a local)
$password = ''; // La teva contrasenya (normalment buida a local)

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
}
?>
