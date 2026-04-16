import sqlite3
import tempfile
import unittest
from pathlib import Path
from unittest import mock

import server


class ServerDatabaseTests(unittest.TestCase):
    def setUp(self):
        self.temp_dir = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp_dir.cleanup)
        self.db_path = Path(self.temp_dir.name) / "calendar.db"

        patcher = mock.patch.object(server, "DB_PATH", self.db_path)
        patcher.start()
        self.addCleanup(patcher.stop)

        server.initialize_database()

    def test_initialize_database_creates_default_profile(self):
        state = server.fetch_app_state()

        self.assertEqual(len(state["profiles"]), 1)
        self.assertEqual(state["profiles"][0]["name"], "You")
        self.assertEqual(state["activeProfileId"], "profile-default")

    def test_creating_profile_and_assignment_persists_to_database(self):
        server.create_profile(
            {
                "id": "profile-1",
                "name": "Alex",
                "color": "#123456",
            }
        )
        state = server.create_assignment(
            {
                "id": "assignment-1",
                "dateKey": "2026-04-09",
                "title": "Math worksheet",
                "course": "Math",
                "notes": "Chapter 4",
                "profileId": "profile-1",
            }
        )

        self.assertEqual(state["activeProfileId"], "profile-1")
        self.assertEqual(state["assignmentsByDate"]["2026-04-09"][0]["profileName"], "Alex")

    def test_deleting_profile_cascades_assignments(self):
        server.create_profile(
            {
                "id": "profile-1",
                "name": "Alex",
                "color": "#123456",
            }
        )
        server.create_assignment(
            {
                "id": "assignment-1",
                "dateKey": "2026-04-09",
                "title": "Math worksheet",
                "course": "Math",
                "notes": "Chapter 4",
                "profileId": "profile-1",
            }
        )

        state = server.delete_profile("profile-1")

        self.assertEqual(state["assignmentsByDate"], {})
        self.assertEqual(state["profiles"][0]["id"], "profile-default")

    def test_cannot_delete_last_profile(self):
        with self.assertRaises(ValueError):
            server.delete_profile("profile-default")


if __name__ == "__main__":
    unittest.main()
