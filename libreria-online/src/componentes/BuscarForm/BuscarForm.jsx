import React, { useRef, useEffect, useContext } from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./buscarform.css";
import { AppContext } from '../../context/AppContext';

const BuscarForm = () => {
  const { setSearchTerm, setResultTitle } = useContext(AppContext);
  const searchText = useRef('');
  const navigate = useNavigate();

  useEffect(() => searchText.current.focus(), []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let tempSearchTerm = searchText.current.value.trim();

    if ((tempSearchTerm.replace(/[^\w\s]/gi, "")).length === 0) {
      setSearchTerm("Busca tu libro");
      setResultTitle("Por Favor Ingresa algo...");
    } else {
      setSearchTerm(tempSearchTerm);
      // Enviar la búsqueda al backend
      try {
        const response = await fetch(`http://localhost:5001/buscar?q=${tempSearchTerm}`);
        const data = await response.json();

        if (data.libros && data.libros.length > 0) {
          setResultTitle(`Resultados para: "${tempSearchTerm}"`);
        } else {
          setResultTitle("No se encontraron resultados.");
        }
      } catch (error) {
        console.error('Error al buscar libros:', error);
        setResultTitle("Error al buscar libros.");
      }

    }


    navigate("/book");
  };

  return (
    <div className='search-form'>
      <div className='container'>
        <div className='search-form-content'>
          <form className='search-form' onSubmit={handleSubmit}>
            <div className='search-form-elem flex flex-sb bg-white'>
              <input type="text" className='form-control' placeholder='Busca tu Libro...' ref={searchText} />
              <button type="submit" className='flex flex-c' onClick={handleSubmit}>
                <FaSearch className='text-purple' size={32} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}


export default BuscarForm;
//36