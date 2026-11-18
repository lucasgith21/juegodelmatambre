# 🔥 Los Juegos del Hambre: Arena en Llamas

Juego web **Battle Royale 2D Top-Down** inspirado en *Los Juegos del Hambre*, desarrollado en HTML5 Canvas, CSS3 y JavaScript moderno con audio sintetizado en tiempo real (Web Audio API) y optimización SEO para Google.

---

## 🏹 Características del Juego

- **La Cornucopia y Cuenta Regresiva**: 24 Tributos comienzan en sus pedestales rodeando la Cornucopia central con 5 segundos antes del gong.
- **Arsenal Completo**:
  - 🏹🔥 **Arco Explosivo (Legendario)**: Tensá la cuerda manteniendo clic izquierdo; las flechas dejan una estela de fuego y explotan al impactar.
  - 🏹 **Arco de Caza (Épico)** y 🎯 **Ballesta Táctica (Perforante)**.
  - 🔫 **Rifle de Asalto del Capitolio** y 💥 **Escopeta de Combate**.
  - 💣 **Granadas de Fragmentación**, 🍾 **Bombas Molotov** (crean zonas de fuego) y 🚨 **Minas de Proximidad** invisibles.
  - 🗡️ **Katana Táctica**, 🧰 **Botiquines**, 🛡️ **Chalecos Blindados**, 🍒 **Bayas del Bosque** y 💉 **Adrenalina Pura**.
- **23 Bots con Inteligencia Artificial**: Tributos de los Distritos 1 al 12 (*Cato, Clove, Finnick, Thresh, Rue, Peeta...*) que abren cofres, usan arcos, lanzan explosivos, se esconden en arbustos y huyen del Anillo de Fuego.
- **Cañonazos del Capitolio y Paracaídas (Airdrops)**: Sonido de cañón y alerta en pantalla cada vez que cae un tributo.

---

## 🚀 Cómo subirlo a GitHub y Vercel (en 2 minutos)

### Paso 1: Subir el código a GitHub
1. Creá un repositorio nuevo en [github.com/new](https://github.com/new) (por ejemplo: `juegos-del-hambre-arena`).
2. Abrí una terminal en esta carpeta (`hunger-games-arena`) y ejecutá:
   ```bash
   git init
   git add .
   git commit -m "Juego Los Juegos del Hambre Arena en Llamas"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/juegos-del-hambre-arena.git
   git push -u origin main
   ```
   *(También podés arrastrar los archivos directamente desde la web de GitHub en **"uploading an existing file"**).*

### Paso 2: Publicarlo gratis en Vercel
1. Entrá a [vercel.com](https://vercel.com) e iniciá sesión con tu cuenta de GitHub.
2. Hacé clic en **"Add New..." → "Project"**.
3. Seleccioná tu repositorio `juegos-del-hambre-arena` y tocá **"Deploy"**.
4. ¡Listo! En 15 segundos te dará tu link público `.vercel.app`.

### Paso 3: Hacer que aparezca en Google (Google Search Console)
1. Entrá a [Google Search Console](https://search.google.com/search-console).
2. En **"Prefijo de la URL"**, pegá el link que te dio Vercel (ej. `https://juegos-del-hambre-arena.vercel.app`) y verificá la propiedad.
3. En el menú izquierdo andá a **Sitemaps** y enviá `sitemap.xml`.
4. Usá la barra superior (**Inspección de URLs**) para pegar tu link y hacer clic en **"Solicitar indexación"**.
