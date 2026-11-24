<?php
// Minimal read-only MCP server (Streamable HTTP, stateless JSON responses).
// Served at https://itsnocap.com/mcp via .htaccess.

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Accept, Mcp-Session-Id, Mcp-Protocol-Version');

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
if ($method === 'OPTIONS') { http_response_code(204); exit; }
if ($method !== 'POST') {
    http_response_code(405);
    header('Allow: POST, OPTIONS');
    header('Content-Type: application/json');
    echo json_encode(['error' => 'This MCP endpoint accepts JSON-RPC over POST. See /.well-known/mcp/server-card.json']);
    exit;
}

$site = json_decode((string) @file_get_contents(__DIR__ . '/data/site.json'), true) ?: [];

$tools = [
    ['name' => 'list_services', 'description' => 'List the marketing services NOCAP offers, with a description and tags for each.',
     'inputSchema' => ['type' => 'object', 'properties' => new stdClass()], 'annotations' => ['readOnlyHint' => true]],
    ['name' => 'get_case_studies', 'description' => 'Get NOCAP case studies, headline stats and brands worked with.',
     'inputSchema' => ['type' => 'object', 'properties' => new stdClass()], 'annotations' => ['readOnlyHint' => true]],
    ['name' => 'get_contact_details', 'description' => "Get NOCAP's contact email, phone, address, Instagram profile and cities.",
     'inputSchema' => ['type' => 'object', 'properties' => new stdClass()], 'annotations' => ['readOnlyHint' => true]],
];

function result_text($value) {
    return ['content' => [['type' => 'text', 'text' => json_encode($value, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE)]]];
}

function handle($msg, $site, $tools) {
    if (!is_array($msg) || ($msg['jsonrpc'] ?? null) !== '2.0' || !isset($msg['method'])) {
        return ['jsonrpc' => '2.0', 'id' => null, 'error' => ['code' => -32600, 'message' => 'Invalid Request']];
    }
    $id = $msg['id'] ?? null;
    $isNotification = !array_key_exists('id', $msg);
    $params = $msg['params'] ?? [];

    switch ($msg['method']) {
        case 'initialize':
            $requested = $params['protocolVersion'] ?? '2025-06-18';
            $supported = ['2025-06-18', '2025-03-26', '2024-11-05'];
            $result = [
                'protocolVersion' => in_array($requested, $supported, true) ? $requested : '2025-06-18',
                'capabilities' => ['tools' => ['listChanged' => false]],
                'serverInfo' => ['name' => 'com.itsnocap/site', 'title' => 'NOCAP', 'version' => '1.0.0'],
                'instructions' => 'Read-only information about NOCAP, a creative and influencer marketing agency.',
            ];
            break;
        case 'ping':
            $result = new stdClass();
            break;
        case 'tools/list':
            $result = ['tools' => $tools];
            break;
        case 'tools/call':
            $name = $params['name'] ?? '';
            if ($name === 'list_services') {
                $result = result_text($site['services'] ?? []);
            } elseif ($name === 'get_case_studies') {
                $result = result_text(['caseStudies' => $site['caseStudies'] ?? [], 'stats' => $site['stats'] ?? [], 'brands' => $site['brands'] ?? []]);
            } elseif ($name === 'get_contact_details') {
                $result = result_text(['email' => $site['email'] ?? null, 'telephone' => $site['telephone'] ?? null, 'address' => $site['address'] ?? null, 'instagram' => $site['instagram'] ?? null, 'hubs' => $site['hubs'] ?? [], 'contactPage' => 'https://itsnocap.com/contact/']);
            } else {
                return $isNotification ? null : ['jsonrpc' => '2.0', 'id' => $id, 'error' => ['code' => -32602, 'message' => "Unknown tool: $name"]];
            }
            break;
        default:
            if ($isNotification) return null;
            return ['jsonrpc' => '2.0', 'id' => $id, 'error' => ['code' => -32601, 'message' => 'Method not found']];
    }
    return $isNotification ? null : ['jsonrpc' => '2.0', 'id' => $id, 'result' => $result];
}

$body = json_decode((string) file_get_contents('php://input'), true);
if ($body === null) {
    http_response_code(400);
    header('Content-Type: application/json');
    echo json_encode(['jsonrpc' => '2.0', 'id' => null, 'error' => ['code' => -32700, 'message' => 'Parse error']]);
    exit;
}

$isBatch = is_array($body) && $body !== [] && array_keys($body) === range(0, count($body) - 1);
$responses = [];
foreach ($isBatch ? $body : [$body] as $msg) {
    $r = handle($msg, $site, $tools);
    if ($r !== null) $responses[] = $r;
}

if (!$responses) { http_response_code(202); exit; }
header('Content-Type: application/json');
echo json_encode($isBatch ? $responses : $responses[0], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
