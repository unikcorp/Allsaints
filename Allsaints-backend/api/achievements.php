<?php
/**
 * Module 5: Achievements API
 * Sports, Academic, Science, and Cultural Trophies & Medals
 */

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/db.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $cat = $_GET['category'] ?? null;
        if ($cat) {
            $stmt = $pdo->prepare("SELECT * FROM achievements WHERE category = ? ORDER BY event_date DESC");
            $stmt->execute([$cat]);
        } else {
            $stmt = $pdo->query("SELECT * FROM achievements ORDER BY event_date DESC");
        }
        echo json_encode(['status' => 'success', 'data' => $stmt->fetchAll()]);
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        if (empty($data['title']) || empty($data['winner_name'])) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Title and winner name are required']);
            exit;
        }

        $stmt = $pdo->prepare("INSERT INTO achievements (title, category, level, winner_name, class_grade, award_title, event_date, photo_url, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $data['title'],
            $data['category'] ?? 'ACADEMIC',
            $data['level'] ?? 'DISTRICT',
            $data['winner_name'],
            $data['class_grade'] ?? null,
            $data['award_title'] ?? 'First Prize',
            $data['event_date'] ?? date('Y-m-d'),
            $data['photo_url'] ?? null,
            $data['description'] ?? null
        ]);

        echo json_encode(['status' => 'success', 'message' => 'Achievement recorded', 'id' => $pdo->lastInsertId()]);
        break;

    case 'DELETE':
        $id = $_GET['id'] ?? (json_decode(file_get_contents('php://input'), true)['id'] ?? null);
        if (!$id) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'ID is required']);
            exit;
        }
        $stmt = $pdo->prepare("DELETE FROM achievements WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(['status' => 'success', 'message' => 'Achievement deleted']);
        break;

    default:
        http_response_code(405);
        echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
        break;
}
