"""Создание и получение бронирований стола в ретро-клубе."""
import json
import os
import psycopg2


def handler(event: dict, context) -> dict:
    cors = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    }

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": cors, "body": ""}

    conn = psycopg2.connect(os.environ["DATABASE_URL"])
    cur = conn.cursor()

    method = event.get("httpMethod", "GET")

    # POST — создать бронь
    if method == "POST":
        body = json.loads(event.get("body") or "{}")
        name = body.get("name", "").strip()
        phone = body.get("phone", "").strip()
        date = body.get("date", "").strip()
        time = body.get("time", "").strip()
        guests = body.get("guests", "2").strip()

        if not all([name, phone, date, time]):
            cur.close()
            conn.close()
            return {
                "statusCode": 400,
                "headers": cors,
                "body": json.dumps({"error": "Заполните все поля"}, ensure_ascii=False),
            }

        cur.execute(
            "INSERT INTO bookings (name, phone, date, time, guests) VALUES (%s, %s, %s, %s, %s) RETURNING id",
            (name, phone, date, time, guests),
        )
        booking_id = cur.fetchone()[0]
        conn.commit()
        cur.close()
        conn.close()

        return {
            "statusCode": 200,
            "headers": cors,
            "body": json.dumps({"ok": True, "id": booking_id}, ensure_ascii=False),
        }

    # GET — список броней (только для админа)
    if method == "GET":
        params = event.get("queryStringParameters") or {}
        password = params.get("password", "")

        if password != "1968":
            cur.close()
            conn.close()
            return {
                "statusCode": 403,
                "headers": cors,
                "body": json.dumps({"error": "Доступ запрещён"}, ensure_ascii=False),
            }

        cur.execute(
            "SELECT id, name, phone, date, time, guests, status, created_at FROM bookings ORDER BY created_at DESC"
        )
        rows = cur.fetchall()
        cur.close()
        conn.close()

        bookings = [
            {
                "id": r[0],
                "name": r[1],
                "phone": r[2],
                "date": str(r[3]),
                "time": r[4],
                "guests": r[5],
                "status": r[6],
                "created_at": str(r[7]),
            }
            for r in rows
        ]

        return {
            "statusCode": 200,
            "headers": cors,
            "body": json.dumps({"bookings": bookings}, ensure_ascii=False),
        }

    # PUT — обновить статус брони
    if method == "PUT":
        params = event.get("queryStringParameters") or {}
        password = params.get("password", "")

        if password != "1968":
            cur.close()
            conn.close()
            return {
                "statusCode": 403,
                "headers": cors,
                "body": json.dumps({"error": "Доступ запрещён"}, ensure_ascii=False),
            }

        body = json.loads(event.get("body") or "{}")
        booking_id = body.get("id")
        status = body.get("status")

        cur.execute("UPDATE bookings SET status = %s WHERE id = %s", (status, booking_id))
        conn.commit()
        cur.close()
        conn.close()

        return {
            "statusCode": 200,
            "headers": cors,
            "body": json.dumps({"ok": True}, ensure_ascii=False),
        }

    cur.close()
    conn.close()
    return {"statusCode": 405, "headers": cors, "body": "Method not allowed"}
