import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  BrowserRouter, Routes, Route
} from 'react-router-dom';
import './estilo1.css';
import Inicio from './paginas/Inicio/Inicio';
import Acerca from "./paginas/Acerca/Acerca";
import ListaLibro from "./componentes/ListaLibros/ListaLibro";
import DetalleLibros from "./componentes/DetallesLibros/DetallesLibros";


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path = "/" element = {<Inicio />}>
        <Route path="acerca" element = {<Acerca />} />
        <Route path="Libro" element = {<ListaLibro />} />
        <Route path="/Libro/:id" element = {<DetalleLibros />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

//12:15