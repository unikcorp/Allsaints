<?php
/**
 * All Saints Public School - Database Connection
 * PDO Database Handler with Secure Environment Configuration
 * Hostinger MySQL Configuration
 */

header('Content-Type: application/json; charset=UTF-8');

// Return existing connection if already initialized
if (isset($pdo) && $pdo instanceof PDO) {
    return;
}

// 1. Load Environment Configuration from .env if present
$envFile = __DIR__ . '/../.env';
if (file_exists($envFile) && is_readable($envFile)) {
    $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        $line = trim($line);
        if ($line === '' || substr($line, 0, 1) === '#') {
            continue;
        }
        if (strpos($line, '=') !== false) {
            list($key, $value) = explode('=', $line, 2);
            $key = trim($key);
            $value = trim($value);
            if ((substr($value, 0, 1) === '"' && substr($value, -1) === '"') ||
                (substr($value, 0, 1) === "'" && substr($value, -1) === "'")) {
                $value = substr($value, 1, -1);
            }
            if (getenv($key) === false) {
                putenv("{$key}={$value}");
                $_ENV[$key] = $value;
                $_SERVER[$key] = $value;
            }
        }
    }
}

// 2. Resolve Database Credentials (Hostinger VPS Defaults)
$host = getenv('DB_HOST') ?: ($_ENV['DB_HOST'] ?? ($_SERVER['DB_HOST'] ?? '127.0.0.1'));
$port = getenv('DB_PORT') ?: ($_ENV['DB_PORT'] ?? ($_SERVER['DB_PORT'] ?? '3306'));
$db   = getenv('DB_NAME') ?: ($_ENV['DB_NAME'] ?? ($_SERVER['DB_NAME'] ?? 'allsaints_school_db'));
$user = getenv('DB_USER') ?: ($_ENV['DB_USER'] ?? ($_SERVER['DB_USER'] ?? 'allsaints-admin'));

// Support DB_PASSWORD and DB_PASS
$pass = '';
if (getenv('DB_PASSWORD') !== false) {
    $pass = getenv('DB_PASSWORD');
} elseif (getenv('DB_PASS') !== false) {
    $pass = getenv('DB_PASS');
} elseif (isset($_ENV['DB_PASSWORD'])) {
    $pass = $_ENV['DB_PASSWORD'];
} elseif (isset($_ENV['DB_PASS'])) {
    $pass = $_ENV['DB_PASS'];
} elseif (isset($_SERVER['DB_PASSWORD'])) {
    $pass = $_SERVER['DB_PASSWORD'];
} elseif (isset($_SERVER['DB_PASS'])) {
    $pass = $_SERVER['DB_PASS'];
}

$charset = 'utf8mb4';

// 3. PDO Configuration
$dsn = "mysql:host={$host};port={$port};dbname={$db};charset={$charset}";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
    PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4"
];

// 4. Secure Connection with Sanitized Error Handling
try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (PDOException $e) {
    // Log technical details securely in server logs without exposing credentials to visitors
    error_log('[Database Connection Error] ' . $e->getMessage());

    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Database connection failed. Please contact the administrator or verify configuration.'
    ]);
    exit;
}
