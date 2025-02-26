import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./admin.css";

const Admin = () => {
    const [books, setBooks] = useState([]); // Estado para almacenar los libros
    const [editingBook, setEditingBook] = useState(null); // Estado para el libro en edición
    const [newBook, setNewBook] = useState({ // Estado para el nuevo libro
        id: "",
        title: "",
        author: "",
        first_publish_year: "",
        edition_count: "",
        cover_img: ""
    });
    const [selectedFile, setSelectedFile] = useState(null); // Estado para la imagen seleccionada
    const navigate = useNavigate();

    // Obtener los libros desde el backend al cargar el componente
    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await fetch('http://localhost:5001/libros');
                const data = await response.json();
                setBooks(data);
            } catch (error) {
                console.error('Error al obtener los libros:', error);
            }
        };
        fetchBooks();
    }, []);

    // Manejar cambios en los inputs del formulario (para editar y crear)
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (editingBook) {
            setEditingBook({ ...editingBook, [name]: value });
        } else {
            setNewBook({ ...newBook, [name]: value });
        }
    };

    // Manejar la selección de una nueva imagen
    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    // Crear un nuevo libro
    const handleCreateBook = async () => {
        const formData = new FormData();
        formData.append('title', newBook.title);
        formData.append('author', newBook.author);
        formData.append('first_publish_year', newBook.first_publish_year);
        formData.append('edition_count', newBook.edition_count);
        if (selectedFile) {
            formData.append('cover', selectedFile);
        }
    
        try {
            const response = await fetch('http://localhost:5001/libros', {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            console.log('Libro creado:', data);
        } catch (error) {
            console.error('Error al crear el libro:', error);
        }
    };

    // Guardar los cambios (editar libro)
    const handleSaveChanges = async () => {
        if (!editingBook) return;
    
        const formData = new FormData();
        formData.append('title', editingBook.title);
        formData.append('author', editingBook.author);
        formData.append('first_publish_year', editingBook.first_publish_year);
        formData.append('edition_count', editingBook.edition_count);
        if (selectedFile) {
            formData.append('cover', selectedFile);
        }
    
        try {
            const response = await fetch(`http://localhost:5001/libros/${editingBook._id}`, {
                method: 'PUT',
                body: formData,
            });
            const data = await response.json();
    
            // Actualiza solo el libro editado en el estado
            setBooks(books.map(book => book._id === data._id ? data : book));
            setEditingBook(null);
            setSelectedFile(null);
        } catch (error) {
            console.error('Error al guardar los cambios:', error);
        }
    };

    // Eliminar un libro
    const handleDeleteBook = async (id) => {
        try {
            await fetch(`http://localhost:5001/libros/${id}`, {
                method: 'DELETE',
            });
            setBooks(books.filter(book => book._id !== id));
        } catch (error) {
            console.error('Error al eliminar el libro:', error);
        }
    };

    return (
        <div className="admin">
            <h1>Administrar Libros</h1>

            {/* Formulario para crear un nuevo libro */}
            <div className="form">
                <h2>Crear Nuevo Libro</h2>
                <input
                    type="text"
                    name="id"
                    placeholder="ID Personalizado"
                    value={newBook.id}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    name="title"
                    placeholder="Título"
                    value={newBook.title}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    name="author"
                    placeholder="Autor"
                    value={newBook.author}
                    onChange={handleInputChange}
                />
                <input
                    type="number"
                    name="first_publish_year"
                    placeholder="Año de Publicación"
                    value={newBook.first_publish_year}
                    onChange={handleInputChange}
                />
                <input
                    type="number"
                    name="edition_count"
                    placeholder="Total de Ediciones"
                    value={newBook.edition_count}
                    onChange={handleInputChange}
                />
                <input
                    type="file"
                    onChange={handleFileChange}
                />
                <button onClick={handleCreateBook}>Crear Libro</button>
            </div>

            {/* Formulario para editar un libro existente */}
            {editingBook && (
                <div className="form">
                    <h2>Editar Libro</h2>
                    <input
                        type="text"
                        name="id"
                        placeholder="ID Personalizado"
                        value={editingBook.id}
                        onChange={handleInputChange}
                    />
                    <input
                        type="text"
                        name="title"
                        placeholder="Título"
                        value={editingBook.title}
                        onChange={handleInputChange}
                    />
                    <input
                        type="text"
                        name="author"
                        placeholder="Autor"
                        value={editingBook.author}
                        onChange={handleInputChange}
                    />
                    <input
                        type="number"
                        name="first_publish_year"
                        placeholder="Año de Publicación"
                        value={editingBook.first_publish_year}
                        onChange={handleInputChange}
                    />
                    <input
                        type="number"
                        name="edition_count"
                        placeholder="Total de Ediciones"
                        value={editingBook.edition_count}
                        onChange={handleInputChange}
                    />
                    <input
                        type="file"
                        onChange={handleFileChange}
                    />
                    <button onClick={handleSaveChanges}>Guardar Cambios</button>
                    <button onClick={() => setEditingBook(null)}>Cancelar</button>
                </div>
            )}

            {/* Lista de libros */}
            <div className="book-list">
                {books.map((book) => (
                    <div key={book._id} className="book-item">
                        <h3>{book.title}</h3>
                        <img src={book.cover_img} alt={book.title} style={{ width: '100px' }} />
                        <p>Autor: {book.author}</p>
                        <p>Año de Publicación: {book.first_publish_year}</p>
                        <p>Ediciones: {book.edition_count}</p>
                        <button onClick={() => setEditingBook(book)}>Editar</button>
                        <button onClick={() => handleDeleteBook(book._id)}>Eliminar</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Admin;