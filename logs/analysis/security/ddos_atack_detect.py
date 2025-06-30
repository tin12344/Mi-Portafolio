from pyspark.sql.functions import col

def ddos_analysis(df):
    threshold = 100
    
    ip_counts = df.groupBy("ip").count()
    
    potential_ddos = ip_counts.filter(col("count") > threshold)
    
    ddos_detected = potential_ddos.count() > 0
    ddos_detected_df = df.sparkSession.createDataFrame([(ddos_detected,)], ["ddos_detected"])
    
    return ip_counts, potential_ddos, ddos_detected_df