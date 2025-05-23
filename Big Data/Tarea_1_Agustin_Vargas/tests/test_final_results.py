import pytest
from pyspark.sql import SparkSession
from data.create_data import get_schemas, generate_athletes_data, generate_swimming_data, generate_running_data
from data_union.data_union import unit_data
from parcial_aggregations.parcial_aggregations import calculate_all_aggregations
from final_results.final_results import get_top_n_by_country, get_top_n_average_by_country

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
    df_complete = unit_data(df_athletes, df_swim, df_run)
    
    aggregations = calculate_all_aggregations(df_complete)
    return df_complete, aggregations

def test_top_by_country_no_nulls(test_complete_data):
    _, aggregations = test_complete_data
    result = get_top_n_by_country(aggregations["by_person"], n=3)
    
    assert result.filter("correo_electronico is null").count() == 0
    assert result.filter("nombre is null").count() == 0
    assert result.filter("pais is null").count() == 0
    assert result.filter("total_metros is null").count() == 0
    assert result.filter("rank is null").count() == 0
    
# test para verificar que el ordenamiento del ranking sea correcto por cada pais
def test_top_by_country_ranking(test_complete_data):
    _, aggregations = test_complete_data
    n = 3
    result = get_top_n_by_country(aggregations["by_person"], n=n)
    
    assert result.filter(f"rank > {n}").count() == 0
    countries = result.select("pais").distinct().collect()
    for country_row in countries:
        country = country_row.pais
        country_data = result.filter(f"pais = '{country}'").orderBy("rank").collect()
        
        if len(country_data) > 1:
            for i in range(1, len(country_data)):
                assert country_data[i].total_metros <= country_data[i-1].total_metros

# test para verificar que el ranking no exeda de 3
def test_country_count_validity(test_complete_data):
    df_complete, aggregations = test_complete_data
    n = 3
    result_total = get_top_n_by_country(aggregations["by_person"], n=n)
    result_avg = get_top_n_average_by_country(df_complete, n=n)
    
    country_counts_total = result_total.groupBy("pais").count().collect()
    country_counts_avg = result_avg.groupBy("pais").count().collect()
    
    assert all(row['count'] <= n for row in country_counts_total)
    assert all(row['count'] <= n for row in country_counts_avg)
