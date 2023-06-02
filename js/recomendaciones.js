/*
 Muestra los datos de recommendations.json
 - Agregar libro al carrito
 - Quitar del carrito
 - Actualizacion del total
 - Button Comprar borra los elementos del Session Storage 
   desplegando mensaje "Su compra esta en camino!"
 */

//funcion asincronica recupera data de recommendations.json
const fetchRecomJson = async () => 
{  
    let response = await fetch('./json/recommendations.json');
    let data = await response.json();
    return data;
}

//llama funcion asincronica y almacena los datos en Session Storage
fetchRecomJson()
    .then(data => 
    {
        if (!sessionStorage.getItem('recomm')) 
        {
            let session_list = [];
            data.recomm.forEach(element => 
                {
                    session_list.push(element);
                })
            sessionStorage.setItem('recomm', JSON.stringify(session_list));
            session_list = [];
        }
    })

//actualiza el total del carrito: 
//corre cada vez que se carga el carrito (addPurchases) con Session Storage (purchases)
const updateCartTotal = () => 
{
    let total = 0;
    let cart_item = document.querySelectorAll('.cart-row-item');
    cart_item.forEach(element => 
    {
        let item_price = element.querySelector('.cart-price').innerHTML.replace('$', '');
        let item_quantity = element.querySelector('.cart-quantity-input').value;
        total += (item_price * item_quantity);
    })
    total = Math.round(total * 100) / 100;

    let cartTotal = document.querySelector('.cart-total-price');
    cartTotal.innerHTML = `$ ${total}`;
}

/*
carga en el carrito todos los libros en Session Storage (purchases)
esta funcion es llamada cada vez que carga la pagina (displayRecommedations),
cada vez que se agrega un libro (addCartClick),
cada vez que se elimina un libro del carrito (removeButtonClick) y
cuando se hace la compra (purchaseCartItems)
*/
const addPurchases = () => 
{
    let cart_items_list = document.querySelector('.cart-items');
    while (cart_items_list.hasChildNodes()) 
    {
        cart_items_list.removeChild(cart_items_list.firstChild);
    }
    if (sessionStorage.getItem('purchases'))
    {
        JSON.parse(sessionStorage.getItem('purchases')).forEach(element =>
            {
                let new_cart_row = document.createElement('div');
                new_cart_row.className = 'cart-row-item';
                new_cart_row.setAttribute('data-value', `${element.id}`);
                new_cart_row.innerHTML = `
                                        <div class="cart-item cart-column">
                                            <img class="cart-item-image" src="${element.cover}" width="150" height="auto">
                                            <span class="cart-item-title">${element.title} - ${element.autor}</span>
                                        </div>
                                        <span class="cart-price cart-column">${element.price}</span>
                                        <div class="cart-quantity cart-column">
                                            <input class="cart-quantity-input" type="number" value="1">
                                            <button class="btn btn-danger" type="button">Quitar del carrito</button>
                                        </div>
                                        `;
                cart_items_list = document.querySelector('.cart-items');
                cart_items_list.append(new_cart_row);

                updateCartTotal();
            })

        let remove_buttos_event = document.querySelectorAll('.btn-danger');
        remove_buttos_event.forEach(element =>
            {
                element.addEventListener('click', removeButtonClick)
            })

        let quantity_selector = document.querySelectorAll('.cart-quantity-input');
        quantity_selector.forEach(element => 
            {
                element.addEventListener('change', quantityChange)
            })
    }
    updateCartTotal()
}

//muestra los libros en Session Storage en html
const displayRecommedations = () => 
{
    if (JSON.parse(sessionStorage.getItem('recomm')) == null) 
    { 
        window.setTimeout(displayRecommedations, 100);
    }
    else 
    {
        let session_storage_array = JSON.parse(sessionStorage.getItem('recomm'));
        session_storage_array.forEach(element => 
        {
            displayRecommBook(element);
        })
    }
    add_and_purchase_buttons_events();
}

