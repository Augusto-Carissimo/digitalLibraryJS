/*
Muestra la informacion del libro seleccionado
- Puede remover libro de la biblioteca
*/

//crea template del libro a mostrar y lo agrega al hmtl
const displaySelectedBook = (book) => 
{
    let page_title = document.querySelector('.page_title');
    page_title.innerHTML = `${book.title}-${book.autor}`
    
    let div = document.createElement('div');
    div.className = 'row-container';

    div.innerHTML = 
                            `
                            <div class='shop-item-image'>
                                <img class="item-image" src=${book.cover}>
                            </div>

                            <div class="shop-item-details">

                                    <h1 class="shop-item-title">
                                        <span class="item-title">${book.title}</span>
                                        <span class="item-sep">-</span>
                                        <span class="item-autor">${book.autor}</span>
                                        <span class="item-year">(${book.year})</span>
                                    </h1>
                                
                                    <span class="shop-item-summary">${book.summary}</span>
                                    <span class="shop-item-price">
                                        <button class="btn btn-danger" value="${book.id}" type="button">Quitar de tu biblioteca</button>
                                    </span>
                            </div>
                            `;

    let container = document.querySelector('.container');                        
    container.append(div);

    //event button Quitar de tu biblioteca
    let remove_button = document.querySelector('.btn-danger');
    remove_button.addEventListener('click', removeBookSessionStorage);
}

//remueve libro de Session Storage dejando de mostrarlo en la biblioteca
//Una vez ejecutado lleva de nuevo a la pagina principal
const removeBookSessionStorage = (e) =>
{
    let remove_button_clicked = e.target;
    let new_books_array = all_books_array.filter(data => data.id != remove_button_clicked.value)
    sessionStorage.setItem('booklib', JSON.stringify(new_books_array));
    swal(`Has eliminado ${
        remove_button_clicked.parentElement.parentElement.querySelector('.item-title').innerHTML} 
        de ${
            remove_button_clicked.parentElement.parentElement.querySelector('.item-autor').innerHTML
        } de tu biblioteca.`)
    .then((value) => 
    {
        window.location.href = 'index.html';
    });
    
}

let book_selected_id = window.location.search;
book_selected_id = book_selected_id.split('=')[1];

let all_books_array = JSON.parse(sessionStorage.getItem('booklib'));
all_books_array.forEach(element => 
    {
        if (element.id == book_selected_id) 
        {
            displaySelectedBook(element);
        }            
    });





