//###############
//# Traffics.js #
//###############


//###########################################################################################
//# Blocco 1: Codice per ottenere l'agente utente e effettuare una richiesta XMLHttpRequest #
//###########################################################################################

const ua = encodeURIComponent(navigator.userAgent).replace(/%20/g,'+');
const xhr = new XMLHttpRequest();
xhr.open('GET', 'https://livetrafficfeed.com/static/v2/user-agent?ua=USERAGENT&key=dou5hdkJiiiSRvQ9R5UklsbvR4JAEYER', false);
xhr.send();
if (xhr.status == 200) {
const result = JSON.parse(xhr.responseText);
console.log(result);
}


//###########################################
//# Blocco 2: Codice per Google Tag Manager #
//###########################################

document.addEventListener('DOMContentLoaded', () => {
	window.dataLayer = window.dataLayer || [];
	function gtag() {
	dataLayer.push(arguments);
	}
	gtag('js', new Date());
	gtag('config', 'G-87Y6V1Z9H6');
});