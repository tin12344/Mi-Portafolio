import pytest
from pyspark.sql import SparkSession
from data.create_data import generate_athletes_data, generate_swimming_data, generate_running_data, get_schemas
from data_union.data_union import unit_data

@pytest.fixture
def spark_session():
    spark = SparkSession.builder.appName("test").master("local[1]").getOrCreate()
    yield spark
    spark.stop()

@pytest.fixture
def test_dataframes(spark_session):
    athletes_schema, swim_schema, run_schema = get_schemas()
    
    df_athletes = spark_session.createDataFrame(generate_athletes_data(), schema=athletes_schema)
    df_swim = spark_session.createDataFrame(generate_swimming_data(df_athletes), schema=swim_schema)
    df_run = spark_session.createDataFrame(generate_running_data(df_athletes), schema=run_schema)
    
    return df_athletes, df_swim, df_run

# test para verificar que los dataframes que no son nulos
def test_dataframes_exist(test_dataframes):
    df_athletes, df_swim, df_run = test_dataframes
    assert df_athletes is not None
    assert df_swim is not None
    assert df_run is not None

# test para verificar que los dataframes que no sean vacios
def test_dataframes_not_empty(test_dataframes):
    df_athletes, df_swim, df_run = test_dataframes
    assert df_athletes.count() > 0
    assert df_swim.count() > 0
    assert df_run.count() > 0

# test para verificar que los dataframes tengan las estructuras correctas
def test_unit_data_structure(test_dataframes):
    df_athletes, df_swim, df_run = test_dataframes
    result = unit_data(df_athletes, df_swim, df_run)
    
    expected_columns = [
        'correo_electronico', 'nombre', 'pais',
        'ritmo_cardiaco_nadar', 'distancia_metros_nadar',
        'total_brazadas', 'minutos_nadar', 'fecha_nadar',
        'ritmo_cardiaco_correr', 'distancia_metros_correr',
        'ganancia_altura_metros', 'minutos_correr', 'fecha_correr'
    ]
    
    assert all(col in result.columns for col in expected_columns)
    assert len(result.columns) == len(expected_columns)
