import pytest
from pyspark.sql import SparkSession
from data.create_data import get_schemas, generate_athletes_data, generate_swimming_data, generate_running_data
from data_union.data_union import unit_data
from parcial_aggregations.parcial_aggregations import (
    aggregate_by_person,
    aggregate_by_activity_and_country,
    aggregate_by_date,
)

@pytest.fixture
def spark_session():
    spark = SparkSession.builder.appName("test").master("local[1]").getOrCreate()
    yield spark
    spark.stop()

@pytest.fixture
def test_unified_data(spark_session):
    athletes_schema, swim_schema, run_schema = get_schemas()
    df_athletes = spark_session.createDataFrame(generate_athletes_data(), schema=athletes_schema)
    df_swim = spark_session.createDataFrame(generate_swimming_data(df_athletes), schema=swim_schema)
    df_run = spark_session.createDataFrame(generate_running_data(df_athletes), schema=run_schema)
    return unit_data(df_athletes, df_swim, df_run)

# test para verificar la estuctura que se desea y que no contenga valores nulos
def test_aggregate_by_person_structure(test_unified_data):
    result = aggregate_by_person(test_unified_data)
    
    expected_columns = ['correo_electronico', 'nombre', 'pais', 
                       'total_metros_nadados', 'total_metros_corridos', 'total_metros']
    assert all(col in result.columns for col in expected_columns)
    
    for column in expected_columns:
        assert result.filter(f"{column} is null").count() == 0

# test para validar que las operaciones que se realicen sean correctas y que no den resultados 
# anomalos como negativos o ceros
def test_aggregate_by_person_calculations(test_unified_data):
    result = aggregate_by_person(test_unified_data)

    row = result.first()
    assert row.total_metros == row.total_metros_nadados + row.total_metros_corridos
    assert result.filter("total_metros < 0").count() == 0
    assert result.filter("total_metros_nadados < 0").count() == 0
    assert result.filter("total_metros_corridos < 0").count() == 0

# test para verificar la estuctura que se desea y que cada pais solo pueda aparecer una vez
def test_aggregate_by_country_structure(test_unified_data):
    result = aggregate_by_activity_and_country(test_unified_data)

    expected_columns = ['pais', 'total_metros_nadados', 'total_metros_corridos', 'total_metros']
    assert all(col in result.columns for col in expected_columns)
    assert result.select('pais').distinct().count() == result.count()

# test para verificar que la estructura de la fecha sea correcta
def test_aggregate_by_date_structure(test_unified_data):
    swim_result, run_result = aggregate_by_date(test_unified_data)

    assert 'fecha_nadar' in swim_result.columns
    assert 'total_metros_nadados' in swim_result.columns
    assert 'fecha_correr' in run_result.columns
    assert 'total_metros_corridos' in run_result.columns

