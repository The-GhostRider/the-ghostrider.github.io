//###############################
//# Tips_e_Spoilers_Features.js #
//###############################


//###############################
//# Tips e Spoilers Fade System #
//###############################

document.addEventListener('DOMContentLoaded', () => {
	function addFadeEffect(selector) {
		const elements = document.querySelectorAll(selector);
	
		elements.forEach((element) => {
			let opacity = 0;
			let scale = 0.1;
			let interval;
			const elementContent = element.nextElementSibling; // Ottiene il contenuto del Tip o dello Spoiler.
	
			element.addEventListener("mouseenter", function () {
				clearInterval(interval);
				elementContent.style.display = "block";
				fadeIn();
			});
	
			element.addEventListener("mouseleave", function () {
				clearInterval(interval);
				fadeOut();
			});
	
			function fadeIn() {
				interval = setInterval(function () {
					opacity += 0.1;
					scale += 0.1; // Aumenta la scala durante il fadeIn
					elementContent.style.opacity = opacity;
					elementContent.style.transform = `scale(${scale}) translate(-50%, -10%)`;
					if (opacity >= 1) {
						clearInterval(interval);
					}
				}, 10); // Regola la velocità della dissolvenza in base alle tue preferenze
			}
	
			function fadeOut() {
				interval = setInterval(function () {
					opacity -= 0.1;
					scale -= 0.1; // Riduce la scala durante il fadeOut
					elementContent.style.opacity = opacity;
					elementContent.style.transform = `scale(${scale}) translate(50%, -50%)`;
					if (opacity <= 0) {
						clearInterval(interval);
						elementContent.style.display = "none";
					}
				}, 40); // Regola la velocità della dissolvenza in base alle tue preferenze
			}
		});
	}

	addFadeEffect(`.tip-icon`);
});


//################################
//# Spoilers Open e Close System #
//################################

// Funzione per chiudere tutti gli spoiler
function closeAllSpoilers() {
	const spoilerContents = document.querySelectorAll('.spoiler-content');
	spoilerContents.forEach((spoilerContent) => {
		spoilerContent.style.display = 'none';
	});
}
// Funzione per aprire o chiudere lo spoiler
function toggleSpoiler(element) {
	const spoilerContent = element.querySelector('.spoiler-content');
	if (spoilerContent.style.display === 'block') {
		spoilerContent.classList.add('fadeOut');
		setTimeout(function() {
			spoilerContent.style.display = 'none';
			spoilerContent.classList.remove('fadeOut');
		}, 1500);
	} else {
		closeAllSpoilers(); // Chiude tutti gli spoiler prima di aprirne uno
		spoilerContent.style.display = 'block';
		spoilerContent.classList.add('fadeIn');
		setTimeout(function() {
			spoilerContent.classList.remove('fadeIn');
		}, 1500);
	}
}

// Aggiunge event listener per il click su spoiler
const spoilers = document.querySelectorAll('.spoilers-container > .spoiler');
spoilers.forEach((spoiler) => {
	spoiler.addEventListener('click', () => {
		toggleSpoiler(spoiler);
	});
});