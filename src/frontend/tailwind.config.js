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
        display: ['Archivo', 'Inter', '-apple-system', 'sans-serif'],
        body: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      maxWidth: { focus: '760px' },
    },
  },
  plugins: [],
};
