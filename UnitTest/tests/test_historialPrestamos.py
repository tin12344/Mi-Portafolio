import unittest # Importa el módulo unittest para crear y ejecutar pruebas unitarias
from unittest.mock import patch, MagicMock # Importa funciones para crear mocks y parches

import sys # Importa el módulo sys para manipular la lista de rutas de búsqueda de módulos
import os # Importa el módulo os para interactuar con el sistema operativo

# Agrega el directorio del módulo al sys.path
ruta_modulo = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) # Obtiene la ruta del directorio padre
sys.path.append(ruta_modulo) # Agrega el directorio del módulo a la lista de rutas de búsqueda de módulos

# Ahora puedes importar el módulo
from biblioteca import Biblioteca

class TestHistorialPrestamos(unittest.TestCase):
    def setUp(self):
        # Crear un mock para la conexión y el cursor de la base de datos
        self.conn_mock = MagicMock()
        self.cursor_mock = MagicMock()
        self.conn_mock.cursor.return_value = self.cursor_mock # Configura el mock de la conexión para devolver el mock del cursor

        # Parchear la función create_connection para que devuelva el mock de la conexión
        patcher = patch('biblioteca.create_connection', return_value=self.conn_mock)
        self.addCleanup(patcher.stop) # Asegura que el parche se detenga después de cada prueba
        self.mock_create_connection = patcher.start() # Inicia el parche

        # Crear una instancia de la clase Biblioteca utilizando los mocks
        self.biblioteca = Biblioteca()

    def test_consulta_historial_exitoso(self):
        # Configurar el mock del cursor para devolver el historial esperado
        self.cursor_mock.fetchall.return_value = [("El Principito",)] # Datos simulados: historial de préstamos
        historial = self.biblioteca.consultar_historial("u123") # Consulta el historial de préstamos para el usuario "u123"
        self.assertIn("El Principito", [libro[0] for libro in historial]) # Verifica que "El Principito" esté en el historial

        # Verificar que se hizo la llamada correcta al cursor
        self.cursor_mock.execute.assert_called_with("SELECT libros.titulo FROM prestamos JOIN libros ON prestamos.isbn = libros.isbn WHERE prestamos.usuario_id = %s", ("u123",))
    
    def test_consulta_historial_usuario_sin_prestamos(self):
        # Configurar el mock del cursor para devolver una lista vacía
        self.cursor_mock.fetchall.return_value = [] # Datos simulados: el usuario no tiene préstamos
        historial = self.biblioteca.consultar_historial("u124") # Consulta el historial de préstamos para el usuario "u124"
        self.assertEqual(len(historial), 0) # Verifica que el historial esté vacío

        # Verificar que se hizo la llamada correcta al cursor
        self.cursor_mock.execute.assert_called_with("SELECT libros.titulo FROM prestamos JOIN libros ON prestamos.isbn = libros.isbn WHERE prestamos.usuario_id = %s", ("u124",))

# Ejecuta las pruebas unitarias si el archivo se ejecuta directamente
if __name__ == '__main__':
    unittest.main() # Ejecuta todas las pruebas definidas en la clase