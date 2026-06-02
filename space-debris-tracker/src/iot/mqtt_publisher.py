import json
import time
import paho.mqtt.client as mqtt

from telemetry_generator import generate_telemetry


BROKER = "broker.hivemq.com"
TOPIC = "space_debris_tracker/telemetry"

client = mqtt.Client()

client.connect(
    BROKER,
    1883,
    60
)

while True:

    payload = generate_telemetry()

    client.publish(
        TOPIC,
        json.dumps(payload)
    )

    print(
        "Publicado:",
        payload
    )

    time.sleep(5)
