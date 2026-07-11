import { defineConfig } from "vite";
import { fresh } from "@fresh/plugin-vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  // @ts-ignore This is the valid default setup for Fresh.
  plugins: [fresh(), tailwindcss()],
});
