<?php
require '../config/db.php';
session_start();
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');

if (!isset($_SESSION['user_id'])) {
  echo json_encode(['success' => false, 'message' => 'Unauthorized']);
  exit;
}

$scanId = $_POST['scan_id'] ?? '';
error_log("Received scan_id: " . var_export($scanId, true)); // Detailed debug log
if (!$scanId) {
  echo json_encode(['success' => false, 'message' => 'No scan ID provided']);
  exit;
}

// Validate if the scan_id is a valid MongoDB ObjectId (24 hex characters)
if (!preg_match('/^[a-fA-F0-9]{24}$/', $scanId)) {
  echo json_encode(['success' => false, 'message' => 'Invalid scan ID format']);
  exit;
}

$collection = $db->mri_images;
try {
  $scan = $collection->findOne(['_id' => new MongoDB\BSON\ObjectId($scanId)]);
  if (!$scan) {
    echo json_encode(['success' => false, 'message' => 'Scan not found']);
    exit;
  }
} catch (MongoDB\Driver\Exception\InvalidArgumentException $e) {
  error_log("ObjectId error: " . $e->getMessage());
  echo json_encode(['success' => false, 'message' => 'Invalid scan ID format']);
  exit;
}

$projectRoot = realpath(__DIR__ . '/../../');
$pythonPath = 'C:/Python313/python.exe';
$outputPath = $projectRoot . '/backend/api/uploads/report_' . $scanId . '.pdf';
$jsonPath = $projectRoot . '/backend/api/uploads/temp_' . $scanId . '.json';

// Prepare data for PDF generation
$data = [
  'pat_id' => $scan['pat_id'],
  'scan_date' => $scan['metadata']['scan_date'],
  'description' => $scan['metadata']['description'],
  'tumor_size' => $scan['analysis']['tumor_size'],
  'risk' => $scan['analysis']['risk'],
  'doc_id' => $scan['doc_id'],
  'image_path' => $projectRoot . '/backend/api/' . $scan['file_path']
];

// Save JSON file
file_put_contents($jsonPath, json_encode($data));

// Execute Python script to generate PDF
$command = escapeshellarg($pythonPath) . " " . escapeshellarg($projectRoot . '/processing/generate_pdf.py') . " " . 
          escapeshellarg($outputPath) . " " . escapeshellarg($jsonPath);
$execOutput = shell_exec($command . " 2>&1");

// Log the command and output for debugging
error_log("Generate PDF Command: " . $command);
error_log("Generate PDF Output: " . ($execOutput ?: 'No output'));
error_log("Output Path: " . $outputPath);
error_log("JSON Path: " . $jsonPath);
error_log("File exists after exec: " . (file_exists($outputPath) ? 'Yes' : 'No'));

// Check if the PDF was successfully generated
if (file_exists($outputPath)) {
  header('Content-Type: application/pdf');
  header('Content-Disposition: attachment; filename="mri_report_' . $scanId . '.pdf"');
  header('Content-Length: ' . filesize($outputPath));
  readfile($outputPath);

  // Clean up: Delete the generated files after sending the response
  unlink($outputPath);
  unlink($jsonPath);
  exit;
} else {
  echo json_encode(['success' => false, 'message' => 'PDF generation failed - ' . ($execOutput ?: 'No output from Python')]);
  if (file_exists($jsonPath)) unlink($jsonPath);
  exit;
}