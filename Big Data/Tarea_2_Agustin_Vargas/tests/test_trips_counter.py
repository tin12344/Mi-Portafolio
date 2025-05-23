import pytest
from pyspark.sql.types import StructType, StructField, StringType
from total_trips.trips_counter import count_trips_by_postal_code

@pytest.fixture
def sample_df(spark_session):
    data = [
        ("1", "10101", "20202", "10.5", "500"),
        ("1", "10101", "30303", "15.2", "400"),
        ("2", "20202", "40404", "20.0", "300"),
    ]
    
    schema = StructType([
        StructField("identificador", StringType(), True),
        StructField("codigo_postal_origen", StringType(), True),
        StructField("codigo_postal_destino", StringType(), True),
        StructField("kilometros", StringType(), True),
        StructField("precio_kilometro", StringType(), True)
    ])
    
    return spark_session.createDataFrame(data, schema)

# test para verificar que el DataFrame de entrada no sea nulo
def test_input_not_none(sample_df):
    assert sample_df is not None
    result = count_trips_by_postal_code(sample_df)
    assert result is not None

# test para verificar que el DataFrame de entrada no esté vacío
def test_input_not_empty(sample_df):
    assert sample_df.count() > 0
    result = count_trips_by_postal_code(sample_df)
    assert result.count() > 0

# test para verificar que no hay valores nulos en las columnas existentes del DataFrame
def test_no_null_values(sample_df):
    null_count_identificador = sample_df.filter(sample_df.identificador.isNull()).count()
    null_count_origen = sample_df.filter(sample_df.codigo_postal_origen.isNull()).count()
    null_count_destino = sample_df.filter(sample_df.codigo_postal_destino.isNull()).count()
    null_count_kilometros = sample_df.filter(sample_df.kilometros.isNull()).count()
    null_count_precio = sample_df.filter(sample_df.precio_kilometro.isNull()).count()
    
    assert null_count_identificador == 0
    assert null_count_origen == 0
    assert null_count_destino == 0
    assert null_count_kilometros == 0
    assert null_count_precio == 0

# test para verificar la estructura del DataFrame de salida
def test_output_structure(sample_df):
    result = count_trips_by_postal_code(sample_df)

    expected_columns = ["codigo_postal", "tipo", "total_viajes"]
    assert all(col in result.columns for col in expected_columns)
    assert len(result.columns) == len(expected_columns)

# test para verificar los valores del conteo
def test_count_values(sample_df):
    result = count_trips_by_postal_code(sample_df)
    
    rows = result.collect()
    for row in rows:
        if row.codigo_postal == "10101" and row.tipo == "origen":
            assert row.total_viajes == 2
        elif row.codigo_postal == "20202" and row.tipo == "destino":
            assert row.total_viajes == 1

# test para verificar que los tipos sean solo 'origen' o 'destino'
def test_valid_tipos(sample_df):
    result = count_trips_by_postal_code(sample_df)
    invalid_tipos = result.filter(~result.tipo.isin(["origen", "destino"])).count()
    
    assert invalid_tipos == 0
