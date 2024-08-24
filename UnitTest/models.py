from database import create_connection # Importa la función para crear una conexión a la base de datos

# Clase que representa un libro en la biblioteca
class Libro:
    def __init__(self, isbn, titulo, autor):
        self.isbn = isbn # Clase que representa un libro en la biblioteca
        self.titulo = titulo # Título del libro
        self.autor = autor # Autor del libro
        self.prestado = False # Estado de préstamo del libro, inicialmente False (no prestado)
        self.reservado_por = None # ID del usuario que ha reservado el libro, inicialmente None (no reservado)

# Clase que representa un usuario de la biblioteca
class Usuario:
    def __init__(self, user_id, nombre):
        self.id = user_id # ID único del usuario
        self.nombre = nombre # Nombre del usuario