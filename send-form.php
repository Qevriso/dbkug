<?php
// ===============================
// НАСТРОЙКИ
// ===============================
$to = 'qevriso@gmail.com'; // КУДА ПРИХОДИТ ПИСЬМО
$siteName = 'Буровая компания Горобцова А.С.';
$rawHost = $_SERVER['HTTP_HOST'] ?? '';
$host = preg_replace('/[^a-z0-9.\-]/i', '', $rawHost);
if ($host === '') {
  $host = 'localhost';
}
$fromEmail = 'no-reply@' . $host;

header('Content-Type: application/json; charset=UTF-8');

// ===============================
// ПРОВЕРКА МЕТОДА
// ===============================
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['success' => false, 'message' => 'Method not allowed']);
  exit;
}

// ===============================
// СБОР ДАННЫХ
// ===============================
$data = $_POST;
$messageLines = [];

foreach ($data as $key => $value) {
  if (is_array($value)) {
    $value = implode(', ', $value);
  }
  $value = trim(strip_tags($value));
  if ($value !== '') {
    $messageLines[] = ucfirst($key) . ': ' . $value;
  }
}

if (empty($messageLines)) {
  echo json_encode(['success' => false, 'message' => 'Пустая форма']);
  exit;
}

// ===============================
// ПИСЬМО
// ===============================
$subject = 'Заявка с сайта — ' . $siteName;
$message = implode("\n", $messageLines);

$headers = [];
$headers[] = 'From: ' . $siteName . ' <' . $fromEmail . '>';
$headers[] = 'Content-Type: text/plain; charset=UTF-8';

$sent = mail(
  $to,
  '=?UTF-8?B?' . base64_encode($subject) . '?=',
  $message,
  implode("\r\n", $headers)
);

echo json_encode([
  'success' => $sent,
  'message' => $sent ? 'Заявка отправлена' : 'Ошибка отправки'
]);

exit;
