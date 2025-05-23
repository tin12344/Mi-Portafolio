from pyspark.sql import SparkSession
from read_data.reader import read_persona_data
from total_trips.trips_counter import count_trips_by_postal_code
from total_incomes.income_calculator import calculate_total_income
from metrics.metrics_calculator import calculate_metrics
import sys

spark = SparkSession.builder.appName("Tarea 2").getOrCreate()


file_pattern = sys.argv[1]

df_final = read_persona_data(spark, file_pattern)
df_final.show(truncate=False)

df_final.write.mode("overwrite").option("header", "true").csv("united_data.csv")

df_total_viajes = count_trips_by_postal_code(df_final)
df_total_viajes.write.mode("overwrite").option("header", "true").csv("results/total_viajes.csv")

df_total_ingresos = calculate_total_income(df_final)
df_total_ingresos.write.mode("overwrite").option("header", "true").csv("results/total_ingresos.csv")

df_metricas = calculate_metrics(df_final)
df_metricas.write.mode("overwrite").option("header", "true").csv("results/metricas.csv")

spark.stop()