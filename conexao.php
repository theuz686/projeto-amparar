<?php
// Define as constantes de conexão
define('DB_HOST', '127.0.0.1');
define('DB_PORT', '3307');
define('DB_USER', 'root');
define('DB_PASS', 'root'); // Senha que você definiu no MariaDB/MySQL
define('DB_NAME', 'projeto_amparar'); // Nome do seu Schema

// Cria a conexão usando MySQLi Orientado a Objetos
$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME, DB_PORT);

// Verifica se houve erro na conexão
if ($conn->connect_error) {
    die("❌ Falha na Conexão com o Banco de Dados: " . $conn->connect_error);
}

// Configura o charset para UTF-8 (boas práticas)
$conn->set_charset("utf8mb4");

// O objeto de conexão ($conn) está pronto para uso pelos outros scripts.
?>