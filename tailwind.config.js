module.exports = {
    important: true,
    darkMode: 'class',
    content: [
        "./resources/**/*.blade.php",
        "./resources/**/*.js",
        "./resources/**/*.vue",
        "./app/View/Components/**/*.php",
    ],
    safelist: [
        {
            pattern: /bg-(.*)-(50|100|200|300|400|500|600|700|800|900)/,
            variants: ['hover', 'dark', 'dark:hover'],
        },
        {
            pattern: /text-(.*)-(50|100|200|300|400|500|600|700|800|900)/,
            variants: ['hover', 'dark', 'dark:hover'],
        },
        {
            pattern: /border-(.*)-(50|100|200|300|400|500|600|700|800|900)/,
            variants: ['hover', 'dark', 'dark:hover'],
        },
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#f0fff4',
                    100: '#f0fff4',
                    200: '#c6f6d5',
                    300: '#9ae6b4',
                    400: '#68d391',
                    500: '#48bb78',
                    600: '#38a169',
                    700: '#2f855a',
                    800: '#276749',
                    900: '#22543d',
                }
            }
        },
        fontFamily: {
            sans: ['Inter', 'sans-serif'],
        }
    },
    plugins: [
        require('@tailwindcss/forms'),
        require('@tailwindcss/typography'),
        require('@tailwindcss/aspect-ratio'),
    ],
}
