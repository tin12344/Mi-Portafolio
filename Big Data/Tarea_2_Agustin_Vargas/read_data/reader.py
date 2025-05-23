from pyspark.sql.functions import explode, col

def read_persona_data(spark, file_pattern):
    try:
        df = spark.read.option("multiline", "true").json(file_pattern)

        if df is None:
            raise ValueError("El DataFrame es nulo.")

        if df.isEmpty():
            raise ValueError("El DataFrame está vacío.")

        df_final = df.select(
            "identificador", 
            explode("viajes").alias("viaje")
        ).select(
            "identificador",
            col("viaje.codigo_postal_origen").alias("codigo_postal_origen"),
            col("viaje.codigo_postal_destino").alias("codigo_postal_destino"),
            col("viaje.kilometros").alias("kilometros"),
            col("viaje.precio_kilometro").alias("precio_kilometro")
        )

        for column in df_final.columns:
            if df_final.filter(df_final[column].isNull()).count() > 0:
                raise ValueError(f"Se encontraron valores nulos en la columna {column}")

        return df_final

    except Exception as e:
        raise Exception(f"Error al procesar el archivo JSON: {str(e)}")
