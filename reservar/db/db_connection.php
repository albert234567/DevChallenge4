<?php
// db_connection.php

$host = 'localhost';
$db   = 'reserves_cursos'; // canvia-ho pel nom real
$user = 'root';            // el teu usuari de la base de dades
$pass = '';       // la teva contrasenya
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";

$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    // Maneig d'error senzill, pots fer-ho més elegant si vols
    throw new \PDOException($e->getMessage(), (int)$e->getCode());
}
