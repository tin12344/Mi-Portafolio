import psycopg2
from psycopg2 import sql

# Función para crear y devolver una conexión a la base de datos de la biblioteca
def create_connection():
    return psycopg2.connect(
        host='localhost', # Dirección del host donde se encuentra la base de datos
        user='postgres', # Nombre de usuario para la conexión
        password='admin', # Contraseña para la conexión
        dbname='biblioteca',  # Nombre de la base de datos, Cambiado de database a dbname para PostgreSQL
        port='5432'  # El puerto por defecto de PostgreSQL es 5432
    )

# Función para configurar la base de datos creando las tablas necesarias
def setup_database():
    # Primero nos conectamos al servidor sin especificar una base de datos para crearla
    conn = psycopg2.connect(
        host='localhost', # Dirección del host
        user='postgres',  # Nombre de usuario
        password='admin', # Contraseña
        port='5432'       # Puerto por defecto para PostgreSQL
    )
    conn.autocommit = True # Habilitar autocommit para ejecutar comandos de creación de base de datos
    cursor = conn.cursor()
    cursor.execute("CREATE DATABASE biblioteca;") # Crear la base de datos 'biblioteca'
    cursor.close()
    conn.close()

    # Ahora nos conectamos a la base de datos recién creada
    conn = create_connection() # Crear conexión a la base de datos 'biblioteca'
    cursor = conn.cursor()

    # Crear la tabla 'libros' si no existe
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS libros (
            isbn VARCHAR(13) PRIMARY KEY,
            titulo VARCHAR(255),
            autor VARCHAR(255),
            prestado BOOLEAN DEFAULT FALSE,
            reservado_por VARCHAR(50) DEFAULT NULL
        )
    """)
    # Crear la tabla 'usuarios' si no existe
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS usuarios (
            id VARCHAR(50) PRIMARY KEY,
            nombre VARCHAR(255)
        )
    """)
    # Crear la tabla 'prestamos' si no existe
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS prestamos (
            id SERIAL PRIMARY KEY,
            usuario_id VARCHAR(50),
            isbn VARCHAR(13),
            fecha_devolucion DATE,
            FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
            FOREIGN KEY (isbn) REFERENCES libros(isbn)
        )
    """)
    conn.commit() # Confirmar las transacciones
    cursor.close() # Cerrar el cursor
    conn.close() # Cerrar la conexión

# Llamar a setup_database() solo cuando se está configurando la base de datos real
if __name__ == "__main__":
    setup_database()
