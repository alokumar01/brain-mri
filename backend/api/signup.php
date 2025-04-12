<?php
header("Access-Control-Allow-Origin: http://localhost:3000"); // Specific origin
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true"); // Allow credentials

require '../config/db.php';
session_start();
header('Content-Type: application/json');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
if (!$data || !isset($data['role']) || !isset($data['email']) || !isset($data['password']) || !isset($data['name'])) {
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit;
}

$role = $data['role'];
$email = $data['email'];
$password = password_hash($data['password'], PASSWORD_DEFAULT);
$name = $data['name'];

if ($role === 'doctor') {
    $collection = $db->doctors;
    if ($collection->findOne(['email' => $email])) {
        echo json_encode(['success' => false, 'message' => 'Email already exists']);
        exit;
    }
    $lastDoc = $collection->find([], ['sort' => ['doc_id' => -1], 'limit' => 1])->toArray();
    $nextId = $lastDoc ? (int)substr($lastDoc[0]['doc_id'], 7) + 1 : 1;
    $docId = "DOC-ID-" . str_pad($nextId, 4, "0", STR_PAD_LEFT);

    $result = $collection->insertOne([
        'doc_id' => $docId,
        'email' => $email,
        'password' => $password,
        'name' => $name,
        'specialization' => $data['specialization'] ?? '',
        'created_at' => new MongoDB\BSON\UTCDateTime()
    ]);
    $_SESSION['user_id'] = $docId;
    $_SESSION['role'] = 'doctor';
    $response = ['success' => true, 'doc_id' => $docId];
} elseif ($role === 'patient') {
    $collection = $db->patients;
    if ($collection->findOne(['email' => $email])) {
        echo json_encode(['success' => false, 'message' => 'Email already exists']);
        exit;
    }
    $lastPat = $collection->find([], ['sort' => ['pat_id' => -1], 'limit' => 1])->toArray();
    $nextId = $lastPat ? (int)substr($lastPat[0]['pat_id'], 7) + 1 : 1;
    $patId = "PAT-ID-" . str_pad($nextId, 4, "0", STR_PAD_LEFT);

    $result = $collection->insertOne([
        'pat_id' => $patId,
        'email' => $email,
        'password' => $password,
        'name' => $name,
        'phone' => $data['phone'] ?? '',
        'created_at' => new MongoDB\BSON\UTCDateTime()
    ]);
    $_SESSION['user_id'] = $patId;
    $_SESSION['role'] = 'patient';
    $response = ['success' => true, 'pat_id' => $patId];
} else {
    $response = ['success' => false, 'message' => 'Invalid role'];
}

echo json_encode($response);