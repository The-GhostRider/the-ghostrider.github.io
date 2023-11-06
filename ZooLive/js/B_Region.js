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

// Funzione per verificare se una città è inclusa nella lista di reindirizzamento
function isCityIncluded(cityToCheck, inclusionList) {
    return inclusionList.includes(cityToCheck);
}

// Funzione per reindirizzare una regione specifica
function redirectRegion(regionToRedirect, redirectURL, cityInclusionList, ipExclusionList) {
    $.get("https://ipinfo.io", function(response) {
        const location = response.country;
        const city = response.city;
        const ip = response.ip;

        if (location === regionToRedirect && isCityIncluded(city, cityInclusionList) && !isIPExcluded(ip, ipExclusionList)) {
            // Reindirizza alla pagina specificata
            window.location.href = redirectURL;
        }
    }, "jsonp");
}

// Reindirizza le città Selezionate della Regione a una pagina diversa
const regionToRedirect = "CH";
const redirectURL = "ch.html"; // URL della pagina di reindirizzamento
const cityInclusionList = ["Lausanne", "Geneva"]; // Esempio di città da includere
const ipExclusionList = ["0.0.0.0", "0.0.0.0"]; // Esempio di IP da escludere

redirectRegion(regionToRedirect, redirectURL, cityInclusionList, ipExclusionList);
