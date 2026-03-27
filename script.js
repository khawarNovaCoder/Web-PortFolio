// Mobile Navigation Toggle
const menuBtn = document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');
const navContainer = document.querySelector('.navbar');

menuBtn.addEventListener('click', () => {
    navContainer.classList.toggle('nav-active');
    navLinks.classList.toggle('active');
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navContainer.classList.remove('nav-active');
        navLinks.classList.remove('active');
    });
});

// Typing Text Effect
const typingText = document.querySelector('.typing-text');
const phrases = [
    "I build digital experiences",
    "I design user interfaces",
    "I solve complex problems",
    "I love clean code"
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typeSpeed = 100;

function typeEffect() {
    const currentPhrase = phrases[phraseIndex];
    
    if (isDeleting) {
        typingText.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
        typeSpeed = 50;
    } else {
        typingText.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
        typeSpeed = 100;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
        isDeleting = true;
        typeSpeed = 2000;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typeSpeed = 500;
    }

    setTimeout(typeEffect, typeSpeed);
}

// Initialize Typing Effect
document.addEventListener('DOMContentLoaded', typeEffect);

// Scroll Reveal Animation
const revealElements = document.querySelectorAll('.section-title, .about-text, .skill-category, .project-card, .timeline-item, .contact-card, .contact-form');

revealElements.forEach(el => el.classList.add('reveal'));

const revealOnScroll = () => {
    const windowHeight = window.innerHeight;
    const elementVisible = 150;

    revealElements.forEach(el => {
        const elementTop = el.getBoundingClientRect().top;
        if (elementTop < windowHeight - elementVisible) {
            el.classList.add('active');
        }
    });
};

window.addEventListener('scroll', revealOnScroll);
revealOnScroll();

// Active Navigation Link on Scroll
const sections = document.querySelectorAll('section');
const navItems = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navItems.forEach(li => {
        li.classList.remove('active');
        if (li.getAttribute('href').includes(current)) {
            li.classList.add('active');
        }
    });
});

// =========================================
// PROJECT SLIDER ARROW NAVIGATION
// =========================================
document.addEventListener('DOMContentLoaded', function () {
    const track = document.getElementById('sliderTrack');
    const prevBtn = document.getElementById('sliderPrev');
    const nextBtn = document.getElementById('sliderNext');

    if (!track || !prevBtn || !nextBtn) return;

    const CARD_WIDTH = 428; // 380px card + 48px margin (3rem)
    let currentOffset = 0;
    let isManual = false;
    let autoResumeTimer = null;

    function enterManualMode() {
        if (isManual) return;
        isManual = true;

        // Read current animated position from computed transform matrix
        const matrix = window.getComputedStyle(track).transform;
        if (matrix && matrix !== 'none') {
            const vals = matrix.match(/matrix.*\((.+)\)/);
            if (vals) {
                const parts = vals[1].split(', ');
                currentOffset = Math.abs(parseFloat(parts[4]) || 0);
            }
        }

        // Kill CSS animation, hold position
        track.style.animation = 'none';
        track.style.transition = 'none';
        track.style.transform = `translateX(-${currentOffset}px)`;

        // Enable smooth transition for next movement
        requestAnimationFrame(() => {
            track.style.transition = 'transform 0.45s cubic-bezier(0.25, 0.8, 0.25, 1)';
        });
    }

    function resumeAuto() {
        isManual = false;
        track.style.transition = 'none';
        track.style.transform = 'translateX(0)';
        setTimeout(() => {
            track.style.animation = '';
            track.style.transform = '';
            track.style.transition = '';
        }, 60);
    }

    function slide(direction) {
        enterManualMode();

        const halfWidth = track.scrollWidth / 2;
        currentOffset += direction * CARD_WIDTH;

        // Wrap around
        if (currentOffset < 0) currentOffset = halfWidth + currentOffset;
        if (currentOffset >= halfWidth) currentOffset = currentOffset - halfWidth;

        track.style.transform = `translateX(-${currentOffset}px)`;

        // Auto-resume after 3 seconds of no clicks
        clearTimeout(autoResumeTimer);
        autoResumeTimer = setTimeout(resumeAuto, 3000);
    }

    prevBtn.addEventListener('click', () => slide(-1));
    nextBtn.addEventListener('click', () => slide(1));
});
