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
    interface Window {
        setThemeFromLocalStorageOrMediaPreference(): void;
        LOCAL_STORAGE_KEY_THEME: string;
        THEME_VALUE_AUTO: string;
        THEME_VALUE_LIGHT: string;
        THEME_VALUE_DARK: string;
    }
}

export { };