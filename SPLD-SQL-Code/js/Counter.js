//##############
//# Counter.js #
//##############


//###############################################
//# Gestore Conteggio Clicks di Semplificazione #
//###############################################


let isCounterIncremented = false;
let count = 0;
let isSimplified = false;
let textContent

document.addEventListener('DOMContentLoaded', (event) => {
    // Esegue la richiesta AJAX per ottenere il valore corrente del contatore dal database
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
        // Verifica se il valore restituito è "DB Temporarily Offline"
        console.log("DB Off", document.getElementById("counterValue"));
        if (data.trim() === "DB Temporarily Offline") {
        } else {
            // Verifica se il valore restituito può essere convertito in un numero
            count = parseInt(data); // 'let' è stato rimosso
            if (!isNaN(count)) {
                // Imposta il contatore sulla pagina con il valore ricevuto dal server
                document.getElementById("counterValue").textContent = count;
            } else {
                // Mostra un messaggio appropriato al posto del valore "NaN"
                document.getElementById("counterValue").textContent = "DB Temporarily Offline";
            }
        }
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

