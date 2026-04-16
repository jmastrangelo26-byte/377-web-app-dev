from __future__ import annotations

import json
import os
import sqlite3
from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, urlparse


ROOT = Path(__file__).resolve().parent
DB_PATH = ROOT / "data" / "homework_calendar.db"
DEFAULT_PROFILE_COLORS = ["#d06f9a", "#f29db8", "#b971ff", "#7ea7f7", "#64b899", "#f2b66d"]


def create_marker(name: str) -> str:
    parts = [part[:1].upper() for part in name.strip().split()[:2] if part]
    return "".join(parts) or "P"


def get_connection() -> sqlite3.Connection:
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    connection.execute("PRAGMA foreign_keys = ON")
    return connection


def initialize_database() -> None:
    with get_connection() as connection:
      connection.executescript(
          """
          CREATE TABLE IF NOT EXISTS profiles (
              id TEXT PRIMARY KEY,
              name TEXT NOT NULL,
              color TEXT NOT NULL,
              marker TEXT NOT NULL,
              created_at TEXT DEFAULT CURRENT_TIMESTAMP
          );

          CREATE TABLE IF NOT EXISTS assignments (
              id TEXT PRIMARY KEY,
              date_key TEXT NOT NULL,
              title TEXT NOT NULL,
              course TEXT NOT NULL DEFAULT '',
              notes TEXT NOT NULL DEFAULT '',
              profile_id TEXT NOT NULL,
              created_at TEXT DEFAULT CURRENT_TIMESTAMP,
              FOREIGN KEY (profile_id) REFERENCES profiles (id) ON DELETE CASCADE
          );

          CREATE TABLE IF NOT EXISTS app_settings (
              key TEXT PRIMARY KEY,
              value TEXT NOT NULL
          );
          """
      )

      profile_count = connection.execute("SELECT COUNT(*) AS count FROM profiles").fetchone()["count"]
      if profile_count == 0:
          connection.execute(
              """
              INSERT INTO profiles (id, name, color, marker)
              VALUES (?, ?, ?, ?)
              """,
              ("profile-default", "You", DEFAULT_PROFILE_COLORS[0], "Y"),
          )
          connection.execute(
              """
              INSERT OR REPLACE INTO app_settings (key, value)
              VALUES ('active_profile_id', 'profile-default')
              """
          )


def fetch_app_state() -> dict:
    with get_connection() as connection:
        profiles = [
            dict(row)
            for row in connection.execute(
                """
                SELECT id, name, color, marker
                FROM profiles
                ORDER BY created_at, name
                """
            ).fetchall()
        ]
        assignments = connection.execute(
            """
            SELECT
                assignments.id,
                assignments.date_key,
                assignments.title,
                assignments.course,
                assignments.notes,
                profiles.id AS profile_id,
                profiles.name AS profile_name,
                profiles.color AS profile_color,
                profiles.marker AS profile_marker
            FROM assignments
            JOIN profiles ON profiles.id = assignments.profile_id
            ORDER BY assignments.date_key, assignments.created_at, assignments.title
            """
        ).fetchall()
        active_profile = connection.execute(
            """
            SELECT value FROM app_settings WHERE key = 'active_profile_id'
            """
        ).fetchone()

    assignments_by_date: dict[str, list[dict]] = {}
    for row in assignments:
        assignment = {
            "id": row["id"],
            "title": row["title"],
            "course": row["course"],
            "notes": row["notes"],
            "profileId": row["profile_id"],
            "profileName": row["profile_name"],
            "profileColor": row["profile_color"],
            "profileMarker": row["profile_marker"],
        }
        assignments_by_date.setdefault(row["date_key"], []).append(assignment)

    active_profile_id = active_profile["value"] if active_profile else (profiles[0]["id"] if profiles else None)

    return {
        "profiles": [
            {
                "id": profile["id"],
                "name": profile["name"],
                "color": profile["color"],
                "marker": profile["marker"],
            }
            for profile in profiles
        ],
        "activeProfileId": active_profile_id,
        "assignmentsByDate": assignments_by_date,
    }


def set_active_profile(profile_id: str) -> None:
    with get_connection() as connection:
        connection.execute(
            """
            INSERT OR REPLACE INTO app_settings (key, value)
            VALUES ('active_profile_id', ?)
            """,
            (profile_id,),
        )


def create_profile(payload: dict) -> dict:
    profile_id = payload["id"]
    name = payload["name"].strip()
    color = payload["color"]
    marker = create_marker(name)

    with get_connection() as connection:
        connection.execute(
            """
            INSERT INTO profiles (id, name, color, marker)
            VALUES (?, ?, ?, ?)
            """,
            (profile_id, name, color, marker),
        )
        connection.execute(
            """
            INSERT OR REPLACE INTO app_settings (key, value)
            VALUES ('active_profile_id', ?)
            """,
            (profile_id,),
        )

    return fetch_app_state()


