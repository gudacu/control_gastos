# Cómo solucionar el error de autenticación en GitHub

GitHub ya no acepta contraseñas para operaciones en la terminal. Debes usar un **Personal Access Token (PAT)**.

## Paso 1: Generar el Token

1.  Inicia sesión en GitHub como **gudacu**.
2.  Ve a **Settings** (Configuración) -> **Developer settings** (al final del menú izquierdo) -> **Personal access tokens** -> **Tokens (classic)**.
3.  Haz clic en **Generate new token** -> **Generate new token (classic)**.
4.  Dale un nombre (ej: "Macbook App Gastos").
5.  **Expiration**: Selecciona "No expiration" o el tiempo que prefieras.
6.  **Scopes** (Permisos): MARCA LA CASILLA **`repo`** (esto selecciona todo lo necesario para subir código).
7.  Haz clic en **Generate token**.
8.  **COPIA EL TOKEN** (empieza con `ghp_...`). **No podrás verlo de nuevo.**

## Paso 2: Usar el Token

1.  Vuelve a tu terminal en VS Code.
2.  Ejecuta el comando para subir:
    ```bash
    git push -u origin main
    ```
3.  Te pedirá **Username**: Escribe `gudacu`.
4.  Te pedirá **Password**: **PEGA EL TOKEN QUE COPIASTE**.
    *   *Nota: No verás nada mientras pegas o escribes, es normal por seguridad.*
5.  Presiona Enter.

¡Listo! Tu código debería subirse correctamente.
