from pyspark.sql.functions import regexp_extract

def analyze_traffic_data(df):
    # Extraer la hora del timestamp solo para el análisis
    traffic_by_hour = df.withColumn(
        "hour",
        regexp_extract("timestamp", r":(\d{2}):\d{2}:\d{2}", 1)
    ).groupBy("hour").count()
    traffic_by_ip = df.groupBy("ip").count()
    return traffic_by_hour, traffic_by_ip