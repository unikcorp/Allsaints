<?php
/**
 * Module 9: School Parliament API
 * Student Council, Head Boy/Girl, House Captains
 */

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/db.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $year = $_GET['year'] ?? null;
        if ($year) {
            $stmt = $pdo->prepare("SELECT * FROM student_parliament WHERE academic_year = ? ORDER BY display_order ASC");
            $stmt->execute([$year]);
        } else {
            $stmt = $pdo->query("SELECT * FROM student_parliament ORDER BY academic_year DESC, display_order ASC");
        }
        echo json_encode(['status' => 'success', 'data' => $stmt->fetchAll()]);
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        if (empty($data['portfolio']) || empty($data['student_name'])) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Portfolio and student name required']);
            exit;
        }

        $stmt = $pdo->prepare("INSERT INTO student_parliament (academic_year, portfolio, student_name, class_grade, house_name, photo_url, motto_pledge, display_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $data['academic_year'] ?? '2026-2027',
            $data['portfolio'],
            $data['student_name'],
            $data['class_grade'] ?? 'Class XII',
            $data['house_name'] ?? null,
            $data['photo_url'] ?? null,
            $data['motto_pledge'] ?? null,
            $data['display_order'] ?? 1
        ]);

        echo json_encode(['status' => 'success', 'message' => 'Parliament leader added', 'id' => $pdo->lastInsertId()]);
        break;

    case 'DELETE':
        $id = $_GET['id'] ?? (json_decode(file_get_contents('php://input'), true)['id'] ?? null);
        if (!$id) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'ID is required']);
            exit;
        }
        $stmt = $pdo->prepare("DELETE FROM student_parliament WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(['status' => 'success', 'message' => 'Leader removed']);
        break;

    default:
        http_response_code(405);
        echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
        break;
}
