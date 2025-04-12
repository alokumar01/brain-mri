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
if (!$data || !isset($data['role']) || !isset($data['email']) || !isset($data['password'])) {
  echo json_encode(['success' => false, 'message' => 'Missing required fields']);
  exit;
}

$email = $data['email'];
$password = $data['password'];
$role = $data['role'];

$collection = $role === 'doctor' ? $db->doctors : $db->patients;
$user = $collection->findOne(['email' => $email]);

if ($user && password_verify($password, $user['password'])) {
  $_SESSION['user_id'] = $role === 'doctor' ? $user['doc_id'] : $user['pat_id'];
  $_SESSION['role'] = $role;
  echo json_encode([
    'success' => true,
    'user_id' => $_SESSION['user_id'],
    'role' => $role
  ]);
} else {
  echo json_encode(['success' => false, 'message' => 'Invalid email or password']);
}