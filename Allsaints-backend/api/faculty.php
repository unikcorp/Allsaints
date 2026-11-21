<?php
/**
 * Module 3: Faculty API
 * Manage Teaching & Non-Teaching Staff
 */

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/db.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $dept = $_GET['dept'] ?? null;
        if ($dept) {
            $stmt = $pdo->prepare("SELECT * FROM faculty_members WHERE department = ? AND is_active = 1 ORDER BY display_order ASC");
            $stmt->execute([$dept]);
        } else {
            $stmt = $pdo->query("SELECT * FROM faculty_members WHERE is_active = 1 ORDER BY display_order ASC, id ASC");
        }
        echo json_encode(['status' => 'success', 'data' => $stmt->fetchAll()]);
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        if (empty($data['name']) || empty($data['department'])) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Name and department are required']);
            exit;
        }

        $stmt = $pdo->prepare("INSERT INTO faculty_members (name, department, designation, qualification, experience_years, photo_url, email, display_order, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $data['name'],
            $data['department'],
            $data['designation'] ?? 'TGT',
            $data['qualification'] ?? 'B.Ed',
            $data['experience_years'] ?? 0,
            $data['photo_url'] ?? null,
            $data['email'] ?? null,
            $data['display_order'] ?? 1,
            isset($data['is_active']) ? ($data['is_active'] ? 1 : 0) : 1
        ]);

        echo json_encode(['status' => 'success', 'message' => 'Faculty member added', 'id' => $pdo->lastInsertId()]);
        break;

    case 'PUT':
        $data = json_decode(file_get_contents('php://input'), true);
        if (empty($data['id'])) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'ID is required']);
            exit;
        }

        $stmt = $pdo->prepare("UPDATE faculty_members SET name = ?, department = ?, designation = ?, qualification = ?, experience_years = ?, photo_url = ?, email = ?, display_order = ?, is_active = ? WHERE id = ?");
        $stmt->execute([
            $data['name'],
            $data['department'],
            $data['designation'] ?? 'TGT',
            $data['qualification'] ?? 'B.Ed',
            $data['experience_years'] ?? 0,
            $data['photo_url'] ?? null,
            $data['email'] ?? null,
            $data['display_order'] ?? 1,
            isset($data['is_active']) ? ($data['is_active'] ? 1 : 0) : 1,
            $data['id']
        ]);

        echo json_encode(['status' => 'success', 'message' => 'Faculty updated']);
        break;

    case 'DELETE':
        $id = $_GET['id'] ?? (json_decode(file_get_contents('php://input'), true)['id'] ?? null);
        if (!$id) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'ID is required']);
            exit;
        }

        $stmt = $pdo->prepare("DELETE FROM faculty_members WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(['status' => 'success', 'message' => 'Faculty deleted']);
        break;

    default:
        http_response_code(405);
        echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
        break;
}
