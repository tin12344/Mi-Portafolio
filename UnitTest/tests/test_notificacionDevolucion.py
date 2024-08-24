import unittest  # Importa el módulo unittest para crear y ejecutar pruebas unitarias
from unittest.mock import patch, MagicMock  # Importa funciones para crear mocks y parches

import sys  # Importa el módulo sys para manipular la lista de rutas de búsqueda de módulos
import os  # Importa el módulo os para interactuar con el sistema operativo

# Agrega el directorio del módulo al sys.path
ruta_modulo = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # Obtiene la ruta del directorio padre
sys.path.append(ruta_modulo)  # Agrega el directorio del módulo a la lista de rutas de búsqueda de módulos

from biblioteca import Biblioteca  # Importa la clase Biblioteca del módulo biblioteca

# Clase de prueba para la funcionalidad de notificaciones de devolución de libros
class TestNotificacionesDevolucion(unittest.TestCase):
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

    def test_notificacion_devolucion_exitosa(self):
        # Configurar el mock del cursor para devolver las notificaciones esperadas
        self.cursor_mock.fetchall.return_value = [("u123", "12345")]  # Datos simulados: notificación de devolución
        notificaciones = self.biblioteca.enviar_notificaciones_devolucion()  # Envía notificaciones de devolución
        self.assertIn("u123", [notificacion["usuario_id"] for notificacion in notificaciones])  # Verifica que el usuario esté en las notificaciones

        # Verificar que se hizo la llamada correcta al cursor
        self.cursor_mock.execute.assert_called_with(
            "SELECT usuario_id, isbn FROM prestamos WHERE fecha_devolucion <= %s",
            (unittest.mock.ANY,)  # Comprueba que se pasó un valor como argumento para la fecha de devolución
        )
    
    def test_no_se_envian_notificaciones_sin_devoluciones_proximas(self):
        # Configurar el mock del cursor para devolver una lista vacía
        self.cursor_mock.fetchall.return_value = []  # Datos simulados: no hay devoluciones próximas
        notificaciones = self.biblioteca.enviar_notificaciones_devolucion()  # Envía notificaciones de devolución
        self.assertEqual(len(notificaciones), 0)  # Verifica que no se enviaron notificaciones

        # Verificar que se hizo la llamada correcta al cursor
        self.cursor_mock.execute.assert_called_with(
            "SELECT usuario_id, isbn FROM prestamos WHERE fecha_devolucion <= %s",
            (unittest.mock.ANY,)  # Comprueba que se pasó un valor como argumento para la fecha de devolución
        )

# Ejecuta las pruebas unitarias si el archivo se ejecuta directamente
if __name__ == '__main__':
    unittest.main()  # Ejecuta todas las pruebas definidas en la clase