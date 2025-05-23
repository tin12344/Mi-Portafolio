import pytest
from pyspark.sql import SparkSession
from pyspark.sql.types import StructType, StructField, StringType, IntegerType, DoubleType
from pyspark.sql.functions import col, count, when
from ..data_processing.vehicle_processing import (
    load_vehicle_data,
    clean_cero_values_msrp,
    clean_null_data,
    handle_outliers_iqr
)
import os

@pytest.fixture(scope="module")
def spark():
    return SparkSession.builder \
        .appName("TestVehicleProcessing") \
        .master("local[*]") \
        .getOrCreate()

@pytest.fixture(scope="module")
def sample_df(spark):
    data = [
        ("VIN1", "County1", "City1", None, 2020, 300, 35000),
        ("VIN2", None, None, 98001, 2021, 0, 0),
        ("VIN3", "County2", "City2", 98002, 2025, 500, 80000),
        ("VIN4", "County1", None, 98003, 2022, 250, 40000)
    ]
    
    schema = StructType([
        StructField("VIN (1-10)", StringType(), True),
        StructField("County", StringType(), True),
        StructField("City", StringType(), True),
        StructField("Postal Code", IntegerType(), True),
        StructField("Model Year", IntegerType(), True),
        StructField("Electric Range", IntegerType(), True),
        StructField("Base MSRP", IntegerType(), True)
    ])
    
    return spark.createDataFrame(data, schema)

# Test para verificar la limpieza de datos nulos
def test_clean_null_data(sample_df):
    result_df = clean_null_data(sample_df)
    
    null_counts = result_df.select([
        count(when(col(c).isNull(), c)).alias(c)
        for c in result_df.columns
    ]).collect()[0]
    
    assert all(count == 0 for count in null_counts), "Existen valores nulos después de la limpieza"

# Test para verificar la limpieza de valores cero tomando como referencia Base MSRP
def test_clean_cero_values_msrp(sample_df):
    result_df = clean_cero_values_msrp(sample_df)
    
    zero_count = result_df.filter(col("Base MSRP") == 0.0).count()
    assert zero_count == 0, "Existen valores cero en Base MSRP después de la limpieza"
    
    # Verificar que los valores originales no cero permanecen sin cambios
    original_values = set(sample_df.filter(col("Base MSRP") > 0.0)
                         .select("Base MSRP")
                         .rdd.flatMap(lambda x: x).collect())
    result_values = set(result_df.filter(col("Base MSRP") > 0.0)
                       .select("Base MSRP")
                       .rdd.flatMap(lambda x: x).collect())
    
    assert original_values != result_values, "Se modificaron los valores con exito en Base MSRP"

# Test para verificar la limpieza de outliers usando el método IQR
def test_handle_outliers_iqr(sample_df):
    result_df = handle_outliers_iqr(sample_df)
    
    for column in ['Model Year', 'Electric Range', 'Base MSRP']:
        quantiles = result_df.approxQuantile(column, [0.25, 0.75], 0.05)
        Q1, Q3 = quantiles[0], quantiles[1]
        IQR = Q3 - Q1
        lower_bound = Q1 - 1.5 * IQR
        upper_bound = Q3 + 1.5 * IQR
        
        outliers_count = result_df.filter(
            (col(column) < lower_bound) | (col(column) > upper_bound)
        ).count()
        
        assert outliers_count == 0, f"Existen outliers en {column} después del tratamiento"

# Test para verificar la carga de datos
def test_data_load(spark):
    try:
        if not os.path.exists("data/Electric_Vehicle_Population_Data.csv"):
            pytest.skip("Archivo de datos no encontrado")
            
        df = load_vehicle_data(spark)
        assert df is not None, "El DataFrame no se cargó correctamente"
        assert df.count() > 0, "El DataFrame está vacío"
        
        expected_columns = {
            "VIN (1-10)", "County", "City", "State", "Postal Code",
            "Model Year", "Make", "Model", "Electric Vehicle Type",
            "Electric Range", "Base MSRP", "Legislative District"
        }
        
        actual_columns = set(df.columns)
        assert expected_columns.issubset(actual_columns), \
            "Faltan columnas esperadas en el DataFrame"
            
    except Exception as e:
        pytest.fail(f"Error al cargar los datos: {str(e)}")