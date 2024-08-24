import unittest # Importa el módulo unittest para crear y ejecutar pruebas unitarias
from unittest.mock import patch, MagicMock # Importa funciones para crear mocks y parches

import sys # Importa el módulo sys para manipular la lista de rutas de búsqueda de módulos
import os # Importa el módulo os para interactuar con el sistema operativo

# Agrega el directorio del módulo al sys.path
ruta_modulo = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) # Obtiene la ruta del directorio padre
sys.path.append(ruta_modulo) # Agrega el directorio del módulo a la lista de rutas de búsqueda de módulos

# Ahora se puede importar importar el módulo
from biblioteca import Biblioteca
from io import StringIO  # Importa StringIO para capturar la salida de la consola

class TestConsultaDisponibilidad(unittest.TestCase):
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

    def test_consulta_disponibilidad_libro_disponible(self):
        # Configurar el mock del cursor para que devuelva que el libro no está prestado ni reservado
        self.cursor_mock.fetchone.return_value = (False, None)  # Datos simulados: el libro no está prestado ni reservado
        captured_output = StringIO()  # Crea una instancia de StringIO para capturar la salida
        sys.stdout = captured_output  # Redirecciona la salida estándar a StringIO
        self.biblioteca.consultar_disponibilidad("12345")
        sys.stdout = sys.__stdout__  # Restaura la salida estándar
        self.assertEqual(captured_output.getvalue().strip(), "El libro está disponible")

    def test_consulta_disponibilidad_libro_prestado(self):
        # Configurar el mock del cursor para que devuelva que el libro está prestado
        self.cursor_mock.fetchone.return_value = (True, None)  # Datos simulados: el libro está prestado
        captured_output = StringIO()
        sys.stdout = captured_output
        self.biblioteca.consultar_disponibilidad("12345")
        sys.stdout = sys.__stdout__
        self.assertEqual(captured_output.getvalue().strip(), "El libro está prestado")

    def test_consulta_disponibilidad_libro_reservado(self):
        # Configurar el mock del cursor para que devuelva que el libro está reservado
        self.cursor_mock.fetchone.return_value = (False, "usuario123")  # Datos simulados: el libro está reservado por "usuario123"
        captured_output = StringIO()
        sys.stdout = captured_output
        self.biblioteca.consultar_disponibilidad("12345")
        sys.stdout = sys.__stdout__
        self.assertEqual(captured_output.getvalue().strip(), "El libro está reservado por otro usuario")

    def test_consulta_disponibilidad_libro_no_existe(self):
        # Configurar el mock del cursor para que devuelva None, simulando que el libro no existe
        self.cursor_mock.fetchone.return_value = None
        captured_output = StringIO()
        sys.stdout = captured_output
        self.biblioteca.consultar_disponibilidad("12345")
        sys.stdout = sys.__stdout__
        self.assertEqual(captured_output.getvalue().strip(), "El libro no existe")

# Ejecuta las pruebas unitarias si el archivo se ejecuta directamente
if __name__ == '__main__':
    unittest.main()  # Ejecuta todas las pruebas definidas en la clase