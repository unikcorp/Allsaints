<?php
/**
 * Module 11: Online Admission Portal API
 * Application submission, status check, and admin management
 */

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/db.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $appNo = $_GET['app_no'] ?? null;
        $pin = $_GET['pin'] ?? null;

        // Parent tracking status check
        if ($appNo && $pin) {
            $stmt = $pdo->prepare("SELECT application_no, student_name, class_applied, status, created_at FROM admission_applications WHERE application_no = ? AND tracking_pin = ? LIMIT 1");
            $stmt->execute([$appNo, $pin]);
            $record = $stmt->fetch();
            if ($record) {
                echo json_encode(['status' => 'success', 'data' => $record]);
            } else {
                http_response_code(404);
                echo json_encode(['status' => 'error', 'message' => 'Application not found or invalid PIN']);
            }
            exit;
        }

        // Admin list all applications
        $statusFilter = $_GET['status'] ?? null;
        if ($statusFilter) {
            $stmt = $pdo->prepare("SELECT * FROM admission_applications WHERE status = ? ORDER BY created_at DESC");
            $stmt->execute([$statusFilter]);
        } else {
            $stmt = $pdo->query("SELECT * FROM admission_applications ORDER BY created_at DESC");
        }
        echo json_encode(['status' => 'success', 'data' => $stmt->fetchAll()]);
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        if (empty($data['student_name']) || empty($data['class_applied']) || empty($data['father_phone'])) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Student name, class applied, and father phone required']);
            exit;
        }

        // Generate unique Application Number and 4-digit PIN
        $year = date('Y');
        $randomSeq = strtoupper(bin2hex(random_bytes(2)));
        $appNumber = "ASPS-$year-$randomSeq";
        $pin = (string)rand(1000, 9999);

        $stmt = $pdo->prepare("INSERT INTO admission_applications (application_no, student_name, gender, dob, blood_group, class_applied, academic_year, father_name, father_phone, mother_name, mother_phone, email, residential_address, student_photo_url, birth_cert_url, status, tracking_pin) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $appNumber,
            $data['student_name'],
            $data['gender'] ?? 'Male',
            $data['dob'] ?? '2018-01-01',
            $data['blood_group'] ?? null,
            $data['class_applied'],
            $data['academic_year'] ?? "$year-" . ($year + 1),
            $data['father_name'] ?? 'Father',
            $data['father_phone'],
            $data['mother_name'] ?? 'Mother',
            $data['mother_phone'] ?? null,
            $data['email'] ?? 'parent@email.com',
            $data['residential_address'] ?? 'Adoor, Kerala',
            $data['student_photo_url'] ?? null,
            $data['birth_cert_url'] ?? null,
            'PENDING',
            $pin
        ]);

        echo json_encode([
            'status' => 'success',
            'message' => 'Admission application submitted successfully',
            'application_no' => $appNumber,
            'tracking_pin' => $pin
        ]);
        break;

    case 'PUT':
        // Admin update application status
        $data = json_decode(file_get_contents('php://input'), true);
        if (empty($data['id']) || empty($data['status'])) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'ID and status required']);
            exit;
        }

        $stmt = $pdo->prepare("UPDATE admission_applications SET status = ? WHERE id = ?");
        $stmt->execute([$data['status'], $data['id']]);
        echo json_encode(['status' => 'success', 'message' => 'Status updated']);
        break;

    default:
        http_response_code(405);
        echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
        break;
}
