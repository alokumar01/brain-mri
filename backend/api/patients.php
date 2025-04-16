<?php
require '../config/db.php';
session_start();

// CORS Headers
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');

// Check if doctor is logged in
if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'doctor') {
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

// Log session info for debugging
error_log("User ID: " . $_SESSION['user_id'] . ", Role: " . $_SESSION['role']);

// Make sure doc_id is in session, or fallback to user_id if you’re storing doc_id there
$docId = $_SESSION['doc_id'] ?? $_SESSION['user_id'];
error_log("DOC ID in session: " . $docId);

// Query doc_patients collection
$collection = $db->doc_patients;
$query = ['doc_id' => $docId];
error_log("Querying doc_patients with: " . json_encode($query));
$cursor = $collection->find($query);

// Prepare response
// $patients = [];

foreach ($cursor as $doc) {
    $patients[] = [
        'pat_id' => $doc['pat_id'],
        'name' => $doc['name']
    ];
}

error_log("Patients Found: " . json_encode($patients));

if (count($patients) === 0) {
    echo json_encode(['success' => true, 'patients' => [], 'message' => 'No patients found.']);
} else {
    echo json_encode(['success' => true, 'patients' => $patients]);
}
?>
