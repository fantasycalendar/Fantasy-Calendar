import colors from 'tailwindcss/colors';

export default {
    darkMode: 'class',
    content: [
        "./resources/**/*.blade.php",
        "./app/Services/Discord/resources/**/*.blade.php",
        "./resources/**/*.js",
        "./resources/**/*.vue",
        "./app/View/Components/**/*.php",
        './vendor/filament/**/*.blade.php',
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
                },
                danger: colors.rose,
                success: colors.green,
                warning: colors.yellow,
            }
        },
        fontFamily: {
            sans: ['Inter', 'sans-serif'],
        }
    },
    plugins: [
        '@tailwindcss/forms',
        '@tailwindcss/typography',
        '@tailwindcss/aspect-ratio',
    ],
}
