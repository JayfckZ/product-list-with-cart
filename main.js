document.addEventListener('DOMContentLoaded', () => {
    const loadProducts = async () => {
        try {
            const response = await fetch('data.json')
            const data = await response.json()

            const productsList = document.getElementsByClassName('grid-container')

            data.forEach(product => {
                const card = document.createElement('div')
                card.classList.add('card')

                card.innerHTML = `
                    <div class="card-header">
                        <img class="product-img" src="${product.image.desktop}" alt="" width="300px">
                        <button class="btn-default"><img src="./assets/images/icon-add-to-cart.svg">Adicionar ao carrinho</button>
                    </div>
                    <div class="card-body">
                        <span class="category">${product.category}</span>
                        <h4 class="product-name">${product.name}</h4>
                        <span class="price">R$ ${product.price.toFixed(2).replace('.', ',')}</span>
                    </div>
                `

                productsList[0].appendChild(card)
            })
        } catch (e) {
            console.log('Não foi possível carregar os dados.', e)
        }
    }

    loadProducts()
    
})