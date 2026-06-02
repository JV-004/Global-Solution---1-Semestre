from telemetry_generator import generate_telemetry

def collect_sensor_data():

    return generate_telemetry()


if __name__ == "__main__":

    data = collect_sensor_data()

    print(data)
