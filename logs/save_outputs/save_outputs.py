def save_outputs(df, output_path):
    df.write.mode("overwrite").option("header", "true").csv("/workspace/logs/outputs/" + output_path)
