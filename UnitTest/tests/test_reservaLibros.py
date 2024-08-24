import unittest  # Importa el módulo unittest para crear y ejecutar pruebas unitarias
from unittest.mock import patch, MagicMock  # Importa funciones para crear mocks y parches

import sys  # Importa el módulo sys para manipular la lista de rutas de búsqueda de módulos
import os  # Importa el módulo os para interactuar con el sistema operativo

# Agrega el directorio del módulo al sys.path
ruta_modulo = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # Obtiene la ruta del directorio padre
sys.path.append(ruta_modulo)  # Agrega el directorio del módulo a la lista de rutas de búsqueda de módulos

# Ahora se puede importar el módulo
from biblioteca import Biblioteca

# Clase de prueba para la funcionalidad de reserva de libros
class TestReservaLibros(unittest.TestCase):
    def setUp(self):
        # Crear un mock para la conexión y el cursor de la base de datos
        self.conn_mock = MagicMock()
        self.cursor_mock = MagicMock()
        self.conn_mock.cursor.return_value = self.cursor_mock

        # Parchear la función create_connection para que devuelva el mock de la conexión
        patcher = patch('biblioteca.create_connection', return_value=self.conn_mock)
        self.addCleanup(patcher.stop)
        self.mock_create_connection = patcher.start()

        # Crear una instancia de la clase Biblioteca
        self.biblioteca = Biblioteca()

    def test_reserva_exitosa_libro(self):
        # Configurar el mock del cursor para simular que el usuario existe y el libro está prestado y no reservado
        self.cursor_mock.fetchone.side_effect = [(True,), (True, None)]
        self.biblioteca.reservar_libro("12345", "u124")

        # Verificar que se hicieron las llamadas correctas al cursor
        self.cursor_mock.execute.assert_any_call("SELECT 1 FROM usuarios WHERE id = %s", ("u124",))
        self.cursor_mock.execute.assert_any_call("SELECT prestado, reservado_por FROM libros WHERE isbn = %s", ("12345",))
        self.cursor_mock.execute.assert_any_call("UPDATE libros SET reservado_por = %s WHERE isbn = %s", ("u124", "12345"))
        self.conn_mock.commit.assert_called_once()

    def test_reserva_fallida_libro_no_existe(self):
        # Configurar el mock del cursor para simular que el usuario existe pero el libro no existe
        self.cursor_mock.fetchone.side_effect = [(True,), None]
        with self.assertRaises(ValueError, msg="El libro no existe"):
            self.biblioteca.reservar_libro("12345", "u124")

        # Verificar que se hicieron las llamadas correctas al cursor
        self.cursor_mock.execute.assert_any_call("SELECT 1 FROM usuarios WHERE id = %s", ("u124",))
        self.cursor_mock.execute.assert_any_call("SELECT prestado, reservado_por FROM libros WHERE isbn = %s", ("12345",))

    def test_reserva_fallida_usuario_no_registrado(self):
        # Configurar el mock del cursor para simular que el usuario no existe
        self.cursor_mock.fetchone.side_effect = [None]
        with self.assertRaises(ValueError, msg="El usuario no está registrado"):
            self.biblioteca.reservar_libro("12345", "u124")

        # Verificar que se hizo la llamada correcta al cursor
        self.cursor_mock.execute.assert_called_with("SELECT 1 FROM usuarios WHERE id = %s", ("u124",))

    def test_reserva_fallida_libro_reservado(self):
        # Configurar el mock del cursor para simular que el usuario existe y el libro está reservado por otro usuario
        self.cursor_mock.fetchone.side_effect = [(True,), (True, "otro_usuario")]
        with self.assertRaises(ValueError, msg="El libro ya está reservado por otro usuario"):
            self.biblioteca.reservar_libro("12345", "u124")

        # Verificar que se hicieron las llamadas correctas al cursor
        self.cursor_mock.execute.assert_any_call("SELECT 1 FROM usuarios WHERE id = %s", ("u124",))
        self.cursor_mock.execute.assert_any_call("SELECT prestado, reservado_por FROM libros WHERE isbn = %s", ("12345",))
        self.conn_mock.commit.assert_not_called()

# Ejecuta las pruebas unitarias si el archivo se ejecuta directamente
if __name__ == '__main__':
    unittest.main()

