from pyspark.sql.functions import col, sum, lit, round as spark_round

def calculate_total_income(df):
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

        for column in df.columns:
            if df.filter(df[column].isNull()).count() > 0:
                raise ValueError(f"Se encontraron valores nulos en la columna {column}")

        invalid_numeric = df.filter(
            (~col("kilometros").rlike("^[0-9]+(\\.[0-9]+)?$")) |
            (~col("precio_kilometro").rlike("^[0-9]+$"))
        )
        
        if invalid_numeric.count() > 0:
            raise ValueError("Se encontraron valores numéricos con formato incorrecto")

        df = df.withColumn("ingreso", 
            col("kilometros").cast("double") * col("precio_kilometro").cast("double"))

        origins = df.groupBy(
            col("codigo_postal_origen").alias("codigo_postal")
        ).agg(
            spark_round(sum("ingreso"), 2).alias("total_ingresos")
        ).select(
            col("codigo_postal"),
            lit("origen").alias("tipo"),
            col("total_ingresos")
        )

        destinations = df.groupBy(
            col("codigo_postal_destino").alias("codigo_postal")
        ).agg(
            spark_round(sum("ingreso"), 2).alias("total_ingresos")
        ).select(
            col("codigo_postal"),
            lit("destino").alias("tipo"),
            col("total_ingresos")
        )

        return origins.union(destinations)

    except Exception as e:
        raise Exception(f"Error al calcular ingresos totales: {str(e)}")
