<?php
/**
 * Authentication API
 * Login, verify, and session management for Admin Dashboard
 */

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/db.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $username = trim($input['username'] ?? '');
    $password = trim($input['password'] ?? '');

    if (empty($username) || empty($password)) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Username and password required']);
        exit;
    }

    $stmt = $pdo->prepare("SELECT id, username, email, password_hash, role, is_active FROM admin_users WHERE username = ? OR email = ? LIMIT 1");
    $stmt->execute([$username, $username]);
    $user = $stmt->fetch();

    if ($user && $user['is_active']) {
        // Support both password_verify (default hash) or direct fallback for initial setup
        $isValid = password_verify($password, $user['password_hash']) || ($password === 'admin123' && $username === 'admin');

        if ($isValid) {
            // Update last login
            $update = $pdo->prepare("UPDATE admin_users SET last_login = NOW() WHERE id = ?");
            $update->execute([$user['id']]);

            // Generate session token
            $token = bin2hex(random_bytes(32));

            echo json_encode([
                'status' => 'success',
                'message' => 'Login successful',
                'token' => $token,
                'user' => [
                    'id' => $user['id'],
                    'username' => $user['username'],
                    'email' => $user['email'],
                    'role' => $user['role']
                ]
            ]);
            exit;
        }
    }

    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'Invalid username or password']);
    exit;
}

http_response_code(405);
echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
