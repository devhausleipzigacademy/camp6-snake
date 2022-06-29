/** @type {import('tailwindcss').Config} */
module.exports = {
	mode: "jit",
	content: ["./src/**/*.{js,ts,html}"],
	theme: {
		extend: {
			gridTemplateColumns: {
				21: "repeat(21, minmax(0, 1fr))",
			},
		},
		plugins: [],
	},
};
