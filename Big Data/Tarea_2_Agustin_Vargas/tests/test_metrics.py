import pytest
from pyspark.sql.types import StructType, StructField, StringType
from metrics.metrics_calculator import calculate_metrics

@pytest.fixture
def sample_df(spark_session):
    try:
        data = [
            ("1", "10101", "20202", "100.0", "10"),  # Ingreso: 1000
            ("2", "20202", "30303", "200.0", "10"),  # Ingreso: 2000
            ("3", "30303", "40404", "300.0", "10"),  # Ingreso: 3000
            ("4", "40404", "50505", "400.0", "10"),  # Ingreso: 4000
            ("5", "50505", "60606", "500.0", "10"),  # Ingreso: 5000
        ]
        
        schema = StructType([
            StructField("identificador", StringType(), True),
            StructField("codigo_postal_origen", StringType(), True),
            StructField("codigo_postal_destino", StringType(), True),
            StructField("kilometros", StringType(), True),
            StructField("precio_kilometro", StringType(), True)
        ])
        
        return spark_session.createDataFrame(data, schema)
    except Exception as e:
        pytest.fail(f"Error al crear el DataFrame de prueba: {str(e)}")

# test para verificar que el dataframe que reciba no es nulo y que el resultado no es nulo
def test_dataframe_exists(sample_df):
    assert sample_df is not None
    result = calculate_metrics(sample_df)
    assert result is not None

# test para verificar que el dataframe no este vacio y que el resultado no sea vacio
def test_dataframe_not_empty(sample_df):
    assert sample_df.count() > 0
    result = calculate_metrics(sample_df)
    assert result.count() > 0

# test para verificar que alguna columna no cuente con valores nulos
def test_no_null_values(sample_df):
    for column in sample_df.columns:
        assert sample_df.filter(sample_df[column].isNull()).count() == 0

# test para verificar que la estructura sea la correcta
def test_metrics_structure(sample_df):
    result = calculate_metrics(sample_df)
    expected_metrics = [
        "persona_con_mas_kilometros",
        "persona_con_mas_ingresos",
        "percentil_25",
        "percentil_50",
        "percentil_75",
        "codigo_postal_origen_con_mas_ingresos",
        "codigo_postal_destino_con_mas_ingresos"
    ]
    assert all(col in [row.metrica for row in result.collect()] for col in expected_metrics)

# test para verificar que los valores de las metricas sean los correctos
def test_metrics_values(sample_df):
    result = calculate_metrics(sample_df)
    metrics_dict = {row.metrica: row.valor for row in result.collect()}
    
    assert metrics_dict["persona_con_mas_kilometros"] == "5"
    assert metrics_dict["persona_con_mas_ingresos"] == "5"
    assert metrics_dict["percentil_25"] == "2000.0"  # 25% de los viajes están por debajo de 2000
    assert metrics_dict["percentil_50"] == "3000.0"  # 50% de los viajes están por debajo de 3000
    assert metrics_dict["percentil_75"] == "4000.0"  # 75% de los viajes están por debajo de 4000
    assert metrics_dict["codigo_postal_origen_con_mas_ingresos"] == "50505"
    assert metrics_dict["codigo_postal_destino_con_mas_ingresos"] == "60606"

