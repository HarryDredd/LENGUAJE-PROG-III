import React, {useState, useEffect} from "react";
import { useParams } from "react-router-dom";
import Loading from "../Cargador/Cargador"
import coverImg from "../../Imagenes/cover_not_found.jpg";
import "./detalleslibros.css";
import {FaArrowLeft} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const URL = "https://openlibrary.org/works/";

const DetallesLibros = () => {
    const {id} = useParams();
    const [loading, setLoading] = useState(false);
    const [book, setBook] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        async function getDetallesLibros(){
            try{
              const response = await fetch(`${URL}${id}.json`);
              const data = await response.json();
              console.log(data);

              if(data){
                const {description, title, covers, subject_places, subject_times, subjects, last_modified} = data;
                const newBook = {
                    description: description ? description.value : "No se encontro descripcion",
                    title: title,
                    last_modified: last_modified ? last_modified.value : "Sin Registro",
                    cover_img: covers ? `https://covers.openlibrary.org/b/id/${covers[0]}-L.jpg` : coverImg,
                    subject_places: subject_places ? subject_places.join(", ") : "No se encontraron lugares temáticos",
                    subject_times: subject_times ? subject_times.join(", ") : "No se encontraron tiempos de tema",
                    subjects: subjects ? subjects.join(", ") : "No se encontraron temas"
                  };
                  setBook(newBook);
              } else {
                setBook(null);
              }
              setLoading(false);
            } catch(error){
              console.log(error);
              setLoading(false);
            }     
        }
        getDetallesLibros();
    }, [id]);



    if(loading) return <Loading />;

    return (
        <section className="book-details">
            <div className="container">
                <button type="button" className="flex flex-c back-btn" onClick={() => navigate("/book")}>
                    <FaArrowLeft size={22} />
                    <span className="fs-18 fw-6">Regresar</span>
                </button>

                <div className="book-details-content grid">
                    <div className="book-details-img">
                        <img src= {book?.cover_img} alt="cover img" />
                    </div>
                    <div className="book-details-info">
                        <div className="book-details-item title">
                            <span className="fw-6 fs-24">{book?.title}</span>
                        </div>
                        <div className="book-details-item description">
                            <span>{book?.description}</span>
                        </div>
                        <div className="book-details-item">
                            <span className="fw-6">Lugares temáticos: </span>
                            <span className="text-italic">{book?.subject_places}</span>
                        </div>
                        <div className="book-details-item">
                            <span className="fw-6">Tiempos de tema: </span>
                            <span className="text-italic">{book?.subject_times}</span>
                        </div>
                        <div className="book-details-item">
                            <span className="fw-6">Subjects: </span>
                            <span>{book?.subjects}</span>
                        </div>
                        <div className="book-details-item last_modified">
                        <span className="fw-6">Ultima Modificación: </span>
                        <span>{book?.last_modified}</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default DetallesLibros

//1.13.14