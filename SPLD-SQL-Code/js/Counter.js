//##############
//# Counter.js #
//##############


//###############################################
//# Gestore Conteggio Clicks di Semplificazione #
//###############################################


// Includi questo codice solo una volta all'inizio del file Counter.js
let isCounterIncremented = false;
let count = 0;
let isSimplified = false;

document.addEventListener('DOMContentLoaded', (event) => {
    // Esegui la richiesta AJAX per ottenere il valore corrente del contatore dal database
    fetch("https://lastrevenge.ddns.net/test/SPLD-SQL-Code/php/get_counter.php", {
        method: "GET"
    })
    .then(response => {
        if (response.ok) {
            return response.text();
        } else {
            throw new Error("Errore nella richiesta AJAX");
        }
    })
    .then(data => {
        // Imposta il contatore sulla pagina con il valore ricevuto dal server
        count = parseInt(data);
        document.getElementById("counterValue").textContent = count;
    })
    .catch(error => {
        console.error(error);
    });

    const tuoPulsante = document.getElementById("semplificaCodice");
    tuoPulsante.addEventListener("click", function() {
        semplificaCodice();
        incrementCounter();
    });
});

// Rimuovi la dichiarazione duplicata di count
function incrementCounter() {
    console.log("La funzione incrementCounter è stata chiamata.");
    console.log(isSimplified);
    if (isSimplified) {
        if (!isCounterIncremented) {
            count++;
            document.getElementById("counterValue").textContent = count;
            isCounterIncremented = true; // Imposta il flag isCounterIncremented a true
            // Esegui la richiesta AJAX per aggiornare il contatore nel database
            fetch("https://lastrevenge.ddns.net/test/SPLD-SQL-Code/php/update_counter.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            })
            .then(response => {
                if (response.ok) {
                    return response.text();
                } else {
                    throw new Error("Errore nella richiesta AJAX");
                }
            })
            .then(data => {
                // Gestisci la risposta del server, se necessario
                console.log(data);
            })
            .catch(error => {
                console.error(error);
            });
        }
        isSimplified = false; // Resetta il flag isSimplified dopo l'incremento
    }
}

// Aggiungi una funzione per reimpostare il flag quando il codice viene cancellato
function resetCounter() {
    isCounterIncremented = false; // Reimposta il flag isCounterIncremented a false
    console.log("La funzione resetCounter è stata chiamata.", isSimplified);
    isSimplified = false;
    console.log("isSimplified è stata reimpostata a", isSimplified);
}

