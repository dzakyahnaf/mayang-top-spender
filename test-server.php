<?php echo "Composer spawned PHP OK\n"; $s = stream_socket_server("tcp://127.0.0.1:8000", $errno, $errstr); if ($s) { echo "BIND OK\n"; fclose($s); } else { echo "BIND FAIL: $errno $errstr\n"; }
