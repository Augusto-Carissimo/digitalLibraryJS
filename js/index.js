/* 
Funcionalidades:
- Carga de manera asincronica los libros de bookLib.json
- Permite agregar nuevos libros los cuales se guardan en Session Storage
- Los libros pueden ordenarse por autor o titulos
- Al hacer click en un libro muestra las informacion del mismo y permite eliminarlo de las biblioteca
*/

//funcion asincronica carga los datos de bookLib.json 
const fetchJson = async () => 
{
    let response = await fetch("./json/bookLib.json");
    let data = await response.json();
    return data;
}

//ejectuta la funcion asincronica y guarda los datos en session Storage
fetchJson()
    .then(data => 
    {
        if (!sessionStorage.getItem('booklib')) 
        {
            let session_list = [];
            data.booklib.forEach(element => 
            {
                session_list.push(element);
            })

            sessionStorage.setItem('booklib', JSON.stringify(session_list));
            session_list = [];
        } 
    })

//toma los datos de Session Storage (booklib) y muestra cada libro en html    
const deployPage = (value_sort) => 
{
    if (JSON.parse(sessionStorage.getItem('booklib')) == null) 
    { 
        window.setTimeout(deployPage, 100);
    }
    else 
    {
        let session_storage_array = JSON.parse(sessionStorage.getItem('booklib'));
        //ordena los libros por titulo o autor
        if (value_sort == 1) 
        {
            session_storage_array.sort((a, b) => a.autor.localeCompare(b.autor));
        }
        else if (value_sort == 2) 
        {
            session_storage_array.sort((a, b) => a.title.localeCompare(b.title));
        }

        let row = document.querySelector('.row');
        row.innerHTML = '';
        session_storage_array.forEach(element => 
        {        
            displayBook(element);
        })
    }
    
}

//crea template para cada libro
const displayBook = (book) => 
{
    let book_element = document.createElement('div');
    book_element.className = ('col-sm-3');

    book_element.innerHTML = 
                            `
                            <a  class="book-div" href="./libro.html?id=${book.id}">
                                <img class ="cover_book" src=${book.cover}><br>
                                <span class ="title_book">${book.title}</span><br>
                                <span class = "autor_book">${book.autor}</span>
                            </a>
                            `;

    let row = document.querySelector('.row');                        
    row.appendChild(book_element);
}

//form event button Agregar nuevo libro
let add_new_book_form = document.querySelector('#form');
add_new_book_form.addEventListener('submit', (e) => 
{
    e.preventDefault();
    addNewBook();
})

//toma los inputs del form 
const addNewBook = () => 
{
    let new_book_title = (document.getElementById('new_title').value).trim();
    let new_book_autor = (document.getElementById('new_autor').value).trim();
    let new_book_year = (document.getElementById('new_year').value).trim();
    let new_book_summary = (document.getElementById('new_summary').value).trim();

    let new_book_cover = './img/mock.jpg';
    
    let id_array = [];
    let books_title_autor_array = [];

    JSON.parse(sessionStorage.getItem('booklib')).forEach(book => 
    {
        id_array.push(parseInt(book.id));
        books_title_autor_array.push(`${book.title}-${book.autor}`.toLowerCase());
    })
    
    //chequea si el titulo y el autor del libro estan duplicados 
    if (!books_title_autor_array.includes(`${new_book_title}-${new_book_autor}`.toLowerCase()))
    {
        //crea id
        new_book_id = (Math.max(...id_array)) + 1;

        if (new_book_year == '') 
        {
            new_book_year = 'Desconocido';
        }

        // Book object tiene el mismo formato que el json
        let new_book = new Book(
            new_book_id, new_book_title, new_book_autor, new_book_cover, new_book_year, 
            new_book_summary);

        let booklib = JSON.parse(sessionStorage.getItem('booklib'));
        booklib.push(new_book);
        sessionStorage.setItem('booklib', JSON.stringify(booklib));

        deployPage(document.querySelector('.sort_by').value);
    }
    else 
    {
        swal('Este libro ya existe en tu biblioteca.');
    }
}

class Book 
{
    constructor(id, title, autor, cover, year, summary) 
    {
        this.id = id;
        this.title = title;
        this.autor = autor;
        this.cover = cover;
        this.year = year;
        this.summary = summary;
    }
}

//evento select Ordenar por titulo o autor
let sort_by_select = document.querySelector('.sort_by');
sort_by_select.addEventListener('change', sortBy);

function sortBy()
{   
    if (this.value == 1) 
    {
        deployPage(1);
    } 
    else if (this.value == 2) 
    {
        deployPage(2);
    }
}

deployPage(2);