from pyspark.sql.types import StructType, StructField, StringType, IntegerType
from datetime import datetime, timedelta
import random

def generate_athletes_data():
    athletes_data = [
        ("atleta1@email.com", "Juan Pérez", "México"),
        ("atleta2@email.com", "Ana García", "España"),
        ("atleta3@email.com", "John Smith", "Estados Unidos"),
        ("atleta4@email.com", "Maria Silva", "Brasil"),
        ("atleta5@email.com", "Carlos López", "Argentina"),
        ("atleta6@email.com", "Laura Torres", "Colombia"),
        ("atleta7@email.com", "Pedro Ramírez", "Chile"),
        ("atleta8@email.com", "Sophie Martin", "Francia"),
        ("atleta9@email.com", "Mario Rossi", "Italia"),
        ("atleta10@email.com", "Emma Wilson", "Reino Unido"),
        ("atleta11@email.com", "Luis González", "Uruguay"),
        ("atleta12@email.com", "Hans Mueller", "Alemania"),
        ("atleta13@email.com", "Yuki Tanaka", "Japón"),
        ("atleta14@email.com", "Alex Chen", "China"),
        ("atleta15@email.com", "Isabel Santos", "Portugal")
    ]
    return athletes_data

def get_date_range(initial_date, final_date):
    initial_date = datetime.strptime(initial_date, "%Y-%m-%d")
    final_date = datetime.strptime(final_date, "%Y-%m-%d")

    if initial_date > final_date:
        raise ValueError("Fecha de inicio no puede ser mayor a la fecha final")
    
    dias = (final_date - initial_date).days + 1
    return [(initial_date + timedelta(days=i)).strftime("%Y-%m-%d") for i in range(dias)]

def generate_swimming_data(df_atletas):
    swim_data = []
    dates = get_date_range("2025-01-01", "2025-01-31")
    
    for fecha in dates:
        email = random.choice([row.correo_electronico for row in df_atletas.collect()])
        swim_data.append((
            email,
            random.randint(0, 200),
            random.randint(500, 3000),
            random.randint(100, 1000),
            random.randint(20, 120),
            fecha
        ))
    return swim_data

def generate_running_data(df_atletas):
    run_data = []
    dates = get_date_range("2025-01-01", "2025-01-31")
    
    for fecha in dates:
        email = random.choice([row.correo_electronico for row in df_atletas.collect()])
        run_data.append((
            email,
            random.randint(0, 200),
            random.randint(1000, 10000),
            random.randint(0, 500),
            random.randint(20, 120),
            fecha
        ))
    return run_data

def get_schemas():
    athletes_schema = StructType([
        StructField("correo_electronico", StringType(), True),
        StructField("nombre", StringType(), True),
        StructField("pais", StringType(), True)
    ])
    
    swim_schema = StructType([
        StructField("correo_electronico", StringType(), True),
        StructField("ritmo_cardiaco", IntegerType(), True),
        StructField("distancia_metros", IntegerType(), True),
        StructField("total_brazadas", IntegerType(), True),
        StructField("minutos_actividad", IntegerType(), True),
        StructField("fecha", StringType(), True)
    ])
    
    run_schema = StructType([
        StructField("correo_electronico", StringType(), True),
        StructField("ritmo_cardiaco", IntegerType(), True),
        StructField("distancia_metros", IntegerType(), True),
        StructField("ganancia_altura_metros", IntegerType(), True),
        StructField("minutos_actividad", IntegerType(), True),
        StructField("fecha", StringType(), True)
    ])
    
    return athletes_schema, swim_schema, run_schema