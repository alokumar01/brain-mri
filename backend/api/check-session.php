<?php
require '../config/db.php';
session_start();
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Credentials: true');

echo json_encode([
  'isLoggedIn' => isset($_SESSION['user_id']),
  'role' => $_SESSION['role'] ?? null
]);