//###################################
//# semplificaIlCodiceQui_UPDATE.js #
//###################################


//#############################################
//# Gestione semplificaIlCodiceQui per UPDATE #
//#############################################

function semplificaIlCodiceQui(codiceOriginale, chiavePrimaria0Select, chiavePrimaria1Select) {
    console.log("La funzione semplificaIlCodiceQui è stata chiamata.");

    const chiavePrimaria0 = chiavePrimaria0Select.options[chiavePrimaria0Select.selectedIndex].text;
    const chiavePrimaria1 = chiavePrimaria1Select.options[chiavePrimaria1Select.selectedIndex].text;
	const UpdateStatements = [];
    const righe = codiceOriginale.trim().split('\n');
    const istruzioniSemplificate = [];
    const gruppi = new Map();

    // Separa le righe UPDATE
    let currentStatement = "";
    for (const riga of righe) {
        if (riga.startsWith("UPDATE")) {
            if (currentStatement) {
                UpdateStatements.push(currentStatement);
            }
            currentStatement = riga;
        } else if (currentStatement) {
            currentStatement += '\n' + riga;
        }
    }
    if (currentStatement) {
        UpdateStatements.push(currentStatement);
    }

    // Gestisce istruzioni UPDATE
    for (let i = 0; i < righe.length; i++) {
        const riga = righe[i].trim();
        if (riga.startsWith("UPDATE")) {
            const chiave = riga.match(new RegExp("`" + chiavePrimaria0 + "` = (\\d+)"))[1];
            if (!gruppi.has(chiave)) {
                gruppi.set(chiave, []);
            }
            gruppi.get(chiave).push(riga);
        }
    }

    // Costruisce le istruzioni semplificate
    gruppi.forEach((queryGroup, chiave) => {
        const valoreChiave = queryGroup.map(riga => riga.match(new RegExp("`" + chiavePrimaria0 + "` = (\\d+)"))[1]);
        const clausolaChiave = "`" + chiavePrimaria0 + "` IN (" + valoreChiave.join(', ') + ")";
        const parti = queryGroup[0].split("WHERE");
        const altreChiavi = valoreChiave.filter(id => id !== chiave).join(', ');

        let nuovaIstruzione = parti[0] + "WHERE " + clausolaChiave;
        if (altreChiavi !== "") {
            nuovaIstruzione += (chiavePrimaria1 ? " AND " + chiavePrimaria1 + parti[1] : "") + parti[1];
        } else {
            nuovaIstruzione += parti[1].replace(/AND\s+`[^`]+`\s+IN\s+\(,\s*\d+\)\s*$/, "");
        }
        istruzioniSemplificate.push(nuovaIstruzione);
    });

    // Rimuove le chiavi primarie dalla sezione WHERE delle istruzioni semplificate
    istruzioniSemplificate.forEach((istruzione, index) => {
        istruzioniSemplificate[index] = istruzione.replace(new RegExp("`" + chiavePrimaria0 + "`\\s*(=|IN)\\s*\\(\\d+\\)", 'g'), '');
    });

    // Crea una stringa contenente gli ID raggruppati
    const idRaggruppati = Array.from(gruppi.keys()).join(', ');

    // Determina la query finale
    let queryRaggruppata = "";
    if ((chiavePrimaria0Select.value === "chiave1") || (chiavePrimaria1Select.value === "chiave1")) {
        queryRaggruppata = istruzioniSemplificate[0];
    } else {
        const clausolaRaggruppata = "`" + chiavePrimaria0 + "` IN (" + idRaggruppati + ")";
        const UpdateQueries = istruzioniSemplificate.filter(query => query.startsWith("UPDATE"));
        const modifiedQueries = UpdateQueries.map(query => {
            const modifiedQuery = query.replace(new RegExp("`" + chiavePrimaria0 + "`\\s*=\\s*\\d+", 'g'), '');
            return modifiedQuery;
        });
        const simplifiedDeleteAndUpdateStatements = modifiedQueries.join("\n");
        queryRaggruppata = istruzioniSemplificate[0].split("WHERE")[0] + "WHERE " + clausolaRaggruppata;
        let altreCondizioni = istruzioniSemplificate[0].split("WHERE")[1] || "";
        altreCondizioni = altreCondizioni.replace(new RegExp("`" + chiavePrimaria0 + "`\\s*=\\s*\\d+", 'g'), "");
        altreCondizioni = altreCondizioni.replace(/\(\)\s*AND\s*/g, "");
        if (altreCondizioni.trim().length !== 0 && altreCondizioni.trim() != "();") {
            queryRaggruppata += (" AND " + altreCondizioni.trim());
        } else {
            queryRaggruppata += ";";
        }
    }

    // Restituisce l'istruzione SQL raggruppata o istruzioniFinali
    if (righe[0].startsWith("UPDATE")) {
        return queryRaggruppata;
    } else {
        return istruzioniSemplificate.join("\n");
    }
}
