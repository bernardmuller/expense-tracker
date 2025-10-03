//  @ts-check

/** @type {import('prettier').Config} */
const config = {
  plugins: [
    'prettier-plugin-tailwindcss',
    'prettier-plugin-classnames',
    'prettier-plugin-merge',
  ],
  semi: false,
  singleQuote: true,
  trailingComma: 'all',
}

export default config
