def unit_data(df_athletes, df_swim, df_run):
    df_with_swim = df_athletes.join(
        df_swim,
        df_athletes['correo_electronico'] == df_swim['correo_electronico'],
        "inner"
    ).select(
        df_athletes['correo_electronico'],
        df_athletes['nombre'],
        df_athletes['pais'],
        df_swim['ritmo_cardiaco'].alias('ritmo_cardiaco_nadar'),
        df_swim['distancia_metros'].alias('distancia_metros_nadar'),
        df_swim['total_brazadas'],
        df_swim['minutos_actividad'].alias('minutos_nadar'),
        df_swim['fecha'].alias('fecha_nadar')
    )
    
    df_complete = df_with_swim.join(
        df_run,
        (df_with_swim['correo_electronico'] == df_run['correo_electronico']),
        "inner"
    ).select(
        df_with_swim['correo_electronico'],
        df_with_swim['nombre'],
        df_with_swim['pais'],
        df_with_swim['ritmo_cardiaco_nadar'],
        df_with_swim['distancia_metros_nadar'],
        df_with_swim['total_brazadas'],
        df_with_swim['minutos_nadar'],
        df_with_swim['fecha_nadar'],
        df_run['ritmo_cardiaco'].alias('ritmo_cardiaco_correr'),
        df_run['distancia_metros'].alias('distancia_metros_correr'),
        df_run['ganancia_altura_metros'],
        df_run['minutos_actividad'].alias('minutos_correr'),
        df_run['fecha'].alias('fecha_correr')
    )

    return df_complete