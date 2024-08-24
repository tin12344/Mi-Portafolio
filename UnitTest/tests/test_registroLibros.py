import unittest  # Importa el módulo unittest para crear y ejecutar pruebas unitarias
from unittest.mock import patch, MagicMock  # Importa funciones para crear mocks y parches

import sys  # Importa el módulo sys para manipular la lista de rutas de búsqueda de módulos
import os  # Importa el módulo os para interactuar con el sistema operativo

# Agrega el directorio del módulo al sys.path
ruta_modulo = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # Obtiene la ruta del directorio padre
sys.path.append(ruta_modulo)  # Agrega el directorio del módulo a la lista de rutas de búsqueda de módulos

from biblioteca import Biblioteca  # Importa la clase Biblioteca del módulo biblioteca

# Clase de prueba para la funcionalidad de registro de libros
class TestRegistroLibros(unittest.TestCase):
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

    def test_registro_exitoso_libro(self):
        # Prueba de registro exitoso de un libro
        self.biblioteca.registrar_libro("El Principito", "Antoine de Saint-Exupéry", "12345")

        # Verificar que se hicieron las llamadas correctas al cursor
        self.cursor_mock.execute.assert_called_with(
            "INSERT INTO libros (isbn, titulo, autor) VALUES (%s, %s, %s)",  # Verifica la consulta de inserción del libro
            ("12345", "El Principito", "Antoine de Saint-Exupéry")  # Datos del libro a insertar
        )
        self.conn_mock.commit.assert_called_once()  # Verifica que se haya llamado a commit para guardar los cambios

    def test_registro_fallido_libro_ya_existente(self):
        # Prueba de registro fallido debido a que el libro ya está registrado
        self.cursor_mock.execute.side_effect = ValueError("El libro ya está registrado")  # Configura el mock del cursor para simular una excepción de integridad
        with self.assertRaises(ValueError):  # Espera que se lance un ValueError
            self.biblioteca.registrar_libro("El Principito", "Antoine de Saint-Exupéry", "12345")  # Intenta registrar un libro ya existente

# Ejecuta las pruebas unitarias si el archivo se ejecuta directamente
if __name__ == '__main__':
    unittest.main()  # Ejecuta todas las pruebas definidas en la clase