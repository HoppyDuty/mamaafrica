import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/**/*.blade.php',
        './resources/**/*.jsx',
        './resources/**/*.js',
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', ...defaultTheme.fontFamily.sans],
                serif: ['"Playfair Display"', ...defaultTheme.fontFamily.serif],
            },
            colors: {
                brand: {
                    brown: '#8B4513',
                    gold: '#D4AF37',
                    cream: '#F5F0E8',
                    dark: '#2d1606',
                    light: '#fbf9f6',
                }
            },
            boxShadow: {
                'soft': '0 4px 20px rgba(139, 69, 19, 0.08)',
                'glow': '0 0 20px rgba(212, 175, 55, 0.3)',
            }
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
        require('@tailwindcss/typography'),
    ],
};
