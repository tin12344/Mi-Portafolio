import unittest # Importa el módulo unittest para crear y ejecutar pruebas unitarias
from unittest.mock import patch, MagicMock # Importa funciones para crear mocks y parches

import sys # Importa el módulo sys para manipular la lista de rutas de búsqueda de módulos
import os # Importa el módulo os para interactuar con el sistema operativo

# Agrega el directorio del módulo al sys.path
ruta_modulo = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) # Obtiene la ruta del directorio padre
sys.path.append(ruta_modulo) # Agrega el directorio del módulo a la lista de rutas de búsqueda de módulos

# Ahora se puede importar importar el módulo
from biblioteca import Biblioteca

class TestDevolucionLibros(unittest.TestCase):
    def setUp(self):
        # Crear un mock para la conexión y el cursor de la base de datos
        self.conn_mock = MagicMock()
        self.cursor_mock = MagicMock()
        self.conn_mock.cursor.return_value = self.cursor_mock

        # Parchear la función create_connection para que devuelva el mock de la conexión
        patcher = patch('biblioteca.create_connection', return_value=self.conn_mock)
        self.addCleanup(patcher.stop)
        self.mock_create_connection = patcher.start()

        # Crear una instancia de la clase Biblioteca utilizando los mocks
        self.biblioteca = Biblioteca()

    def test_devolucion_exitoso_libro(self):
        # Configurar el mock del cursor para devolver que el libro está prestado
        self.cursor_mock.fetchone.return_value = (True,)
        self.biblioteca.devolver_libro("12345")

        # Verificar que se hicieron las llamadas correctas al cursor
        self.cursor_mock.execute.assert_any_call("SELECT prestado FROM libros WHERE isbn = %s", ("12345",))
        self.cursor_mock.execute.assert_any_call("UPDATE libros SET prestado = FALSE, reservado_por = null WHERE isbn = %s", ("12345",))
        self.cursor_mock.execute.assert_any_call("DELETE FROM prestamos WHERE isbn = %s", ("12345",))
        self.conn_mock.commit.assert_called_once()  # Verifica que se hizo un commit en la conexión

    def test_devolucion_fallido_libro_no_prestado(self):
        # Configurar el mock del cursor para devolver que el libro no está prestado
        self.cursor_mock.fetchone.return_value = (False,)
        with self.assertRaises(ValueError, msg="El libro no está prestado"):
            self.biblioteca.devolver_libro("12345")

        # Verificar que se hizo la llamada correcta al cursor
        self.cursor_mock.execute.assert_called_with("SELECT prestado FROM libros WHERE isbn = %s", ("12345",))

# Ejecuta las pruebas unitarias si el archivo se ejecuta directamente
if __name__ == '__main__':
    unittest.main()  # Ejecuta todas las pruebas definidas en la clase