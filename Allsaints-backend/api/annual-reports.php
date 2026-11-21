<?php
/**
 * Module 4: Annual Report API
 * Academic & Institutional Annual Audit Reports
 */

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/db.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $stmt = $pdo->query("SELECT * FROM annual_reports ORDER BY published_at DESC, id DESC");
        echo json_encode(['status' => 'success', 'data' => $stmt->fetchAll()]);
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        if (empty($data['title']) || empty($data['pdf_url'])) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Title and PDF URL are required']);
            exit;
        }

        $stmt = $pdo->prepare("INSERT INTO annual_reports (academic_year, title, summary, pdf_url, cover_image_url, presented_by, published_at) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $data['academic_year'] ?? '2025-2026',
            $data['title'],
            $data['summary'] ?? null,
            $data['pdf_url'],
            $data['cover_image_url'] ?? null,
            $data['presented_by'] ?? 'Principal Rev. Dr. James Stephen',
            $data['published_at'] ?? date('Y-m-d')
        ]);

        echo json_encode(['status' => 'success', 'message' => 'Annual report added', 'id' => $pdo->lastInsertId()]);
        break;

    case 'DELETE':
        $id = $_GET['id'] ?? (json_decode(file_get_contents('php://input'), true)['id'] ?? null);
        if (!$id) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'ID is required']);
            exit;
        }
        $stmt = $pdo->prepare("DELETE FROM annual_reports WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(['status' => 'success', 'message' => 'Annual report deleted']);
        break;

    default:
        http_response_code(405);
        echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
        break;
}
