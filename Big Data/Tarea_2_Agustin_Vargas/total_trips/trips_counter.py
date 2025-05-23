from pyspark.sql.functions import col, count, lit

def count_trips_by_postal_code(df):
    try:
        if df is None:
            raise ValueError("El DataFrame es nulo")

        if df.isEmpty():
            raise ValueError("El DataFrame está vacío")

        expected_columns = [
            "identificador",
            "codigo_postal_origen",
            "codigo_postal_destino",
            "kilometros",
            "precio_kilometro"
        ]
        
        if not all(col in df.columns for col in expected_columns):
            raise ValueError("El DataFrame no tiene la estructura correcta")

        for column in ["codigo_postal_origen", "codigo_postal_destino"]:
            if df.filter(df[column].isNull()).count() > 0:
                raise ValueError(f"Se encontraron valores nulos en la columna {column}")

        origins = df.groupBy(
            col("codigo_postal_origen").alias("codigo_postal")
        ).agg(
            count("*").alias("total_viajes")
        ).select(
            col("codigo_postal"),
            lit("origen").alias("tipo"),
            col("total_viajes")
        )

        destinations = df.groupBy(
            col("codigo_postal_destino").alias("codigo_postal")
        ).agg(
            count("*").alias("total_viajes")
        ).select(
            col("codigo_postal"),
            lit("destino").alias("tipo"),
            col("total_viajes")
        )

        return origins.union(destinations)

    except Exception as e:
        raise Exception(f"Error al contar viajes: {str(e)}")
