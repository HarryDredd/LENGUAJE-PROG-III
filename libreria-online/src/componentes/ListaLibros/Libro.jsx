import React from "react";
import { Link } from 'react-router-dom';
import "./listalibro.css";

const Libro = (libro) => {
    return (
        <div className="book-item flex flex-column flex-sb">
            <div className="book-item-img">
                <img src= {libro.cover_img} alt = "cover" />
            </div>
            <div className="book-item-info text-center">
                <Link to={`/book/${libro.id}`} { ... libro}>
                    <div className="book-item-info-item title fw-7 fs-18">
                        <span>{libro.title}</span>
                    </div>
                </Link>

                <div className="book-item-info-item author fs-15">
                    <span className="text-capitalize fw-7">Autor: </span>
                    <span>{libro.author.join(", ")}</span> 
                </div>

                <div className="book-item-info-item edition-count fs-15">
                    <span className="text-capitalize fw-7">Total de Ediciones: </span>
                    <span>{libro.edition_count}</span>
                </div>


                <div className="book-item-info-item publish-year fs-15">
                    <span className="text-capitalize fw-7">Año de Publicación: </span>
                    <span>{libro.first_publish_year}</span>
                </div>
            </div>
        </div>
    )
}

export default Libro
//linea 20 .join hace que algunas busquedas no funcionen
