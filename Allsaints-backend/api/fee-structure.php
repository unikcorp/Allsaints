<?php
/**
 * Module 7: Fee Structure API
 * Manage Grade-wise Tuition and Lab Fees
 */

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/db.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $stmt = $pdo->query("SELECT * FROM fee_structures ORDER BY id ASC");
        echo json_encode(['status' => 'success', 'data' => $stmt->fetchAll()]);
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        $tuition = (float)($data['tuition_fee'] ?? 0);
        $annual = (float)($data['annual_charges'] ?? 0);
        $lab = (float)($data['computer_lab_fee'] ?? 0);
        $total = $data['total_annual'] ?? ($tuition + $annual + $lab);

        $stmt = $pdo->prepare("INSERT INTO fee_structures (academic_year, grade_category, tuition_fee, annual_charges, computer_lab_fee, total_annual, payment_terms, official_pdf_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $data['academic_year'] ?? '2026-2027',
            $data['grade_category'],
            $tuition,
            $annual,
            $lab,
            $total,
            $data['payment_terms'] ?? '3 Term Installments',
            $data['official_pdf_url'] ?? null
        ]);

        echo json_encode(['status' => 'success', 'message' => 'Fee structure added', 'id' => $pdo->lastInsertId()]);
        break;

    case 'PUT':
        $data = json_decode(file_get_contents('php://input'), true);
        if (empty($data['id'])) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'ID is required']);
            exit;
        }

        $tuition = (float)($data['tuition_fee'] ?? 0);
        $annual = (float)($data['annual_charges'] ?? 0);
        $lab = (float)($data['computer_lab_fee'] ?? 0);
        $total = $data['total_annual'] ?? ($tuition + $annual + $lab);

        $stmt = $pdo->prepare("UPDATE fee_structures SET academic_year = ?, grade_category = ?, tuition_fee = ?, annual_charges = ?, computer_lab_fee = ?, total_annual = ?, payment_terms = ?, official_pdf_url = ? WHERE id = ?");
        $stmt->execute([
            $data['academic_year'] ?? '2026-2027',
            $data['grade_category'],
            $tuition,
            $annual,
            $lab,
            $total,
            $data['payment_terms'] ?? '3 Term Installments',
            $data['official_pdf_url'] ?? null,
            $data['id']
        ]);

        echo json_encode(['status' => 'success', 'message' => 'Fee structure updated']);
        break;

    case 'DELETE':
        $id = $_GET['id'] ?? (json_decode(file_get_contents('php://input'), true)['id'] ?? null);
        if (!$id) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'ID is required']);
            exit;
        }
        $stmt = $pdo->prepare("DELETE FROM fee_structures WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(['status' => 'success', 'message' => 'Fee record deleted']);
        break;

    default:
        http_response_code(405);
        echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
        break;
}
