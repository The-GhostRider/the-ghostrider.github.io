    // C-ID e C-Scrt
    const clientId = '23bdf20da54043319d5c2189e78b449e';
    const clientSecret = '4dacc9440bec42c7af081df06d104d3a';

    // Funzione per ottenere un token di accesso
    async function getAccessToken() {
        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
            },
            body: 'grant_type=client_credentials'
        });

        const data = await response.json();
        return data.access_token;
    }

    // Funzione per ottenere i dettagli della traccia
    async function getTrackDetails(trackId, accessToken) {
        const response = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + accessToken }
        });

        const data = await response.json();
        return {
            name: data.name,
            artist: data.artists[0].name,
            popularity: data.popularity,
            image: data.album.images[0].url
        };
    }

    // Funzione per ottenere i dettagli di tutte le tracce in una playlist
    async function getPlaylistTracks(playlistId, accessToken) {
        const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + accessToken }
        });

        const data = await response.json();
        return data.items.map(item => item.track.id);
    }

    // Funzione principale
    async function main() {
        const accessToken = await getAccessToken();
        const trackIds = await getPlaylistTracks('6QdZq1Cs2DpdAr1Jz56dob', accessToken);
        const tracks = [];
        for (const trackId of trackIds) {
            const trackDetails = await getTrackDetails(trackId, accessToken);
            tracks.push(trackDetails);
        }
        tracks.sort((a, b) => b.popularity - a.popularity);
        for (const track of tracks) {
            document.getElementById('trackDetails').innerHTML += `<img src="${track.image}" width="100" height="100"><br><b style="color:#00e424;">Artista:</b> ${track.artist},<br><b style="color:#00e424;">Brano:</b> ${track.name},<br><b style="color:#00e424;">Spotify Punti Popolarità:</b> ${track.popularity.toFixed()}<br><br>`;
        }
    }

    main();