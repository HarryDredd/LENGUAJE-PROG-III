import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  BrowserRouter, Routes, Route
} from 'react-router-dom';
import { AppProvider } from './consApi';
import './estilo1.css';
import Inicio from "./paginas/inicio/inicio";
import Acerca from "./paginas/Acerca/Acerca";
import ListaLibro from "./componentes/ListaLibros/ListaLibro";
import DetalleLibros from "./componentes/DetallesLibros/DetallesLibros";
import Admin from "./paginas/Admin/Admin";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AppProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Inicio />}>
          <Route path="acerca" element={<Acerca />} />
          <Route path="book" element={<ListaLibro />} />
          <Route path="/book/:id" element={<DetalleLibros />} />
          <Route path="admin" element={<Admin />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </AppProvider>

);

//1.09.00