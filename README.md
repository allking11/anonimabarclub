# Anónimo Cocina & Bar 🍸🚪

Una experiencia digital premium y misteriosa diseñada para **Anónimo Cocina & Bar / Anónima Bar Club**, un speakeasy de alta gama ubicado en Barranquilla, Colombia. 

El sitio web combina un diseño visual inmersivo (estética de lujo oscura con acentos dorados y tipografía estilizada `Λ` en lugar de `A`) con características interactivas avanzadas para la reserva y visualización de la carta.

---

## ✨ Características Principales

*   **Estética Speakeasy Inmersiva**: Diseño en modo oscuro refinado, efectos de vidrio templado (glassmorphism), y un video de fondo cinematográfico en bucle continuo en la sección Hero (`reel mostrando cocteles.mp4`).
*   **Menú Dinámico de Cocina & Coctelería**: Un bento grid interactivo clasificado por categorías con filtros rápidos y un lightbox detallado para explorar la carta.
*   **Asistente de Reservas de 7 Días**: Un sistema interactivo tipo "wizard" que guía al usuario paso a paso:
    1.  **Selección de Fecha**: Calendario dinámico para los próximos 7 días (excluyendo domingos y lunes por cierre).
    2.  **Selección de Hora**: Horarios adaptativos según el día (Martes-Jueves: 6:00 PM a 11:30 PM; Viernes-Sábado: 6:00 PM a 2:30 AM).
    3.  **Cantidad de Invitados**: Selector dinámico para hasta 8 personas.
    4.  **Confirmación de Datos**: Validación instantánea de Nombre y WhatsApp, redirigiendo al checkout oficial en WhatsApp con el mensaje en español formateado automáticamente.
*   **Testimonios Seleccionados**: Carrusel interactivo y elegante que destaca las reseñas de Google Maps de los comensales.
*   **Totalmente Responsivo**: Optimizado tanto para pantallas grandes (Escritorio) como para móviles con menús deslizables y objetivos táctiles accesibles ($44 \times 44\text{px}$).

---

## 🚀 Cómo Iniciar Localmente

Para iniciar el servidor de desarrollo local, sigue estos pasos:

1.  Asegúrate de tener [Node.js](https://nodejs.org/) instalado.
2.  Instala las dependencias necesarias de desarrollo (si las hay) o inicia directamente el servidor web:
    ```bash
    npm run dev
    ```
3.  Abre tu navegador en [http://localhost:3000](http://localhost:3000).

---

## 🔄 Sincronización y Clonación del Repositorio

Si deseas sincronizar este proyecto con otro dispositivo o trabajar de forma colaborativa, puedes usar los siguientes comandos de Git:

### 1. Clonar por primera vez
Para descargar la base de código completa en un nuevo dispositivo:
```bash
git clone https://github.com/allking11/anonimabarclub.git
```

### 2. Obtener los últimos cambios (Sincronizar)
Si ya tienes el repositorio clonado y deseas traer las últimas actualizaciones del servidor:
```bash
git pull origin master
```

### 3. Subir tus cambios
Si realizas modificaciones locales y quieres subirlas al repositorio remoto:
```bash
git add .
git commit -m "feat: descripción de tus cambios"
git push origin master
```

---

## 🛠️ Tecnologías Utilizadas

*   **Estructura**: HTML5 Semántico
*   **Estilos**: Vanilla CSS con variables CSS personalizadas y Tailwind CSS (mediante Play CDN para prototipado rápido)
*   **Interacciones**: JavaScript nativo (ES6+) libre de dependencias
*   **Integración**: API de Enlace Directo de WhatsApp
*   **Fuentes**: Google Fonts (Cinzel y Montserrat)
