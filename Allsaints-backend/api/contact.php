<?php
/**
 * Module 16: Contact Us & Enquiries API
 * General Contact Messages, Transfer Certificate requests, and Admission queries
 */

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/db.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $type = $_GET['type'] ?? null;
        if ($type) {
            $stmt = $pdo->prepare("SELECT * FROM contact_enquiries WHERE inquiry_type = ? ORDER BY created_at DESC");
            $stmt->execute([$type]);
        } else {
            $stmt = $pdo->query("SELECT * FROM contact_enquiries ORDER BY created_at DESC");
        }
        echo json_encode(['status' => 'success', 'data' => $stmt->fetchAll()]);
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        if (empty($data['name']) || empty($data['phone']) || empty($data['message'])) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Name, phone, and message are required']);
            exit;
        }

        $stmt = $pdo->prepare("INSERT INTO contact_enquiries (inquiry_type, name, email, phone, grade_interested, subject, message, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $data['inquiry_type'] ?? 'General Contact',
            $data['name'],
            $data['email'] ?? '',
            $data['phone'],
            $data['grade_interested'] ?? null,
            $data['subject'] ?? null,
            $data['message'],
            'NEW'
        ]);

        echo json_encode([
            'status' => 'success',
            'message' => 'Message submitted successfully',
            'id' => $pdo->lastInsertId()
        ]);
        break;

    case 'PUT':
        // Update inquiry status (NEW, CONTACTED, CLOSED)
        $data = json_decode(file_get_contents('php://input'), true);
        if (empty($data['id']) || empty($data['status'])) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'ID and status required']);
            exit;
        }

        $stmt = $pdo->prepare("UPDATE contact_enquiries SET status = ? WHERE id = ?");
        $stmt->execute([$data['status'], $data['id']]);
        echo json_encode(['status' => 'success', 'message' => 'Enquiry status updated']);
        break;

    case 'DELETE':
        $id = $_GET['id'] ?? (json_decode(file_get_contents('php://input'), true)['id'] ?? null);
        if (!$id) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'ID required']);
            exit;
        }

        $stmt = $pdo->prepare("DELETE FROM contact_enquiries WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(['status' => 'success', 'message' => 'Enquiry deleted']);
        break;

    default:
        http_response_code(405);
        echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
        break;
}
