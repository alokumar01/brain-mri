<?php
require '../config/db.php';
session_start();
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');

if (!isset($_SESSION['user_id'])) {
  echo json_encode(['success' => false, 'message' => 'Unauthorized']);
  exit;
}

if (!isset($_FILES['mri'])) {
  echo json_encode(['success' => false, 'message' => 'No file uploaded']);
  exit;
}

$file = $_FILES['mri'];
$uploadDir = 'uploads/';
if (!file_exists($uploadDir)) mkdir($uploadDir, 0777, true);
$imagePath = $uploadDir . uniqid() . '.' . pathinfo($file['name'], PATHINFO_EXTENSION);
move_uploaded_file($file['tmp_name'], $imagePath);

$collection = $db->mri_images;
$docId = $_SESSION['role'] === 'doctor' ? $_SESSION['user_id'] : null;
$patId = $_SESSION['role'] === 'patient' ? $_SESSION['user_id'] : $_POST['patient_id'];

$projectRoot = realpath(__DIR__ . '/../../');
$scriptPath = $projectRoot . '/processing/process_mri.py';
$fullImagePath = $projectRoot . '/backend/api/' . $imagePath;

$pythonPath = 'C:/Python313/python.exe';
$command = escapeshellarg($pythonPath) . " " . escapeshellarg($scriptPath) . " " . escapeshellarg($fullImagePath);
$analysisOutput = shell_exec($command . " 2>&1");
$analysis = json_decode($analysisOutput, true) ?? [
  'tumor_size' => 0,
  'risk' => 'Unknown: Processing failed - ' . ($analysisOutput ?: 'No output')
];

// Generate PDF
$pdfPath = $uploadDir . uniqid() . '.pdf';
$scanData = [
  'pat_id' => $patId,
  'metadata' => [
    'scan_date' => $_POST['scan_date'],
    'description' => $_POST['description']
  ],
  'analysis' => $analysis
];
$jsonData = json_encode($scanData);
$pdfScript = $projectRoot . '/processing/generate_pdf.py';
$pdfCommand = escapeshellarg($pythonPath) . " " . escapeshellarg($pdfScript) . " " . escapeshellarg($jsonData) . " " . escapeshellarg($projectRoot . '/backend/api/' . $pdfPath);
shell_exec($pdfCommand . " 2>&1");

$result = $collection->insertOne([
  'pat_id' => $patId,
  'doc_id' => $docId,
  'file_path' => $imagePath,
  'pdf_path' => $pdfPath,
  'metadata' => [
    'scan_date' => $_POST['scan_date'],
    'description' => $_POST['description']
  ],
  'analysis' => $analysis
]);

echo json_encode(['success' => true, 'scan_id' => (string)$result->getInsertedId()]);