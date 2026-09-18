# Álbum de recuerdos para Fernando

Sitio estático, móvil primero, creado con HTML, CSS y JavaScript sin dependencias. Todo el contenido visible y las referencias de las fotos se editan desde `dist/content.js`.

## Verlo localmente

Puedes abrir `dist/index.html` directamente en un navegador. Para una vista más fiel a GitHub Pages, inicia cualquier servidor estático desde la carpeta `dist`.

Por ejemplo, si tienes Node.js y `serve` instalado:

```bash
npx serve dist
```

La página también puede publicarse desde la carpeta `dist` en GitHub Pages. Todas las rutas son relativas y no requiere compilación.

## Cambiar textos

Abre `dist/content.js`. El objeto `window.FERNANDO_CONTENT` reúne:

- etiquetas de navegación;
- textos de los cinco capítulos;
- las tres tarjetas de recuerdos;
- la dedicatoria y la firma.

Conserva las comillas, comas y llaves del archivo al editar.

## Fotos actuales

Las copias usadas por la página están en `dist/assets/fotos/` y tienen nombres descriptivos. Los archivos recibidos, sin modificar, se conservan en `assets/originales/`.

Las rutas y los textos alternativos están centralizados en `dist/content.js`. Cada recuerdo usa una lista `images`; el recuerdo **En buena compañía** contiene dos elementos y activa automáticamente sus controles manuales.

## Añadir la futura foto del discurso

Mientras `featuredImage.src` esté vacío, la felicitación muestra el marco con el texto **“Aquí va el recuerdo de este día”**.

Para sustituirlo por la foto real:

1. Optimiza una copia para web y guárdala, por ejemplo, como `dist/assets/fotos/discurso-alameda.jpg`. Conserva el original en `assets/originales/`.
2. En `dist/content.js`, busca el capítulo con `id: "felicitacion"`.
3. Dentro de `featuredImage`, cambia `src: ""` por `src: "assets/fotos/discurso-alameda.jpg"`.
4. Revisa el texto `alt`. Puedes ajustar `position`, aunque la imagen se muestra completa y sin recortes.

Al recargar, el marco se reemplaza automáticamente por la foto y esta se puede ampliar en el visor.

## Añadir o reemplazar fotos del álbum

1. Copia cada imagen a `dist/assets/fotos/`. Se recomiendan archivos `.webp` o `.jpg` optimizados, de menos de 1 MB.
2. En `dist/content.js`, busca el recuerdo correspondiente dentro de `memories`.
3. Añade o cambia un elemento de `images`, por ejemplo `src: "assets/fotos/asamblea.webp"`.
4. Ajusta `alt` para describir brevemente quién aparece y qué sucede en la foto.
5. Ajusta `position` si lo necesitas. Las fotografías usan `object-fit: contain`, así que siempre se muestran completas.

Cuando un recuerdo contiene más de una imagen, la tarjeta y el visor muestran controles anterior/siguiente. No hay reproducción automática.

## Actualizar GitHub Pages sin cambiar la dirección

Cuando el sitio ya esté publicado, trabaja en el mismo repositorio y conserva la configuración actual de Pages. Añade la foto a `dist/assets/fotos/`, actualiza `dist/content.js` y vuelve a desplegar la carpeta `dist` mediante el mismo flujo o rama usados en la publicación inicial. No crees otro repositorio ni cambies el nombre del repositorio o la fuente de Pages: así se mantiene la misma dirección del sitio.

## Controles

- Los botones **Anterior** y **Siguiente** recorren los capítulos.
- **Ver capítulos** abre el índice completo.
- Las flechas izquierda y derecha del teclado permiten navegar cuando el foco no está dentro de un botón.
- Las notas del álbum se abren y cierran con botones accesibles por teclado.
- La ampliación de fotos usa un diálogo que se cierra con `Esc` y devuelve el foco a la foto que lo abrió.
- Las flechas izquierda y derecha recorren la galería cuando el visor de dos fotos está abierto.
- Si el dispositivo solicita movimiento reducido, las animaciones se desactivan casi por completo.

