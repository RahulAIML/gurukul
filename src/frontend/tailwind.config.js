/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Backgrounds — near-black, very slightly cool
        carbon: { DEFAULT: '#0A0A0C', 2: '#121216', 3: '#191920', 4: '#22222B' },
        // Accent — vivid athletic red
        ember: { DEFAULT: '#E4262F', lit: '#FF4A52', deep: '#A8161D' },
        // Foreground
        chalk: { DEFAULT: '#FFFFFF', dim: '#9A9AA8', mute: '#6B6B78' },
      },
      fontFamily: {
        // One family across the product. 'Noto Sans Devanagari' sits in the
        // stack because Open Sans has no Devanagari coverage — without it the
        // Hindi locale falls back to a browser default and looks unrelated.
        display: ['"Open Sans"', '"Noto Sans Devanagari"', 'system-ui', 'sans-serif'],
        body: ['"Open Sans"', '"Noto Sans Devanagari"', 'system-ui', 'sans-serif'],
      },
      maxWidth: { focus: '760px' },
    },
  },
  plugins: [],
};
