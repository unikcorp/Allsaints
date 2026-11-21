<?php
/**
 * Module 8: Academic Calendar API
 * School working days, holidays, examination dates
 */

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/db.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $month = $_GET['month'] ?? null;
        if ($month) {
            $stmt = $pdo->prepare("SELECT * FROM academic_calendar_events WHERE MONTH(start_date) = ? ORDER BY start_date ASC");
            $stmt->execute([$month]);
        } else {
            $stmt = $pdo->query("SELECT * FROM academic_calendar_events ORDER BY start_date ASC");
        }
        echo json_encode(['status' => 'success', 'data' => $stmt->fetchAll()]);
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        if (empty($data['title']) || empty($data['start_date'])) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Title and start date required']);
            exit;
        }

        $stmt = $pdo->prepare("INSERT INTO academic_calendar_events (academic_year, title, event_type, start_date, end_date, applicable_for, description, calendar_pdf_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $data['academic_year'] ?? '2026-2027',
            $data['title'],
            $data['event_type'] ?? 'CELEBRATION',
            $data['start_date'],
            $data['end_date'] ?? null,
            $data['applicable_for'] ?? 'All Classes',
            $data['description'] ?? null,
            $data['calendar_pdf_url'] ?? null
        ]);

        echo json_encode(['status' => 'success', 'message' => 'Event added to calendar', 'id' => $pdo->lastInsertId()]);
        break;

    case 'DELETE':
        $id = $_GET['id'] ?? (json_decode(file_get_contents('php://input'), true)['id'] ?? null);
        if (!$id) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'ID is required']);
            exit;
        }
        $stmt = $pdo->prepare("DELETE FROM academic_calendar_events WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(['status' => 'success', 'message' => 'Event deleted']);
        break;

    default:
        http_response_code(405);
        echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
        break;
}
