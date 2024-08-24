import unittest # Importa el módulo unittest para crear y ejecutar pruebas unitarias
from unittest.mock import patch, MagicMock # Importa funciones para crear mocks y parches

import sys # Importa el módulo sys para manipular la lista de rutas de búsqueda de módulos
import os # Importa el módulo os para interactuar con el sistema operativo

# Agrega el directorio del módulo al sys.path
ruta_modulo = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) # Obtiene la ruta del directorio padre
sys.path.append(ruta_modulo) # Agrega el directorio del módulo a la lista de rutas de búsqueda de módulos

# Ahora se puede importar importar el módulo
from biblioteca import Biblioteca

class TestBusquedaLibros(unittest.TestCase):
    def setUp(self):
        # Crear un mock para la conexión y el cursor de la base de datos
        self.conn_mock = MagicMock()
        self.cursor_mock = MagicMock()
        self.conn_mock.cursor.return_value = self.cursor_mock # Configura el mock de la conexión para devolver el mock del cursor

        # Parchear la función create_connection para que devuelva el mock de la conexión
        patcher = patch('biblioteca.create_connection', return_value=self.conn_mock)
        self.addCleanup(patcher.stop) # Asegura que el parche se detenga después de cada prueba
        self.mock_create_connection = patcher.start()# Inicia el parche
        # Crear una instancia de la clase Biblioteca utilizando los mocks
        self.biblioteca = Biblioteca()

    def test_busqueda_libro_titulo_exitoso(self):
        # Configurar el mock del cursor para que devuelva un resultado específico
        self.cursor_mock.fetchall.return_value = [
            (1, 'El Principito', 'Antoine de Saint-Exupéry', '12345', False, None)
        ]
        resultados = self.biblioteca.buscar_libro(titulo="El Principito")
        self.assertIsInstance(resultados, list)  # Verifica que la respuesta es una lista
        self.assertEqual(len(resultados), 1)
        self.assertEqual(resultados[0][1], "El Principito") # Busca el libro por título

    def test_busqueda_libro_no_existente(self):
        self.cursor_mock.fetchall.return_value = []
        resultados = self.biblioteca.buscar_libro(titulo="Cien años de soledad")
        self.assertEqual(resultados, "El libro no existe.") # Devuelve que el libro no existe y la busqueda fallo

    def test_busqueda_libro_autor_exitoso(self):
        self.cursor_mock.fetchall.return_value = [
            (1, 'El Principito', 'Antoine de Saint-Exupéry', '12345', False, None)
        ]
        resultados = self.biblioteca.buscar_libro(autor="Antoine de Saint-Exupéry")
        self.assertIsInstance(resultados, list)
        self.assertEqual(len(resultados), 1)
        self.assertEqual(resultados[0][2], "Antoine de Saint-Exupéry") # Busqueda por medio del autos

    def test_busqueda_libro_isbn_exitoso(self):
        self.cursor_mock.fetchall.return_value = [
            (1, 'El Principito', 'Antoine de Saint-Exupéry', '12345', False, None)
        ]
        resultados = self.biblioteca.buscar_libro(isbn="12345")
        self.assertIsInstance(resultados, list)
        self.assertEqual(len(resultados), 1)
        self.assertEqual(resultados[0][3], "12345") # Busqueda por medio del isbn

# Ejecuta las pruebas unitarias si el archivo se ejecuta directamente
if __name__ == '__main__':
    unittest.main() # Ejecuta todas las pruebas definidas en la clase