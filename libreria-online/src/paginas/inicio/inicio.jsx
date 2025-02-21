import React from 'react';
import Header from '../../componentes/Header/header';
import { Outlet } from 'react-router-dom';

const Inicio = () => {
  return (
    <main>
        <Header />
        <Outlet />
    </main>
  )
}

export default Inicio

