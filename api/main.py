from fastapi import FastAPI
from datetime import datetime
import psycopg2

app = FastAPI()

# Database connection
def get_db_connection():
    return psycopg2.connect(...)

@app.get("/api/projects/{project_id}/events")
def get_events(project_id: str, start_time: datetime, end_time: datetime):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        """
        SELECT time, event_type, data FROM events
        WHERE project_id = %s AND time BETWEEN %s AND %s
        ORDER BY time DESC
        LIMIT 100;
        """,
        (project_id, start_time, end_time)
    )
    events = cursor.fetchall()
    # ... format and return events ...
    return {"events": events}

@app.get("/api/projects/{project_id}/stats/over-time")
def get_stats(project_id: str, interval: str = '1 hour'):
    # Use TimescaleDB's time_bucket function for amazing performance!
    query = """
        SELECT
            time_bucket(%s, time) AS bucket,
            event_type,
            COUNT(*) as count
        FROM events
        WHERE project_id = %s
        GROUP BY bucket, event_type
        ORDER BY bucket DESC;
    """
    # ... execute query and return results ...