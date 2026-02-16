# Guía Paso a Paso: Configurar Base de Datos en Supabase

Supabase es una plataforma que nos da una base de datos PostgreSQL gratuita y lista para usar. Es perfecta para conectar con Vercel.

## Paso 1: Crear Cuenta y Proyecto

1.  Ingresa a [database.new](https://database.new) (te pedirá iniciar sesión, puedes usar tu cuenta de GitHub).
2.  Recibirás un formulario para crear un nuevo proyecto:
    - **Name**: `Control Gastos` (o lo que prefieras).
    - **Database Password**: Haz clic en "Generate a password" y **CÓPIALA** en un lugar seguro (o en un bloc de notas por ahora). La necesitaremos.
    - **Region**: Elige `South America (São Paulo)` para mejor velocidad, o la que prefieras.
    - **Pricing Plan**: Asegúrate que diga "Free" ($0/month).
3.  Haz clic en **Create new project**.
4.  Espera unos minutos a que termine de configurar (se pondrá verde).

## Paso 2: Obtener las Credenciales

1.  Una vez creado el proyecto, ve al menú lateral izquierdo y busca el ícono de engranaje **Project Settings**.
2.  Dentro de Settings, ve a la sección **Database**.
3.  Baja hasta encontrar el panel **Connection parameters**.
4.  Arriba a la derecha de ese panel, verás un selector que dice "Mode: Transaction". **Déjalo en Transaction**.
5.  Copia la URL que aparece (debería empezar con `postgres://...`).
    - Esta será tu `DATABASE_URL`.
    - **IMPORTANTE**: La URL tendrá un texto `[YOUR-PASSWORD]`. Debes reemplazar ese texto manualmente por la contraseña que guardaste en el Paso 1.

6.  Ahora, cambia el selector de "Mode: Transaction" a **"Mode: Session"**.
7.  Copia esta nueva URL.
    - Esta será tu `DIRECT_URL`.
    - También reemplaza `[YOUR-PASSWORD]` con tu contraseña real.

## Paso 3: Guardar en tu Proyecto

1.  Vuelve a VS Code.
2.  Crea un archivo llamado `.env` (si no existe) clonando el `.env.example`.
3.  Pega tus dos URLs:

```env
DATABASE_URL="postgres://postgres.tusuario:tustrsecreta@aws-0-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgres://postgres.tusuario:tustrsecreta@aws-0-sa-east-1.supabase.co:5432/postgres"
```

## Paso 4: Subir la estructura de datos

Una vez tengas el `.env` listo en tu máquina, ejecuta en la terminal:

```bash
npx prisma db push
```

¡Listo! Tu base de datos en la nube ya tiene las tablas creadas.
