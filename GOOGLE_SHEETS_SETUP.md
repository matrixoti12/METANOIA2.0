# 📊 Estructura de Google Sheets: Máxima Privacidad (2 Pestañas)

Para garantizar que la **oración sea 100% incógnita** y que nadie que abra la hoja pueda vincular a una persona con su petición, la hoja se divide automáticamente en **2 pestañas independientes**:

---

## 📑 Pestaña 1: `Participantes`

Contiene la lista de personas registradas y su récord en los minijuegos:

| Columna A | Columna B |
|:---|:---:|
| **Nombre** | **Puntaje Total** |
| German Rauda | 1450 |
| Sofía Castillo | 820 |
| David Mendoza | 1200 |

---

## 🔒 Pestaña 2: `Oraciones Incógnitas`

Contiene únicamente las peticiones de oración, **sin nombres, sin correos y sin ningún identificador**. Es un buzón puro para el equipo pastoral y de intercesión:

| Columna A |
|:---|
| **Oración Incógnita (100% Confidencial)** |
| Por sanidad en mi familia y dirección en mis estudios |
| Por paz mental y una carga en mi corazón |
| Por un amigo que necesita conocer a Jesús |

> 🛡️ **Garantía de Privacidad:** Nadie puede deducir de quién es cada oración porque se guardan de forma totalmente aislada e independiente.

---

## ⚡ ¿Cómo activarlo en tu hoja?

1. En tu hoja de Google Sheets, ve a **Extensiones > Apps Script**.
2. Pega todo el código actualizado del archivo [`google-apps-script/Code.gs`](file:///c:/Users/German%20Rauda/project/metanoia-2.0---evento-juvenil/google-apps-script/Code.gs).
3. Guarda el archivo 💾 (`Ctrl + S`).
4. Haz clic en **Implementar > Nueva implementación**:
   - Tipo: **Aplicación web**.
   - Ejecutar como: **Yo**.
   - Quién tiene acceso: **Cualquiera** *(Anyone)*.
5. Clic en **Implementar**, autoriza los permisos y copia la URL terminada en `/exec`.
6. En la web de Metanoia, toca el botón **⚙️ Configurar Google Sheets** y pega tu enlace.

*(Nota: Las 2 pestañas y sus cabeceras en morado oficial se crearán automáticamente con el script en tu hoja de cálculo).*
