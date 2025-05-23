import pytest
from pyspark.sql.types import StructType, StructField, StringType
from total_incomes.income_calculator import calculate_total_income

@pytest.fixture
def sample_df(spark_session):
    data = [
        ("1", "10101", "20202", "10.0", "100"),  # Ingreso: 1000
        ("1", "10101", "30303", "20.0", "100"),  # Ingreso: 2000
        ("2", "20202", "40404", "30.0", "100"),  # Ingreso: 3000
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
    result = calculate_total_income(sample_df)
    assert result is not None

# test para verificar que el DataFrame de entrada no este vacio
def test_input_not_empty(sample_df):
    assert sample_df.count() > 0
    result = calculate_total_income(sample_df)
    assert result.count() > 0

# test para verificar la estructura del DataFrame de salida
def test_output_structure(sample_df):
    result = calculate_total_income(sample_df)
    expected_columns = ["codigo_postal", "tipo", "total_ingresos"]
    assert all(col in result.columns for col in expected_columns)
    assert len(result.columns) == len(expected_columns)

# test para verificar que el calculo de ingresos es correcto
def test_income_calculation(sample_df):
    result = calculate_total_income(sample_df)
    rows = result.collect()
    
    for row in rows:
        if row.codigo_postal == "10101" and row.tipo == "origen":
            assert row.total_ingresos == 3000.0  # 1000 + 2000
        elif row.codigo_postal == "20202" and row.tipo == "origen":
            assert row.total_ingresos == 3000.0  # 3000

# test para verificar que los tipos sean solo 'origen' o 'destino'
def test_valid_tipos(sample_df):
    result = calculate_total_income(sample_df)
    invalid_tipos = result.filter(~result.tipo.isin(["origen", "destino"])).count()
    assert invalid_tipos == 0