//crea templete para cada Recomendacion
const displayRecommBook = (recommBook) => 
{
    let book_item = document.createElement('div');
    book_item.className = 'row-container';
    book_item.setAttribute('data-value', `${recommBook.id},${recommBook.cover},${recommBook.title},${recommBook.autor},${recommBook.year},${recommBook.price}`)
    book_item.innerHTML = 
                        `
                        <div class='shop-item-image'>
                            <img class="item-image" src=${recommBook.cover}>
                        </div>

                        <div class="shop-item-details">

                                <h1 class="shop-item-title">
                                    <span class="item-title">${recommBook.title}</span>
                                    <span class="item-sep">-</span>
                                    <span class="item-autor">${recommBook.autor}</span>
                                    <span class="item-year">(${recommBook.year})</span>
                                </h1>
                            
                                <span class="shop-item-summary">${recommBook.summary}</span>

                                <span class="shop-item-price">
                                    <span class="item-price">
                                        $${recommBook.price}
                                    </span>
                                    <button class="btn btn-primary shop-item-button" type="button">Agregar al carrito</button>
                                </span> 
                        </div>
                        `

    let shop_items = document.querySelector('.container');
    shop_items.append(book_item)
    addPurchases()
}

//elimina purchases de Session Storage vaciando asi el carrito
const purchaseCartItems = () =>
{
    sessionStorage.removeItem('purchases');
    swal('Su compra esta en camino!');
    addPurchases();
}

//events buttons Agragar y Comprar
const add_and_purchase_buttons_events = () => 
{
    //boton Agregar al Carrito
    let add_cart_bottons = document.querySelectorAll('.shop-item-button');
    add_cart_bottons.forEach(button => 
    {
        button.addEventListener('click', addCartClick);
    });

    //boton Comprar
    let purschase_button = document.querySelector('.btn-purchase');
    purschase_button.addEventListener('click', purchaseCartItems);
}

// elimina libro de Session Storage (purchases)
const removeButtonClick = (e) =>
{
    let remove_button = e.target;
    let purchases_array = JSON.parse(sessionStorage.getItem('purchases'));
    purchases_array = purchases_array.filter(data => data.id != remove_button.parentElement.parentElement.getAttribute('data-value'))
    sessionStorage.setItem('purchases', JSON.stringify(purchases_array));

    addPurchases();
}

//quantity selected: no puede ser menor de 1
const quantityChange = (e) => 
{
    quantity = e.target
    if (isNaN(quantity.value) || quantity.value <= 0) {
        quantity.value = 1;
    }
    updateCartTotal();
}

//Agrage libro clicleado al Carrito
const addCartClick = (e) => 
{
    add_button = e.target;
    let attr_list = add_button.parentElement.parentElement.parentElement.getAttribute('data-value');
    attr_list = attr_list.split(',');
    let [id, cover, title, autor, year, price] = attr_list;

    if (sessionStorage.getItem('purchases')) 
    {
        let check_duplicate_array = [];
        let purchases_array = JSON.parse(sessionStorage.getItem('purchases'));
        //chequea si el libro ya esta en carrito usando el id extraido del json
        purchases_array.forEach(element =>
            {
                check_duplicate_array.push(element.id);
            })
        if (check_duplicate_array.includes(id))
        {
            swal('Este libro ya esta en el carrito!');
        }
        else
        {
            purchases_array.push(
            {
                "id": id,
                "title": title,
                "autor":autor,
                "cover":cover,
                "year":year,
                "price":price
            });
            sessionStorage.setItem('purchases', JSON.stringify(purchases_array));
            purchases_array = [];

        }

        addPurchases();
    }
    else
    {
        let purchases_array = [];
        purchases_array.push(
        {
            "id": id,
            "title": title,
            "autor":autor,
            "cover":cover,
            "year":year,
            "price":price
        });
        sessionStorage.setItem('purchases', JSON.stringify(purchases_array));
        purchases_array = [];

        addPurchases();
    }
}

displayRecommedations();