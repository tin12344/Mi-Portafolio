from pyspark.sql.functions import col, sum, avg, round, dense_rank
from pyspark.sql.window import Window

def get_top_n_height_gain(df_complete, n=3):
    height_gain = df_complete.groupBy("correo_electronico", "nombre", "pais").agg(
        sum("ganancia_altura_metros").alias("total_altura_ganada")
    )
    
    window_spec = Window.partitionBy("pais").orderBy(col("total_altura_ganada").desc())
    return height_gain.withColumn("rank", dense_rank().over(window_spec)).filter(col("rank") <= n).orderBy("pais", "rank")

def get_top_n_strokes_efficiency(df_complete, n=3):
    strokes_efficiency = df_complete.groupBy("correo_electronico", "nombre", "pais").agg(
        sum("total_brazadas").alias("total_brazadas"),
        sum("distancia_metros_nadar").alias("total_metros")
    ).withColumn(
        "brazadas_por_100m",
        round((col("total_brazadas") * 100) / col("total_metros"), 2)
    )
    
    window_spec = Window.partitionBy("pais").orderBy(col("brazadas_por_100m").asc())
    return strokes_efficiency.withColumn("rank", dense_rank().over(window_spec)).filter(col("rank") <= n).orderBy("pais", "rank")

def get_top_n_heart_rate(df_complete, n=3):
    heart_rate = df_complete.groupBy("correo_electronico", "nombre", "pais").agg(
        round(avg("ritmo_cardiaco_nadar"), 2).alias("promedio_rc_nadar"),
        round(avg("ritmo_cardiaco_correr"), 2).alias("promedio_rc_correr"),
        round((avg("ritmo_cardiaco_nadar") + avg("ritmo_cardiaco_correr"))/2, 2).alias("promedio_rc_total")
    )
    
    window_spec = Window.partitionBy("pais").orderBy(col("promedio_rc_total").desc())
    return heart_rate.withColumn("rank", dense_rank().over(window_spec)).filter(col("rank") <= n).orderBy("pais", "rank")

def get_top_n_time_efficiency(df_complete, n=3):
    time_efficiency = df_complete.groupBy("correo_electronico", "nombre", "pais").agg(
        sum("minutos_nadar").alias("total_minutos_nadar"),
        sum("minutos_correr").alias("total_minutos_correr"),
        sum("distancia_metros_nadar").alias("total_metros_nadar"),
        sum("distancia_metros_correr").alias("total_metros_correr")
    ).withColumn(
        "minutos_por_100m",
        round(
            (col("total_minutos_nadar") + col("total_minutos_correr")) * 100 /
            (col("total_metros_nadar") + col("total_metros_correr")),
            2
        )
    )
    
    window_spec = Window.partitionBy("pais").orderBy(col("minutos_por_100m").asc())
    return time_efficiency.withColumn("rank", dense_rank().over(window_spec)).filter(col("rank") <= n).orderBy("pais", "rank")
