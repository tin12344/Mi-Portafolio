import pytest
from read_data.reader import read_persona_data

@pytest.fixture
def test_dataframe(spark_session):
    try:
        df = read_persona_data(spark_session, "persona*.json")
        return df
    except Exception as e:
        pytest.fail(f"Error al crear el DataFrame: {str(e)}")

# test para verificar que el dataframe no es nulo
def test_dataframe_exists(test_dataframe):
    assert test_dataframe is not None

# test para verificar que el dataframe no este vacio
def test_dataframe_not_empty(test_dataframe):
    assert test_dataframe.count() > 0

# test para verificar que el dataframe tenga la estructura correcta
def test_dataframe_structure(test_dataframe):
    expected_columns = [
        "identificador",
        "codigo_postal_origen",
        "codigo_postal_destino",
        "kilometros",
        "precio_kilometro"
    ]
    
    assert all(col in test_dataframe.columns for col in expected_columns)
    assert len(test_dataframe.columns) == len(expected_columns)

# test para verificar que no haya valores nulos
def test_no_null_values(test_dataframe):
    for column in test_dataframe.columns:
        assert test_dataframe.filter(test_dataframe[column].isNull()).count() == 0

# test para verificar el formato de los valores numéricos
def test_numeric_format(test_dataframe):
    df_filtered = test_dataframe.filter(
        (~test_dataframe["kilometros"].rlike("^[0-9]+(\\.[0-9]+)?$")) |
        (~test_dataframe["precio_kilometro"].rlike("^[0-9]+$"))
    )
    
    assert df_filtered.count() == 0
