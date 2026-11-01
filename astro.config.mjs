import { defineConfig } from "astro/config";

export default defineConfig({
  // Change this line when the custom domain arrives.
  site: "https://humanprojectt.github.io",
  // Emits dist/aviso-legal.html, so the URL stays /aviso-legal.html.
  build: { format: "file" },
  trailingSlash: "ignore",
  devToolbar: { enabled: false },
});
