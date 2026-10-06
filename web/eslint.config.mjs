// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'
import prettier from 'eslint-config-prettier'

export default withNuxt(prettier).append({ignores: ['app/types/sanity.generated.ts']})
