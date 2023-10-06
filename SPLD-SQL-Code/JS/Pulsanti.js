//###############
//# Pulsanti.js #
//###############


//#####################
//# Gestione Pulsanti #
//#####################

document.addEventListener('DOMContentLoaded', () => {
	const codiceSemplificatoPre = document.getElementById('codiceSemplificato');
	const codiceOriginaleTextarea = document.getElementById('codiceOriginale');
	const cancellaButton = document.getElementById('cancellaButton');
	const semplificaCodiceButton = document.getElementById('semplificaCodice');
	const copiaButton = document.getElementById('copiaButton');
	const chiavePrimaria0Select = document.getElementById('chiavePrimaria0');
	const chiavePrimaria1Select = document.getElementById('chiavePrimaria1');
	cancellaButton.addEventListener('click', () => {
		console.log("La funzione Erased è stata chiamata.");
		codiceSemplificatoPre.innerHTML = '';
		codiceOriginaleTextarea.value = '';
		semplificaCodiceButton.textContent = "Simplify Code"; // Reimposta il testo del pulsante
		copiaButton.textContent = "Copy";
		chiavePrimaria0Select.value = "chiave0";
		chiavePrimaria1Select.value = "chiave0";
		setTimeout(() => {
			cancellaButton.textContent = "Erase";
		}, 2000);
		document.getElementById("cancellaButton").textContent = "Erased!";
		semplificaCodiceButton.disabled = true; // Disabilita il pulsante "Simplify Code"
		copiaButton.disabled = true; // Disabilita il pulsante "Copy"
	});
});


//##################
//# Gestione Copia #
//##################

function copiaContenuto(idOutput, idButton) {
console.log("La funzione copiaContenuto è stata chiamata.");
	const areaOutput = document.getElementById(idOutput);
	const selezione = window.getSelection();
	const range = document.createRange();
	range.selectNodeContents(areaOutput);
	selezione.removeAllRanges();
	selezione.addRange(range);
	document.execCommand("copy");
	selezione.removeAllRanges();
	document.getElementById(idButton).textContent = "Copied!";
}

function copiaTesto() {
console.log("La funzione copiaTesto è stata chiamata.");
	copiaContenuto("codiceSemplificato", "copiaButton");
}