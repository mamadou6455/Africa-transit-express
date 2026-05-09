// Navigation mobile
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
});

// Smooth scrolling pour les liens d'ancrage
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Animation au scroll
function animateOnScroll() {
    const elements = document.querySelectorAll('.service-card, .contact-item, .stat');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        
        if (elementTop < window.innerHeight && elementBottom > 0) {
            element.classList.add('visible');
        }
    });
}

window.addEventListener('scroll', animateOnScroll);
window.addEventListener('load', animateOnScroll);

// Header scroll effect
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
});

// Formulaire de contact
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Récupérer les données du formulaire
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        service: document.getElementById('service').value,
        message: document.getElementById('message').value
    };
    
    // Validation simple
    if (!formData.name || !formData.email || !formData.message) {
        showNotification('Veuillez remplir tous les champs obligatoires', 'error');
        return;
    }
    
    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        showNotification('Veuillez entrer une adresse email valide', 'error');
        return;
    }
    
    // Simuler l'envoi du formulaire
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Envoi en cours...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        // Réinitialiser le formulaire
        document.getElementById('contactForm').reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Afficher un message de succès
        showNotification('Votre message a été envoyé avec succès! Nous vous contacterons bientôt.', 'success');
        
        // Log des données (à remplacer par un vrai envoi vers un serveur)
        console.log('Données du formulaire:', formData);
    }, 2000);
});

// Système de notification
function showNotification(message, type = 'info') {
    // Créer l'élément de notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Ajouter au DOM
    document.body.appendChild(notification);
    
    // Animation d'entrée
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Bouton de fermeture
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        closeNotification(notification);
    });
    
    // Fermeture automatique
    setTimeout(() => {
        closeNotification(notification);
    }, 5000);
}

function getNotificationIcon(type) {
    switch(type) {
        case 'success': return 'fa-check-circle';
        case 'error': return 'fa-exclamation-circle';
        case 'warning': return 'fa-exclamation-triangle';
        default: return 'fa-info-circle';
    }
}

function closeNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// Compteur animé pour les statistiques
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        if (element.textContent.includes('+')) {
            element.textContent = Math.floor(current) + '+';
        } else if (element.textContent.includes('%')) {
            element.textContent = Math.floor(current) + '%';
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Observer pour les statistiques
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat h3');
            statNumbers.forEach(stat => {
                const text = stat.textContent;
                const number = parseInt(text.replace(/\D/g, ''));
                if (!isNaN(number)) {
                    animateCounter(stat, number);
                }
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

// Observer la section about
const aboutSection = document.querySelector('.about-stats');
if (aboutSection) {
    statsObserver.observe(aboutSection);
}

// Effet parallaxe pour le hero
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Animation des services au hover
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-15px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Validation des champs en temps réel
document.getElementById('email').addEventListener('input', function() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (this.value && !emailRegex.test(this.value)) {
        this.style.borderColor = '#e74c3c';
    } else {
        this.style.borderColor = '#e0e0e0';
    }
});

document.getElementById('phone').addEventListener('input', function() {
    const phoneRegex = /^[\d\s\+\-\(\)]+$/;
    if (this.value && !phoneRegex.test(this.value)) {
        this.style.borderColor = '#e74c3c';
    } else {
        this.style.borderColor = '#e0e0e0';
    }
});

// Bouton retour en haut
const backToTopBtn = document.createElement('button');
backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
backToTopBtn.className = 'back-to-top';
backToTopBtn.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    background: var(--secondary-color);
    color: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 999;
    box-shadow: 0 5px 15px rgba(231, 76, 60, 0.3);
`;

document.body.appendChild(backToTopBtn);

window.addEventListener('scroll', () => {
    // Afficher le bouton dès que l'utilisateur dépasse la première section (hero)
    const heroSection = document.querySelector('.hero');
    const heroHeight = heroSection ? heroSection.offsetHeight : window.innerHeight;
    
    if (window.scrollY > heroHeight * 0.8) { // 80% de la hauteur de la hero section
        backToTopBtn.style.opacity = '1';
        backToTopBtn.style.visibility = 'visible';
    } else {
        backToTopBtn.style.opacity = '0';
        backToTopBtn.style.visibility = 'hidden';
    }
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Styles pour les notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        right: -400px;
        max-width: 400px;
        background: white;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        transition: right 0.3s ease;
    }
    
    .notification.show {
        right: 20px;
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        padding: 15px 20px;
        gap: 15px;
    }
    
    .notification-success {
        border-left: 4px solid #27ae60;
    }
    
    .notification-success i {
        color: #27ae60;
    }
    
    .notification-error {
        border-left: 4px solid #e74c3c;
    }
    
    .notification-error i {
        color: #e74c3c;
    }
    
    .notification-warning {
        border-left: 4px solid #f39c12;
    }
    
    .notification-warning i {
        color: #f39c12;
    }
    
    .notification-info {
        border-left: 4px solid #3498db;
    }
    
    .notification-info i {
        color: #3498db;
    }
    
    .notification-close {
        background: none;
        border: none;
        font-size: 1.2rem;
        cursor: pointer;
        color: #7f8c8d;
        padding: 0;
        margin-left: auto;
    }
    
    .notification-close:hover {
        color: #2c3e50;
    }
    
    .back-to-top:hover {
        background: #c0392b !important;
        transform: translateY(-3px);
    }
`;

document.head.appendChild(notificationStyles);

// Préchargement des images
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        if (img.dataset.src) {
            img.src = img.dataset.src;
        }
    });
});

// Détection de la connexion internet
window.addEventListener('online', () => {
    showNotification('Connexion internet rétablie', 'success');
});

window.addEventListener('offline', () => {
    showNotification('Connexion internet perdue', 'warning');
});

console.log('AFRICA TRANSIT EXPRESS - Site web chargé avec succès!');
