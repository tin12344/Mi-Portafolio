from pyspark.sql import SparkSession
from data_union.data_union import unit_data
from parcial_aggregations.parcial_aggregations import calculate_all_aggregations
from final_results.final_results import get_top_n_by_country, get_top_n_average_by_country
from data.create_data import get_schemas
from extra_points.extra_points import (
    get_top_n_height_gain,
    get_top_n_strokes_efficiency,
    get_top_n_heart_rate,
    get_top_n_time_efficiency
)
import sys

spark = SparkSession.builder.appName("Tarea 1").getOrCreate()

athletes_path = sys.argv[1]
swim_path = sys.argv[2]
run_path = sys.argv[3]

athletes_schema, swim_schema, run_schema = get_schemas()

df_athletes = spark.read.schema(athletes_schema).csv(athletes_path)
df_swim = spark.read.schema(swim_schema).csv(swim_path)
df_run = spark.read.schema(run_schema).csv(run_path)

df_complet_data = unit_data(df_athletes, df_swim, df_run)

df_complet_data.write.mode("overwrite").csv("unit_data.csv")

df_complet_data.show()

aggregations = calculate_all_aggregations(df_complet_data)

aggregations["by_person"].write.mode("overwrite").csv("aggregation_by_person.csv")
aggregations["by_country"].write.mode("overwrite").csv("aggregation_by_country.csv")
aggregations["by_date_swim"].write.mode("overwrite").csv("aggregation_by_day_swim.csv")
aggregations["by_date_run"].write.mode("overwrite").csv("aggregation_by_day_run.csv")


print("\nTop 3 Atletas por País (Metros Totales)")
top_by_total = get_top_n_by_country(aggregations["by_person"], n=3)
top_by_total.show()
    
print("\nTop 3 Atletas por País (Promedio Diario)")
top_by_average = get_top_n_average_by_country(df_complet_data, n=3)
top_by_average.show()
    
top_by_total.write.mode("overwrite").csv("top_by_total.csv")
top_by_average.write.mode("overwrite").csv("top meters average per day.csv")

print("\nTop 3 Atletas por País (Ganancia de Altura)")
top_height = get_top_n_height_gain(df_complet_data, n=3)
top_height.show()

print("\nTop 3 Atletas por País (Eficiencia de Brazadas)")
top_strokes = get_top_n_strokes_efficiency(df_complet_data, n=3)
top_strokes.show()

print("\nTop 3 Atletas por País (Ritmo Cardíaco Promedio)")
top_heart_rate = get_top_n_heart_rate(df_complet_data, n=3)
top_heart_rate.show()

print("\nTop 3 Atletas por País (Eficiencia de Tiempo)")
top_time = get_top_n_time_efficiency(df_complet_data, n=3)
top_time.show()

top_height.write.mode("overwrite").csv("top_height_gain.csv")
top_strokes.write.mode("overwrite").csv("top_strokes_efficiency.csv")
top_heart_rate.write.mode("overwrite").csv("top_heart_rate.csv")
top_time.write.mode("overwrite").csv("top_time_efficiency.csv")

spark.stop()