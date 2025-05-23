from pyspark.sql.functions import col, when, mean, count, lit
from pyspark.sql.types import StringType, IntegerType, DoubleType, LongType, BooleanType

def load_station_data(spark):
    return spark.read \
        .option("header", "true") \
        .option("inferSchema", "true") \
        .csv("data/alt_fuel_stations.csv")

def get_columns_by_type(df, data_type):
    return [field.name for field in df.schema.fields 
            if isinstance(field.dataType, data_type)]

def handle_numeric_columns(df):
    # Identificar todas las columnas numéricas
    numeric_types = (IntegerType, DoubleType, LongType)
    numeric_columns = []
    
    for type_class in numeric_types:
        numeric_columns.extend(get_columns_by_type(df, type_class))
    
    df_cleaned = df
    for column in numeric_columns:
        # Calcular estadísticas solo si hay valores no nulos
        non_null_count = df_cleaned.filter(col(column).isNotNull()).count()
        
        if non_null_count > 0:
            # Calcular la media para valores nulos
            mean_value = df_cleaned.select(mean(col(column))).first()[0]
            
            # Reemplazar valores nulos con la media
            df_cleaned = df_cleaned.withColumn(
                column,
                when(col(column).isNull(), mean_value)
                .otherwise(col(column))
            )
            
            # Calcular IQR y límites
            quantiles = df_cleaned.approxQuantile(column, [0.25, 0.75], 0.05)
            Q1, Q3 = quantiles[0], quantiles[1]
            IQR = Q3 - Q1
            lower_bound = Q1 - 1.5 * IQR
            upper_bound = Q3 + 1.5 * IQR
            
            # Tratar outliers
            df_cleaned = df_cleaned.withColumn(
                column,
                when(col(column) < lower_bound, lower_bound)
                .when(col(column) > upper_bound, upper_bound)
                .otherwise(col(column))
            )
    
    return df_cleaned

def handle_string_columns(df):
    string_columns = get_columns_by_type(df, StringType)
    df_cleaned = df
    
    for column in string_columns:
        # Encontrar el valor más frecuente excluyendo nulos
        most_frequent = df_cleaned.filter(col(column).isNotNull()) \
            .groupBy(column) \
            .agg(count("*").alias("count")) \
            .orderBy(col("count").desc()) \
            .first()
        
        if most_frequent:
            most_frequent_value = most_frequent[0]
            # Reemplazar nulos con el valor más frecuente
            df_cleaned = df_cleaned.withColumn(
                column,
                when(col(column).isNull(), most_frequent_value)
                .otherwise(col(column))
            )
    
    return df_cleaned

def handle_boolean_columns(df):
    boolean_columns = get_columns_by_type(df, BooleanType)
    df_cleaned = df
    
    for column in boolean_columns:
        # Calcular la moda (valor más frecuente) de los valores no nulos
        mode_value = df_cleaned.filter(col(column).isNotNull()) \
            .groupBy(column) \
            .agg(count("*").alias("count")) \
            .orderBy(col("count").desc()) \
            .first()
        
        if mode_value:
            default_value = mode_value[0]
            # Reemplazar nulos con el valor más frecuente
            df_cleaned = df_cleaned.withColumn(
                column,
                when(col(column).isNull(), lit(default_value))
                .otherwise(col(column))
            )
    
    return df_cleaned

def process_station_data(df):
    # Procesar columnas numéricas
    df = handle_numeric_columns(df)
    # Procesar columnas string
    df = handle_string_columns(df)
    # Procesar columnas booleanas
    df = handle_boolean_columns(df)
    return df