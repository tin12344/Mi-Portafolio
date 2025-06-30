from pyspark.sql.functions import regexp_extract

def load_data(spark, file_path):
    df = spark.read.text(file_path)
    regex = r'(\S+) - - \[([^\]]+)\] "(\S+) (\S+) (\S+)" (\d{3}) (\d+) "([^"]*)" "([^"]*)" (\d+)'
    df = df.withColumn("ip", regexp_extract("value", regex, 1)) \
           .withColumn("timestamp", regexp_extract("value", regex, 2)) \
           .withColumn("method", regexp_extract("value", regex, 3)) \
           .withColumn("route", regexp_extract("value", regex, 4)) \
           .withColumn("protocol", regexp_extract("value", regex, 5)) \
           .withColumn("status", regexp_extract("value", regex, 6)) \
           .withColumn("size", regexp_extract("value", regex, 7)) \
           .withColumn("referer", regexp_extract("value", regex, 8)) \
           .withColumn("user_agent", regexp_extract("value", regex, 9)) \
           .withColumn("response_time", regexp_extract("value", regex, 10))
    return df