// Brand-wide settings. The main switches for launch live here.

export const site = {
  name: "Human Proyect",
  title: "Human Proyect · No necesitas ser perfecto, necesitas ser tú",
  description:
    "Estrategia de contenido y posicionamiento digital de Yera. Comunicación de humano a humano para que la gente recuerde tu negocio.",
  themeColor: "#090909",

  // true shows the preview notice and asks search engines not to index the site.
  preview: true,

  contact: {
    label: "Hablar con Yera",
    // Where every contact button leads, for example an Instagram profile.
    // While null, buttons stay on the page and publishing is blocked.
    url: null as string | null,
  },
} as const;

/** Link for contact buttons. `home` is the home page path when linking from another page. */
export function contactHref(home = ""): string {
  return site.contact.url ?? `${home}#contacto`;
}
