function Book(title, author, category, genre, pages, read) {
    this.title = title;
    this.author = author;
    this.category = category;
    this.genre = genre;
    this.pages = pages;
    this.read = read;
}

const buttons = (function () {
    const demoBtn = document.querySelector('#demoBtn');
    demoBtn.addEventListener('click', () => {
        if (demoBtn.innerText === 'Display Demo') {
            displayDemoLibrary();
            demoBtn.innerText = 'Remove Demo'
        } else {
            removeDemoLibrary();
            demoBtn.innerText = 'Display Demo'
        }
    });

    const newBookBtn = document.querySelector('#newBook');
    const dialog = document.querySelector('dialog');
    newBookBtn.addEventListener('click', () => {
        dialog.showModal();
    });

    const closeFormBtn = document.querySelector('#form-container > img');
    closeFormBtn.addEventListener('click', () => {
        dialog.close();
    });

})();

const processForm = (function () {
    const form = document.querySelector('form');
    const formInput = document.querySelectorAll('input, select');
    const dialog = document.querySelector('dialog');
    const mainLibrary = [];


    form.addEventListener('submit', (e) => {
        e.preventDefault();
        dialog.close();
        const inputValues = [];

        [...formInput].forEach(node => {
            inputValues.push(node.value);
            node.value = '';
        });

        const bookObj = new Book(...inputValues);
        mainLibrary.push(bookObj);
        displayMainLibrary(mainLibrary);
        console.dir(mainLibrary);
    });
})();

function displayMainLibrary(mainLibrary) {
    const bookTemplate = document.querySelector('#hiddenBook');
    const index = mainLibrary.length - 1;
    const bookObj = mainLibrary[index];
    const bookNode = generateBookNode(bookObj, bookTemplate);
    const mainSection = document.querySelector('main');
    const readBtn = bookNode.querySelector('.read');

    bookNode.setAttribute('data-index', index);
    bookNode.classList.add('userBook');
    bookObj.updateReadStatus(readBtn);

    mainSection.appendChild(bookNode, bookTemplate);

    activateUserBookBtns(mainLibrary, bookNode);
}

function displayDemoLibrary() {
    const demoLibrary = generateDemoLibrary();
    const bookTemplate = document.querySelector('#hiddenBook');
    const mainSection = document.querySelector('main');
    demoLibrary.forEach((bookObj, index) => {
        const bookNode = generateBookNode(bookObj, bookTemplate);
        bookNode.setAttribute('data-index', index);
        bookNode.classList.add('demoBook');
        mainSection.insertBefore(bookNode, bookTemplate);
    });
    activateDemoBookBtns(demoLibrary);
}

function generateDemoLibrary() {
    const demoLibrary = [];
    let bookObj = {};
    for (let i = 0; i < 21; i++) {
        bookObj = new Book(
            'Fun Book Title', 'John Smith', 'Fiction', 'Sci-Fi', '1000', true
        )
        demoLibrary.push(bookObj);
    }
    return demoLibrary;
}

function removeDemoLibrary() {
    const demoNodes = document.querySelectorAll('.demoBook');
    [...demoNodes].forEach((node) => {
        node.parentNode.removeChild(node);
    });
}

function generateBookNode(bookObj, hiddenBookTemplate) {
    const bookNode = hiddenBookTemplate.cloneNode(true);
    bookNode.removeAttribute('id');

    for (const property in bookObj) {

        switch (property) {
            case ('title'):
                bookNode.querySelector('.title').innerText =
                    bookObj[property];
                break;
            case ('author'):
                bookNode.querySelector('.author').innerText =
                    `by ${bookObj[property]}`;
                break;
            case ('category'): case ('genre'): case ('pages'):
                bookNode.querySelector(`.${property}`).innerText =
                    `${capitalizeFirstLetter(property)}: ${bookObj[property]}`;
                break;
            case ('read'):
                bookNode.querySelector(`.${property}`).setAttribute('data-read', bookObj[property]);
                break;
        }
    }
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    return bookNode;
}

function activateUserBookBtns(mainLibrary, bookNode) {

    const readBtn = bookNode.querySelector('.read');
    const removeBtn = bookNode.querySelector('.remove-book');


    readBtn.addEventListener('click', (btn) => {
        const clickedBookNode = btn.target.closest('.book');
        const index = clickedBookNode.getAttribute('data-index');
        mainLibrary[index].updateReadStatus(readBtn);
    });

    removeBtn.addEventListener('click', (btn) => {
        const clickedBookNode = btn.target.closest('.book');
        const index = clickedBookNode.getAttribute('data-index');
        clickedBookNode.remove();
        mainLibrary.splice(index, 1);
        console.dir(mainLibrary);
        const bookNodeList = document.querySelectorAll('.userBook');
        for (let i=0; i < mainLibrary.length; i++) {
            [...bookNodeList].forEach(node => {
                node.setAttribute('data-index', i);
            });
        }

    });
}

function activateDemoBookBtns(demoLibrary) {

    const readBtns = document.querySelectorAll('.read');
    readBtns.forEach(btn => btn.addEventListener('click', () => {
        const bookNode = btn.closest('.book');
        const index = bookNode.getAttribute('data-index');
        demoLibrary[index].updateReadStatus(clickedBookNode);
    }));

    const removeBtns = document.querySelectorAll('.remove-book');
    removeBtns.forEach(btn => btn.addEventListener('click', () => {
        const bookNode = btn.closest('.book');
        const index = bookNode.getAttribute('data-index');

        bookNode.remove();
        demoLibrary.splice(index, 1);
        console.dir(demoLibrary);

        const bookNodeList = document.querySelectorAll('.demoBook');
        for (let i=0; i < demoLibrary.length; i++) {
            [...bookNodeList].forEach(node => {
                node.setAttribute('data-index', i);
            });
        }
    }));
}

Book.prototype.updateReadStatus = function (readBtn) {
    if (this.read) {
        readBtn.setAttribute('src', './assets/book-remove.svg');
        this.read = false;
    } else {
        readBtn.setAttribute('src', './assets/book-check.svg');
        this.read = true;
    }
}





