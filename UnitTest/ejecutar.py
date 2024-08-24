from biblioteca import Biblioteca


# Crea una instancia de la clase Biblioteca
biblioteca = Biblioteca()

# Llamada al método registrar_libro
# biblioteca.registrar_libro(titulo="El Principito", autor="Antoine de Saint-Exupéry", isbn="1")

# Llamada al método buscar_libro por título
# resultados = biblioteca.buscar_libro(titulo="Hola")
# print(resultados)

# Llamada al método registrar_usuario
# biblioteca.registrar_usuario(nombre="El pepe", user_id="12")

# Llamada al método prestar_libro
biblioteca.prestar_libro(isbn="1", user_id="12")

# Llamada al método devolver_libro
biblioteca.devolver_libro(isbn="1")

# Llamada al método consultar_historial
# historial = biblioteca.consultar_historial(user_id="12345")
# print(historial)

# Llamada al método enviar_notificaciones_devolucion
# notificaciones = biblioteca.enviar_notificaciones_devolucion()
# print(notificaciones)

# Llamada al método reservar_libro
#try:
 #   biblioteca.reservar_libro('1', '12')
  #  print("Reserva realizada con éxito.")
#except ValueError as e:
 #   print(f"Error al reservar el libro: {e}")

# Llamada al método consultar_disponibilidad
# biblioteca.consultar_disponibilidad(isbn="1")

# Llamada al método generar_reporte_no_devueltos
# reporte = biblioteca.generar_reporte_no_devueltos()
# print(reporte)