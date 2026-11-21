<?php
/**
 * Module 10: Results & Toppers API
 * Class X and XII Board Exam Statistics & High Scorers
 */

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/db.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        // Fetch all board results with their nested toppers
        $stmt = $pdo->query("SELECT * FROM board_results ORDER BY academic_year DESC, standard ASC");
        $results = $stmt->fetchAll();

        foreach ($results as &$r) {
            $tStmt = $pdo->prepare("SELECT * FROM result_toppers WHERE result_id = ? ORDER BY percentage DESC");
            $tStmt->execute([$r['id']]);
            $r['toppers'] = $tStmt->fetchAll();
        }

        echo json_encode(['status' => 'success', 'data' => $results]);
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        if (empty($data['standard']) || empty($data['total_registered']) || empty($data['total_passed'])) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Standard, registered, and passed counts required']);
            exit;
        }

        $reg = (int)$data['total_registered'];
        $pas = (int)$data['total_passed'];
        $pct = $data['pass_percentage'] ?? (($reg > 0) ? round(($pas / $reg) * 100, 2) : 100.00);

        $stmt = $pdo->prepare("INSERT INTO board_results (academic_year, standard, total_registered, total_passed, pass_percentage, distinction_count, remarks) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $data['academic_year'] ?? '2025-2026',
            $data['standard'],
            $reg,
            $pas,
            $pct,
            (int)($data['distinction_count'] ?? 0),
            $data['remarks'] ?? '100% Pass Record'
        ]);

        $resultId = $pdo->lastInsertId();

        // Insert toppers if provided
        if (!empty($data['toppers']) && is_array($data['toppers'])) {
            $topStmt = $pdo->prepare("INSERT INTO result_toppers (result_id, student_name, stream, percentage, grade, photo_url) VALUES (?, ?, ?, ?, ?, ?)");
            foreach ($data['toppers'] as $top) {
                $topStmt->execute([
                    $resultId,
                    $top['student_name'],
                    $top['stream'] ?? 'Science',
                    (float)($top['percentage'] ?? 0),
                    $top['grade'] ?? 'Full A1',
                    $top['photo_url'] ?? null
                ]);
            }
        }

        echo json_encode(['status' => 'success', 'message' => 'Result record created', 'id' => $resultId]);
        break;

    case 'DELETE':
        $id = $_GET['id'] ?? (json_decode(file_get_contents('php://input'), true)['id'] ?? null);
        if (!$id) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'ID is required']);
            exit;
        }
        $stmt = $pdo->prepare("DELETE FROM board_results WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(['status' => 'success', 'message' => 'Result deleted']);
        break;

    default:
        http_response_code(405);
        echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
        break;
}
