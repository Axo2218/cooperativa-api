/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Aquí bautizas tus propios colores corporativos
                coop: {
                    rojo: '#129c59ff',   // Tu rojo institucional
                    fondo: '#111827',  // Tu fondo abisal
                    mar: '#0369A1',    // Un azul personalizado
                }
            }
        },
    },
    plugins: [],
}