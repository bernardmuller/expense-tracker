import { withThemeByClassName } from '@storybook/addon-themes'
import { INITIAL_VIEWPORTS } from 'storybook/viewport'
import type { Preview } from '@storybook/react-vite'
import '../src/styles.css'

const preview: Preview = {
  parameters: {
    viewport: {
      options: INITIAL_VIEWPORTS,
    },
    darkMode: {
      classTarget: 'html',
      darkClass: 'dark',
      lightClass: 'light',
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  initialGlobals: {
    viewport: { value: 'iPhone 13', isRotated: false },
  },
  decorators: [
    withThemeByClassName({
      themes: {
        light: 'light',
        dark: 'dark',
      },
      defaultTheme: 'light',
    }),
  ],
}

export default preview
