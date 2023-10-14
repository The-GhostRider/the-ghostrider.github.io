//#############
//# script.js #
//#############


//#############################################################################
//# Gestisce il comportamento di una lista di pulsanti abbinati ad un iframe. #
//#############################################################################

window.onload = function() {
    // Tutto il tuo codice JavaScript qui
    const videoButtons = document.querySelectorAll('.video-button');
    const videoIframe = document.getElementById('video-iframe');

    videoButtons.forEach(button => {
        button.addEventListener('click', function() {
            const videoSrc = this.getAttribute('data-src');
            videoIframe.src = videoSrc;
        });
    });
};
