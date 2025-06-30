from pyspark.sql.functions import col, count, window

def ip_anomalous_behavior(df):
    ip_anomalies = df.groupBy(
        col("ip"),
        window(col("timestamp"), "1 hour")
    ).agg(count("*").alias("request_count"))

    threshold = 100
    anomalous_ips = ip_anomalies.filter(col("request_count") > threshold)

    # Extraer los campos start y end de la columna window
    anomalous_ips = anomalous_ips.withColumn("window_start", col("window.start")) \
                                 .withColumn("window_end", col("window.end")) \
                                 .drop("window")

    return anomalous_ips