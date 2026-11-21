<?php
/**
 * File & Media Upload API
 * Handles photo and PDF uploads, stores in /backend/uploads/, returns accessible URL
 */

require_once __DIR__ . '/../config/cors.php';

$uploadDir = __DIR__ . '/../uploads/';

// Ensure directory exists
if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!isset($_FILES['file'])) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'No file uploaded']);
        exit;
    }

    $file = $_FILES['file'];
    $allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'pdf'];
    $maxFileSize = 10 * 1024 * 1024; // 10MB

    if ($file['error'] !== UPLOAD_ERR_OK) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'File upload error code: ' . $file['error']]);
        exit;
    }

    if ($file['size'] > $maxFileSize) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'File size exceeds 10MB limit']);
        exit;
    }

    $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    if (!in_array($ext, $allowedExtensions)) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Invalid file extension. Allowed: jpg, jpeg, png, webp, pdf']);
        exit;
    }

    // Generate unique, collision-proof filename
    $newFileName = uniqid('asps_', true) . '.' . $ext;
    $targetPath = $uploadDir . $newFileName;

    if (move_uploaded_file($file['tmp_name'], $targetPath)) {
        // Construct accessible URL
        $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? "https://" : "http://";
        $host = $_SERVER['HTTP_HOST'];
        $relativeUrl = '/backend/uploads/' . $newFileName;
        $fullUrl = $protocol . $host . $relativeUrl;

        echo json_encode([
            'status' => 'success',
            'message' => 'File uploaded successfully',
            'url' => $relativeUrl,
            'full_url' => $fullUrl,
            'file_name' => $newFileName,
            'original_name' => $file['name'],
            'size' => $file['size']
        ]);
        exit;
    } else {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Failed to save uploaded file']);
        exit;
    }
}

http_response_code(405);
echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
