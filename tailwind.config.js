/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [`/src/index.html`, "./src/**/*.{js,ts,jsx,tsx}"],
	darkMode: "class", // or 'media' or 'selector'
	theme: {
		extend: {
			fontFamily: {
				jb: ["Jetbrains-Mono", "monospace"],
			},
		},
	},
};
