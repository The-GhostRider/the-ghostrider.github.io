//###########
//# Logo.js #
//###########


//#######################
//# Gestione Copia Logo #
//#######################

document.addEventListener('DOMContentLoaded', () => {
	// Seleziona l'elemento dell'immagine per ID
	const image = document.getElementById("Logo");
	
	// Aggiungi un gestore di eventi al clic sull'immagine
	image.addEventListener("click", function() {
		// Ottieni l'URL dal link
		const linkURL = this.getAttribute("data-url");
		
		// Crea un elemento textarea nascosto per copiare il testo negli appunti
		const textArea = document.createElement("textarea");
		textArea.value = linkURL;
		document.body.appendChild(textArea);
		
		// Seleziona e copia il testo nell'area di testo
		textArea.select();
		document.execCommand("copy");
		
		// Rimuovi l'area di testo dal DOM
		document.body.removeChild(textArea);
		
		// Alert o messaggio di conferma
		const confirmationGif = document.getElementById("confirmationGif");
		confirmationGif.style.display = "block";
		setTimeout(function() {
			confirmationGif.style.display = "none";
		}, 4500); 
	});
});
