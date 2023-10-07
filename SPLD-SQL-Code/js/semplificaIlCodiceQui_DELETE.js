//###################################
//# semplificaIlCodiceQui_DELETE.js #
//###################################


//##################################################
//# Gestione semplificaIlCodiceQui per DELETE FROM #
//##################################################

function semplificaIlCodiceQui(codiceOriginale, chiavePrimaria0Select, chiavePrimaria1Select) {
	console.log("La funzione semplificaIlCodiceQui è stata chiamata.");

	// Ottiene i testi delle chiavi primarie selezionate dalle select boxes
	const chiavePrimaria0 = chiavePrimaria0Select.options[chiavePrimaria0Select.selectedIndex].text;
	const chiavePrimaria1 = chiavePrimaria1Select.options[chiavePrimaria1Select.selectedIndex].text;

	// Divide il codice originale in righe
	const righe = codiceOriginale.trim().split('\n');

	// Inizializza le strutture dati per DELETE FROM e UPDATE
	const deleteAndUpdateStatements = [];
	const insertStatementTemplates = [];
	const gruppi = new Map();
	let currentStatement = [];
	const riga = codiceOriginale.trim();

	// Separa le righe in base al tipo di istruzione
	for (const riga of righe) {
		if (riga.startsWith("DELETE FROM") || riga.startsWith("UPDATE")) {
			if (currentStatement) {
				deleteAndUpdateStatements.push(currentStatement);
			}
			currentStatement = riga;
		} else if (currentStatement) {
			currentStatement += '\n' + riga;
		}
	}
	if (currentStatement) {
		deleteAndUpdateStatements.push(currentStatement);
	}

	// Costruisce l'istruzione finale con i valori raggruppati per INSERT INTO
	const istruzioniSemplificate = [];
	for (const insertStatementTemplate of insertStatementTemplates) {
		const valuesStart = insertStatementTemplate.indexOf("VALUES") + "VALUES".length;
		const valuesContent = insertStatementTemplate.substring(valuesStart).trim();

		// Verifica se la riga di inserimento inizia con una parentesi tonda aperta e termina con un punto e virgola
		if (valuesContent.startsWith("(") && valuesContent.endsWith(";")) {
			const valuesData = valuesContent.substring(1, valuesContent.length - 2);
			const valuesArray = valuesData.split("),");

			const newValuesArray = valuesArray.map(valuesSet => {
				const values = valuesSet.split(",").map(value => value.trim());
				const modifiedValues = values.map(value => value === "''" ? value : "" + value + "");
				return `(${modifiedValues.join(", ")})`;
			});

			const newValuesContent = newValuesArray.join(",\n");

			istruzioniSemplificate.push(insertStatementTemplate.replace('VALUES', `VALUES\n${newValuesContent}`));
		}
	}


		// Gestisce istruzioni DELETE FROM e UPDATE
		for (let i = 0; i < righe.length; i++) {
			const riga = righe[i].trim();
			if (riga.startsWith("DELETE FROM") || riga.startsWith("UPDATE")) {
				const chiave = riga.match(new RegExp("`" + chiavePrimaria0 + "` = (\\d+)"))[1];
				if (!gruppi.has(chiave)) {
					gruppi.set(chiave, []);
				}
				gruppi.get(chiave).push(riga);
			}
		}

		// Costruisce le istruzioni semplificate per DELETE FROM e UPDATE
		gruppi.forEach((queryGroup, chiave) => {
			const valorichiavePrimaria0 = queryGroup.map(riga => riga.match(new RegExp("`" + chiavePrimaria0 + "` = (\\d+)"))[1]);
			const clausolachiavePrimaria0 = "`" + chiavePrimaria0 + "` IN (" + valorichiavePrimaria0.join(', ') + ")";
			const parti = queryGroup[0].split("WHERE");
			const altreChiavi = valorichiavePrimaria0.filter(id => id !== chiave).join(', ');
		
			let nuovaIstruzione = parti[0] + "WHERE " + clausolachiavePrimaria0;
			if (altreChiavi !== "") {
				if (!valorichiavePrimaria0.includes(chiave)) {
					nuovaIstruzione += (chiavePrimaria1 ? " AND " + chiavePrimaria1 + parti[1] : "") + parti[1];
				} else {
					nuovaIstruzione += parti[1];
				}
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
		let queryRaggruppata;

		// Determina se creare una query con clausola WHERE o no
		if (chiavePrimaria0Select.value === "chiave1") {
			queryRaggruppata = istruzioniSemplificate[0];
		} else {
			const clausolaRaggruppata = "`" + chiavePrimaria0 + "` IN (" + idRaggruppati + ")";
			const deleteAndUpdateQueries = istruzioniSemplificate.filter(query => query.startsWith("DELETE FROM") || query.startsWith("UPDATE"));
			const modifiedQueries = deleteAndUpdateQueries.map(query => {
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

		// Unisce le istruzioni DELETE FROM, UPDATE e INSERT INTO
		const istruzioniFinali = deleteAndUpdateStatements.concat(istruzioniSemplificate);

		// Restituisce l'istruzione SQL raggruppata o istruzioniFinali
		if (riga.startsWith("DELETE FROM") || riga.startsWith("UPDATE")) {
			return queryRaggruppata;
		} else {
			return istruzioniFinali.join("\n");
		}
}
