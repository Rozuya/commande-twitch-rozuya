// ========================================================
// 🌌 SYSTÈME DE PARTICULES MAGIQUES (ARRIÈRE-PLAN)
// ========================================================
const canvas = document.getElementById('magic-canvas');
const ctx = canvas.getContext('2d');

let particlesArray = [];
const numberOfParticles = 50;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height + canvas.height;
        this.size = Math.random() * 2.5 + 1;
        this.speedY = Math.random() * -0.8 - 0.2;
        this.speedX = Math.random() * 0.8 - 0.4;
        this.color = Math.random() > 0.5 ? 'rgba(145, 70, 255, 0.3)' : 'rgba(212, 175, 55, 0.3)';
    }

    update() {
        this.y += this.speedY;
        this.x += this.speedX;
        
        if (this.y < 0) {
            this.y = canvas.height;
            this.x = Math.random() * canvas.width;
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

function initParticles() {
    particlesArray = [];
    for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
    }
}
initParticles();

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
    }
    requestAnimationFrame(animate);
}
animate();

// ========================================================
// 🔍 SYSTÈME DE RECHERCHE EN TEMPS RÉEL
// ========================================================
document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("search-commands");
    const commandCards = document.querySelectorAll(".command-card");

    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            const query = e.target.value.toLowerCase().trim();

            commandCards.forEach(card => {
                const trigger = card.querySelector(".command-trigger").textContent.toLowerCase();
                const desc = card.querySelector(".command-desc").textContent.toLowerCase();

                if (trigger.includes(query) || desc.includes(query)) {
                    card.style.display = "flex";
                } else {
                    card.style.display = "none";
                }
            });
        });
    }

    // ========================================================
    // 📋 COPIE DANS LE PRESSE-PAPIER & NOTIFICATION (TOAST)
    // ========================================================
    const copyButtons = document.querySelectorAll(".copy-btn");
    const toastContainer = document.getElementById("toast-container");

    copyButtons.forEach(button => {
        button.addEventListener("click", () => {
            const commandText = button.getAttribute("data-command");

            navigator.clipboard.writeText(commandText).then(() => {
                showToast(`🪄 Sortilège ${commandText} copié !`);
            }).catch(err => {
                console.error("Erreur de copie :", err);
            });
        });
    });

    function showToast(message) {
        if (!toastContainer) return;

        const toast = document.createElement("div");
        toast.className = "toast";
        toast.innerHTML = `<span>✨</span> ${message}`;

        toastContainer.appendChild(toast);

        // Supprime la notification du DOM après la fin de l'animation
        setTimeout(() => {
            toast.remove();
        }, 2500);
    }
});
