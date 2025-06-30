from pyspark.sql import SparkSession
from save_outputs.save_outputs import save_outputs
from data_treatment.data_treatment import load_data
from analysis.performance.enpoint_response import analyze_endpoint_response
from analysis.performance.traffic import analyze_traffic_data
from analysis.security.ddos_atack_detect import ddos_analysis
from analysis.security.error_codes import error_code
from analysis.security.ip_anomalous_behavior import ip_anomalous_behavior

spark = SparkSession.builder.appName("LogAnalysis").getOrCreate()

df = load_data(spark, "data/logfiles.log")

df.show()

# Al usar el comando docker run -p 8888:8888 -v "C:\Users\Agustin Vargas\Desktop\practica pyspark\bigdataclass:/workspace" -i -t bigdata /bin/bash
# el cual es para correr el docker este da acceso a la carpeta de bigdataclass y da acceso 
# donde se encuentra el contenedor y puede crear carpetas y archivos dentro de este para verlo en local
df_endpoint_status, df_avg_response_time, df_size_stats = analyze_endpoint_response(df)
save_outputs(df_endpoint_status, "endpoint_status_output")
save_outputs(df_avg_response_time, "avg_response_time_output")
save_outputs(df_size_stats, "size_stats_output")

df_traffic_by_hour, df_traffic_by_ip = analyze_traffic_data(df)
save_outputs(df_traffic_by_hour, "traffic_by_hour_output")
save_outputs(df_traffic_by_ip, "traffic_by_ip_output")

df_toal_requests, df_potencial_ddos_ips, df_ddos_detected = ddos_analysis(df)
save_outputs(df_toal_requests, "total_requests_output")
save_outputs(df_potencial_ddos_ips, "potential_ddos_ips_output")
save_outputs(df_ddos_detected, "ddos_detected_output")

df_error_codes = error_code(df)
save_outputs(df_error_codes, "error_codes_output")

df_ip_anomalous_behavior = ip_anomalous_behavior(df)
save_outputs(df_ip_anomalous_behavior, "ip_anomalous_behavior_output")