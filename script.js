/**
 * ==========================================================================
 * LE GRIMOIRE DES COMMANDES TWITCH - ROZUYA
 * Script d'Immersion Magique, d'Interactivité & de Performance
 * ==========================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
    // Initialisation de toutes les fonctionnalités magiques
    initMagicParticles();
    initCustomCursor();
    initCopySystem();
    initLiveSearch();
});

/* ==========================================================================
   1. SYSTÈME DE PARTICULES MAGIQUES (HTML5 CANVAS)
   ========================================================================== */
function initMagicParticles() {
    const canvas = document.getElementById("magic-canvas");
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    let particlesArray = [];
    
    // Limitation du nombre de particules sur mobile pour préserver la batterie et les performances
    const isMobile = window.innerWidth <= 900;
    const maxParticles = isMobile ? 25 : 65;

    // Ajustement de la taille du canvas à l'écran
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    // Classe représentant une poussière d'étoile magique
    class Particle {
        constructor() {
            this.reset();
        }

        // Réinitialise la particule en bas de l'écran avec des valeurs aléatoires
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height + Math.random() * 80;
            this.size = Math.random() * 2.5 + 0.8;
            this.speedX = Math.random() * 1.2 - 0.6;
            this.speedY = -(Math.random() * 1.0 + 0.3); // Monte doucement vers le haut
            
            // Alternance entre le Violet Twitch et le Doré magique
            const isPurple = Math.random() > 0.4;
            this.color = isPurple ? "145, 70, 255" : "212, 175, 55";
            this.alpha = Math.random() * 0.5 + 0.1; // Transparence variable
        }

        // Met à jour la position et l'opacité
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            // Oscillation naturelle
            this.x += Math.sin(this.y / 30) * 0.2;

            // Si la particule sort de l'écran par le haut ou les côtés, on la réinitialise
            if (this.y < -20 || this.x < -20 || this.x > canvas.width + 20) {
                this.reset();
            }
        }

        // Dessine la particule avec un léger effet de lueur (glow)
        draw() {
            ctx.fillStyle = `rgba(${this.color}, ${this.alpha})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Génération du vivier de particules
    for (let i = 0; i < maxParticles; i++) {
        particlesArray.push(new Particle());
    }

    // Boucle d'animation principale (60 FPS si possible)
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();
        }
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

/* ==========================================================================
   2. CURSEUR PLUME ET ÉTINCELLES AU CLIC
   ========================================================================== */
function initCustomCursor() {
    const cursor = document.getElementById("custom-cursor");
    
    // On ne charge pas le curseur personnalisé sur mobile (inutile et gênant)
    if (!cursor || window.innerWidth <= 900) {
        if (cursor) cursor.style.display = "none";
        return;
    }

    // Suivi du mouvement de la souris
    window.addEventListener("mousemove", (e) => {
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
    });

    // Effet d'étincelles au clic
    window.addEventListener("click", (e) => {
        createClickSparks(e.clientX, e.clientY);
    });
}

// Génère une explosion de poussière magique au clic de la souris
function createClickSparks(x, y) {
    const sparkCount = 10; // Nombre d'étincelles générées
    
    for (let i = 0; i < sparkCount; i++) {
        const spark = document.createElement("div");
        
        // Styles de base de l'étincelle
        spark.style.position = "fixed";
        spark.style.left = `${x}px`;
        spark.style.top = `${y}px`;
        spark.style.width = "6px";
        spark.style.height = "6px";
        spark.style.borderRadius = "50%";
        spark.style.pointerEvents = "none";
        spark.style.zIndex = "10002";
        
        // Moitié or, moitié violet
        const isPurple = Math.random() > 0.5;
        spark.style.backgroundColor = isPurple ? "#9146FF" : "#d4af37";
        spark.style.boxShadow = `0 0 8px ${isPurple ? "#bf94ff" : "#f3e6c9"}`;
        
        // Calcul d'une direction de projection aléatoire à 360 degrés
        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 5 + 2; // Vitesse de projection
        
        let currentX = x;
        let currentY = y;
        let opacity = 1;

        document.body.appendChild(spark);

        // Animation de la trajectoire de l'étincelle
        const animateSpark = () => {
            currentX += Math.cos(angle) * velocity;
            currentY += Math.sin(angle) * velocity;
            
            // Légère gravité simulée (les étincelles descendent doucement)
            currentY += 0.15; 
            
            opacity -= 0.03; // Disparition progressive

            spark.style.left = `${currentX}px`;
            spark.style.top = `${currentY}px`;
            spark.style.opacity = opacity;

            if (opacity > 0) {
                requestAnimationFrame(animateSpark);
            } else {
                spark.remove(); // Nettoyage du DOM une fois invisible
            }
        };

        requestAnimationFrame(animateSpark);
    }
}

/* ==========================================================================
   3. SYSTEME DE COPIE SÉCURISÉ & ALERTE SOURNOISE (TOAST)
   ========================================================================== */
function initCopySystem() {
    const copyButtons = document.querySelectorAll(".btn-copy");
    const container = document.getElementById("toast-container");

    if (!container) return;

    copyButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const commandText = btn.getAttribute("data-command");
            if (!commandText) return;

            // Utilisation de l'API Presse-papiers moderne
            navigator.clipboard.writeText(commandText).then(() => {
                showToast(`✨ L'incantation "${commandText}" est gravée dans ton esprit ! (Copiée)`);
            }).catch(err => {
                console.error("Erreur d'écriture dans le grimoire : ", err);
            });
        });
    });

    // Affiche la notification toast élégamment
    function showToast(message) {
        const toast = document.createElement("div");
        toast.className = "toast";
        toast.innerText = message;
        
        container.appendChild(toast);

        // Disparition en fondu et retrait après 2.5 secondes
        setTimeout(() => {
            toast.style.opacity = "0";
            toast.style.transform = "translateX(50px)";
            toast.style.transition = "all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)";
            
            setTimeout(() => {
                toast.remove();
            }, 400);
        }, 2500);
    }
}

/* ==========================================================================
   4. FILTRAGE INSTANTANÉ (MOTEUR DE RECHERCHE REPTILIEN)
   ========================================================================== */
function initLiveSearch() {
    const searchBar = document.getElementById("search-commands");
    const placeholder = document.getElementById("no-commands-placeholder");
    
    if (!searchBar) return;

    searchBar.addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase().trim();
        const cards = document.querySelectorAll(".command-card");
        let activeCardsCount = 0;

        cards.forEach(card => {
            const trigger = card.querySelector(".trigger").innerText.toLowerCase();
            const description = card.querySelector(".description").innerText.toLowerCase();

            // Si la requête correspond au nom de la commande ou à la description
            if (trigger.includes(query) || description.includes(query)) {
                card.style.display = "flex";
                activeCardsCount++;
            } else {
                card.style.display = "none";
            }
        });

        // Gestion optionnelle d'un message d'absence de résultat (uniquement pour les pages actives)
        if (placeholder && !placeholder.closest('.book-page.right').querySelector('.commands-container[style*="display: none"]')) {
            if (activeCardsCount === 0 && query !== "") {
                placeholder.style.display = "block";
                placeholder.querySelector("p").innerText = "Aucun sort ne correspond à cette recherche...";
            } else if (query === "") {
                placeholder.style.display = "none";
            } else {
                placeholder.style.display = "none";
            }
        }
    });
}
