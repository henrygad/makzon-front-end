import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        https: {
            key: "certs/localhost-key.pem",
            cert: "certs/localhost.pem",
        },
    },
});

