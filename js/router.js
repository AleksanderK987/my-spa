let pageUrls = {
    about: '/index.html?about',
    contact: '/index.html?contact',
    gallery: '/index.html?gallery'
};

function OnStartUp() {
    popStateHandler();
}
OnStartUp();

document.getElementById('theme-toggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});

document.querySelector('header').addEventListener('click', (event) => {
    if (event.target.id === 'about-link') {
        changePage('about', RenderAboutPage);
    } else if (event.target.id === 'contact-link') {
        changePage('contact', RenderContactPage);
    } else if (event.target.id === 'gallery-link') {
        changePage('gallery', RenderGalleryPage);
    }
});

function changePage(page, renderFunction) {
    let stateObj = { page };
    document.title = page.charAt(0).toUpperCase() + page.slice(1);
    history.pushState(stateObj, page, `?${page}`);
    renderFunction();
}

function RenderAboutPage() {
    document.querySelector('main').innerHTML = `<h1 class="title">About Me</h1>
    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry...</p>`;
}

function RenderContactPage() {
    document.querySelector('main').innerHTML = `
    <h1 class="title">Contact with me</h1>
    <form id="contact-form">
        <label for="name">Name:</label>
        <input type="text" id="name" name="name" required>
        <span class="error-message" id="name-error"></span>

        <label for="email">Email:</label>
        <input type="email" id="email" name="email" required>
        <span class="error-message" id="email-error"></span>

        <label for="message">Message:</label>
        <textarea id="message" name="message" required></textarea>
        <span class="error-message" id="message-error"></span>

        <!-- CAPTCHA -->
        <div class="captcha-container">
            <label id="captcha-question"></label>
            <input type="text" id="captcha-answer" placeholder="Enter the result" required>
            <span class="error-message" id="captcha-error"></span>
        </div>

        <button type="submit">Send</button>
    </form>`;

    const form = document.getElementById('contact-form');
    const captchaQuestion = document.getElementById('captcha-question');
    const captchaAnswer = document.getElementById('captcha-answer');

    // Generowanie losowego działania matematycznego
    let num1 = Math.floor(Math.random() * 10) + 1;
    let num2 = Math.floor(Math.random() * 10) + 1;
    let correctAnswer = num1 + num2;
    captchaQuestion.textContent = `What is ${num1} + ${num2}?`;

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        // Resetowanie błędów
        document.querySelectorAll('.error-message').forEach(el => el.textContent = '');

        // Walidacja pól formularza
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();
        const captchaInput = captchaAnswer.value.trim();

        let isValid = true;

        if (name === '') {
            document.getElementById('name-error').textContent = 'Name is required.';
            isValid = false;
        }

        if (email === '' || !/^\S+@\S+\.\S+$/.test(email)) {
            document.getElementById('email-error').textContent = 'Valid email is required.';
            isValid = false;
        }

        if (message === '') {
            document.getElementById('message-error').textContent = 'Message cannot be empty.';
            isValid = false;
        }

        if (captchaInput === '' || parseInt(captchaInput) !== correctAnswer) {
            document.getElementById('captcha-error').textContent = 'Incorrect CAPTCHA answer.';
            isValid = false;
        }

        if (isValid) {
            alert('Form submitted successfully!');
            form.reset();
            // Opcjonalnie: Wygeneruj nowe pytanie CAPTCHA
            num1 = Math.floor(Math.random() * 10) + 1;
            num2 = Math.floor(Math.random() * 10) + 1;
            correctAnswer = num1 + num2;
            captchaQuestion.textContent = `What is ${num1} + ${num2}?`;
        }
    });
}


function RenderGalleryPage() {
    document.querySelector('main').innerHTML = `
    <h1 class="title">Gallery</h1>
    <div class="gallery-container"></div>
    <div id="modal" class="modal">
        <span id="close-modal">&times;</span>
        <img id="modal-image" class="modal-content" />
    </div>`;

    const galleryContainer = document.querySelector('.gallery-container');
    const modal = document.getElementById('modal');
    const modalImage = document.getElementById('modal-image');
    const closeModal = document.getElementById('close-modal');

    // Dodanie przykładowych obrazów
    for (let i = 1; i <= 9; i++) {
        let img = document.createElement('img');
        img.classList.add('gallery-img', 'lazy');
        img.dataset.src = `https://via.placeholder.com/150?text=Image+${i}`;
        galleryContainer.appendChild(img);
    }

    // Lazy loading
    const lazyImages = document.querySelectorAll('.lazy');
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => observer.observe(img));

    // Modal
    galleryContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('gallery-img')) {
            modal.style.display = 'block';
            modalImage.src = event.target.src;
        }
    });

    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

function popStateHandler() {
    let loc = window.location.search;
    if (loc === '?contact') { RenderContactPage(); }
    else if (loc === '?about') { RenderAboutPage(); }
    else if (loc === '?gallery') { RenderGalleryPage(); }
    else {
        document.querySelector('main').innerHTML = `<h1 class="title">Hello world!</h1>
        <p>Lorem Ipsum</p>`;
    }
}

window.onpopstate = popStateHandler;
