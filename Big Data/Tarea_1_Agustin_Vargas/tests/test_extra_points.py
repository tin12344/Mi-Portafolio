import pytest
from pyspark.sql import SparkSession
from data.create_data import get_schemas, generate_athletes_data, generate_swimming_data, generate_running_data
from data_union.data_union import unit_data
from extra_points.extra_points import (
    get_top_n_height_gain,
    get_top_n_strokes_efficiency,
    get_top_n_heart_rate,
    get_top_n_time_efficiency
)

@pytest.fixture
def spark_session():
    spark = SparkSession.builder.appName("test").master("local[1]").getOrCreate()
    yield spark
    spark.stop()

@pytest.fixture
def test_complete_data(spark_session):
    athletes_schema, swim_schema, run_schema = get_schemas()
    
    df_athletes = spark_session.createDataFrame(generate_athletes_data(), schema=athletes_schema)
    df_swim = spark_session.createDataFrame(generate_swimming_data(df_athletes), schema=swim_schema)
    df_run = spark_session.createDataFrame(generate_running_data(df_athletes), schema=run_schema)
    
    return unit_data(df_athletes, df_swim, df_run)

# teste para validar que los resultados de la funcion de get_top_n_height_gain no son nulos
# y cuenten con las columnas necesarias
def test_height_gain_validity(test_complete_data):
    result = get_top_n_height_gain(test_complete_data, n=3)
    
    expected_columns = ['correo_electronico', 'nombre', 'pais', 'total_altura_ganada', 'rank']
    assert all(col in result.columns for col in expected_columns)
    
    assert result.filter("total_altura_ganada < 0").count() == 0
    assert result.filter("rank > 3").count() == 0
    
    country_ranks = result.select("pais", "rank").distinct().collect()
    for country in set(row.pais for row in country_ranks):
        country_data = [row.rank for row in country_ranks if row.pais == country]
        assert max(country_data) <= 3
        assert sorted(country_data) == list(range(1, len(country_data) + 1))

# test para verificar que no posea datos nulos y que los resultados sean logicos
# y que realice la clasificacion del rango de manera correcta
def test_strokes_efficiency_validity(test_complete_data):
    result = get_top_n_strokes_efficiency(test_complete_data, n=3)
    
    assert result.filter("brazadas_por_100m < 0").count() == 0
    assert result.filter("total_brazadas < 0").count() == 0
    assert result.filter("total_metros <= 0").count() == 0
    
    window_check = result.groupBy("pais").agg({
        "brazadas_por_100m": "min"
    }).collect()
    for row in window_check:
        min_value = result.filter(f"pais = '{row.pais}' AND rank = 1").first().brazadas_por_100m
        assert min_value == row['min(brazadas_por_100m)']

# test para verificar que no posea datos nulos y que los resultados sean logicos
def test_heart_rate_validity(test_complete_data):
    result = get_top_n_heart_rate(test_complete_data, n=3)

    assert result.filter("promedio_rc_nadar < 0 OR promedio_rc_nadar > 200").count() == 0
    assert result.filter("promedio_rc_correr < 0 OR promedio_rc_correr > 200").count() == 0
    assert result.filter("promedio_rc_total < 0 OR promedio_rc_total > 200").count() == 0
    assert result.count() > 0
    
    test_rows = result.filter(
        "promedio_rc_nadar IS NOT NULL AND promedio_rc_correr IS NOT NULL"
    ).collect()
    
    if test_rows:
        test_row = test_rows[0]
        expected_avg = (test_row.promedio_rc_nadar + test_row.promedio_rc_correr) / 2
        assert abs(test_row.promedio_rc_total - expected_avg) < 0.01

# test para verificar que los datos del tiempo no sean vacio, nulos o negativos y que sean logicos
def test_time_efficiency_validity(test_complete_data):
    result = get_top_n_time_efficiency(test_complete_data, n=3)

    assert result.filter("minutos_por_100m < 0").count() == 0
    assert result.filter("total_minutos_nadar < 0").count() == 0
    assert result.filter("total_minutos_correr < 0").count() == 0
    
    assert result.filter("total_metros_nadar <= 0").count() == 0
    assert result.filter("total_metros_correr <= 0").count() == 0