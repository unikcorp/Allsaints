<?php
/**
 * Module 1: Our Management API
 * GET, POST, PUT, DELETE operations for Leadership & Patrons
 */

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/db.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $stmt = $pdo->query("SELECT * FROM management_members ORDER BY display_order ASC, id ASC");
        $members = $stmt->fetchAll();
        echo json_encode(['status' => 'success', 'data' => $members]);
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        if (empty($data['name']) || empty($data['role'])) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Name and role are required']);
            exit;
        }

        $stmt = $pdo->prepare("INSERT INTO management_members (name, role, sub_role, photo_url, quote, bio, display_order, is_patron) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $data['name'],
            $data['role'],
            $data['sub_role'] ?? null,
            $data['photo_url'] ?? '/images/management/principal.jpg',
            $data['quote'] ?? null,
            $data['bio'] ?? null,
            $data['display_order'] ?? 1,
            !empty($data['is_patron']) ? 1 : 0
        ]);

        $id = $pdo->lastInsertId();
        echo json_encode(['status' => 'success', 'message' => 'Member added successfully', 'id' => $id]);
        break;

    case 'PUT':
        $data = json_decode(file_get_contents('php://input'), true);
        if (empty($data['id'])) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Member ID is required']);
            exit;
        }

        $stmt = $pdo->prepare("UPDATE management_members SET name = ?, role = ?, sub_role = ?, photo_url = ?, quote = ?, bio = ?, display_order = ?, is_patron = ? WHERE id = ?");
        $stmt->execute([
            $data['name'],
            $data['role'],
            $data['sub_role'] ?? null,
            $data['photo_url'] ?? '',
            $data['quote'] ?? null,
            $data['bio'] ?? null,
            $data['display_order'] ?? 1,
            !empty($data['is_patron']) ? 1 : 0,
            $data['id']
        ]);

        echo json_encode(['status' => 'success', 'message' => 'Member updated successfully']);
        break;

    case 'DELETE':
        $id = $_GET['id'] ?? null;
        if (!$id) {
            $data = json_decode(file_get_contents('php://input'), true);
            $id = $data['id'] ?? null;
        }

        if (!$id) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Member ID is required']);
            exit;
        }

        $stmt = $pdo->prepare("DELETE FROM management_members WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(['status' => 'success', 'message' => 'Member deleted successfully']);
        break;

    default:
        http_response_code(405);
        echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
        break;
}
