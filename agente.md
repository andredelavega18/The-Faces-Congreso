# Guía de Despliegue para BanaHosting (Next.js Standalone)

Tu proyecto está configurado con `output: 'standalone'`, lo que significa que está optimizado para correr en un servidor Node.js (como los que ofrece BanaHosting con cPanel).

## 1. Generar la Build

Ejecuta el siguiente comando en tu terminal local:

```bash
pnpm build
```

Esto creará una carpeta `.next` con todos los archivos necesarios.

## 2. Preparar los Archivos para Subir

La carpeta `standalone` generada por Next.js es muy ligera, pero **necesita que copies manualmente los archivos estáticos** dentro de ella antes de subirla.

Sigue estos pasos cuidadosamente en tu ordenador antes de subir nada:

1.  Ve a la carpeta de tu proyecto: `.next/standalone`
2.  Copia la carpeta `public` de la raíz de tu proyecto y pégala dentro de `.next/standalone`.
    *   *Resultado:* `.next/standalone/public`
3.  Copia la carpeta `.next/static` de tu proyecto y pégala dentro de `.next/standalone/.next/`.
    *   *Resultado:* `.next/standalone/.next/static`

**Estructura final que debes tener dentro de `.next/standalone`:**

```
.next/standalone/
├── .next/
│   ├── server/
│   └── static/      <-- (Copiada manualmente)
├── public/          <-- (Copiada manualmente)
├── node_modules/
├── package.json
└── server.js
```

## 3. Subir a public_html

1.  Comprime todo el **contenido** de la carpeta `.next/standalone` en un archivo `.zip`.
2.  Ve al Administrador de Archivos de tu cPanel en BanaHosting.
3.  Sube el `.zip` a la carpeta `public_html` (o a la carpeta de tu dominio).
4.  Descomprime el archivo.

## 4. Configurar Node.js en cPanel

1.  En cPanel, busca y entra en **"Setup Node.js App"**.
2.  Crea una nueva aplicación.
3.  **Application Root:** `public_html` (o donde hayas subido los archivos).
4.  **Application URL:** Tu dominio.
5.  **Application Startup File:** `server.js`
6.  Haz clic en **Create**.
7.  Si es necesario, haz clic en **Run NPM Install** (aunque el modo standalone ya suele incluir dependencias críticas, es buena práctica).
8.  Haz clic en **Start App** (o Restart).

¡Listo! Tu aplicación debería estar funcionando.

> **Nota:** Si solo quieres subir archivos HTML estáticos (sin base de datos ni servidor), necesitas cambiar `output: 'standalone'` a `output: 'export'` en `next.config.ts`, pero ten en cuenta que las funciones de servidor (como Prisma/Base de datos) no funcionarán directamente en ese modo.
