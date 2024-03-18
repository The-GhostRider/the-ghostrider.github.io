<?php
	//###################
	//# get_counter.php #
	//###################

	// Includi il file di configurazione
	include 'E:/xampp/htdocs/config_db/config.php';

	// Crea una connessione
	$conn = new mysqli($servername, $username, $password, $dbname, $port);

	// Controlla la connessione
	if ($conn->connect_error) {
		die("Connessione al database fallita: " . $conn->connect_error);
	}

	// Query per ottenere il valore del contatore
	$sql = "SELECT Q_Resolved FROM counter";
	$result = $conn->query($sql);

	if ($result->num_rows > 0) {
		// Estrai il risultato
		$row = $result->fetch_assoc();
		$count = $row["Q_Resolved"];
	
		// Restituisci il conteggio come risposta
		echo $count;
	} else {
		// Se non ci sono risultati, restituisci 0 o un valore di default
		echo "0";
	}

	// Chiudi la connessione al database
	$conn->close();
?>
