import pytest
from pyspark.sql import SparkSession
from pyspark.sql.types import StringType, IntegerType, DoubleType, BooleanType, StructType, StructField, TimestampType
from pyspark.sql.functions import col
from ..data_processing.station_processing import (
    load_station_data,
    handle_numeric_columns,
    handle_string_columns,
    handle_boolean_columns,
    get_columns_by_type
)
import os
from datetime import datetime

@pytest.fixture(scope="module")
def spark():
    return SparkSession.builder \
        .appName("TestStationProcessing") \
        .master("local[*]") \
        .getOrCreate()

@pytest.fixture(scope="module")
def sample_df(spark):
    data = [
        ("LPG", "Burlington Country Store", "1276 S Burlington Blvd", 
         "Burlington", "WA", "98233", 2, 4, 1, "48.461001", -122.335019,
         datetime.strptime("2025-02-12 00:16:32", "%Y-%m-%d %H:%M:%S")),
        
        ("LPG", "Skagit Farmers", "31686 State Route 20",
         "Oak Harbor", "WA", "98277", 1, 2, 0, "48.291006", -122.657044,
         datetime.strptime("2025-02-12 00:16:32", "%Y-%m-%d %H:%M:%S"))
    ]
    
    schema = StructType([
        StructField("Fuel Type Code", StringType(), True),
        StructField("Station Name", StringType(), True),
        StructField("Street Address", StringType(), True),
        StructField("City", StringType(), True),
        StructField("State", StringType(), True),
        StructField("ZIP", StringType(), True),
        StructField("EV Level1 EVSE Num", IntegerType(), True),
        StructField("EV Level2 EVSE Num", IntegerType(), True),
        StructField("EV DC Fast Count", IntegerType(), True),
        StructField("Latitude", StringType(), True),
        StructField("Longitude", DoubleType(), True),
        StructField("Updated At", TimestampType(), True)
    ])
    
    return spark.createDataFrame(data, schema)

# Test para opbtener columnas por tipo
def test_get_columns_by_type(sample_df):
    numeric_columns = get_columns_by_type(sample_df, IntegerType)
    string_columns = get_columns_by_type(sample_df, StringType)
    
    assert set(numeric_columns) == {
        "EV Level1 EVSE Num", 
        "EV Level2 EVSE Num", 
        "EV DC Fast Count"
    }
    assert "Station Name" in string_columns

# Test para manejar columnas numéricas
def test_handle_numeric_columns(sample_df):
    result_df = handle_numeric_columns(sample_df)
    
    for column in get_columns_by_type(result_df, IntegerType):
        null_count = result_df.filter(col(column).isNull()).count()
        assert null_count == 0, f"Existen valores nulos en {column}"
        
        stats = result_df.select(col(column)).summary("25%", "75%").collect()
        q1 = float(stats[0][1])
        q3 = float(stats[1][1])
        iqr = q3 - q1
        lower_bound = q1 - 1.5 * iqr
        upper_bound = q3 + 1.5 * iqr
        
        outliers = result_df.filter(
            (col(column) < lower_bound) | (col(column) > upper_bound)
        ).count()
        
        assert outliers == 0, f"Existen outliers en {column}"

# Test para manejar columnas de tipo string
def test_handle_string_columns(sample_df):
    result_df = handle_string_columns(sample_df)
    
    for column in get_columns_by_type(result_df, StringType):
        null_count = result_df.filter(col(column).isNull()).count()
        assert null_count == 0, f"Existen valores nulos en {column}"

# Test para manejar columnas de tipo booleano
def test_handle_boolean_columns(sample_df):
    result_df = handle_boolean_columns(sample_df)
    
    for column in get_columns_by_type(result_df, BooleanType):
        null_count = result_df.filter(col(column).isNull()).count()
        assert null_count == 0, f"Existen valores nulos en {column}"
        
        invalid_values = result_df.filter(
            ~col(column).isin([True, False])
        ).count()
        assert invalid_values == 0, f"Existen valores inválidos en {column}"

# Test para cargar datos de estaciones
def test_load_station_data(spark):
    try:
        if not os.path.exists("data/alt_fuel_stations.csv"):
            pytest.skip("Archivo de datos no encontrado")
        
        df = load_station_data(spark)
        assert df is not None, "El DataFrame no se cargó correctamente"
        assert df.count() > 0, "El DataFrame está vacío"
        
        essential_columns = {
            "Station Name", "Street Address", "City", "State",
            "ZIP", "EV Level1 EVSE Num", "EV Level2 EVSE Num",
            "EV DC Fast Count", "Latitude", "Longitude"
        }
        
        actual_columns = set(df.columns)
        assert essential_columns.issubset(actual_columns), \
            "Faltan columnas esenciales en el DataFrame"
            
    except Exception as e:
        pytest.fail(f"Error al cargar los datos: {str(e)}")
