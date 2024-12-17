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

document.querySelector('#about-link').addEventListener('click', () => {
    let stateObj = { page: 'about' };
    document.title = 'About';
    history.pushState(stateObj, "about", "?about");
    RenderAboutPage();
});

document.querySelector('#contact-link').addEventListener('click', () => {
    let stateObj = { page: 'contact' };
    document.title = 'Contact';
    history.pushState(stateObj, "contact", "?contact");
    RenderContactPage();
});

document.querySelector('#gallery-link').addEventListener('click', () => {
    let stateObj = { page: 'gallery' };
    document.title = 'Gallery';
    history.pushState(stateObj, "gallery", "?gallery");
    RenderGalleryPage();
});

function RenderAboutPage() {
    document.querySelector('main').innerHTML = `<h1 class="title">About Me</h1>
    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry...</p>`;
}

function RenderContactPage() {
    document.querySelector('main').innerHTML = `<h1 class="title">Contact with me</h1>
    <form id="contact-form">
        <label for="name">Name:</label>
        <input type="text" id="name" name="name" required>
        <label for="email">Email:</label>
        <input type="email" id="email" name="email" required>
        <label for="message">Message:</label>
        <textarea id="message" name="message" required></textarea>
        <button type="submit">Send</button>
    </form>`;
    document.getElementById('contact-form').addEventListener('submit', (event) => {
        event.preventDefault();
        alert('Form submitted!');
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

    for (let i = 1; i <= 9; i++) {
        let img = document.createElement('img');
        img.classList.add('gallery-img', 'lazy');
        img.dataset.src = `https://via.placeholder.com/150?text=Image+${i}`;
        galleryContainer.appendChild(img);
    }

    const lazyImages = document.querySelectorAll('.lazy');
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                fetch(img.dataset.src)
                    .then(response => response.blob())
                    .then(blob => {
                        const url = URL.createObjectURL(blob);
                        img.src = url;
                        img.classList.remove('lazy');
                        observer.unobserve(img);
                    });
            }
        });
    });

    lazyImages.forEach(img => observer.observe(img));

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
    let loc = window.location.href.toString().split(window.location.host)[1];
    if (loc === pageUrls.contact) { RenderContactPage(); }
    if (loc === pageUrls.about) { RenderAboutPage(); }
    if (loc === pageUrls.gallery) { RenderGalleryPage(); }
}

window.onpopstate = popStateHandler;
