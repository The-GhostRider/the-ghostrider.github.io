//###############################
//# Tips_e_Spoilers_Features.js #
//###############################


//#####################################
//# Gestore Posizione Tips e Spoilers #
//#####################################

window.addEventListener('load', function() {
    console.log("La funzione load è stata chiamata.");
    const spoilerContents = document.querySelectorAll('.spoiler-content');
    const tipContents = document.querySelectorAll('.tip-content');
    
    function positionContent(contents, iconIdPrefix, topMultiplier, leftMultiplier) {
        contents.forEach((content, index) => {
            const iconId = `${iconIdPrefix}${index}`;
            const icon = document.getElementById(iconId);
            
            if (icon && content) {
                const iconRect = icon.getBoundingClientRect();
                const top = iconRect.top + iconRect.height * topMultiplier;
                const left = iconRect.left + iconRect.width * leftMultiplier;
                
                content.style.top = top + 'px';
                content.style.left = left + 'px';
                content.style.display = 'none';
            }
        });
    }
    
    positionContent(tipContents, '#Tip', 1, 1);
    positionContent(spoilerContents, 'copiaBTest', 0.31, 0.39);
});



//###############################
//# Tips e Spoilers Fade System #
//###############################

function addFadeEffect(selector) {
	const elements = document.querySelectorAll(selector);

	elements.forEach((element) => {
		let opacity = 0;
		let scale = 0.1;
		let interval;
		const elementContent = element.nextElementSibling; // Ottieni il contenuto del Tip o dello Spoiler

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
				elementContent.style.transform = `scale(${scale}) translate(-50%, -50%)`;
				if (opacity >= 1) {
					clearInterval(interval);
				}
			}, 10); // Regola la velocità della dissolvenza in base alle tue preferenze
		}

		function fadeOut() {
			interval = setInterval(function () {
				opacity -= 0.1;
				scale -= 0.1; // Riduci la scala durante il fadeOut
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

document.addEventListener("DOMContentLoaded", function () {
	addFadeEffect(`.tip-icon`);
});


//################################
//# Spoilers Open e Close System #
//################################

const index = (0, 1, 2, 3);
// Funzione per chiudere tutti gli spoiler
function closeAllSpoilers() {
	const spoilerContents = document.querySelectorAll(`.spoiler-content`);
	spoilerContents.forEach((spoilerContent) => {
	spoilerContent.style.display = 'none';
	});
}

// Funzione per aprire o chiudere lo spoiler
function toggleSpoiler(index) {
const spoilerContent = document.querySelector(`#spoilerContent${index}`);
	if (spoilerContent.style.display === 'block') {
		spoilerContent.classList.add('fadeOut');
		setTimeout(function() {
		spoilerContent.style.display = 'none';
		spoilerContent.classList.remove('fadeOut');
		}, 1500);
	} else {
		closeAllSpoilers(); // Chiudi tutti gli spoiler prima di aprirne uno
		spoilerContent.style.display = 'block';
		spoilerContent.classList.add('fadeIn');
		setTimeout(function() {
		spoilerContent.classList.remove('fadeIn');
		}, 1500);
	}
}

// Aggiungi event listener per il click su spoiler
const spoilers = document.querySelectorAll(`.spoilers-container > .spoiler`);
spoilers.forEach((spoiler, index) => {
	spoiler.addEventListener('click', () => {
	toggleSpoiler(index);
	});
});