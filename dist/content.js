/**
 * Todo el contenido editable del regalo vive en este archivo.
 * Las rutas, textos alternativos y notas de todas las fotos se editan aquí.
 */
window.FERNANDO_CONTENT = {
  meta: {
    title: "Fernando, hoy toca celebrarte",
    description: "Un pequeño álbum de recuerdos de parte de Samuel."
  },
  navigation: {
    openGift: "Abrir el regalo",
    previous: "Anterior",
    next: "Siguiente",
    chapters: "Ver capítulos",
    closeChapters: "Cerrar capítulos",
    backToAlbum: "Volver al álbum",
    previousPhoto: "Foto anterior",
    nextPhoto: "Foto siguiente",
    closePhoto: "Cerrar foto"
  },
  chapters: [
    {
      id: "bienvenida",
      shortLabel: "Inicio",
      eyebrow: "Un regalo de tu amigo Samuel",
      title: "Fernando, hoy esto es para ti",
      body: "Preparé este regalo para recordar algunos de los buenos momentos que hemos compartido y decirte cuánto aprecio tu amistad.",
      actionLabel: "Abrir el regalo"
    },
    {
      id: "felicitacion",
      shortLabel: "Felicitación",
      eyebrow: "Un gran primer paso",
      title: "¡Felicitaciones por tu primer discurso, amigo!",
      body: "Sé cuánto te esforzaste para hacer tu discurso y me alegra poder celebrar contigo este momento y todo el esfuerzo que hay detrás.",
      sideNote: "Y después de tanto esfuerzo… una buena comida no estaría nada mal.",
      featuredImage: {
        src: "assets/fotos/discurso-publico-alameda.jpg",
        alt: "Fernando dando su primer discurso público en la congregación Alameda",
        position: "50% 50%",
        placeholder: "Aquí va el recuerdo de este día"
      }
    },
    {
      id: "recuerdos",
      shortLabel: "Recuerdos",
      eyebrow: "Nuestros recuerdos",
      title: "Momentos que vale la pena guardar",
      intro: "Tres recuerdos de estos años de amistad. Abre cada uno para descubrir una nota.",
      memories: [
        {
          id: "equipo",
          index: "01",
          title: "Haciendo equipo",
          summary: "Un recuerdo de cuando nos tocó trabajar juntos en la asamblea.",
          note: "Me gusta recordar que también hemos hecho equipo en las asambleas. Aunque había trabajo por hacer, siempre era agradable compartir ese tiempo contigo.",
          images: [
            {
              src: "assets/fotos/haciendo-equipo-asamblea.jpg",
              alt: "Grupo junto a varios buses, con dos personas usando chalecos de seguridad",
              position: "50% 50%"
            }
          ]
        },
        {
          id: "ayudar-compartir",
          index: "02",
          title: "Ayudar y compartir",
          summary: "Una ocasión para ayudar a nuestro amigo y después disfrutar una comida juntos.",
          note: "Me gusta este recuerdo porque pudimos ayudar a nuestro amigo y después compartir una comida juntos. Fue uno de esos días que da gusto recordar.",
          images: [
            {
              src: "assets/fotos/ayudar-compartir-restaurante.jpg",
              alt: "Cinco personas reunidas alrededor de una mesa en un restaurante",
              position: "50% 50%"
            }
          ]
        },
        {
          id: "buena-compania",
          index: "03",
          title: "En buena compañía",
          summary: "Dos recuerdos predicando, uno de día y otro de noche.",
          note: "También guardo con cariño estos recuerdos predicando. Son momentos en los que disfrutamos de la compañía de todos los hermanos y de pasar ese tiempo juntos.",
          images: [
            {
              src: "assets/fotos/buena-compania-dia.jpg",
              alt: "Grupo de siete personas posando en una calle durante el día",
              position: "50% 50%"
            },
            {
              src: "assets/fotos/buena-compania-noche.jpg",
              alt: "Grupo de siete personas posando en una calle durante la noche",
              position: "50% 50%"
            }
          ]
        }
      ]
    },
    {
      id: "aprecio",
      shortLabel: "Lo que aprecio",
      eyebrow: "Sin hacer una lista interminable",
      title: "Lo que aprecio de ti",
      intro: "En estos cuatro o cinco años he conocido a alguien en quien se puede confiar.",
      qualities: [
        {
          title: "Tu dedicación",
          text: "Eres trabajador, disciplinado y constante. Cuando te comprometes con algo, se nota."
        },
        {
          title: "Tu forma de ser",
          text: "Me gusta que seas tranquilo y que también tengas buen humor. Siempre es agradable pasar un rato contigo."
        },
        {
          title: "Lo que haces por los tuyos",
          text: "Admiro el apoyo que das a tu familia y, de manera especial, a tus padres."
        },
        {
          title: "Tu amistad",
          text: "Me alegra contar con tu amistad y haber compartido tantas cosas contigo durante estos años. Siempre es agradable trabajar juntos, ayudar a otros o simplemente pasar un rato conversando. Aprecio esos momentos y espero que sigamos compartiendo muchos más."
        }
      ]
    },
    {
      id: "dedicatoria",
      shortLabel: "Dedicatoria",
      eyebrow: "Para seguir sumando buenos momentos",
      title: "Me alegra contar con tu amistad",
      body: "Fernando, espero que disfrutes este logro y todo lo bueno que viene con él. Que este álbum siga creciendo con nuevas fotos, nuevas comidas y muchos momentos que valga la pena recordar.",
      signoff: "De chamo a chamo, con aprecio,",
      signature: "Samuel",
      closing: "Y ahora sí, chamo… ¡queda pendiente una carrera de go-karts para celebrar!"
    }
  ]
};

