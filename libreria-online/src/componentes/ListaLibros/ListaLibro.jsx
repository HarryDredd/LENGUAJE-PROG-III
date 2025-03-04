import React, { useState, useEffect, useContext } from "react";
import Libro from "../ListaLibros/Libro";
import Loading from "../Cargador/Cargador";
import coverImg from "../../Imagenes/cover_not_found.jpg";
import "./listalibro.css";
import { AppContext } from '../../context/AppContext';

//https://covers.openlibrary.org/b/id/7640376-L.jpg  cover

const ListaLibro = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    //const [resultTitle, setResultTitle] = useState("");
    const { searchTerm } = useContext(AppContext); // Obtener el término de búsqueda del contexto
    
    useEffect(() => {
        const obtenerLibrosDesdeBackend = async () => {
            setLoading(true);
            try {
                let url = 'http://localhost:5001/libros'; // Obtener todos los libros guardados
                if (searchTerm) {
                    url = `http://localhost:5001/buscar?q=${searchTerm}`; // Buscar libros si hay un término de búsqueda
                }

                const response = await fetch(url);
                const data = await response.json();
                setBooks(data.libros || data); // Ajusta según la respuesta del backend
                setLoading(false);
            } catch (error) {
                console.error('Error al obtener libros:', error);
                setLoading(false);
            }
        };
            obtenerLibrosDesdeBackend();

    }, [searchTerm]); 

    const booksWithCovers = books.map((singleBook) => {
        // Si hay una portada personalizada, úsala; de lo contrario, usa la de la API o la imagen por defecto
        const cover_img = singleBook.cover_img
            ? singleBook.cover_img
            : singleBook.cover_id
                ? `https://covers.openlibrary.org/b/id/${singleBook.cover_id}-L.jpg`
                :  "http://localhost:5001/uploads/cover_not_found.jpg";

        return {  
            ...singleBook,
            id: singleBook.id ? singleBook.id.replace("/works/", "") : "",
            cover_img: cover_img,
        };
    });

    //console.log(booksWithCovers); mostrar en consola los cover de los libr
    if(loading) return <Loading />

    return (
       <section className="booklist">
        <div className="container">
        <h2>{searchTerm ? `Resultados para: "${searchTerm}"` : "Todos los libros"}</h2>
        </div>
        <div className="booklist-content grid">
            {booksWithCovers.slice(0, 30).map((item, index) => (
                        <Libro key = {index} {...item} />
            ))}
        </div>
       </section>
    );
};

export default ListaLibro;