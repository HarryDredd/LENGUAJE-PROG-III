import React, {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import "./admin.css";

const Admin = () => {
    const [books, setBooks] = useState([]);
    const [newBook, setNewBook] = useState({
        title: "",
        author: "",
        first_publish_year: "",
        cover_id: ""
    });
    const [editingBook, setEditingBook] = useState(null);

    const navigate = useNavigate();

    useEffect(() =>{
        const fetchBooks =async () => {
            try {
                const response = await fetch('http://localhost:5001/libros');
                const data = await response.json();
                setBooks(data); 
            } catch (error) {
                console.error('Error al obtener los libros:', error)
            }
        };
        fetchBooks();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (editingBook) {
            setEditingBook({ ...editingBook, [name]: value});
        } else {
            setNewBook({ ...newBook, [name]: value });
        }
    };

    const handleAddBook = async () => {
        try {
            const response = await fetch('http://localhost:5001/guardar-libros', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ libros: [newBook]}),
            });
            const data = await response.json();
            setBooks([...books, data]);
            setNewBook({ title: "", author: "", first_publish_year: "", cover_id: ""});
        } catch (error) {
            console.error('Error al Agregar Libro:', error);
        }
    };

    // Actalizar un libro existente
    const handleEditBook = async () => {
        try {
            const response = await fetch(`http://localhost:5001/libros/${editingBook._id}`, {

                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editingBook),
            });
            const data =await response.json();
            setBooks(books.map(book => book._id === data._id ? data : book));
            setEditingBook(null);
        } catch (error) {
            console.error('Error al Actualizar el Libro:', error);
        }
    };
    
    // Eliminar un libro
    const handleDeleteBook = async (id) => {
        try {
            await fetch(`http://localhost:5001/libros/${id}`, {
                method: 'DELETE',
            });
            setBooks(books.filter(book => book._id !== id)); // Eliminar el libro del estado
        } catch (error) {
            console.error('Error al eliminar el libro:', error);
        }
    };

    return (
        <div className="admin">
            <h1>Administrar Libros</h1>

            {/* Formulario para agregar o editar libros */}
            <div className="form">
                <h2>{editingBook ? "Editar Libro" : "Agregar Libro"}</h2>
                <input
                    type="text"
                    name="title"
                    placeholder="Título"
                    value={editingBook ? editingBook.title : newBook.title}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    name="author"
                    placeholder="Autor"
                    value={editingBook ? editingBook.author : newBook.author}
                    onChange={handleInputChange}
                />
                <input
                    type="number"
                    name="first_publish_year"
                    placeholder="Año de Publicación"
                    value={editingBook ? editingBook.first_publish_year : newBook.first_publish_year}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    name="cover_id"
                    placeholder="ID de la Portada"
                    value={editingBook ? editingBook.cover_id : newBook.cover_id}
                    onChange={handleInputChange}
                />
                {editingBook ? (
                    <button onClick={handleEditBook}>Guardar Cambios</button>
                ) : (
                    <button onClick={handleAddBook}>Agregar Libro</button>
                )}
                {editingBook && (
                    <button onClick={() => setEditingBook(null)}>Cancelar Edición</button>
                )}
            </div>

            {/* Lista de libros */}
            <div className="book-list">
                {books.map((book) => (
                    <div key={book._id} className="book-item">
                        <h3>{book.title}</h3>
                        <p>Autor: {book.author}</p>
                        <p>Año de Publicación: {book.first_publish_year}</p>
                        <button onClick={() => setEditingBook(book)}>Editar</button>
                        <button onClick={() => handleDeleteBook(book._id)}>Eliminar</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Admin;