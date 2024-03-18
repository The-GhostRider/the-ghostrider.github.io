<?php
	//######################
	//# update_counter.php #
	//######################

	// Includi il file di configurazione
	include 'E:/xampp/htdocs/config_db/config.php';

	$conn = new mysqli($servername, $username, $password, $dbname, $port);

	if ($conn->connect_error) {
		die("Connessione al database fallita: " . $conn->connect_error);
	}

	// Esegui l'aggiornamento del contatore nel database
	$sql = "UPDATE counter SET Q_Resolved = Q_Resolved + 1";
	if ($conn->query($sql) === TRUE) {
		echo "Contatore aggiornato con successo";
	} else {
		echo "Errore nell'aggiornamento del contatore: " . $conn->error;
	}

	$conn->close();
?>


