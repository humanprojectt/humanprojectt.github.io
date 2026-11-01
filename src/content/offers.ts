// To open an offer, change its status to "available". It then shows the contact button.
// The first offer is the one that leads the section.

export type OfferStatus = "available" | "soon";

export interface Offer {
  id: string;
  status: OfferStatus;
  title: string;
  description: string;
  items?: string[];
}

export const statusLabels: Record<OfferStatus, string> = {
  available: "Disponible",
  soon: "Próximamente",
};

export const offersSection = {
  title: "Tres formas de trabajar el método.",
};

export const offers: Offer[] = [
  {
    id: "servicio",
    status: "available",
    title: "Servicio personalizado",
    description:
      "Acompañamiento a medida. Primero hablamos para valorar qué necesitas y el alcance del trabajo.",
  },
  {
    id: "formacion",
    status: "soon",
    title: "Formación",
    description: "Cinco vídeos formativos:",
    items: [
      "Marca personal",
      "Instagram para vender",
      "Contenido que atrae clientes",
      "Captación sin publicidad",
      "Crecimiento sostenido",
    ],
  },
  {
    id: "manual",
    status: "soon",
    title: "Manual",
    description: "El método por escrito, en primera persona y centrado en Instagram:",
    items: ["Guiones", "Ejercicios", "Plantillas", "Plan de 90 días"],
  },
];
