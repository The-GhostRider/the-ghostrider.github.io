//#######################
//# semplificaCodice.js #
//#######################


//###############################################################################
// Funzione per includere uno script dinamicamente in base al tipo di query SQL #
//###############################################################################

function includeSemplificaScript(codiceSQL, callback) {
	const chiavePrimaria0Select = document.getElementById("chiavePrimaria0"); // Attiva INSERT INTO solo con la "chiave1" di "chiavePrimaria0" o "chiavePrimaria1"
	const chiavePrimaria1Select = document.getElementById("chiavePrimaria1"); // Attiva INSERT INTO solo con la "chiave1" di "chiavePrimaria0" o "chiavePrimaria1"
	
	const insertOptionSelected = (chiavePrimaria0Select.value === "chiave1") || (chiavePrimaria1Select.value === "chiave1"); // Attiva INSERT INTO solo con la "chiave1" di "chiavePrimaria0" o "chiavePrimaria1"

    if (insertOptionSelected && codiceSQL.includes("INSERT INTO")) {
        const script = document.createElement('script');
        script.src = './js/semplificaIlCodiceQui_INSERT.js?v=' + Date.now(); // Aggiunge una data per forzare il caricamento
        script.onload = callback;
        document.body.appendChild(script);
    } else if (!insertOptionSelected && (codiceSQL.includes("DELETE FROM"))) {
        const script = document.createElement('script');
        script.src = './js/semplificaIlCodiceQui_DELETE.js?v=' + Date.now(); // Aggiunge una data per forzare il caricamento
        script.onload = callback;
        document.body.appendChild(script);
    } else if (!insertOptionSelected && (codiceSQL.includes("UPDATE"))) {
        const script = document.createElement('script');
        script.src = './js/semplificaIlCodiceQui_UPDATE.js?v=' + Date.now(); // Aggiunge una data per forzare il caricamento
        script.onload = callback;
        document.body.appendChild(script);
}
}


//#############################
//# Funzione semplificaCodice #
//#############################

function semplificaCodice() {
    console.log("La funzione semplificaCodice è stata chiamata.");

    // Ottiene i riferimenti agli elementi select delle chiavi primarie
    const chiavePrimaria0Select = document.getElementById("chiavePrimaria0");
    const chiavePrimaria1Select = document.getElementById("chiavePrimaria1");
    const chiavePrimaria0Value = chiavePrimaria0Select.value;
    const chiavePrimaria1Value = chiavePrimaria1Select.value;

    // Crea oggetti per rappresentare le chiavi primarie selezionate
    const chiavePrimaria0 = {
        name: chiavePrimaria0Select.options[chiavePrimaria0Select.selectedIndex].text,
        index: chiavePrimaria0Select.selectedIndex,
    };

    const chiavePrimaria1 = {
        name: chiavePrimaria1Select.options[chiavePrimaria1Select.selectedIndex].text,
        index: chiavePrimaria1Select.selectedIndex,
    };

    // Ottiene il testo dell'area di testo contenente il codice SQL originale
    const codiceOriginaleTextarea = document.getElementById("codiceOriginale");
    const codiceOriginale = codiceOriginaleTextarea.value;
	
    // Chiama la funzione per includere il giusto script
    includeSemplificaScript(codiceOriginale, function () {

    // Chiama la funzione semplificaIlCodiceQui per ottenere il codice semplificato
    const codiceSemplificato = semplificaIlCodiceQui(codiceOriginale, chiavePrimaria0Select, chiavePrimaria1Select);

    // Ottiene il riferimento all'area di testo per il codice semplificato
    const codiceSemplificatoPre = document.getElementById("codiceSemplificato");

    // Aggiorna il contenuto dell'area di testo con il codice semplificato
    codiceSemplificatoPre.textContent = codiceSemplificato;

    // Evidenzia la sintassi del codice semplificato utilizzando la libreria hljs (highlight.js)
    hljs.highlightElement(codiceSemplificatoPre);

    // Abilita o disabilita il pulsante di copia in base alla lunghezza del codice semplificato
    const copiaButton = document.getElementById("copiaButton");
    copiaButton.disabled = !codiceSemplificato || codiceSemplificato.length === 0;

    // Mostra un messaggio "Simplified!" se il codice è stato semplificato con successo
    if (codiceSemplificato) {
        document.getElementById("semplificaCodice").textContent = "Simplified!";
    } else {
        // Altrimenti, rimuovi il testo "Simplified!" dal pulsante
        document.getElementById("semplificaCodice").textContent = "Simplify Code";

        // Rimuovi il contenuto dall'area di testo del codice semplificato
        codiceSemplificatoPre.textContent = "";
    }
	});
	isSimplified = true;
}
