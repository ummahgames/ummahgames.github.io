// Every game remains an ordinary link, even with JavaScript disabled.
// Give the optional "Surprise me" link a fresh destination on activation.
const gameLinks = Array.from(document.querySelectorAll('.game-card'), card => card.getAttribute('href'));
const surpriseLink = document.getElementById('surprise-link');

if (surpriseLink && gameLinks.length) {
  surpriseLink.addEventListener('click', () => {
    surpriseLink.href = gameLinks[Math.floor(Math.random() * gameLinks.length)];
  });
}
