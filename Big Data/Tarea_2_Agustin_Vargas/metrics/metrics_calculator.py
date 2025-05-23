from pyspark.sql.functions import col, sum, percentile_approx, array, lit

def calculate_metrics(df):
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

        df_with_income = df.withColumn("ingreso", 
            col("kilometros").cast("double") * col("precio_kilometro").cast("double"))
    
        person_totals = df_with_income.groupBy("identificador").agg(
            sum("kilometros").cast("double").alias("total_kilometros"),
            sum("ingreso").alias("total_ingresos")
        )
        
        person_max_km = person_totals.orderBy(col("total_kilometros").desc()).first().identificador
        person_max_ingresos = person_totals.orderBy(col("total_ingresos").desc()).first().identificador
        
        percentiles = df_with_income.select(
            percentile_approx(
                col("ingreso"), 
                array(lit(0.25), lit(0.50), lit(0.75))
            ).alias("percentiles")
        ).first().percentiles

        origyn_ingresos = df_with_income.groupBy("codigo_postal_origen").agg(
            sum("ingreso").alias("total_ingresos")
        ).orderBy(col("total_ingresos").desc())
        
        destiny_ingresos = df_with_income.groupBy("codigo_postal_destino").agg(
            sum("ingreso").alias("total_ingresos")
        ).orderBy(col("total_ingresos").desc())
        
        origyn_max = origyn_ingresos.first().codigo_postal_origen
        destiny_max = destiny_ingresos.first().codigo_postal_destino
        
        metrics_data = [
            ("persona_con_mas_kilometros", person_max_km),
            ("persona_con_mas_ingresos", person_max_ingresos),
            ("percentil_25", str(percentiles[0])),
            ("percentil_50", str(percentiles[1])),
            ("percentil_75", str(percentiles[2])),
            ("codigo_postal_origen_con_mas_ingresos", origyn_max),
            ("codigo_postal_destino_con_mas_ingresos", destiny_max)
        ]
        
        return df_with_income.sparkSession.createDataFrame(
            metrics_data,
            ["metrica", "valor"]
        )

    except Exception as e:
        raise Exception(f"Error al calcular métricas: {str(e)}")
