<?php

// Composer strips critical Windows env vars (SystemRoot, TEMP, etc.)
// which causes crypto failures in child processes. Restore them.
if (PHP_OS_FAMILY === 'Windows') {
    $restore = [
        'SystemRoot' => 'C:\\WINDOWS',
        'TEMP' => sys_get_temp_dir(),
        'TMP' => sys_get_temp_dir(),
    ];
    foreach ($restore as $key => $fallback) {
        if (! getenv($key)) {
            putenv("$key=$fallback");
        }
    }
}

$dir = __DIR__;
$host = '127.0.0.1';
$port = 8000;

echo PHP_EOL;
echo "  Starting development servers..." . PHP_EOL;
echo "  App:  http://{$host}:{$port}" . PHP_EOL;
echo "  Vite: http://localhost:5173" . PHP_EOL;
echo PHP_EOL;

// Start PHP built-in server in background
$phpCmd = PHP_BINARY . " -S {$host}:{$port} -t " . escapeshellarg($dir . DIRECTORY_SEPARATOR . 'public');
if (PHP_OS_FAMILY === 'Windows') {
    $phpProc = proc_open($phpCmd, [['pipe', 'r'], STDOUT, STDERR], $pipes, $dir, null, ['bypass_shell' => true]);
} else {
    $phpProc = proc_open($phpCmd . ' &', [['pipe', 'r'], STDOUT, STDERR], $pipes, $dir);
}

// Run Vite in foreground (blocks until Ctrl+C)
$viteCmd = PHP_OS_FAMILY === 'Windows' ? 'npm.cmd run dev' : 'npm run dev';
passthru($viteCmd, $exitCode);

// Cleanup PHP server when Vite exits
if (is_resource($phpProc)) {
    proc_terminate($phpProc);
    proc_close($phpProc);
}

exit($exitCode);
