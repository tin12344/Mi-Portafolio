import psycopg2
from psycopg2 import IntegrityError, sql
from models import Libro, Usuario
from database import create_connection
from datetime import datetime, timedelta

# Clase que representa una biblioteca con funcionalidades para gestionar libros, usuarios y préstamos
class Biblioteca:
    def __init__(self):
        # Inicializa la conexión a la base de datos y crea un cursor para ejecutar consultas
        self.conn = create_connection()
        self.cursor = self.conn.cursor()

    # Registra un nuevo libro en la base de datos
    def registrar_libro(self, titulo, autor, isbn):
        try:
            self.cursor.execute(
                "INSERT INTO libros (isbn, titulo, autor) VALUES (%s, %s, %s)",
                (isbn, titulo, autor)
            )
            self.conn.commit()
        except IntegrityError:
            # Maneja el error en caso de que el libro ya esté registrado
            raise ValueError("El libro ya está registrado")

    # Busca libros en la base de datos según título, autor o ISBN
    def buscar_libro(self, titulo=None, autor=None, isbn=None):
        query = "SELECT * FROM libros WHERE"
        filters = []
        if titulo:
            filters.append(" titulo LIKE %s")
        if autor:
            filters.append(" autor LIKE %s")
        if isbn:
            filters.append(" isbn = %s")
        query += " AND".join(filters)
        values = []
        if titulo:
            values.append(f"%{titulo}%")
        if autor:
            values.append(f"%{autor}%")
        if isbn:
            values.append(isbn)
        
        self.cursor.execute(query, values)
        results = self.cursor.fetchall()
        
        if not results:
            return "El libro no existe."
        
        return results

    # Registra un nuevo usuario en la base de datos
    def registrar_usuario(self, nombre, user_id):
        try:
            self.cursor.execute(
                "INSERT INTO usuarios (id, nombre) VALUES (%s, %s)",
                (user_id, nombre)
            )
            self.conn.commit()
            print('El usuario se registro de manera exitosa')
        except IntegrityError:
            # Maneja el error en caso de que el usuario ya esté registrado
            raise ValueError("El usuario ya está registrado")

    # Registra un préstamo de libro en la base de datos
    def prestar_libro(self, isbn, user_id, fecha_devolucion=None):
        # Verificar si el usuario existe
        self.cursor.execute("SELECT 1 FROM usuarios WHERE id = %s", (user_id,))
        usuario = self.cursor.fetchone()

        if not usuario:
            raise ValueError("El usuario no existe")

        if not fecha_devolucion:
            # Establece la fecha de devolución por defecto a 14 días desde la fecha actual
            fecha_devolucion = datetime.now() + timedelta(days=14)

        self.cursor.execute("SELECT prestado FROM libros WHERE isbn = %s", (isbn,))
        libro = self.cursor.fetchone()

        if libro is None:
            raise ValueError("El libro no existe")

        if libro[0]:
            raise ValueError("El libro ya está prestado")

        # Actualiza el estado del libro a prestado y registra el préstamo
        self.cursor.execute("UPDATE libros SET prestado = TRUE WHERE isbn = %s", (isbn,))
        self.cursor.execute(
            "INSERT INTO prestamos (usuario_id, isbn, fecha_devolucion) VALUES (%s, %s, %s)",
            (user_id, isbn, fecha_devolucion)
        )
        self.conn.commit()

    # Registra la devolución de un libro en la base de datos
    def devolver_libro(self, isbn):
        self.cursor.execute("SELECT prestado FROM libros WHERE isbn = %s", (isbn,))
        libro = self.cursor.fetchone()
        if not libro or not libro[0]:
            raise ValueError("El libro no está prestado")
        # Actualiza el estado del libro a no prestado y elimina el préstamo
        self.cursor.execute("UPDATE libros SET prestado = FALSE, reservado_por = null WHERE isbn = %s", (isbn,))
        self.cursor.execute("DELETE FROM prestamos WHERE isbn = %s", (isbn,))
        self.conn.commit()

    # Consulta el historial de préstamos de un usuario
    def consultar_historial(self, user_id):
        self.cursor.execute(
            "SELECT libros.titulo FROM prestamos JOIN libros ON prestamos.isbn = libros.isbn WHERE prestamos.usuario_id = %s",
            (user_id,)
        )
        return self.cursor.fetchall()

    # Envía notificaciones a los usuarios que deben devolver libros pronto
    def enviar_notificaciones_devolucion(self):
        notificaciones = []
        self.cursor.execute(
            "SELECT usuario_id, isbn FROM prestamos WHERE fecha_devolucion <= %s",
            (datetime.now() + timedelta(days=1),)
        )
        devoluciones_proximas = self.cursor.fetchall()
        for devolucion in devoluciones_proximas:
            usuario_id, isbn = devolucion
            notificaciones.append({"usuario_id": usuario_id, "isbn": isbn})
            print(f"Notificación enviada a {usuario_id} para devolver el libro {isbn}")
        return notificaciones

    # Reserva un libro para un usuario
    def reservar_libro(self, isbn, user_id):
        # Verificar si el usuario existe
        self.cursor.execute("SELECT 1 FROM usuarios WHERE id = %s", (user_id,))
        usuario = self.cursor.fetchone()

        if not usuario:
            raise ValueError("El usuario no está registrado")

        # Verificar si el libro existe y su estado
        self.cursor.execute("SELECT prestado, reservado_por FROM libros WHERE isbn = %s", (isbn,))
        libro = self.cursor.fetchone()

        if not libro:
            raise ValueError("El libro no existe")

        prestado, reservado_por = libro

        if reservado_por is not None:
            raise ValueError("El libro ya está reservado por otro usuario")

        # Reservar el libro para el usuario
        self.cursor.execute("UPDATE libros SET reservado_por = %s WHERE isbn = %s", (user_id, isbn))
        self.conn.commit()


    # Consulta la disponibilidad de un libro
    def consultar_disponibilidad(self, isbn):
        self.cursor.execute("SELECT prestado, reservado_por FROM libros WHERE isbn = %s", (isbn,))
        libro = self.cursor.fetchone()

        if not libro:
            print('El libro no existe')
        else:
            prestado, reservado_por = libro

            if prestado:
                print('El libro está prestado')
            elif reservado_por is not None:
                print('El libro está reservado por otro usuario')
            else:
                print('El libro está disponible')   

    # Genera un reporte de libros que no han sido devueltos a tiempo
    def generar_reporte_no_devueltos(self):
        self.cursor.execute(
            "SELECT libros.isbn, libros.titulo FROM prestamos JOIN libros ON prestamos.isbn = libros.isbn WHERE prestamos.fecha_devolucion < %s",
            (datetime.now(),)
        )
        return self.cursor.fetchall()

    # Cierra la conexión a la base de datos al eliminar la instancia de Biblioteca
    def __del__(self):
        self.cursor.close()
        self.conn.close()