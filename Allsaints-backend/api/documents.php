<?php
/**
 * Module 14: Statutory Documents API
 * Mandatory CBSE Certificates (Affiliation, Fire Safety, Building Fitness, Sanitation)
 */

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/db.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $stmt = $pdo->query("SELECT * FROM statutory_documents ORDER BY display_order ASC, id ASC");
        echo json_encode(['status' => 'success', 'data' => $stmt->fetchAll()]);
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        if (empty($data['title']) || empty($data['file_url'])) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Title and file URL required']);
            exit;
        }

        $stmt = $pdo->prepare("INSERT INTO statutory_documents (title, category, doc_number, issuing_authority, valid_until, compliance_status, file_url, file_type, description, display_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $data['title'],
            $data['category'] ?? 'Mandatory Disclosure',
            $data['doc_number'] ?? null,
            $data['issuing_authority'] ?? 'Competent Authority',
            $data['valid_until'] ?? null,
            $data['compliance_status'] ?? 'Valid & Verified',
            $data['file_url'],
            $data['file_type'] ?? 'PDF',
            $data['description'] ?? null,
            $data['display_order'] ?? 1
        ]);

        echo json_encode(['status' => 'success', 'message' => 'Document added', 'id' => $pdo->lastInsertId()]);
        break;

    case 'PUT':
        $data = json_decode(file_get_contents('php://input'), true);
        if (empty($data['id'])) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'ID required']);
            exit;
        }

        $stmt = $pdo->prepare("UPDATE statutory_documents SET title = ?, category = ?, doc_number = ?, issuing_authority = ?, valid_until = ?, compliance_status = ?, file_url = ?, file_type = ?, description = ?, display_order = ? WHERE id = ?");
        $stmt->execute([
            $data['title'],
            $data['category'] ?? 'Mandatory Disclosure',
            $data['doc_number'] ?? null,
            $data['issuing_authority'] ?? 'Competent Authority',
            $data['valid_until'] ?? null,
            $data['compliance_status'] ?? 'Valid & Verified',
            $data['file_url'],
            $data['file_type'] ?? 'PDF',
            $data['description'] ?? null,
            $data['display_order'] ?? 1,
            $data['id']
        ]);

        echo json_encode(['status' => 'success', 'message' => 'Document updated']);
        break;

    case 'DELETE':
        $id = $_GET['id'] ?? (json_decode(file_get_contents('php://input'), true)['id'] ?? null);
        if (!$id) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'ID required']);
            exit;
        }

        $stmt = $pdo->prepare("DELETE FROM statutory_documents WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(['status' => 'success', 'message' => 'Document deleted']);
        break;

    default:
        http_response_code(405);
        echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
        break;
}
