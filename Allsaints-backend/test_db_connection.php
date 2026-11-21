<?php
/**
 * Test Database Connection & Environment Configuration
 */

require_once __DIR__ . '/config/db.php';

echo json_encode([
    'status' => 'success',
    'message' => 'Connected to database successfully via PDO',
    'host' => $host,
    'port' => $port,
    'database' => $db,
    'user' => $user,
    'driver' => $pdo->getAttribute(PDO::ATTR_DRIVER_NAME),
    'server_version' => $pdo->getAttribute(PDO::ATTR_SERVER_VERSION)
], JSON_PRETTY_PRINT);
