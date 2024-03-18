import menuArray from './dinerdata.js';

const menu = document.getElementById('menu');
const orderItems = document.getElementById('order-items');
const orderContainer = document.getElementById('order-container');
const totalPrice = document.getElementById('total-price');
const closeModalBtn = document.getElementById('close-modal-btn');
const modal = document.getElementById('modal');
const placeOrderBtn = document.getElementById('place-order-btn');
const completeOrderBtn = document.getElementById('complete-order-btn');
const paymentForm = document.getElementById('payment-form');
const modalTitle = document.querySelector('.modal-title');
const themeButton = document.querySelector('.theme-button');

themeButton.addEventListener('click', toggleTheme);

function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    themeButton.classList.toggle('dark-theme-button');

    if (document.body.classList.contains('dark-theme')) {
        themeButton.innerHTML = ('🌞');
    } else {
        themeButton.innerHTML = ('🌜');
    }
}

function menuHtml() {
    let menuHtml = ``;

    menuArray.forEach(item => {
        menuHtml += `
            <section class='menu-item'>
                <p class='item-photo'>${item.emoji}</p>
                <div class='menu-item-data'
                    <p>${item.name}</p>
                    <p>${item.ingredients}</p>
                    <p>$${item.price} <span>plus tax</span></p>
                </div>
                <button class='menu-button' id='menu-button'
                data-add-item='${item.id}'>
                    ➕ Add
                </button>
            </section>
        `
    })
    return menuHtml;
}

document.addEventListener('click', (e) => {
    if (e.target.dataset.addItem) {
        handleAddItem(e.target.dataset.addItem);
    } else if (e.target.dataset.remove) {
        handleRemoveItem(e.target.dataset.remove)
    }
})

function handleAddItem(id) {
    menuArray[id].quantity++;
    renderOrder();
}

function handleRemoveItem(id) {
    menuArray[id].quantity--;
    renderOrder();
}

function renderOrder() {
    let totalCost = 0;
    orderItems.innerHTML = ``;

    menuArray.forEach(item => {
        const tax = Math.round((item.quantity * item.price) * 7.25) / 100;

        if (item.quantity > 0) {
            totalCost += item.quantity * item.price + tax;

            orderItems.innerHTML += `
                <section class='order-item'>
                    <div class='order-item-info'>
                        <p>${item.quantity}</p>
                        <p>${item.name}</p>
                        <button class='remove-btn' data-remove='${item.id}'>
                            Remove Item
                        </button>
                        <p>$${item.quantity * item.price}</p>
                    </div>
                </section>
            `
        }
    })

    if (totalCost > 0) {
        orderContainer.style.display = 'block';
        totalPrice.textContent = '$' + totalCost.toFixed(2);
    } else if (totalCost === 0) {
        orderContainer.style.display = 'none';
    }
    
}

placeOrderBtn.addEventListener('click', function() {
    modal.style.display = 'block'
})

paymentForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const paymentFormData = new FormData(paymentForm);
    const name = paymentFormData.get('fullName');

    completeOrderBtn.style.display = 'none';

    modalTitle.innerHTML = `
        <div class="modal-inner-loading">
            <p>Processing</p>
            <img src="images/loading.svg" class="loading">
        </div>
    `

    setTimeout(() => {
        paymentForm.reset();
        modalTitle.textContent = `
            Thank you ${name} for your order. Delivery in 30 minutes.
        `
    }, 2000);
})

closeModalBtn.addEventListener('click', function() {
    clearOrderData();
    modal.style.display = 'none';
})

function clearOrderData() {
    menuArray.forEach(item => {
        item.quantity = 0;
        renderOrder();
    })
}

function render() {
    menu.innerHTML = menuHtml();
}

render();