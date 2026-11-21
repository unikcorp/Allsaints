<?php
/**
 * Module 6: Enrollment API
 * Class-wise student strength distribution
 */

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/db.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $year = $_GET['year'] ?? null;
        if ($year) {
            $stmt = $pdo->prepare("SELECT * FROM enrollment_statistics WHERE academic_year = ? ORDER BY id ASC");
            $stmt->execute([$year]);
        } else {
            $stmt = $pdo->query("SELECT * FROM enrollment_statistics ORDER BY academic_year DESC, id ASC");
        }
        $records = $stmt->fetchAll();

        // Calculate summary
        $totalBoys = 0;
        $totalGirls = 0;
        foreach ($records as $r) {
            $totalBoys += (int)$r['boys_count'];
            $totalGirls += (int)$r['girls_count'];
        }

        echo json_encode([
            'status' => 'success',
            'summary' => [
                'total_students' => $totalBoys + $totalGirls,
                'total_boys' => $totalBoys,
                'total_girls' => $totalGirls
            ],
            'data' => $records
        ]);
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        $boys = (int)($data['boys_count'] ?? 0);
        $girls = (int)($data['girls_count'] ?? 0);
        $total = $boys + $girls;

        $stmt = $pdo->prepare("INSERT INTO enrollment_statistics (academic_year, class_grade, section, stream, boys_count, girls_count, total_count) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $data['academic_year'] ?? '2025-2026',
            $data['class_grade'],
            $data['section'] ?? 'A',
            $data['stream'] ?? 'General',
            $boys,
            $girls,
            $total
        ]);

        echo json_encode(['status' => 'success', 'message' => 'Enrollment record added', 'id' => $pdo->lastInsertId()]);
        break;

    case 'DELETE':
        $id = $_GET['id'] ?? (json_decode(file_get_contents('php://input'), true)['id'] ?? null);
        if (!$id) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'ID is required']);
            exit;
        }
        $stmt = $pdo->prepare("DELETE FROM enrollment_statistics WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(['status' => 'success', 'message' => 'Record deleted']);
        break;

    default:
        http_response_code(405);
        echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
        break;
}
