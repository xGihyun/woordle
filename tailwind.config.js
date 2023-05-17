/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      gridTemplateColumns: {
        'box': 'repeat(6, minmax(0, 4rem))',
      },
      gridTemplateRows: {
        'box': 'repeat(6, minmax(0, 4rem))',
      },
      keyframes: {
        expand: {
          "0": { scale: "1", },
          "50%": { scale: "1.1", },
          "100%": { scale: "1", },
        },
        flip: {
          "0": { transform: "scaleY(1)" },
          "50%": { transform: "scaleY(0)" },
          "100%": { transform: "scaleY(1)" },
        }
      },
      animation: {
        expand: "expand 0.2s ease-in-out",
        flip: "flip 0.5s ease-in-out",
      },
    },
    fontFamily: {
      "fenomen-slab-xcn-black": "fenomen-slab-xcn-black, sans-serif"
    }
  },
  plugins: [],
}

