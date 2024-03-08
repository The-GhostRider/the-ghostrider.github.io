//###############################
//# Mediaset_Player_Features.js #
//###############################


//##############################################################################
//# Gestione del buffering tramite pulsanti "backward-2-min" e "forward-2-min" #
//##############################################################################

document.addEventListener('DOMContentLoaded', (event) => {
	const videoPlayer = document.getElementById('mediaset-player');
	const backward2MinButton = document.getElementById('backward-2-min');
	const forward2MinButton = document.getElementById('forward-2-min');

	backward2MinButton.addEventListener('click', () => {
		rewindVideo(videoPlayer, 2);
	});

	forward2MinButton.addEventListener('click', () => {
		fastForwardVideo(videoPlayer, 2);
	});

	function rewindVideo(player, minutes) {
		player.currentTime -= minutes * 60;
	}

	function fastForwardVideo(player, minutes) {
		player.currentTime += minutes * 60;
	}
});


//##################################################################
//# Recupera il manifesto di streaming video dalla risorsa remota. #
//##################################################################

document.addEventListener('DOMContentLoaded', (event) => {
    fetch('https://live03-seg.msr.cdn.mediaset.net/live/ch-r1/r1-clr.isml/manifest.mpd')
    .then(response => response.text())
    .then(manifest => {
        let parser = new DOMParser();
		console.log('parser', parser);
        let xmlDoc = parser.parseFromString(manifest, "text/xml");
		console.log('xmlDoc', xmlDoc);

        // Ottieni il valore corrente del bitrate audio.
        let currentAudioBitrate = xmlDoc.querySelector('AdaptationSet[contentType="audio"] Representation').getAttribute('bandwidth');
		console.log('currentAudioBitrate', currentAudioBitrate);

        // Elemento HTML in cui verranno visualizzati i bitrate audio e video.
        let audioBitrateContainer = document.getElementById('bitrateValueAudio');
		console.log('audioBitrateContainer', audioBitrateContainer);
        let videoBitrateContainer = document.getElementById('bitrateValueVideo');
		console.log('videoBitrateContainer', videoBitrateContainer);

        // Assegna i valori dei bitrate audio e video agli elementi HTML
        audioBitrateContainer.innerText = `Bitrate Audio: ${currentAudioBitrate} kbps`;

        // Trova l'elemento video nel manifesto DASH.
		let currentVideoBitrate = 0;
        let videoElement = xmlDoc.querySelector('MPD[type="dynamic"] Period[start="PT0S"] AdaptationSet[id="2"][minBandwidth="512000"][maxBandwidth="4800000"] Representation[id="video=4800000"][scanType="progressive"]');
		console.log('videoElement', videoElement);
        if (videoElement) {
            let currentVideoBitrate = videoElement.getAttribute('bandwidth');
			console.log('currentVideoBitrate', currentVideoBitrate);
            videoBitrateContainer.innerText = `Bitrate Video: ${currentVideoBitrate} kbps`;
        }
    })
    .catch(error => console.error('Errore durante il caricamento del manifest.mpd:', error));

});


//##############################################################################
//# Gestione del video player e delle funzioni di registrazione e riproduzione #
//##############################################################################