def create_assignment(payload: dict) -> dict:
    with get_connection() as connection:
        connection.execute(
            """
            INSERT INTO assignments (id, date_key, title, course, notes, profile_id)
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (
                payload["id"],
                payload["dateKey"],
                payload["title"].strip(),
                payload.get("course", "").strip(),
                payload.get("notes", "").strip(),
                payload["profileId"],
            ),
        )

    return fetch_app_state()


def delete_assignment(assignment_id: str) -> dict:
    with get_connection() as connection:
        connection.execute("DELETE FROM assignments WHERE id = ?", (assignment_id,))
    return fetch_app_state()


def clear_assignments_for_date(date_key: str) -> dict:
    with get_connection() as connection:
        connection.execute("DELETE FROM assignments WHERE date_key = ?", (date_key,))
    return fetch_app_state()


def delete_profile(profile_id: str) -> dict:
    with get_connection() as connection:
        profile_count = connection.execute("SELECT COUNT(*) AS count FROM profiles").fetchone()["count"]
        if profile_count <= 1:
            raise ValueError("Cannot remove the last profile.")

        connection.execute("DELETE FROM profiles WHERE id = ?", (profile_id,))
        active_profile = connection.execute(
            "SELECT value FROM app_settings WHERE key = 'active_profile_id'"
        ).fetchone()
        if active_profile and active_profile["value"] == profile_id:
            next_profile = connection.execute(
                "SELECT id FROM profiles ORDER BY created_at, name LIMIT 1"
            ).fetchone()
            if next_profile:
                connection.execute(
                    """
                    INSERT OR REPLACE INTO app_settings (key, value)
                    VALUES ('active_profile_id', ?)
                    """,
                    (next_profile["id"],),
                )

    return fetch_app_state()


class AppHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def do_GET(self) -> None:
        parsed = urlparse(self.path)
        if parsed.path == "/api/state":
            self.respond_json(fetch_app_state())
            return

        super().do_GET()

    def do_POST(self) -> None:
        parsed = urlparse(self.path)
        payload = self.read_json_body()

        try:
            if parsed.path == "/api/profiles":
                self.respond_json(create_profile(payload), HTTPStatus.CREATED)
                return

            if parsed.path == "/api/profiles/active":
                set_active_profile(payload["profileId"])
                self.respond_json(fetch_app_state())
                return

            if parsed.path == "/api/assignments":
                self.respond_json(create_assignment(payload), HTTPStatus.CREATED)
                return
        except (KeyError, sqlite3.IntegrityError, ValueError) as error:
            self.respond_json({"error": str(error)}, HTTPStatus.BAD_REQUEST)
            return

        self.respond_json({"error": "Not found"}, HTTPStatus.NOT_FOUND)

    def do_DELETE(self) -> None:
        parsed = urlparse(self.path)
        query = parse_qs(parsed.query)

        try:
            if parsed.path.startswith("/api/profiles/"):
                profile_id = parsed.path.removeprefix("/api/profiles/")
                self.respond_json(delete_profile(profile_id))
                return

            if parsed.path.startswith("/api/assignments/"):
                assignment_id = parsed.path.removeprefix("/api/assignments/")
                self.respond_json(delete_assignment(assignment_id))
                return

            if parsed.path == "/api/assignments":
                date_key = query.get("dateKey", [None])[0]
                if not date_key:
                    raise ValueError("Missing dateKey query parameter.")
                self.respond_json(clear_assignments_for_date(date_key))
                return
        except ValueError as error:
            self.respond_json({"error": str(error)}, HTTPStatus.BAD_REQUEST)
            return

        self.respond_json({"error": "Not found"}, HTTPStatus.NOT_FOUND)

    def read_json_body(self) -> dict:
        length = int(self.headers.get("Content-Length", "0"))
        raw_body = self.rfile.read(length).decode("utf-8") if length > 0 else "{}"
        return json.loads(raw_body or "{}")

    def respond_json(self, payload: dict, status: HTTPStatus = HTTPStatus.OK) -> None:
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)


def run() -> None:
    initialize_database()
    host = os.environ.get("HOMEWORK_CALENDAR_HOST", "127.0.0.1")
    port = int(os.environ.get("HOMEWORK_CALENDAR_PORT", "8000"))
    server = ThreadingHTTPServer((host, port), AppHandler)
    print(f"Serving homework calendar on http://{host}:{port}")
    server.serve_forever()


if __name__ == "__main__":
    run()
