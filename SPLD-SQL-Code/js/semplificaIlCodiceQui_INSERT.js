//###################################
//# semplificaIlCodiceQui_INSERT.js #
//###################################


//##################################################
//# Gestione semplificaIlCodiceQui per INSERT INTO #
//##################################################

function semplificaIlCodiceQui(codiceOriginale, chiavePrimaria0Select, chiavePrimaria1Select) {
    console.log("La funzione semplificaIlCodiceQui è stata chiamata.");

    // Ottiene i testi delle chiavi primarie selezionate dalle select boxes
    const chiavePrimaria0 = chiavePrimaria0Select.options[chiavePrimaria0Select.selectedIndex].text;
    const chiavePrimaria1 = chiavePrimaria1Select.options[chiavePrimaria1Select.selectedIndex].text;

    // Divide il codice originale in righe
    const righe = codiceOriginale.trim().split('\n');
    console.log("Righe divise:", righe);

    // Inizializza le strutture dati per DELETE FROM, UPDATE e INSERT INTO
    const deleteAndUpdateStatements = [];
    const insertStatementTemplates = [];
    const gruppi = new Map();
    let currentStatement = [];
    const riga = codiceOriginale.trim();
    console.log("Riga originale:", riga);
    // Separa le righe in base al tipo di istruzione
    for (const riga of righe) {
        if (riga.startsWith("DELETE FROM") || riga.startsWith("UPDATE")) {
            if (currentStatement) {
                deleteAndUpdateStatements.push(currentStatement);
            }
            currentStatement = riga;
        } else if (riga.startsWith("INSERT INTO")) {
            insertStatementTemplates.push(riga);
        } else if (currentStatement) {
            currentStatement += riga;
        }
    }
    if (currentStatement) {
        deleteAndUpdateStatements.push(currentStatement);
    }
    console.log("DELETE e UPDATE Statements:", deleteAndUpdateStatements);
    console.log("INSERT INTO Templates:", insertStatementTemplates);

    // Costruisce l'istruzione finale con i valori raggruppati per INSERT INTO
    const istruzioniSemplificate = [];
    let insertStatementTemplate = insertStatementTemplates[0];
    let valuesStart = insertStatementTemplate.indexOf("VALUES");
    if (valuesStart !== -1) {
        valuesStart += "VALUES".length;
        let valuesContent = insertStatementTemplate.substring(valuesStart).trim();
        console.log("VALUES Content:", valuesContent);

        // Verifica se la riga di inserimento inizia con una parentesi tonda aperta e termina con un punto e virgola
        if (valuesContent.trim().startsWith("(") && valuesContent.trim().endsWith(";")) {
            let newValuesContent = "";
            for (let i = 1; i < insertStatementTemplates.length; i++) {
                const insertStatementTemplate = insertStatementTemplates[i];
                valuesStart = insertStatementTemplate.indexOf("VALUES");
                if (valuesStart !== -1) {
                    valuesStart += "VALUES".length;
                    valuesContent = insertStatementTemplate.substring(valuesStart).trim();
                    const valuesData = valuesContent.substring(1, valuesContent.length - 2);
                    newValuesContent += "(" + valuesData + "),\n";
                }
            }
            if (newValuesContent) {
                const simplifiedSQL = insertStatementTemplates[0].replace('VALUES', `VALUES\n${newValuesContent}`);
                istruzioniSemplificate.push(simplifiedSQL);
                console.log("Istruzioni Semplificate:", istruzioniSemplificate);
            }
        }
    }

    // Ritorna l'istruzione semplificata
    return istruzioniSemplificate.join('\n');
}
