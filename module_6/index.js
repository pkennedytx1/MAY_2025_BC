const slides = document.querySelectorAll('.slide');
let currentSlide = 0;

function showSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    slides[index].classList.add('active');
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
}

const createGreeting = () => {
    const greeting = document.getElementById("greeting-title")
    const name = document.getElementById("name").value
    if (name) {
        greeting.textContent = "Howdy " + name + "!"
    } else {
        greeting.textContent = "Hello nobody!"
    }
}