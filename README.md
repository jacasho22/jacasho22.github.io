# Mi Portafolio Profesional

Este es un portafolio web profesional diseñado para mostrar proyectos en diferentes lenguajes de programación. El sitio es completamente responsive y cuenta con secciones para mostrar información personal, proyectos, habilidades y un formulario de contacto.

## Características

- Diseño moderno y responsive
- Navegación suave con scroll
- Filtrado de proyectos por categoría/lenguaje
- Animaciones y transiciones elegantes
- Sección de habilidades con barras de progreso
- Formulario de contacto funcional
- Optimizado para SEO

## Estructura del Proyecto

```
/
├── index.html          # Página principal
├── css/
│   └── styles.css      # Estilos principales
├── js/
│   └── main.js         # JavaScript principal
├── img/                # Carpeta para imágenes
│   ├── profile.jpg     # Foto de perfil
│   ├── hero-bg.jpg     # Imagen de fondo para la sección hero
│   └── projects/       # Imágenes de proyectos
└── README.md           # Este archivo
```

## Personalización

### Información Personal

Para personalizar la información personal, edita las siguientes secciones en el archivo `index.html`:

1. **Sección Hero**: Modifica el título y subtítulo en la sección con id `inicio`.
2. **Sección Sobre Mí**: Actualiza la información en la sección con id `sobre-mi`.
3. **Información de Contacto**: Cambia los datos de contacto en la sección con id `contacto`.

### Proyectos

Para añadir o modificar proyectos:

1. Duplica uno de los elementos con clase `project-card` dentro de la sección con id `proyectos`.
2. Actualiza el atributo `data-category` con la categoría correspondiente (javascript, python, java, csharp, etc.).
3. Cambia la imagen, título, descripción y etiquetas del proyecto.
4. Actualiza los enlaces a GitHub y al proyecto en vivo.

### Habilidades

Para modificar las habilidades:

1. Edita los elementos con clase `skill-item` dentro de la sección con id `habilidades`.
2. Actualiza el icono, nombre y nivel de cada habilidad (el nivel se ajusta cambiando el valor de `width` en el estilo del elemento con clase `skill-level`).

### Estilos

Para cambiar los colores y estilos principales:

1. Edita las variables CSS en el archivo `css/styles.css` dentro del selector `:root`.
2. Personaliza los colores primario, secundario, oscuro y claro según tus preferencias.

## Imágenes

Para un rendimiento óptimo, se recomienda:

1. Usar imágenes optimizadas en formato WebP o JPEG optimizado.
2. Dimensiones recomendadas:
   - Imagen de perfil: 400x400px
   - Imagen de fondo hero: 1920x1080px
   - Imágenes de proyectos: 800x600px

## Formulario de Contacto

El formulario de contacto utiliza [Formspree](https://formspree.io) para procesar los envíos sin necesidad de backend. Para que funcione correctamente después de subir el repositorio a GitHub Pages, sigue estos pasos:

1. Regístrate en [Formspree](https://formspree.io) si aún no tienes una cuenta.
2. Crea un nuevo formulario en Formspree.
3. Obtén tu endpoint único de Formspree (será algo como `https://formspree.io/f/xxxxxxxz`).
4. Abre el archivo `index.html` y reemplaza `https://formspree.io/f/your-formspree-endpoint` con tu endpoint real.
5. Reemplaza `https://jacasho22.github.io/thanks.html` con la URL de tu sitio en GitHub Pages.

El formulario ya está configurado con validación en JavaScript y un campo honeypot para evitar spam.

## Compatibilidad

Este portafolio es compatible con los siguientes navegadores:

- Google Chrome (última versión)
- Mozilla Firefox (última versión)
- Safari (última versión)
- Microsoft Edge (última versión)
- Opera (última versión)

## Licencia

Este proyecto está disponible para uso personal y comercial. Siéntete libre de modificarlo según tus necesidades.

---

© 2023 Mi Portafolio. Todos los derechos reservados.