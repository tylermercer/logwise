import type { Migration } from "../types";

// Example migration 2; does nothing. Replace with actual migration 2 once needed

export default {
    async migrate() {
        console.log("Migration 2 migrate called")
        return {
            success: true,
            migrationNumber: 2,
            message: "Migration 2 was successful",
            counts: {
                logs: 0,
                forms: 0,
                entries: 0,
            }
        }
    }
} as Migration;