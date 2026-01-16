import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                // Warm Beige & Terracotta Color Palette
                beige: {
                    50: '#FDFAF5',   // Very Light Sand
                    100: '#FFF8F0',  // Creamy Ivory
                    200: '#F8F1E9',  // Warm Beige Light
                    300: '#F5EDE4',  // Warm Beige
                    400: '#E8DED1',  // Mid Beige
                    500: '#D5C4B3',  // Deep Beige
                },
                terracotta: {
                    300: '#E5B299',  // Light Terracotta
                    400: '#D89F85',  // Soft Terracotta
                    500: '#C68A6A',  // Terracotta
                    600: '#B8775A',  // Medium Terracotta
                    700: '#A86F5C',  // Muted Clay/Brick
                },
                mocha: {
                    400: '#8A766A',  // Warm Taupe Gray-Brown
                    500: '#7A5A47',  // Medium Coffee Brown
                    600: '#6B4C3A',  // Mocha
                    700: '#5C3E2E',  // Deep Mocha
                },
                espresso: {
                    700: '#5C3A28',  // Deep Chocolate
                    800: '#4A2F1E',  // Espresso
                    900: '#3A2518',  // Very Dark Espresso
                },
            },
        },
    },

    plugins: [forms],
    darkMode: 'class'
};
