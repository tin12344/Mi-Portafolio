from pyspark.sql.functions import col, dense_rank, count, sum
from pyspark.sql.window import Window

def get_top_n_by_country(df_aggregated, n=3):
    df_filled = df_aggregated.fillna(0, subset=['total_metros_nadados', 'total_metros_corridos', 'total_metros'])
    window_spec = Window.partitionBy("pais").orderBy(col("total_metros").desc())
    
    return df_filled.withColumn(
        "rank", 
        dense_rank().over(window_spec)
    ).filter(
        col("rank") <= n
    ).orderBy("pais", "rank")

def get_top_n_average_by_country(df_complete, n=3):
    df_filled = df_complete.fillna(0, subset=['distancia_metros_nadar', 'distancia_metros_correr'])
    
    daily_avg = df_filled.groupBy(
        "correo_electronico", 
        "nombre", 
        "pais"
    ).agg(
        sum(col("distancia_metros_nadar")).alias("metros_nadados"),
        sum(col("distancia_metros_correr")).alias("metros_corridos"),
        count("*").alias("dias_actividad")
    ).withColumn(
        "total_metros",
        col("metros_nadados") + col("metros_corridos")
    ).withColumn(
        "promedio_diario",
        col("total_metros") / col("dias_actividad")
    )
    window_spec = Window.partitionBy("pais").orderBy(col("promedio_diario").desc())
    
    return daily_avg.withColumn(
        "rank",
        dense_rank().over(window_spec)
    ).filter(
        col("rank") <= n
    ).select(
        "pais",
        "correo_electronico",
        "nombre",
        "total_metros",
        "dias_actividad",
        "promedio_diario",
        "rank"
    ).orderBy("pais", "rank")