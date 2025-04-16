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

$reports = [];

try {
  if ($role === 'patient') {
    // Fetch reports for the logged-in patient
    $cursor = $collection->find(['pat_id' => $userId]);
    // Convert _id to string for patient role
    $reports = array_map(function($doc) {
      return [
        '_id' => (string)$doc['_id'], // Explicitly cast to string
        'pat_id' => $doc['pat_id'],
        'doc_id' => $doc['doc_id'],
        'file_path' => $doc['file_path'],
        'pdf_path' => $doc['pdf_path'],
        'metadata' => $doc['metadata'],
        'analysis' => $doc['analysis']
      ];
    }, iterator_to_array($cursor));
  } else if ($role === 'doctor') {
    // Get patients assigned to this doctor
    $patientsCollection = $db->doc_patients;
    $patientIds = array_map(function($doc) {
      return $doc['_id'];
    }, iterator_to_array($patientsCollection->find(['doc_id' => $userId])));
    
    if (!empty($patientIds)) {
      $cursor = $collection->find(['pat_id' => ['$in' => $patientIds]]);
      $reports = array_map(function($doc) {
        return [
          '_id' => (string)$doc['_id'], // Explicitly cast to string
          'pat_id' => $doc['pat_id'],
          'doc_id' => $doc['doc_id'],
          'file_path' => $doc['file_path'],
          'pdf_path' => $doc['pdf_path'],
          'metadata' => $doc['metadata'],
          'analysis' => $doc['analysis']
        ];
      }, iterator_to_array($cursor));
    }
  } else {
    echo json_encode(['success' => false, 'message' => 'Invalid role']);
    exit;
  }
} catch (Exception $e) {
  echo json_encode(['success' => false, 'message' => 'Error fetching reports: ' . $e->getMessage()]);
  exit;
}

echo json_encode(['success' => true, 'reports' => $reports]);