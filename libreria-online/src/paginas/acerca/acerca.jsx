import React from "react";
import "./acerca.css";
import acercaImg from "../../Imagenes/books-3733892_1280.jpg";

const Acerca = () => {
    return (
        <section className="about">
            <div className="container">
                <div className="section-title">
                    <h2>Acerca</h2>
                </div>

                <div className="about-content grid">
                    <div className="about-img">
                        <img src= {acercaImg} alt="" />
                    </div>
                    <div className="about-text">
                        <h2 className="about-title fs-26 ls-1">Acerca De La Librería Online</h2>
                        <p className="fs-17">Aprovechando la API de la OpenLibrary para buscar y traer en un solo lugar una gran variedad de libros de manera util y sencilla.</p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Acerca