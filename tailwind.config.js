module.exports = {
    darkMode: 'class',
    content: [
        "./resources/**/*.blade.php",
        "./resources/**/*.js",
        "./resources/**/*.vue",
        "./App/View/Components/**/*.php",
    ],
    safelist: [
        {
            pattern: /bg-(gray|yellow|red|green|blue)-(50|100|200|300|400|500|600|700|800|900)/,
            variants: ['hover', 'dark', 'dark:hover'],
        },
        {
            pattern: /text-(gray|yellow|red|green|blue)-(50|100|200|300|400|500|600|700|800|900)/,
            variants: ['hover', 'dark', 'dark:hover'],
        },
        {
            pattern: /border-(gray|yellow|red|green|blue)/,
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
    },
    plugins: [
        require('@tailwindcss/forms'),
    ],
}
