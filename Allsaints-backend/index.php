<?php
/**
 * All Saints Public School - PHP REST API Backend
 * Health Check & API Route Directory
 */

require_once __DIR__ . '/config/cors.php';

echo json_encode([
    'name' => 'All Saints Public School - PHP Backend API',
    'status' => 'ONLINE',
    'version' => '1.0.0',
    'school' => 'All Saints Public School, Pannivizha, Adoor',
    'cbse_affiliation' => '930501',
    'routes' => [
        'POST /api/auth.php' => 'Admin Authentication & Login',
        'POST /api/upload.php' => 'Image & PDF File Uploads',
        'GET|POST|PUT|DELETE /api/management.php' => 'Module 1: Our Management',
        'GET|POST|PUT|DELETE /api/committee.php' => 'Module 2: PTA & SMC Committee',
        'GET|POST|PUT|DELETE /api/faculty.php' => 'Module 3: Faculty & Staff',
        'GET|POST|DELETE /api/annual-reports.php' => 'Module 4: Annual Reports',
        'GET|POST|DELETE /api/achievements.php' => 'Module 5: School Achievements',
        'GET|POST|DELETE /api/enrollment.php' => 'Module 6: Student Enrollment',
        'GET|POST|PUT|DELETE /api/fee-structure.php' => 'Module 7: Fee Structure',
        'GET|POST|DELETE /api/calendar.php' => 'Module 8: Academic Calendar',
        'GET|POST|DELETE /api/parliament.php' => 'Module 9: School Parliament',
        'GET|POST|DELETE /api/results.php' => 'Module 10: Board Results & Toppers',
        'GET|POST|PUT /api/admissions.php' => 'Module 11: Online Admission Portal',
        'GET|POST|DELETE /api/gallery.php' => 'Module 12: Photo & Video Gallery',
        'GET|POST|PUT|DELETE /api/news.php' => 'Module 13: News & Bulletins',
        'GET|POST|PUT|DELETE /api/documents.php' => 'Module 14: CBSE Statutory Documents',
        'GET|POST|PUT /api/complaints.php' => 'Module 15: Grievances Redressal Cell',
        'GET|POST|PUT|DELETE /api/contact.php' => 'Module 16: Contact & Enquiries',
    ]
], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
