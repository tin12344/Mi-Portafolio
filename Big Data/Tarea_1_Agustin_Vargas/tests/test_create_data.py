import pytest
from pyspark.sql import SparkSession
from pyspark.sql.types import StructType, StructField, StringType
from data.create_data import get_date_range, generate_athletes_data, generate_swimming_data, generate_running_data

# test para verificar que el rango de fechas es correcto
def test_date_range_invalid_dates():
    fecha_inicio = "2025-01-31"
    fecha_fin = "2025-01-01"
        
    with pytest.raises(ValueError) as exc_info:
        get_date_range(fecha_inicio, fecha_fin)
        
    assert "Fecha de inicio no puede ser mayor a la fecha final" in str(exc_info.value)

# test para vericar que la creacion de las fechas sea correcto
def test_date_range_valid_dates():
    fecha_inicio = "2025-01-01"
    fecha_fin = "2025-01-03"
    expected = ["2025-01-01", "2025-01-02", "2025-01-03"]
 
    result = get_date_range(fecha_inicio, fecha_fin)

    assert result == expected
    assert len(result) == 3

@pytest.fixture # Inicializacion una sesion para pruebas con data frames
def spark_session():
    spark = SparkSession.builder.appName("test").master("local[1]").getOrCreate()
    yield spark # Devolvemos la sesion para usarla en las pruebas
    spark.stop()

# test para verificar que la generacion de datos de nadar es correcta
def test_swimming_data_generation(spark_session):
    athletes_schema = StructType([
        StructField("correo_electronico", StringType(), True),
        StructField("nombre", StringType(), True),
        StructField("pais", StringType(), True)
    ])
    df_athletes = spark_session.createDataFrame(generate_athletes_data(), schema=athletes_schema)
    
    swim_data = generate_swimming_data(df_athletes)
    
    assert len(swim_data) > 0
    
    first_record = swim_data[0]
    assert len(first_record) == 6
    
    valid_emails = set(row.correo_electronico for row in df_athletes.collect())
    
    for record in swim_data:
        email, heart_rate, distance, strokes, minutes, date = record
        
        assert email in valid_emails
        assert 0 <= heart_rate <= 200
        assert 500 <= distance <= 3000
        assert 100 <= strokes <= 1000
        assert 20 <= minutes <= 120
        assert date.startswith("2025-01-")

# test para verificar que la generacion de datos de correr es correcta
def test_running_data_generation(spark_session):
    athletes_schema = StructType([
        StructField("correo_electronico", StringType(), True),
        StructField("nombre", StringType(), True),
        StructField("pais", StringType(), True)
    ])
    df_athletes = spark_session.createDataFrame(generate_athletes_data(), schema=athletes_schema)
    
    run_data = generate_running_data(df_athletes)
    
    assert len(run_data) > 0
    
    first_record = run_data[0]
    assert len(first_record) == 6
    
    valid_emails = set(row.correo_electronico for row in df_athletes.collect())
    
    for record in run_data:
        email, heart_rate, distance, height_gain, minutes, date = record
        
        assert email in valid_emails
        assert 0 <= heart_rate <= 200
        assert 1000 <= distance <= 10000
        assert 0 <= height_gain <= 500
        assert 20 <= minutes <= 120
        assert date.startswith("2025-01-")
