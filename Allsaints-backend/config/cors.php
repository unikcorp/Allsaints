<?php
/**
 * Cross-Origin Resource Sharing (CORS) Configuration
 * Allows Next.js frontend (http://localhost:3000) to communicate with PHP backend
 */

$allowed_origins = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'https://allsaintspublicschool.com',
    'https://allsaints.unikcorp.org',
    'http://allsaints.unikcorp.org'
];

$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';

if (in_array($origin, $allowed_origins) || empty($origin)) {
    header("Access-Control-Allow-Origin: " . ($origin ?: '*'));
} else {
    header("Access-Control-Allow-Origin: *");
}

header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}
