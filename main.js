document.addEventListener('DOMContentLoaded', async () => {
    let cart = []

    // Carrega e atualiza o carrinho
    const loadCart = () => {
        const empty = document.querySelector('.empty')
        const productsList = document.querySelector('.products-list')
        console.log(cart)
        
        if (cart.length > 0) {
            empty.style.display = 'none'
            const list = cart.map(item => `
                <div class="cart-item">
                    <span class="product-name">${item.product.name}</span>
                    <span class="quantity">Quantidade: ${item.quantity}</span>
                </div>
            `).join('')

            productsList.innerHTML = list
        
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
        console.log(item)
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