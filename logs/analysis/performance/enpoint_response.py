def analyze_endpoint_response(df):
    status_count = df.groupBy("status").count()
    avg_response_time = df.agg({"response_time": "avg"})
    size_stats = df.select("size").describe()
    return status_count, avg_response_time, size_stats