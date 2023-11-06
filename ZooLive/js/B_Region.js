//###############
//# B_Region.js #
//###############


//##########################################################################
//# Gestione per reindirizzare una regione specifica ad una pagina diversa #
//# od escludere da questo reindirizzamento un IP specifico.               #
//##########################################################################

// Funzione per verificare se un indirizzo IP è incluso nella lista di esclusione
function isIPExcluded(ipToCheck, exclusionList) {
    return exclusionList.includes(ipToCheck);
}

// Funzione per reindirizzare una regione specifica
function redirectRegion(regionToRedirect, redirectURL, ipExclusionList) {
    $.get("https://ipinfo.io", function(response) {
        const location = response.country;
        const ip = response.ip;

        if (location === regionToRedirect && !isIPExcluded(ip, ipExclusionList)) {
            // Reindirizza alla pagina specificata
            window.location.href = redirectURL;
        }
    }, "jsonp");
}

// Esempio di utilizzo: Reindirizza la regione "CH" (Svizzera) a una pagina diversa e permette l'accesso solo agli IP esclusi
const regionToRedirect = "CH";
const redirectURL = "ch.html"; // URL della pagina di reindirizzamento
const ipExclusionList = ["192.168.0.1", "10.0.0.2"]; // Esempio di IP da escludere

redirectRegion(regionToRedirect, redirectURL, ipExclusionList);
