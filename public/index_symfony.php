<?php

use App\Kernel;
use Symfony\Component\Debug\Debug;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RedirectResponse;

require dirname(__DIR__).'/config/bootstrap.php';

include_once(__DIR__.'/../init/init.php');
include_once(__DIR__.'/../init/init_menu.php');
include_once(__DIR__.'/../init/init_templates.php');
include_once(__DIR__ . '/../init/common.php');

if ($_SERVER['APP_DEBUG']) {
    #umask(0000);

    #Debug::enable();
}

$request = Request::createFromGlobals();
$path = $request->getPathInfo();
global $base_url;
$base_url = plannoBaseUrl($request);

// Session has expired. Redirect to authentication page.
if (empty($_SESSION['login_id']) && $path != '/login' && $path != 'logout') {

    $redirect = ltrim($path, '/');
    header("Location: $base_url/login?redirURL=$redirect");
    exit();
}

// Prevent user accessing to login page
// if he is already authenticated.
if (!empty($_SESSION['login_id']) && $path == '/login') {
    header("Location: {$config['URL']}");
    exit();
}


if ($trustedProxies = $_SERVER['TRUSTED_PROXIES'] ?? $_ENV['TRUSTED_PROXIES'] ?? false) {
    Request::setTrustedProxies(explode(',', $trustedProxies), Request::HEADER_X_FORWARDED_ALL ^ Request::HEADER_X_FORWARDED_HOST);
}

if ($trustedHosts = $_SERVER['TRUSTED_HOSTS'] ?? $_ENV['TRUSTED_HOSTS'] ?? false) {
    Request::setTrustedHosts([$trustedHosts]);
}

$kernel = new Kernel($_SERVER['APP_ENV'], (bool) $_SERVER['APP_DEBUG']);
$response = $kernel->handle($request);
$response->send();
$kernel->terminate($request, $response);
