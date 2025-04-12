<?php
require '../config/db.php';
session_start();
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');

if (!isset($_SESSION['user_id'])) {
  echo json_encode(['success' => false, 'message' => 'Unauthorized']);
  exit;
}

$collection = $db->mri_images;
$userId = $_SESSION['user_id'];
$role = $_SESSION['role'];

if ($role === 'patient') {
  $cursor = $collection->find(['pat_id' => $userId]);
} else if ($role === 'doctor') {
  // Get patients assigned to this doctor from doc_patients
  $patientsCollection = $db->doc_patients; // Updated to doc_patients
  $patientIds = array_map(function($doc) {
    return $doc['_id'];
  }, iterator_to_array($patientsCollection->find(['doc_id' => $userId])));
  
  if (empty($patientIds)) {
    $reports = [];
  } else {
    $cursor = $collection->find(['pat_id' => ['$in' => $patientIds]]);
    $reports = array_map(function($doc) {
      return [
        '_id' => (string)$doc['_id'],
        'pat_id' => $doc['pat_id'],
        'metadata' => $doc['metadata'],
        'analysis' => $doc['analysis']
      ];
    }, iterator_to_array($cursor));
  }
} else {
  echo json_encode(['success' => false, 'message' => 'Invalid role']);
  exit;
}

$reports = $role === 'patient' ? iterator_to_array($cursor) : $reports;
echo json_encode(['success' => true, 'reports' => $reports]);