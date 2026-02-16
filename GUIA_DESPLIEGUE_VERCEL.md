# Guía de Despliegue con Supabase y Vercel

## 1. Configuración de Base de Datos (Supabase)

1.  Crea una cuenta/proyecto en [supabase.com](https://supabase.com).
2.  Ve a **Project Settings** -> **Database**.
3.  Busca la sección **Connection parameters**.
4.  Copia las siguientes cadenas de conexión:
    - **Transaction (Pooler)**: Úsala para `DATABASE_URL`. (Puerto 6543)
    - **Session (Direct)**: Úsala para `DIRECT_URL`. (Puerto 5432)

## 2. Configuración en GitHub

1.  Asegúrate de que tu código esté subido a GitHub (reintentaremos esto).

## 3. Configuración en Vercel

1.  Importa el proyecto en Vercel.
2.  En **Environment Variables**, agrega:
    - `DATABASE_URL`: Pegar string de Transaction (Pooler) de Supabase.
    - `DIRECT_URL`: Pegar string de Session (Direct) de Supabase.
3.  Dale a **Deploy**.

## 4. Inicializar Base de Datos

Una vez desplegado (o antes, desde tu local si conectas el .env):

1.  Ve a la pestaña **Build Logs** en Vercel o usa tu terminal local.
2.  Necesitamos crear las tablas. Vercel a veces lo hace automático si agregamos el comando de build, pero lo más seguro es:
    - En tu terminal local, actualiza `.env` con las credenciales de Supabase.
    - Ejecuta: `npx prisma db push`
    - Ejecuta: `npx prisma db seed` (para cargar los datos iniciales).
