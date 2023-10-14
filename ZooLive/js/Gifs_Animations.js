//######################
//# Gifs_Animations.js #
//######################

//##################################
//# Gestore delle Animazioni Gifs. #
//##################################

document.addEventListener('DOMContentLoaded', () => {
  // Lista delle immagini mescolata in modo casuale
  function shuffleArray(array) {
    for (let i = array.length - 6; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  // Array di percorsi delle immagini disponibili.
  const imagePaths = [
    'https://i.ibb.co/fMkwTqJ/Zoo1.gif',
    'https://i.ibb.co/VBMNQ33/Zoo2.gif',
    'https://i.ibb.co/YN1C7LQ/Zoo3.gif',
    'https://i.ibb.co/L5w6j5w/Zoo4.gif',
    'https://i.ibb.co/Z62GGGR/Zoo5.gif',
    'https://i.ibb.co/VWnSf8N/Zoo6.gif',
    'https://i.ibb.co/f12WBCN/Zoo7.gif',
  ];

  // Mescola l'array delle immagini in modo casuale prima di iniziare l'animazione.
  shuffleArray(imagePaths);

  const imageContainer = document.getElementById('image-container');
  const maxImages = 13; // Numero massimo di immagini da visualizzare contemporaneamente.

  function createRandomImage() {
    if (imageContainer.children.length >= maxImages) {
      // Rimuove la prima immagine se raggiunge il numero massimo.
      const firstImage = imageContainer.children[0];
      imageContainer.removeChild(firstImage);
    }

    const image = new Image();
    const randomIndex = Math.floor(Math.random() * imagePaths.length); // Genera un indice casuale.
    const imagePath = imagePaths[randomIndex]; // Prendi il percorso dell'immagine dal percorso mescolato.
    image.src = imagePath; // Imposta il percorso dell'immagine.
    image.className = 'image';

    // Imposta le dimensioni dell'immagine.
    image.width = 360;

	// Imposta il bordo arrotondato al 5%.
	image.style.borderRadius = '20%';

    image.onload = function () {
      const maxX = document.documentElement.clientWidth - this.width;
      const maxY = document.documentElement.clientHeight - this.height;
      const randomX = Math.random() * maxX;
      const randomY = Math.random() * maxY;

      image.style.left = randomX + 'px';
      image.style.top = randomY + 'px';
    }

    // effetto di dissolvenza.
    image.style.opacity = 0; // Inizialmente immagine trasparente.
    let opacity = 0;
    const fadeInterval = setInterval(() => {
      opacity += 0.01;
      image.style.opacity = opacity;
      if (opacity >= 1) {
        clearInterval(fadeInterval); // Interrompe l'animazione di dissolvenza.
      }
    }, 10); // Intervallo di tempo di 10ms.

    // Imposta un'animazione casuale
    const animationDuration = Math.random() * 1 + 20; // Durata in secondi.
    image.style.animation = `move ${animationDuration}s linear infinite`;

    // Imposta una rotazione casuale tra -60 e 60 gradi.
    const rotation = Math.random() * 120 - 60; // Gradi.
    image.style.transform = `rotate(${rotation}deg)`;

    // Imposta l'effetto di dissolvenza all'uscita prima di rimuovere l'immagine.
    setTimeout(() => {
      let opacity = 1;
      const fadeOutInterval = setInterval(() => {
        opacity -= 0.01;
        image.style.opacity = opacity;
        if (opacity <= 0) {
          clearInterval(fadeOutInterval); // Interrompe l'animazione di dissolvenza all'uscita.
          if (imageContainer.contains(image)) {
            imageContainer.removeChild(image); // Rimuove l'immagine dopo l'animazione.
          }
        }
      }, 50);
    }, animationDuration * 5000); // Attende il completamento dell'animazione di movimento prima di avviare l'uscita.

    imageContainer.appendChild(image);
  }

  // Crea nuove immagini periodicamente.
  setInterval(createRandomImage, 5000); // Crea una nuova immagine ogni 5 secondi.
});
