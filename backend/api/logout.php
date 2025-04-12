<?php
require '../config/db.php';
session_start();
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(200);
  exit;
}

session_unset(); // Clear all session variables
session_destroy(); // Destroy the session

echo json_encode(['success' => true, 'message' => 'Logged out successfully']);