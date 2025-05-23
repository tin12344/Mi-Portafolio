from pyspark.sql.functions import sum, col, coalesce

def aggregate_by_person(df_unified):
    df_filled = df_unified.fillna(0, subset=['distancia_metros_nadar', 'distancia_metros_correr'])
    
    return df_filled.groupBy("correo_electronico", "nombre", "pais").agg(
        sum("distancia_metros_nadar").alias("total_metros_nadados"),
        sum("distancia_metros_correr").alias("total_metros_corridos"),
        (sum("distancia_metros_nadar") + sum("distancia_metros_correr")).alias("total_metros")
    ).orderBy("correo_electronico")

def aggregate_by_activity_and_country(df_unified):
    return df_unified.groupBy("pais").agg(
        sum("distancia_metros_nadar").alias("total_metros_nadados"),
        sum("distancia_metros_correr").alias("total_metros_corridos"),
        (sum("distancia_metros_nadar") + sum("distancia_metros_correr")).alias("total_metros")
    ).orderBy("pais")

def aggregate_by_date(df_unified):
    swim_by_date = df_unified.groupBy("fecha_nadar").agg(
        sum("distancia_metros_nadar").alias("total_metros_nadados")
    ).orderBy("fecha_nadar")

    run_by_date = df_unified.groupBy("fecha_correr").agg(
        sum("distancia_metros_correr").alias("total_metros_corridos")
    ).orderBy("fecha_correr")
    
    return swim_by_date, run_by_date

def calculate_all_aggregations(df_unified):
    return {
        "by_person": aggregate_by_person(df_unified),
        "by_country": aggregate_by_activity_and_country(df_unified),
        "by_date_swim": aggregate_by_date(df_unified)[0],
        "by_date_run": aggregate_by_date(df_unified)[1]
    }