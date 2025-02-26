import React, { useEffect } from "react";
import { useGlobalContext } from '../../consApi';
import Libro from "../ListaLibros/Libro";
import Loading from "../Cargador/Cargador";
import "./listalibro.css";

//https://covers.openlibrary.org/b/id/7640376-L.jpg  cover

const ListaLibro = () => {
    const { books, loading, resultTitle, setBooks, setLoading } = useGlobalContext();

    useEffect(() => {
        const obtenerLibrosDesdeBackend = async () => {
            setLoading(true);
            try {
                const response = await fetch('http://localhost:5001/libros');
                const data = await response.json();
                setBooks(data);
                setLoading(false);
            } catch (error) {
                console.error('Error al obtener libros desde el backend:', error);
                setLoading(false);
            }
        };
      
        obtenerLibrosDesdeBackend();
    }, [setBooks, setLoading]);


    const booksWithCovers = books.map((singleBook) => {
        return {
            ...singleBook,
            id: singleBook.id ? singleBook.id.replace("/works/", "") : "",
            cover_img: singleBook.cover_img || "http://localhost:5001/uploads/cover_not_found.jpg",
        };
    });

    //console.log(booksWithCovers); mostrar en consola los cover de los libros

    if(loading) return <Loading />

    return (
       <section className="booklist">
        <div className="container">
            <h2>{resultTitle}</h2>
        </div>
        <div className="booklist-content grid">
            {booksWithCovers.slice(0, 30).map((item, index) => (
                        <Libro key = {index} {...item} />
            ))}
        </div>
       </section>
    );
};

export default ListaLibro