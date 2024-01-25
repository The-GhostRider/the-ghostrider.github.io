<?php

# CLICKY ANTI-ADBLOCK PROXY - https://clicky.com/help/proxy
# COPY ALL FILES INTO YOUR WEBSITE'S ROOT DIRECTORY:
# /470c6da80a599.php: Javascript tracking code
# /1377052163ff0.php: Beacon
# /4c9290dbc9b0a.php: Noscript beacon

error_reporting(0);
ob_start();

$x = proxyget( "https://in.getclicky.com/in.php?" . $_SERVER['QUERY_STRING'] );

if( is_array( $x )) {
	http_response_code( $x['code'] );
	foreach( $x['headers'] as $h ) header( $h, false ); # false needed for multiple 'set-cookie' headers
	echo $x['content']; 
}



function proxyget( $url ) {
	
	# HEADERS
	
	# x-forwarded-for - delete/comment out 'HTTP_X_FORWARDED_FOR' line to ignore incoming xff
	$headers = array( 'x-forwarded-for: '
		. ( $_SERVER['HTTP_X_FORWARDED_FOR'] ? $_SERVER['HTTP_X_FORWARDED_FOR'] .',' : '' )
		. ( $_SERVER['REMOTE_ADDR'] )
	);
	
	# cookie - only send service-related cookies to the tracking servers
	$cookies = '';
	foreach( $_COOKIE as $key => $value ) {
		if( preg_match("#^_cky_#", $key )) $cookies .= "$key=$value; ";
	}
	if( $cookies ) $headers[] = 'cookie: ' . substr( $cookies, 0, -2 );
	
	# all other headers - filter out a few, including the ones we did manually, but send all the rest
	foreach( getallheaders() as $key => $value ) {
		if( in_array( strtolower( $key ), array('cookie','x-forwarded-for','host','accept-encoding','keep-alive'))) continue;
		$headers[] = "$key: $value";
	}
	
	
	# REQUEST
	
	$curl = curl_init( $url );
	curl_setopt_array( $curl, array(
		CURLOPT_HTTPHEADER     => $headers, # headers to send
		CURLOPT_RETURNTRANSFER => true,     # return content
		CURLOPT_HEADER         => true,     # return headers
		CURLOPT_FOLLOWLOCATION => true,     # follow redirects
		CURLOPT_AUTOREFERER    => true,     # set referer on redirect
		CURLOPT_ENCODING       => "",       # handle all encodings
		CURLOPT_CONNECTTIMEOUT => 10,       # timeout on connect
		CURLOPT_TIMEOUT        => 10,       # timeout on response
		CURLOPT_MAXREDIRS      => 3,        # stop after X redirects
		CURLOPT_SSL_VERIFYHOST => false,    # skip ssl verification
		CURLOPT_SSL_VERIFYPEER => false,    # skip ssl verification
	));	
	
	if( $_SERVER['REQUEST_METHOD'] == 'POST' ) {
		curl_setopt( $curl, CURLOPT_POST, true );
		curl_setopt( $curl, CURLOPT_POSTFIELDS, file_get_contents('php://input'));
	}
	
	$response    = curl_exec( $curl );
	$header_size = curl_getinfo( $curl, CURLINFO_HEADER_SIZE );
	$code        = curl_getinfo( $curl, CURLINFO_HTTP_CODE );
	curl_close( $curl );
	
	$response_headers = array();
	
	foreach( explode("\r\n", substr( $response, 0, $header_size )) as $header ) {
		$header = explode(':', $header, 2);
		if( sizeof( $header ) == 2 ) {
			$key = strtolower( trim( $header[0] ));
			if( in_array( $key, array(
				'access-control-allow-origin',
				'access-control-allow-credentials',
				'cache-control',
				'content-type',
				'content-length',
				'cross-origin-resource-policy',
				'expires',
				'set-cookie',
				'vary',
				'x-content-type-options',
			))) {
				$response_headers[] = "$key: " . trim( $header[1] );
			}
		}
	}
	
	return array(
		'code'    => $code,
		'headers' => $response_headers,
		'content' => substr( $response, $header_size ),
	);
}
