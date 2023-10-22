/** @type {import("prettier").Config} */
const config = {
  plugins: ["@ianvs/prettier-plugin-sort-imports"],
  importOrder: [
    "<TYPES>^(react/(.*)$)|^(react$)",
    "<TYPES>^(next/(.*)$)|^(next$)",
    "<TYPES>",
    "",
    "^(react/(.*)$)|^(react$)",
    "^(next/(.*)$)|^(next$)",
    "<THIRD_PARTY_MODULES>",
    "",
    "<TYPES>^@/(.*)$",
    "<TYPES>^[.]",
    "",
    "^@/(.*)$",
    "^[.]",
  ],
};

export default config;
