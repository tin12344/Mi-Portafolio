import unittest  # Importa el módulo unittest para crear y ejecutar pruebas unitarias
from unittest.mock import patch, MagicMock  # Importa funciones para crear mocks y parches

import sys  # Importa el módulo sys para manipular la lista de rutas de búsqueda de módulos
import os  # Importa el módulo os para interactuar con el sistema operativo
from datetime import datetime, timedelta  # Importa módulos para manipular fechas y horas

# Agrega el directorio del módulo al sys.path
ruta_modulo = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # Obtiene la ruta del directorio padre
sys.path.append(ruta_modulo)  # Agrega el directorio del módulo a la lista de rutas de búsqueda de módulos

from biblioteca import Biblioteca  # Importa la clase Biblioteca del módulo biblioteca

# Clase de prueba para la funcionalidad de préstamo de libros
class TestPrestamoLibros(unittest.TestCase):
    def setUp(self):
        # Crear un mock para la conexión y el cursor de la base de datos
        self.conn_mock = MagicMock()  # Crea un mock para la conexión de la base de datos
        self.cursor_mock = MagicMock()  # Crea un mock para el cursor de la base de datos
        self.conn_mock.cursor.return_value = self.cursor_mock  # Configura el mock de la conexión para devolver el mock del cursor

        # Parchear la función create_connection para que devuelva el mock de la conexión
        patcher = patch('biblioteca.create_connection', return_value=self.conn_mock)  # Crea un parche para la función create_connection
        self.addCleanup(patcher.stop)  # Asegura que el parche se detenga después de cada prueba
        self.mock_create_connection = patcher.start()  # Inicia el parche

        # Crear una instancia de la clase Biblioteca
        self.biblioteca = Biblioteca()  # Crea una instancia de Biblioteca utilizando los mocks

    def test_prestamo_exitoso_libro(self):
        # Configurar el mock del cursor para devolver que el usuario existe y el libro no está prestado
        self.cursor_mock.fetchone.side_effect = [(True,), (False,)]  # Datos simulados: usuario existe, libro no prestado
        self.biblioteca.prestar_libro("12345", "u123")  # Prueba de préstamo de libro

        # Verificar que se hicieron las llamadas correctas al cursor
        self.cursor_mock.execute.assert_any_call("SELECT 1 FROM usuarios WHERE id = %s", ("u123",))  # Verifica la consulta del usuario
        self.cursor_mock.execute.assert_any_call("SELECT prestado FROM libros WHERE isbn = %s", ("12345",))  # Verifica la consulta del estado del libro
        self.cursor_mock.execute.assert_any_call("UPDATE libros SET prestado = TRUE WHERE isbn = %s", ("12345",))  # Verifica la actualización del estado del libro
        self.cursor_mock.execute.assert_any_call(
            "INSERT INTO prestamos (usuario_id, isbn, fecha_devolucion) VALUES (%s, %s, %s)",
            ("u123", "12345", unittest.mock.ANY)  # Verifica la inserción del registro de préstamo con cualquier fecha
        )

    def test_prestamo_fallido_libro_no_existente(self):
        # Configurar el mock del cursor para devolver que el usuario existe y el libro no existe
        self.cursor_mock.fetchone.side_effect = [(True,), None]  # Datos simulados: usuario existe, libro no existe
        with self.assertRaises(ValueError, msg="El libro no existe"):  # Espera que se lance un ValueError con el mensaje adecuado
            self.biblioteca.prestar_libro("67890", "u123")  # Prueba de préstamo de libro inexistente

        # Verificar que se hicieron las llamadas correctas al cursor
        self.cursor_mock.execute.assert_any_call("SELECT 1 FROM usuarios WHERE id = %s", ("u123",))  # Verifica la consulta del usuario
        self.cursor_mock.execute.assert_any_call("SELECT prestado FROM libros WHERE isbn = %s", ("67890",))  # Verifica la consulta del estado del libro

# Ejecuta las pruebas unitarias si el archivo se ejecuta directamente
if __name__ == '__main__':
    unittest.main()  # Ejecuta todas las pruebas definidas en la clase
