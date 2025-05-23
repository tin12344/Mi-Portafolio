from pyspark.sql import SparkSession
from data.create_data import (
    generate_athletes_data,
    generate_swimming_data,
    generate_running_data,
    get_schemas
)

spark = SparkSession.builder.appName("Generate Data").getOrCreate()

athletes_schema, swim_schema, run_schema = get_schemas()

df_athletes = spark.createDataFrame(generate_athletes_data(), schema=athletes_schema)
df_swim = spark.createDataFrame(generate_swimming_data(df_athletes), schema=swim_schema)
df_run = spark.createDataFrame(generate_running_data(df_athletes), schema=run_schema)

df_athletes.write.mode("overwrite").option("header", "true").csv("atleta.csv")
df_swim.write.mode("overwrite").option("header", "true").csv("nadar.csv")
df_run.write.mode("overwrite").option("header", "true").csv("correr.csv")

df_athletes.show()
df_swim.show()
df_run.show()

spark.stop()