// Draft without legal review. The site owner must validate it before publishing.

export const legal = {
  title: "Aviso legal y privacidad",
  // Set to false once the owner has reviewed this page.
  needsReview: true,
  reviewNote: "Borrador sin revisión legal. El titular debe validarlo antes de publicar.",

  // Provider details (LSSI-CE, art. 10). Every null shows as pending and blocks publishing.
  owner: [
    { label: "Nombre o razón social", value: null as string | null },
    { label: "NIF", value: null as string | null },
    { label: "Domicilio", value: null as string | null },
    { label: "Correo electrónico", value: null as string | null },
  ],

  sections: [
    {
      title: "Datos personales",
      text: "Esta web no tiene formularios ni cuentas de usuario y no pide datos personales. Si escribes por el canal de contacto, tus datos los trata ese servicio y el titular solo los usa para responderte.",
    },
    {
      title: "Alojamiento",
      text: "Esta web está alojada en GitHub Pages. GitHub registra la dirección IP de quien la visita por motivos de seguridad, según su propia documentación.",
    },
    {
      title: "Cookies y analítica",
      text: "Esta web no instala cookies propias ni usa herramientas de analítica o publicidad.",
    },
  ],
};
