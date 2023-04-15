import { createVuetify, ThemeDefinition } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'

const customLightTheme: ThemeDefinition = {
    dark: false,
    colors: {
        primary: '#2962FF',
    }
}

export default defineNuxtPlugin((nuxtApp) => {
    const vuetify = createVuetify({
        theme: {
            defaultTheme: 'customLightTheme',
            themes: {
                customLightTheme,
            }
        },
        icons: {
            defaultSet: 'mdi',
            aliases,
            sets: {
                mdi,
            },
        },
        components,
        directives,
    })

    nuxtApp.vueApp.use(vuetify)
})
