import pika
import psycopg2
import json
import time

def main():
    connection = None
    for i in range(5):
        try:
            connection = pika.BlockingConnection(
                pika.ConnectionParameters(host='rabbitmq')
            )
            print("Successfully connected to RabbitMQ")
            break
        except pika.exceptions.AMQPConnectionError as e:
            print(f"Failed to connect to RabbitMQ, retrying in 5s... ({e})")
            time.sleep(5)
    
    if not connection:
        print("Could not connect to RabbitMQ after multiple retries. Exiting.")
        return

    channel = connection.channel()
    channel.queue_declare(queue='logs', durable=True)

    try:
        db_conn = psycopg2.connect(
            host="timescaledb",
            database="mydb",
            user="user",
            password="password"
        )
        cursor = db_conn.cursor()
        print("Successfully connected to TimescaleDB")
    except psycopg2.OperationalError as e:
        print(f"Could not connect to TimescaleDB. Exiting. ({e})")
        return

    def callback(ch, method, properties, body):
        try:
            message = json.loads(body)
            print(f" [x] Received {message}")
            
            cursor.execute(
                """
                INSERT INTO events (time, project_id, event_type, data)
                VALUES (NOW(), %s, %s, %s);
                """,
                (
                    message.get('projectId'),
                    message.get('eventType'),
                    json.dumps(message.get('data'))
                )
            )
            db_conn.commit()
            ch.basic_ack(delivery_tag=method.delivery_tag)
        except Exception as e:
            print(f"Error processing message: {e}")

    channel.basic_consume(queue='logs', on_message_callback=callback)

    print(' [*] Waiting for messages. To exit press CTRL+C')
    try:
        channel.start_consuming()
    except KeyboardInterrupt:
        print("Shutting down worker.")
        connection.close()
        db_conn.close()

if __name__ == '__main__':
    main()