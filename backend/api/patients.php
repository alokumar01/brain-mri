<?php
require '../config/db.php';
session_start();
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');

if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'doctor') {
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

error_log("User ID: " . $_SESSION['user_id'] . ", Role: " . $_SESSION['role']); // Debug

$collection = $db->doc_patients;
$cursor = $collection->find(['doc_id' => $_SESSION['user_id']]);

$patients = [];

foreach ($cursor as $doc) {
    $patients[] = [
        'pat_id' => $doc['pat_id'], // Ensure this is `pat_id`
        'name' => $doc['name']
    ];
}

error_log("Patients Found: " . json_encode($patients)); // Debug
echo json_encode(['success' => true, 'patients' => $patients]);
?>
