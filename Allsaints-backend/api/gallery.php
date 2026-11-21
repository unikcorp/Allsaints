<?php
/**
 * Module 12: Gallery API
 * Manage Photo Albums, Individual Photos, and Video Embeds
 */

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/db.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $type = $_GET['type'] ?? 'albums';

        if ($type === 'videos') {
            $stmt = $pdo->query("SELECT * FROM gallery_videos ORDER BY id DESC");
            echo json_encode(['status' => 'success', 'data' => $stmt->fetchAll()]);
            exit;
        }

        // Fetch albums with photos
        $stmt = $pdo->query("SELECT * FROM gallery_albums ORDER BY display_order ASC, id DESC");
        $albums = $stmt->fetchAll();

        foreach ($albums as &$alb) {
            $pStmt = $pdo->prepare("SELECT * FROM gallery_photos WHERE album_id = ?");
            $pStmt->execute([$alb['id']]);
            $alb['photos'] = $pStmt->fetchAll();
            $alb['photoCount'] = count($alb['photos']);
        }

        echo json_encode(['status' => 'success', 'data' => $albums]);
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        $type = $data['type'] ?? 'album';

        if ($type === 'video') {
            $stmt = $pdo->prepare("INSERT INTO gallery_videos (title, category, youtube_url, thumbnail_url, duration) VALUES (?, ?, ?, ?, ?)");
            $stmt->execute([
                $data['title'],
                $data['category'] ?? 'Campus Life',
                $data['youtube_url'],
                $data['thumbnail_url'] ?? null,
                $data['duration'] ?? '3:00'
            ]);
            echo json_encode(['status' => 'success', 'message' => 'Video added', 'id' => $pdo->lastInsertId()]);
            exit;
        }

        // Add album
        $stmt = $pdo->prepare("INSERT INTO gallery_albums (title, subtitle, category, cover_image_url, display_order) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([
            $data['title'],
            $data['subtitle'] ?? '',
            $data['category'] ?? 'General',
            $data['cover_image_url'] ?? '/images/infrastructure/infra-campus.jpg',
            $data['display_order'] ?? 1
        ]);
        $albumId = $pdo->lastInsertId();

        // Add photos if provided
        if (!empty($data['photos']) && is_array($data['photos'])) {
            $photoStmt = $pdo->prepare("INSERT INTO gallery_photos (album_id, image_url, caption) VALUES (?, ?, ?)");
            foreach ($data['photos'] as $p) {
                $photoStmt->execute([$albumId, $p['image_url'], $p['caption'] ?? '']);
            }
        }

        echo json_encode(['status' => 'success', 'message' => 'Album created', 'id' => $albumId]);
        break;

    case 'DELETE':
        $id = $_GET['id'] ?? (json_decode(file_get_contents('php://input'), true)['id'] ?? null);
        $type = $_GET['type'] ?? 'album';

        if (!$id) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'ID required']);
            exit;
        }

        $table = ($type === 'video') ? 'gallery_videos' : 'gallery_albums';
        $stmt = $pdo->prepare("DELETE FROM $table WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(['status' => 'success', 'message' => 'Deleted successfully']);
        break;

    default:
        http_response_code(405);
        echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
        break;
}
