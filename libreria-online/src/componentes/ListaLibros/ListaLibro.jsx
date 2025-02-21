import React from "react";
import { useGlobalContext } from '../../consApi';
import Libro from "../ListaLibros/Libro";
import Loading from "../Cargador/Cargador";
import coverImg from "../../Imagenes/cover_not_found.jpg";
import "./listalibro.css";

//https://covers.openlibrary.org/b/id/7640376-L.jpg  cover

const ListaLibro = () => {
    const {books, loading, resultTitle} = useGlobalContext();
    const booksWithCovers = books.map((singleBook) => {
        return {
            ...singleBook,
            id: (singleBook.id).replace("/works/", ""),
            cover_img: singleBook.cover_id ? `https://covers.openlibrary.org/b/id/${singleBook.cover_id}-L.jpg` : coverImg
        }
    });

    //console.log(booksWithCovers); mostrar en consola los cover de los libros

    if(loading) return <Loading />

    return (
       <section className="booklist">
        <div className="container">
            <h2>{resultTitle}</h2>
        </div>
        <div className="booklist-content grid">
            {
                booksWithCovers.slice(0, 30).map((item, index) =>{
                    return (
                        <Libro key = {index} { ... item} />
                    )
                })
            }
        </div>
       </section>
    )
}

export default ListaLibro