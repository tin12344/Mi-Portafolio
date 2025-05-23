from pyspark.sql import functions as F
from math import radians, cos, sin, asin, sqrt
from pyspark.sql.types import DoubleType

@F.udf(returnType=DoubleType())
def calculate_distance(lat1, lon1, lat2, lon2):
    if lat1 is None or lon1 is None or lat2 is None or lon2 is None:
        return None
    
    lat1, lon1, lat2, lon2 = map(radians, [float(lat1), float(lon1), float(lat2), float(lon2)])
    
    dlon = lon2 - lon1
    dlat = lat2 - lat1
    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
    c = 2 * asin(sqrt(a))
    r = 6371
    return c * r

def extract_coordinates(vehicles_df):
    vehicles_df = vehicles_df.withColumn(
        "coords_array",
        F.split(F.regexp_replace(F.col("Vehicle Location"), "POINT \\(|\\)", ""), " ")
    )
    vehicles_df = vehicles_df.withColumn(
        "Longitude", 
        F.col("coords_array").getItem(0).cast("double")
    ).withColumn(
        "Latitude", 
        F.col("coords_array").getItem(1).cast("double")
    )
    
    return vehicles_df

def process_and_join_data(stations_df, vehicles_df):
    stations_df = stations_df.withColumn("ZIP", F.trim(F.col("ZIP")))
    stations_df = stations_df.withColumn("Latitude", F.col("Latitude").cast("double"))
    stations_df = stations_df.withColumn("Longitude", F.col("Longitude").cast("double"))
    
    if "Vehicle Location" in vehicles_df.columns and "Latitude" not in vehicles_df.columns:
        vehicles_df = extract_coordinates(vehicles_df)
    
    vehicles_df = vehicles_df.withColumn("Postal Code", F.trim(F.col("Postal Code")))
    
    vehicles_grouped = vehicles_df.groupBy(
        "Postal Code",
        "Make",
    ).agg(
        F.count("*").alias("vehicle_count"),
        F.avg("Latitude").alias("avg_vehicle_latitude"),
        F.avg("Longitude").alias("avg_vehicle_longitude"),
        F.avg("Electric Range").alias("avg_electric_range"),
    )
    
    stations_consolidated = stations_df.groupBy(
        "ZIP",
    ).agg(
        F.count("*").alias("station_count"),
        F.sum("EV Level2 EVSE Num").alias("level2_chargers"),
        F.sum("EV DC Fast Count").alias("dc_fast_chargers"),
        F.avg("Latitude").alias("station_latitude"),
        F.avg("Longitude").alias("station_longitude")
    )
    
    final_data = vehicles_grouped.join(
        stations_consolidated,
        vehicles_grouped["Postal Code"] == stations_consolidated["ZIP"],
        "left"
    ).fillna({
        "station_count": 0,
        "level2_chargers": 0,
        "dc_fast_chargers": 0,
    }).withColumn(
        "avg_distance_km",
        F.when(
            F.col("station_latitude").isNotNull(),
            calculate_distance(
                F.col("avg_vehicle_latitude"), 
                F.col("avg_vehicle_longitude"),
                F.col("station_latitude"), 
                F.col("station_longitude")
            )
        ).otherwise(float(0))
    )
    
    return final_data

def save_to_db(df, table_name):
    df.write \
        .format("jdbc") \
        .option("url", "jdbc:postgresql://host.docker.internal:5433/postgres") \
        .option("dbtable", table_name) \
        .option("user", "postgres") \
        .option("password", "testPassword") \
        .mode("overwrite") \
        .save()