# Migrations

Example migration:

```ts
import type { Migration } from "../types";

// Describe what it does

export default {
    async migrate() {

        //Do the thing

        return {
            success: true,
            migrationNumber: 1,
            message: "Any necessary information needed to describe the result",
            counts: { //How many of each entity were migrated
                logs: 0,
                forms: 0,
                entries: 0,
            }
        }
    }
} as Migration;
```
