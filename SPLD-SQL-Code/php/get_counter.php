<?php
    //###################
    //# get_counter.php #
    //###################

    header("Access-Control-Allow-Origin: *");

    // Includi il file di configurazione
    include '../../../config_db/config.php';

    // Crea una connessione
    $conn = new mysqli($servername, $username, $password, $dbname, $port);

    // Controlla la connessione al database
    if ($conn->connect_error) {
        // Se la connessione fallisce, restituisci un messaggio di errore
        echo "DB Temporarily Offline";
        exit; // Esci dallo script
    }

    // Query per ottenere il valore del contatore
    $sql = "SELECT Q_Resolved FROM counter";
    $result = $conn->query($sql);

    if ($result && $result->num_rows > 0) {
        // Estrai il risultato
        $row = $result->fetch_assoc();
        $count = $row["Q_Resolved"];
        
        // Restituisci il conteggio come risposta
        echo $count;
    } else {
        // Se la query non restituisce risultati o se ci sono errori
        echo "DB Temporarily Offline";
    }

    // Chiudi la connessione al database
    $conn->close();
?>
