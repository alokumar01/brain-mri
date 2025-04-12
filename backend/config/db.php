<?php
require __DIR__ . '/../vendor/autoload.php';

use MongoDB\Client;

try {
  $client = new Client("mongodb://localhost:27017");
  $db = $client->mri_project;
} catch (Exception $e) {
  die(json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]));
}