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
            setEditing(null);
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

    



}