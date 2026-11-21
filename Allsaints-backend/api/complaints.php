<?php
/**
 * Module 15: Complaints & Grievances API
 * Student and Parent Redressal Cell
 */

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/db.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $ticket = $_GET['ticket'] ?? null;
        if ($ticket) {
            $stmt = $pdo->prepare("SELECT ticket_no, complainant_name, category, subject, status, resolution_notes, created_at FROM complaints_grievances WHERE ticket_no = ? LIMIT 1");
            $stmt->execute([$ticket]);
            $record = $stmt->fetch();
            if ($record) {
                echo json_encode(['status' => 'success', 'data' => $record]);
            } else {
                http_response_code(404);
                echo json_encode(['status' => 'error', 'message' => 'Ticket not found']);
            }
            exit;
        }

        // Admin list all grievances
        $stmt = $pdo->query("SELECT * FROM complaints_grievances ORDER BY created_at DESC");
        echo json_encode(['status' => 'success', 'data' => $stmt->fetchAll()]);
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        if (empty($data['complainant_name']) || empty($data['phone']) || empty($data['description'])) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Name, phone, and grievance description required']);
            exit;
        }

        $year = date('Y');
        $randomSeq = strtoupper(bin2hex(random_bytes(2)));
        $ticketNo = "GRV-$year-$randomSeq";

        $stmt = $pdo->prepare("INSERT INTO complaints_grievances (ticket_no, complainant_name, user_type, phone, email, category, subject, description, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $ticketNo,
            $data['complainant_name'],
            $data['user_type'] ?? 'Parent',
            $data['phone'],
            $data['email'] ?? '',
            $data['category'] ?? 'Academics',
            $data['subject'] ?? 'General Grievance',
            $data['description'],
            'SUBMITTED'
        ]);

        echo json_encode([
            'status' => 'success',
            'message' => 'Grievance submitted successfully',
            'ticket_no' => $ticketNo
        ]);
        break;

    case 'PUT':
        // Admin update status and resolution notes
        $data = json_decode(file_get_contents('php://input'), true);
        if (empty($data['id']) || empty($data['status'])) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'ID and status required']);
            exit;
        }

        $stmt = $pdo->prepare("UPDATE complaints_grievances SET status = ?, resolution_notes = ? WHERE id = ?");
        $stmt->execute([
            $data['status'],
            $data['resolution_notes'] ?? null,
            $data['id']
        ]);

        echo json_encode(['status' => 'success', 'message' => 'Grievance ticket updated']);
        break;

    default:
        http_response_code(405);
        echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
        break;
}
