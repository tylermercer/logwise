// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
        interface Platform {
            env: {
                DB: D1Database,
                RATE_LIMITER: {
                    limit({ key: any }): Promise<{ success: boolean }>
                }
            }
            cf: CfProperties
            ctx: ExecutionContext
        }
    }
}

export {};