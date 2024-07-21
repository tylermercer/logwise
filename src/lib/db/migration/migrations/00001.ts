import type { Migration } from "../types";

// Convert named forms to logs and remove names

export default {
    async migrate() {

        //TODO: implement

        return {
            success: true,
            migrationNumber: 1,
            message: "Migration 1 was successful",
            counts: {
                logs: 0,
                forms: 0,
                entries: 0,
            }
        }
    }
} as Migration;