import 'unplugin-icons/types/svelte'

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
    namespace App {
        interface Platform {
            env: {
                DB: D1Database
            }
            cf: CfProperties
            ctx: ExecutionContext
        }
        interface PageState {
            showMenu: boolean
        }
    }
}

export { };