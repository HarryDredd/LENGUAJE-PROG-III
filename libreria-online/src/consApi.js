import React, {useState, useContext, useEffect} from "react";
import { useCallback } from "react";
const URL = "https://openlibrary.org/search.json?title=";
const AppContext = React.createContext();

const AppProvider = ({children}) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [resultTitle, setResultTitle] = useState("");

//aqui enviamos libros al backend y guardarlos en mongo
    const guardarLibrosEnBackend = async (libros) => {
        try {
            const response = await fetch('http://localhost:5001/guardar-libros', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ libros }),
            });
            const data = await response.json();
            console.log('Libros guardados en MongoDB:', data);
        } catch (error){
            console.error('Error al guardar libros en MongoDB:', error);
        }
    };


    const fetchBooks = useCallback(async () => {
        setLoading(true);
        try{
            const response = await fetch(`${URL}${searchTerm}`);
            const data = await response.json();
            const {docs} = data;

            if(docs){
                const newBooks = docs.slice(0, 10).map((bookSingle) => { //contiene los resultados de la busqueda obtenidos por la API osea ressponde laa busqueda con 20 libros en este caso
                    const {key, author_name, cover_i, edition_count, first_publish_year, title} = bookSingle;

                    return {
                        id: key,
                        author: author_name,
                        cover_id: cover_i,
                        edition_count: edition_count,
                        first_publish_year: first_publish_year,
                        title: title
                    }
                });

                setBooks(newBooks);

                //guardar libros a mongoDB
                await guardarLibrosEnBackend(newBooks);

                if(newBooks.length > 1){
                    setResultTitle("Resultado de la Busqueda");
                } else {
                    setResultTitle("No Encontrado")
                }
            } else {
                setBooks([]);
                setResultTitle("No Encontrado");
            }
            setLoading(false);
        } catch(error){
            console.log(error);
            setLoading(false);
        }
    }, [searchTerm]);

    useEffect(() => {
        fetchBooks();
    }, [searchTerm, fetchBooks]);

    return (
        <AppContext.Provider value = {{
            loading,
            books,
            setSearchTerm,
            resultTitle,
            setResultTitle,
        }}>
            {children}
        </AppContext.Provider>
    )
}

export const useGlobalContext = () => {
    return useContext(AppContext);
}

export {AppContext, AppProvider};