document.addEventListener('DOMContentLoaded', (event) => {
	const videoPlayer = document.getElementById('mediaset-player');
	const playButton = document.getElementById('playButton');
	const stopButton = document.getElementById('stopButton');
	const recordingTimeElement = document.getElementById('recording-time');
	let recordingStartTime;
	let recordingInterval;
	let isPlaying = false;
	let lastPlayTime = 0;
	let playStartTime = null;

	// Funzione per attivare lo stile CSS quando il timer si attiva
	function activateTimerStyle() {
	recordingTimeElement.classList.add('active-timer');
	}
	
	// Funzione per ripristinare lo stile CSS quando il timer si ferma
	function resetTimerStyle() {
	recordingTimeElement.classList.remove('active-timer');
	}

	playButton.addEventListener('click', () => {
		if (!isPlaying) {
			// Inizia la riproduzione.
			videoPlayer.play();
			playButton.textContent = "⏸\nPause";
			console.log('Play Button Clicked - Video Playing');
			activateTimerStyle(); // Attiva lo stile quando si avvia la riproduzione
			isPlaying = true;
			if (!recordingStartTime) {
				// Inizia il conteggio del tempo di registrazione se non è già in corso.
				recordingStartTime = Date.now(); // Aggiorna il tempo di registrazione al momento attuale
				recordingInterval = setInterval(updateRecordingTime, 1000);
			}
		} else {
			// Mette in pausa la riproduzione.
			videoPlayer.pause();
			playButton.textContent = "▶️\nPlay";
			console.log('Play Button Clicked - Video Paused');
			resetTimerStyle(); // Ripristina lo stile quando si ferma la riproduzione
			isPlaying = false;
			if (recordingStartTime) {
				// Mette in pausa il conteggio del tempo di registrazione.
				clearInterval(recordingInterval);
				recordingInterval = null;
				lastPlayTime += Date.now() - recordingStartTime; // Aggiunge al tempo trascorso il tempo trascorso durante l'ultima riproduzione
				recordingStartTime = null; // Resetta recordingStartTime
			}
		}
	});

	stopButton.addEventListener('click', () => {
		if (isPlaying) {
			videoPlayer.pause();
			playButton.textContent = "▶️\nPlay";
			isPlaying = false;
		}
		videoPlayer.currentTime = 0;
		console.log('Stop Button Clicked - Video Stopped');
		resetTimerStyle(); // Ripristina lo stile quando si ferma la registrazione
		clearInterval(recordingInterval);
		recordingStartTime = null;
		lastPlayTime = 0;
		recordingTimeElement.textContent = '0:0:00';
	});
				
	const recButton = document.getElementById('recButton');
	let mediaRecorder;
	let recordedChunks = [];

	recButton.addEventListener('click', () => {
	if (mediaRecorder && mediaRecorder.state === 'recording') {
		mediaRecorder.stop();
		recButton.textContent = '🔴/▶️\nRec/AutoPlay';
		console.log('Rec Button Clicked - Video Recording');
		clearInterval(recordingInterval);
		recordingStartTime = null;
		recordingTimeElement.textContent = '0:0:00';
		playButton.textContent = "▶️\nPlay";
		console.log('Play Button Clicked - Video Paused');
		resetTimerStyle(); // Ripristina lo stile quando si ferma la registrazione
	} else {
		try {
		const options = {
			mimeType: 'video/webm; codecs="vp8"',
		};
		mediaRecorder = new MediaRecorder(videoPlayer.captureStream(), options);
		} catch (e) {
		console.error('Impossibile registrare: ' + e);
		return;
		}
	
		if (!isPlaying) {
		videoPlayer.play();
		playButton.textContent = "⏸\nPause";
		console.log('Play Button Clicked - Video Playing');
		activateTimerStyle(); // Attiva lo stile quando si avvia la registrazione
		}
	
		const today = new Date();
		const formattedDate = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;
		const fileName = `Zoo_${formattedDate}.webm`;
	
		recordingStartTime = Date.now();
		recordingInterval = setInterval(updateRecordingTime, 1000);
	
		mediaRecorder.ondataavailable = (event) => {
		if (event.data.size > 0) {
			recordedChunks.push(event.data);
		}
		};
	
		mediaRecorder.onstop = () => {
		const blob = new Blob(recordedChunks, { type: 'video/mp4; codecs="h264"' });
		const url = URL.createObjectURL(blob);
	
		const a = document.createElement('a');
		a.style.display = 'none';
		a.href = url;
		a.download = fileName;
		document.body.appendChild(a);
		a.click();
		window.URL.revokeObjectURL(url);
	
		recordedChunks = [];
		recButton.textContent = '🔴/▶️\nRec/AutoPlay';
		console.log('Rec Button Clicked - Video Recording');
	
		videoPlayer.pause();
	
		clearInterval(recordingInterval);
		recordingStartTime = null;
		lastPlayTime = 0;
		recordingTimeElement.textContent = '0:0:00';
		resetTimerStyle(); // Ripristina lo stile quando si ferma la registrazione
		};
	
		mediaRecorder.start();
		recButton.textContent = '⏹\nStop-Rec';
		console.log('Stop Button Clicked - Video Recording');
	}
	});

	function updateRecordingTime() {
		if (recordingStartTime) {
			const currentTime = Date.now();
			const elapsedTime = currentTime - recordingStartTime;
			const totalElapsedTime = elapsedTime + lastPlayTime;
			const seconds = Math.floor(totalElapsedTime / 1000);
			const minutes = Math.floor(seconds / 60);
			const hours = Math.floor(minutes / 60);
			const remainingSeconds = seconds % 60;
			const timeString = `${hours}:${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
			recordingTimeElement.textContent = timeString;
		//	console.log('Recording Time Updated to: ' + timeString);
		}
	}
});


//#############################################################################################
//# Attiva la modalità schermo intero del video quando il pulsante Fullscreen viene cliccato. #
//#############################################################################################

document.addEventListener('DOMContentLoaded', () => {
	// Recupera il riferimento all'elemento video e al pulsante Fullscreen utilizzando const e let
	const video = document.getElementById("mediaset-player");
	const fullScreenButton = document.getElementById("fullScreenButton");
	
	// Aggiungi un gestore di eventi al pulsante Fullscreen
	fullScreenButton.addEventListener("click", () => {
		if (video.requestFullscreen) {
			video.requestFullscreen();
		} else if (video.mozRequestFullScreen) { // Firefox
			video.mozRequestFullScreen();
		} else if (video.webkitRequestFullscreen) { // Chrome, Safari, and Opera
			video.webkitRequestFullscreen();
		}
	});
});
