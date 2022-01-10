module.exports = {
    content: ['./pages/**/*.{js,ts,jsx,tsx}', './lib/component/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {},
    },
    variants: {
        extend: {},
    },
    plugins: [
        require('@tailwindcss/line-clamp'),
        // ...
    ],
};
