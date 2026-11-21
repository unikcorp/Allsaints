<?php
/**
 * Module 13: News & Bulletins API
 * Manage Daily Gazette, Circulars, and Press Releases
 */

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/db.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $featured = $_GET['featured'] ?? null;
        if ($featured === '1') {
            $stmt = $pdo->query("SELECT * FROM news_bulletins WHERE is_featured = 1 AND is_published = 1 ORDER BY publish_date DESC LIMIT 5");
        } else {
            $stmt = $pdo->query("SELECT * FROM news_bulletins WHERE is_published = 1 ORDER BY is_featured DESC, publish_date DESC");
        }
        echo json_encode(['status' => 'success', 'data' => $stmt->fetchAll()]);
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        if (empty($data['title'])) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Title is required']);
            exit;
        }

        $stmt = $pdo->prepare("INSERT INTO news_bulletins (title, category, publish_date, excerpt, content, image_url, video_url, circular_pdf_url, is_featured, is_published) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $data['title'],
            $data['category'] ?? 'Official Notice',
            $data['publish_date'] ?? date('Y-m-d'),
            $data['excerpt'] ?? '',
            $data['content'] ?? null,
            $data['image_url'] ?? null,
            $data['video_url'] ?? null,
            $data['circular_pdf_url'] ?? null,
            !empty($data['is_featured']) ? 1 : 0,
            isset($data['is_published']) ? ($data['is_published'] ? 1 : 0) : 1
        ]);

        echo json_encode(['status' => 'success', 'message' => 'News bulletin published', 'id' => $pdo->lastInsertId()]);
        break;

    case 'PUT':
        $data = json_decode(file_get_contents('php://input'), true);
        if (empty($data['id'])) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'ID is required']);
            exit;
        }

        $stmt = $pdo->prepare("UPDATE news_bulletins SET title = ?, category = ?, publish_date = ?, excerpt = ?, content = ?, image_url = ?, video_url = ?, circular_pdf_url = ?, is_featured = ?, is_published = ? WHERE id = ?");
        $stmt->execute([
            $data['title'],
            $data['category'] ?? 'Official Notice',
            $data['publish_date'] ?? date('Y-m-d'),
            $data['excerpt'] ?? '',
            $data['content'] ?? null,
            $data['image_url'] ?? null,
            $data['video_url'] ?? null,
            $data['circular_pdf_url'] ?? null,
            !empty($data['is_featured']) ? 1 : 0,
            isset($data['is_published']) ? ($data['is_published'] ? 1 : 0) : 1,
            $data['id']
        ]);

        echo json_encode(['status' => 'success', 'message' => 'News bulletin updated']);
        break;

    case 'DELETE':
        $id = $_GET['id'] ?? (json_decode(file_get_contents('php://input'), true)['id'] ?? null);
        if (!$id) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'ID is required']);
            exit;
        }

        $stmt = $pdo->prepare("DELETE FROM news_bulletins WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(['status' => 'success', 'message' => 'News bulletin deleted']);
        break;

    default:
        http_response_code(405);
        echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
        break;
}
