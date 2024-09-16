document.addEventListener('DOMContentLoaded', async () => {
    let cart = []

    // Carrega e atualiza o carrinho
    const loadCart = () => {
        const empty = document.querySelector('.empty')
        const productsList = document.querySelector('.products-list')
        const cartNumber = document.getElementsByTagName('h2')

        cartNumber[0].innerText = `Carrinho (${cart.reduce((total, item) => total + item.quantity, 0)})`
        
        if (cart.length > 0) {
            empty.style.display = 'none'
            const list = '<div class="cart-item"><ul>' + cart.map((item, index) => `
                        <li>
                            <div>
                            <p class="li-name">${item.product.name}</p>
                            <div class="li-values">
                                <p class="li-quantity">${item.quantity}x</p>
                                <p class="li-default-value">R$ ${item.product.price.toFixed(2).replace('.', ',')}</p>
                                <p class="li-total-value">R$ ${(item.product.price * Number(item.quantity)).toFixed(2).replace('.', ',')}</p>
                            </div>
                            </div>
                            <button class="remove-btn" data-index="${index}"><img src="./assets/images/icon-remove-item.svg"></button>
                        </li>
            `).join('') + '</ul></div>'
            
            
            productsList.innerHTML = list + `
                <div class="cart-value">
                    <p>Total do pedido</p>
                    <p class="total-value">R$ ${cart.reduce((total, item) => total + (item.product.price * Number(item.quantity)), 0).toFixed(2).replace('.', ',')}</p>
                </div>
                <div class="carbon">
                    <img src="./assets/images/icon-carbon-neutral.svg">
                    <p>Esta é uma entrega <span>sem emissão de carbono</span>.</p>
                </div>
                <button class="confirm-button">Confirmar pedido</button>
            `
            
            // Remove o item por completo do carrinho
            productsList.querySelectorAll('.remove-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const index = btn.getAttribute('data-index')

                    // Procura pelos card um que o nome corresponda
                    document.querySelectorAll('.card').forEach(card => {
                        if (card.querySelector('.product-name').textContent == `${cart[index].product.name}`) {
                            const decrementButton = card.querySelector('.decrement')
                            let quantity = cart[index].quantity
        
                            // Simula o decremento até que a quantidade chegue a zero e volte o botão ao estado inicial
                            while (quantity > 0) {
                                decrementButton.click()
                                quantity--
                            }
                        }
                    })
                })

                const modalArea = document.querySelector('.modal-area')
                const openModalBtn = document.querySelector('.confirm-button')
                const closeModalBtn = document.querySelector('.closeBtn')

                closeModalBtn.addEventListener('click', () => {
                    modalArea.style.display = 'none'
                    location.reload(true)
                })

                modalArea.addEventListener('click', () => {
                    modalArea.style.display = 'none'
                    location.reload(true)
                })

                openModalBtn.addEventListener('click', () => {
                    modalArea.style.display = 'flex'
                })


                const modalCart = document.querySelector('.items-values')
                modalCart.innerHTML = '<ul class="resume">' + cart.map(item => `
                    <li>
                        <div style="display: flex; align-items: center;">
                            <img src="${item.product.image.thumbnail}">
                            <div>
                                <p class="li-name">${item.product.name}</p>
                                <div class="li-values">
                                    <p class="li-quantity">${item.quantity}x</p>
                                    <p class="li-default-value">R$ ${item.product.price.toFixed(2).replace('.', ',')}</p>
                                </div>
                            </div>
                        </div>
                        <p class="li-total-value">R$ ${(item.product.price * Number(item.quantity)).toFixed(2).replace('.', ',')}</p>
                    </li>
                `).join('') + `</ul>
                <div class="cart-value">
                    <p>Total do pedido</p>
                    <p class="total-value">R$ ${cart.reduce((total, itemAtual) => total + (itemAtual.product.price * Number(itemAtual.quantity)), 0).toFixed(2).replace('.', ',')}</p>
                </div>
            `
            })
        
        } else {
            productsList.innerHTML = ''
            empty.style.display = 'flex'
        }
    }

    const addToCart = (item) => {
        const existingItem = cart.find(cartItem => cartItem.product === item.product)

        if (existingItem && item.quantity > 0) {
            existingItem.quantity = item.quantity
        } else {
            cart.push(item)
        }
        
        loadCart()
    }

    const removeToCart = (item) => {
        const existingItem = cart.find(cartItem => cartItem.product === item.product)

        if (existingItem && item.quantity > 0) {
            existingItem.quantity = item.quantity
        } else {
            cart = cart.filter(cartItem => cartItem.product !== existingItem.product)
        }
        
        loadCart()
    }

    const loadProducts = async () => {
        try {
            const response = await fetch('data.json')
            const data = await response.json()

            const productsList = document.querySelector('.grid-container')

            data.forEach(product => {
                const card = document.createElement('div')
                card.classList.add('card')

                card.innerHTML = `
                    <div class="card-header">
                        <img class="product-img" src="${product.image.desktop}" alt="" width="300px">
                        <button class="btn-default"><img src="./assets/images/icon-add-to-cart.svg">Adicionar ao carrinho</button>
                        <span class="btn-count">
                            <button class="decrement"><img src="./assets/images/icon-decrement-quantity.svg"></button>
                            <span class="quantity"></span>
                            <button class="increment"><img src="./assets/images/icon-increment-quantity.svg"></button>
                        </span>
                    </div>
                    <div class="card-body">
                        <span class="category">${product.category}</span>
                        <h4 class="product-name">${product.name}</h4>
                        <span class="price">R$ ${product.price.toFixed(2).replace('.', ',')}</span>
                    </div>
                `

                const incrementButton = card.querySelector('.increment')
                const decrementButton = card.querySelector('.decrement')
                const quantitySpan = card.querySelector('.quantity')
                const button = card.querySelector('.btn-default')
                const buttonCount = card.querySelector('.btn-count')
                let quantity = 0

                // Troca para o botão de quantidade
                button.addEventListener('click', () => {
                    button.style.display = 'none'
                    buttonCount.style.display = 'flex';
                    quantity++
                    quantitySpan.textContent = quantity
                    addToCart({
                        "product": product,
                        "quantity": quantity
                    })
                })
                
                // Incrementa
                incrementButton.addEventListener('click', () => {
                    quantity++
                    quantitySpan.textContent = quantity
                    addToCart({
                        "product": product,
                        "quantity": quantity
                    })
                })

                // Decrementa e caso chegue a 0 volta para o estado inicial
                decrementButton.addEventListener('click', () => {
                    if (quantity > 0) {
                        quantity--;
                        quantitySpan.textContent = quantity;
                        removeToCart({
                            "product": product,
                            "quantity": quantity
                        })
                    } 
                    if (quantity === 0) {
                        buttonCount.style.display = 'none'
                        button.style.display = 'block'
                    }
                })

                productsList.appendChild(card)
            })
        } catch (e) {
            console.log('Não foi possível carregar os dados.', e)
        }
    }

    
    await loadProducts()
})