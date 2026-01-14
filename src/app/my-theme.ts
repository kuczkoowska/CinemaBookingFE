import {definePreset} from '@primeng/themes';
import Aura from '@primeng/themes/aura';

export const myCustomPreset = definePreset(Aura, {
  primitive: {
    red: {
      50: '#ffe5e9',
      100: '#ffccd3',
      200: '#ff99a7',
      300: '#ff667a',
      400: '#ff334e',
      500: '#EF233C',
      600: '#D90429',
      700: '#b20322',
      800: '#8c021b',
      900: '#660213',
      950: '#3f010c'
    }
  },
  semantic: {
    primary: {
      50: '{red.50}',
      100: '{red.100}',
      200: '{red.200}',
      300: '{red.300}',
      400: '{red.400}',
      500: '{red.500}',
      600: '{red.600}',
      700: '{red.700}',
      800: '{red.800}',
      900: '{red.900}',
      950: '{red.950}'
    },
    colorScheme: {
      light: {
        primary: {
          color: '{red.500}',
          contrastColor: '#ffffff',
          hoverColor: '{red.600}',
          activeColor: '{red.700}'
        },
        surface: {
          0: '#ffffff',
          50: '{slate.50}',
          100: '{slate.100}',
          200: '{slate.200}',
          300: '{slate.300}',
          400: '{slate.400}',
          500: '{slate.500}',
          600: '{slate.600}',
          700: '{slate.700}',
          800: '{slate.800}',
          900: '{slate.900}',
          950: '{slate.950}'
        }
      },
      dark: {
        primary: {
          color: '{red.500}',
          contrastColor: '#ffffff',
          hoverColor: '{red.600}',
          activeColor: '{red.700}'
        }
      }
    }
  }
});
