from pyspark.sql.functions import col

def error_code(df):
    error_codes_df = df.groupBy("status").count().filter(col("status").startswith("4") | col("status").startswith("5"))
    
    return error_codes_df