//#################
//# fullscreen.js #
//#################


//#############################################################################################
//# Attiva la modalità schermo intero del video quando il pulsante Fullscreen viene cliccato. #
//#############################################################################################

document.addEventListener('DOMContentLoaded', () => {
    // Recupera il riferimento all'elemento JWPlayer
    const player = jwplayer("myElement");

    // Recupera il riferimento al pulsante personalizzato
    const fullScreenButton = document.getElementById("fullScreenButton");

    // Aggiungi un gestore di eventi al pulsante personalizzato
    fullScreenButton.addEventListener("click", () => {
        // Attiva il fullscreen di JWPlayer
        player.setFullscreen(true);
    });

    // Aggiungi un gestore di eventi per rilevare l'ingresso in modalità fullscreen
    player.on('fullscreen', function (event) {
        if (event.fullscreen) {
            // Stile personalizzato quando il player è in fullscreen
            // Puoi applicare qui il tuo stile CSS specifico
            player.getContainer().style.backgroundColor = "black"; // Esempio: sfondo nero
        } else {
            // Stile personalizzato quando il player esce dalla modalità fullscreen
            // Ripristina eventuali stili precedenti
            player.getContainer().style.backgroundColor = ""; // Ripristina lo sfondo predefinito
        }
    });
});
