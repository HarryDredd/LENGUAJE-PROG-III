import React from "react";
import CargarImg from "../../Imagenes/loader.svg";
import "./cargador.css";

const Cargador = () => {
    return (
        <div className="loader flex flex-c">
            <img src = {CargarImg} alt = "loader" />

            
        </div>
    )
}

export default Cargador