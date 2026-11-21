<?php
/**
 * Module 2: PTA & SMC API
 * Manage Parent-Teacher Association & School Management Committee members
 */

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/db.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $type = $_GET['type'] ?? null;
        if ($type) {
            $stmt = $pdo->prepare("SELECT * FROM committee_members WHERE committee_type = ? ORDER BY display_order ASC, id ASC");
            $stmt->execute([$type]);
        } else {
            $stmt = $pdo->query("SELECT * FROM committee_members ORDER BY committee_type ASC, display_order ASC, id ASC");
        }
        echo json_encode(['status' => 'success', 'data' => $stmt->fetchAll()]);
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        if (empty($data['committee_type']) || empty($data['name']) || empty($data['designation'])) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Committee type, name, and designation are required']);
            exit;
        }

        $stmt = $pdo->prepare("INSERT INTO committee_members (committee_type, name, designation, occupation, term_period, phone_number, photo_url, display_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $data['committee_type'],
            $data['name'],
            $data['designation'],
            $data['occupation'] ?? null,
            $data['term_period'] ?? '2025-2027',
            $data['phone_number'] ?? null,
            $data['photo_url'] ?? null,
            $data['display_order'] ?? 1
        ]);

        echo json_encode(['status' => 'success', 'message' => 'Committee member added successfully', 'id' => $pdo->lastInsertId()]);
        break;

    case 'PUT':
        $data = json_decode(file_get_contents('php://input'), true);
        if (empty($data['id'])) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'ID is required']);
            exit;
        }

        $stmt = $pdo->prepare("UPDATE committee_members SET committee_type = ?, name = ?, designation = ?, occupation = ?, term_period = ?, phone_number = ?, photo_url = ?, display_order = ? WHERE id = ?");
        $stmt->execute([
            $data['committee_type'],
            $data['name'],
            $data['designation'],
            $data['occupation'] ?? null,
            $data['term_period'] ?? '2025-2027',
            $data['phone_number'] ?? null,
            $data['photo_url'] ?? null,
            $data['display_order'] ?? 1,
            $data['id']
        ]);

        echo json_encode(['status' => 'success', 'message' => 'Committee member updated successfully']);
        break;

    case 'DELETE':
        $id = $_GET['id'] ?? (json_decode(file_get_contents('php://input'), true)['id'] ?? null);
        if (!$id) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'ID is required']);
            exit;
        }

        $stmt = $pdo->prepare("DELETE FROM committee_members WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(['status' => 'success', 'message' => 'Member deleted successfully']);
        break;

    default:
        http_response_code(405);
        echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
        break;
}
