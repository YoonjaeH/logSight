import os
import psycopg2
import requests
import json
from celery import Celery
from celery.schedules import crontab

# Configure Celery
# The broker is RabbitMQ, where tasks are sent.
# The backend is Redis, where task results/state are stored.
app = Celery('alerter',
             broker='amqp://guest:guest@rabbitmq:5672//',
             backend='redis://redis:6379/0')

# Define the schedule for our task
app.conf.beat_schedule = {
    'check-alerts-every-minute': {
        'task': 'alerter.check_alerts',
        'schedule': 60.0,  # Run every 60 seconds
    },
}
app.conf.timezone = 'UTC'

def get_db_connection():
    """Establishes connection to the TimescaleDB database."""
    return psycopg2.connect(
        host="timescaledb",
        database="mydb",
        user="user",
        password="password"
    )

def send_slack_alert(webhook_url, message):
    """Sends a formatted message to a Slack webhook."""
    payload = {'text': message}
    try:
        response = requests.post(webhook_url, data=json.dumps(payload), headers={'Content-Type': 'application/json'})
        response.raise_for_status()
        print(f"Successfully sent Slack alert.")
    except requests.exceptions.RequestException as e:
        print(f"Error sending Slack alert: {e}")

@app.task
def check_alerts():
    """The main task that checks all alert rules."""
    print("Running alert checks...")
    db_conn = get_db_connection()
    cursor = db_conn.cursor()

    try:
        # 1. Fetch all active alert rules from the database
        cursor.execute("SELECT project_id, alert_name, event_type, threshold, interval_minutes, slack_webhook_url FROM alerts")
        alert_rules = cursor.fetchall()

        # 2. For each rule, check the events table
        for rule in alert_rules:
            project_id, alert_name, event_type, threshold, interval, webhook_url = rule
            
            # Construct the query to count recent events
            query = """
                SELECT COUNT(*) FROM events
                WHERE project_id = %s
                  AND event_type = %s
                  AND time > NOW() - INTERVAL '%s minutes';
            """
            cursor.execute(query, (project_id, event_type, interval))
            count = cursor.fetchone()[0]
            
            print(f"Checking rule '{alert_name}': Found {count} events (Threshold: {threshold})")

            # 3. If threshold is exceeded, send an alert
            if count > threshold:
                message = f"🚨 Alert Triggered for '{alert_name}'!\nFound *{count}* '{event_type}' events in the last {interval} minutes (Threshold was {threshold})."
                send_slack_alert(webhook_url, message)

    except psycopg2.Error as e:
        print(f"Database error: {e}")
    finally:
        cursor.close()
        db_conn.close()

    return f"Checked {len(alert_rules)} alert rules."