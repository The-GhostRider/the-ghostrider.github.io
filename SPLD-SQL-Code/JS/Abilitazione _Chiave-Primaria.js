//####################################
//# Abilitazione _Chiave-Primaria.js #
//####################################


//############################
//# Gestione Chiave Primaria #
//############################

function abilitaPulsante() {
console.log("La funzione abilitaPulsante è stata chiamata.");
	const selectElement0 = document.getElementById("chiavePrimaria0");
	const selectElement1 = document.getElementById("chiavePrimaria1");
	const pulsanteSemplifica = document.getElementById("semplificaCodice");
	const isSelect0Valid = selectElement0.value !== "chiave0";
	const isSelect1Valid = selectElement1.value !== "chiave0";
	pulsanteSemplifica.disabled = !(isSelect0Valid || isSelect1Valid);
}