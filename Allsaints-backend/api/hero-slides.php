<?php
/**
 * Module 17: Hero Campus Slides API
 * Manage Homepage Hero Background Carousel Slides
 */

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/db.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $stmt = $pdo->query("SELECT * FROM hero_slides WHERE is_active = 1 ORDER BY display_order ASC, id ASC");
        echo json_encode(['status' => 'success', 'data' => $stmt->fetchAll()]);
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        if (empty($data['image_url'])) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Image URL is required']);
            exit;
        }

        $stmt = $pdo->prepare("INSERT INTO hero_slides (image_url, title, caption, display_order, is_active) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([
            $data['image_url'],
            $data['title'] ?? 'All Saints Public School Campus',
            $data['caption'] ?? '',
            isset($data['display_order']) ? (int)$data['display_order'] : 1,
            isset($data['is_active']) ? ($data['is_active'] ? 1 : 0) : 1
        ]);

        echo json_encode(['status' => 'success', 'message' => 'Hero slide created', 'id' => $pdo->lastInsertId()]);
        break;

    case 'PUT':
        $data = json_decode(file_get_contents('php://input'), true);
        if (empty($data['id'])) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'ID is required']);
            exit;
        }

        $stmt = $pdo->prepare("UPDATE hero_slides SET image_url = ?, title = ?, caption = ?, display_order = ?, is_active = ? WHERE id = ?");
        $stmt->execute([
            $data['image_url'],
            $data['title'] ?? 'All Saints Public School Campus',
            $data['caption'] ?? '',
            isset($data['display_order']) ? (int)$data['display_order'] : 1,
            isset($data['is_active']) ? ($data['is_active'] ? 1 : 0) : 1,
            $data['id']
        ]);

        echo json_encode(['status' => 'success', 'message' => 'Hero slide updated']);
        break;

    case 'DELETE':
        $id = $_GET['id'] ?? null;
        if (!$id) {
            $data = json_decode(file_get_contents('php://input'), true);
            $id = $data['id'] ?? null;
        }

        if (!$id) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'ID is required']);
            exit;
        }

        $stmt = $pdo->prepare("DELETE FROM hero_slides WHERE id = ?");
        $stmt->execute([$id]);

        echo json_encode(['status' => 'success', 'message' => 'Hero slide deleted']);
        break;

    default:
        http_response_code(405);
        echo json_encode(['status' => 'error', 'message' => 'Method Not Allowed']);
        break;
}
