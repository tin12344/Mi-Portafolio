import pytest
from pyspark.sql import SparkSession
from pyspark.sql.types import StructType, StructField, StringType, DoubleType, IntegerType
from ..data_processing.unify_data import (
    calculate_distance, 
    extract_coordinates, 
    process_and_join_data
)

@pytest.fixture(scope="module")
def spark():
    return SparkSession.builder \
        .appName("TestUnifyData") \
        .master("local[*]") \
        .getOrCreate()

@pytest.fixture(scope="module")
def vehicles_schema():
    return StructType([
        StructField("Postal Code", StringType(), True),
        StructField("Make", StringType(), True),
        StructField("Model", StringType(), True),
        StructField("Model Year", IntegerType(), True),
        StructField("Vehicle Location", StringType(), True),
        StructField("Electric Range", IntegerType(), True),
        StructField("Base MSRP", IntegerType(), True)
    ])

@pytest.fixture(scope="module")
def stations_schema():
    return StructType([
        StructField("ZIP", StringType(), True),
        StructField("Fuel Type Code", StringType(), True),
        StructField("Station Name", StringType(), True),
        StructField("EV Level2 EVSE Num", IntegerType(), True),
        StructField("EV DC Fast Count", IntegerType(), True),
        StructField("Longitude", DoubleType(), True),
        StructField("Latitude", DoubleType(), True)
    ])

@pytest.fixture(scope="module")
def sample_vehicles_data():
    return [
        ("98101", "Tesla", "Model 3", 2022, "POINT (-122.3321 47.6062)", 300, 45000),
        ("98101", "Tesla", "Model Y", 2023, "POINT (-122.3331 47.6097)", 330, 55000)
    ]

@pytest.fixture(scope="module")
def sample_stations_data():
    return [
        ("98101", "ELEC", "Station 1", 2, 1, -122.3321, 47.6062),
        ("98101", "ELEC", "Station 2", 4, 2, -122.3331, 47.6097)
    ]

# Test para calcular la distancia entre dos puntos geográficos
def test_calculate_distance(spark):
    test_data = [(47.6062, -122.3321, 47.6097, -122.3331)]
    schema = StructType([
        StructField("lat1", DoubleType(), True),
        StructField("lon1", DoubleType(), True),
        StructField("lat2", DoubleType(), True),
        StructField("lon2", DoubleType(), True)
    ])
    
    df = spark.createDataFrame(test_data, schema)
    
    result_df = df.select(
        calculate_distance(
            df.lat1, 
            df.lon1, 
            df.lat2, 
            df.lon2
        ).alias("distance")
    )
    
    result = result_df.first()["distance"]
    assert abs(result - 0.4) < 0.1

# Test para extraer coordenadas de la columna "Vehicle Location"
def test_extract_coordinates(spark):
    test_data = [("POINT (-122.3321 47.6062)",)]
    schema = StructType([StructField("Vehicle Location", StringType(), True)])
    df = spark.createDataFrame(test_data, schema)
    
    result = extract_coordinates(df)
    row = result.first()
    assert abs(float(row['Longitude']) - (-122.3321)) < 0.0001
    assert abs(float(row['Latitude']) - 47.6062) < 0.0001

# Test para procesar y unir datos de vehículos y estaciones
def test_process_and_join_data(spark, vehicles_schema, stations_schema, sample_vehicles_data, sample_stations_data):
    vehicles_df = spark.createDataFrame(sample_vehicles_data, vehicles_schema)
    stations_df = spark.createDataFrame(sample_stations_data, stations_schema)

    result = process_and_join_data(stations_df, vehicles_df)
    
    assert result.count() > 0, "El DataFrame resultante no debe estar vacío"
    
    row = result.first()
    
    assert row["Postal Code"] == "98101", "Código postal incorrecto"
    assert row["Make"] == "Tesla", "Marca incorrecta"
    assert row["vehicle_count"] > 0, "El conteo de vehículos debe ser positivo"
    assert row["avg_vehicle_latitude"] is not None, "Latitud promedio no debe ser nula"
    assert row["avg_vehicle_longitude"] is not None, "Longitud promedio no debe ser nula"
    assert row["avg_electric_range"] is not None, "Rango eléctrico promedio no debe ser nulo"
    assert row["station_count"] >= 0, "Conteo de estaciones por tipo no debe ser negativo"
    assert row["level2_chargers"] >= 0, "Conteo de cargadores Level2 no debe ser negativo"
    assert row["dc_fast_chargers"] >= 0, "Conteo de cargadores rápidos no debe ser negativo"
    assert row["avg_distance_km"] is not None, "Distancia promedio no debe ser nula"

# Test ver el comportamiento con datos vacíos
def test_edge_cases(spark, vehicles_schema, stations_schema):
    empty_vehicles = spark.createDataFrame([], vehicles_schema)
    empty_stations = spark.createDataFrame([], stations_schema)
    
    result = process_and_join_data(empty_stations, empty_vehicles)
    assert result.count() == 0
