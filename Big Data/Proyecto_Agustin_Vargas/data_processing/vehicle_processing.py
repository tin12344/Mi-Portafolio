from pyspark.sql.functions import col, when, rand, array, lit, floor, mean
from pyspark.sql.types import StructType, StructField, StringType, IntegerType

def load_vehicle_data(spark):
    schema = StructType([
        StructField("VIN (1-10)", StringType(), True),
        StructField("County", StringType(), True),
        StructField("City", StringType(), True),
        StructField("State", StringType(), True),
        StructField("Postal Code", IntegerType(), True),
        StructField("Model Year", IntegerType(), True),
        StructField("Make", StringType(), True),
        StructField("Model", StringType(), True),
        StructField("Electric Vehicle Type", StringType(), True),
        StructField("Clean Alternative Fuel Vehicle (CAFV) Eligibility", StringType(), True),
        StructField("Electric Range", IntegerType(), True),
        StructField("Base MSRP", IntegerType(), True),
        StructField("Legislative District", IntegerType(), True),
        StructField("DOL Vehicle ID", IntegerType(), True),
        StructField("Vehicle Location", StringType(), True),
        StructField("Electric Utility", StringType(), True),
        StructField("2020 Census Tract", StringType(), True)
    ])
    
    return spark.read \
        .option("header", "true") \
        .schema(schema) \
        .csv("data/Electric_Vehicle_Population_Data.csv")

def clean_cero_values_msrp(df):
    # Verificar si hay ceros para reemplazar
    zero_count = df.filter(col("Base MSRP").cast("int") == 0).count()
    if zero_count == 0:
        return df
    
    # Calcular la media de valores no-cero
    mean_value = df.filter(col("Base MSRP") > 0) \
                  .agg(mean("Base MSRP").cast("int").alias("mean_msrp")) \
                  .collect()[0]["mean_msrp"]
    
    # Aplicar la transformación SOLO a valores que son cero
    return df.withColumn(
        "Base MSRP",
        when(col("Base MSRP").cast("int") == 0, lit(int(mean_value)))
        .otherwise(col("Base MSRP"))
    )

def clean_null_data(df):
    location_columns = ["County", "City", "Postal Code"]
    df_cleaned = df
    
    for column in location_columns:
        if (column in df.columns):
            unique_values = [row[0] for row in df.select(column)
                            .distinct()
                            .filter(col(column).isNotNull())
                            .collect()]
            
            if unique_values: 
                df_cleaned = df_cleaned.withColumn(
                    column,
                    when(col(column).isNull(),
                         array([lit(x) for x in unique_values])[floor(rand() * len(unique_values))] 
                    ).otherwise(col(column))
                )
    
    return df_cleaned

def handle_outliers_iqr(df):
    numeric_columns = ['Model Year', 'Electric Range', 'Base MSRP']
    df_cleaned = df
    
    for column in numeric_columns:
        quantiles = df.approxQuantile(column, [0.25, 0.75], 0.05)
        Q1 = quantiles[0]
        Q3 = quantiles[1]
        IQR = Q3 - Q1
        
        lower_bound = Q1 - 1.5 * IQR
        upper_bound = Q3 + 1.5 * IQR
        
        df_cleaned = df_cleaned.withColumn(
            column,
            when(col(column) < lower_bound, lower_bound)
            .when(col(column) > upper_bound, upper_bound)
            .otherwise(col(column))
        )
    
    return df_cleaned

def process_vehicle_data(df):
    # Procesar valores cero en MSRP
    df = clean_cero_values_msrp(df)
    # Limpiar valores nulos en columnas de ubicación
    df = clean_null_data(df)
    # Manejar outliers en columnas numéricas
    df = handle_outliers_iqr(df)
    
    return df