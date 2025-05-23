from pyspark.sql import SparkSession
from data_processing.vehicle_processing import load_vehicle_data, process_vehicle_data
from data_processing.station_processing import load_station_data, process_station_data
from data_processing.unify_data import save_to_db, process_and_join_data

spark = SparkSession \
    .builder \
    .appName("Proyecto Agustin Vargas") \
    .config("spark.driver.extraClassPath", "postgresql-42.2.14.jar") \
    .config("spark.executor.extraClassPath", "postgresql-42.2.14.jar") \
    .getOrCreate()

# Procesar datos de vehículos
df_vehicles = load_vehicle_data(spark)
df_vehicles_processed = process_vehicle_data(df_vehicles)
        
# Guardar datos de vehículos
save_to_db(df_vehicles_processed, "vehicles")

# Procesar datos de estaciones
df_stations = load_station_data(spark)
df_stations_processed = process_station_data(df_stations)
        
# Guardar datos de estaciones
save_to_db(df_stations_processed, "stations")

# Unir los datasets
df_united_data = process_and_join_data(df_stations_processed, df_vehicles_processed)

# Guardar datos unidos
save_to_db(df_united_data, "joined_data")

