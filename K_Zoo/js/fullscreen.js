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
});
