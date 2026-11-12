# Backend - Rama rodrigo-backend

## 1. Tecnologías utilizadas

- **Node.js:** ejecución del backend.
- **Express:** servidor y rutas de la API.
- **MySQL y mysql2:** conexión con la base de datos.
- **bcryptjs:** cifrado y verificación de contraseñas.
- **express-session:** creación y administración de sesiones.
- **cors:** comunicación entre frontend y backend.
- **morgan:** registro de solicitudes HTTP.
- **dotenv:** lectura de variables de entorno.
- **nodemon:** reinicio automático del servidor durante el desarrollo.

## 2. Instalación y ejecución

Desde la carpeta `backend`, instalar las dependencias:

```bash
npm install
```

Configurar el archivo `.env`:

```env
DB_HOST=localhost
DB_USER=TU_USUARIO
DB_PASSWORD=TU_CONTRASEÑA
DB_NAME=db_ventas_online_final
SESSION_SECRET=TU_CLAVE_SECRETA
```

La base de datos debe estar creada y contener un rol llamado `Cliente`.

Para generar una clave de sesión:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Iniciar el servidor:

```bash
npm start
```

En Windows PowerShell puede utilizarse `npm.cmd start`.

**Puerto del backend:** `3001`

**Dirección del frontend:** `http://localhost:5173`

No se deben compartir las credenciales reales ni la clave de sesión.

## 3. Organización del backend

- `src/app.js`: registra las rutas principales e inicia el servidor.
- `src/server.js`: configura Express, CORS, Morgan, sesiones y acceso a imágenes.
- `src/database.js`: establece la conexión con MySQL.
- `src/routes/routes.js`: conecta las rutas principales.
- `src/routes/Login.routes.js`: define las rutas de autenticación.
- `src/routes/principal.routes.js`: define la ruta del catálogo.
- `src/controllers.js`: contiene los controladores de Login, Register, Session y Logout.
- `src/services.js`: contiene la lógica de registro y autenticación.
- `src/controllers/principal.controller.js`: consulta los productos y aplica los filtros.
- `src/sql/products.js`: contiene la consulta SQL utilizada para obtener los productos.
- `uploads/`: almacena las imágenes de los productos.

## 4. Registro de usuarios (Register)

**Endpoint:** `POST /ecommer/register`

El frontend envía los datos en formato JSON:

```json
{
  "correo": "usuario@gmail.com",
  "contraseña": "Ejemplo123!"
}
```

### Funcionamiento

1. El controlador `register` recibe los datos enviados por el frontend.
2. Se verifican los campos obligatorios y la longitud de la contraseña.
3. Se normaliza el correo electrónico.
4. Se busca en la tabla `rol` el identificador correspondiente a `Cliente`.
5. La contraseña se cifra utilizando `bcryptjs`.
6. Se registra el usuario en la tabla `usuario`.
7. El backend devuelve una respuesta indicando si el registro fue exitoso.

### Datos automáticos

El formulario no necesita solicitar:

- **`id_rol`:** el backend obtiene automáticamente el identificador del rol Cliente.
- **`estado`:** MySQL establece `activo` como valor predeterminado.
- **`fecha_registro`:** MySQL genera automáticamente la fecha y hora del registro.

Esto evita que el usuario seleccione manualmente su rol o estado.

**Nota:** la implementación actual registra la cuenta en `usuario`. Los datos personales de la tabla `cliente` se gestionarán cuando se integre el formulario correspondiente.

## 5. Inicio de sesión (Login)

**Endpoint:** `POST /ecommer/login`

El frontend envía:

```json
{
  "correo": "usuario@gmail.com",
  "contraseña": "Ejemplo123!"
}
```

### Funcionamiento

1. El controlador `login` recibe el correo y la contraseña.
2. El servicio `iniciarSesion` busca el usuario en la tabla `usuario`.
3. Se verifica que su estado sea `activo`.
4. Se compara la contraseña ingresada con la contraseña cifrada almacenada en MySQL mediante `bcrypt.compare()`.
5. Si las credenciales son correctas, se guarda la información pública del usuario en la sesión.
6. El backend devuelve una respuesta exitosa junto con el identificador y correo del usuario.

### Validaciones

- Si faltan datos obligatorios, se devuelve un error.
- Si el correo no existe o la contraseña es incorrecta, se rechaza el inicio de sesión.
- Si las credenciales son correctas, se permite el acceso.

El backend no devuelve la contraseña almacenada.

## 6. Manejo de sesiones

Se utiliza `express-session` para conservar la autenticación del usuario.

La configuración se encuentra en `src/server.js`.

### Funcionamiento

Cuando el usuario inicia sesión correctamente, el controlador guarda:

```javascript
req.session.usuario = usuario;
```

La sesión contiene información pública del usuario, como su identificador y correo.

El navegador recibe una cookie de sesión, que envía automáticamente en las siguientes solicitudes cuando se configura `credentials: 'include'` en el frontend.

### Consultar la sesión

**Endpoint:** `GET /ecommer/session`

Si existe una sesión activa, el backend devuelve una respuesta similar a:

```json
{
  "autenticado": true,
  "usuario": {
    "id_usuario": 1,
    "correo": "usuario@gmail.com"
  }
}
```

Si no existe una sesión:

```json
{
  "autenticado": false,
  "usuario": null
}
```

Esto permite que el frontend compruebe si el usuario ya inició sesión, incluso después de actualizar la página.

### Configuración

- Las sesiones utilizan `SESSION_SECRET`.
- Las cookies tienen la opción `httpOnly`.
- Se utiliza `sameSite: 'lax'`.
- La duración máxima configurada es de 24 horas.
- CORS permite las solicitudes con credenciales desde `http://localhost:5173`.

Actualmente se utiliza el almacenamiento de sesiones predeterminado de `express-session`, adecuado para las pruebas locales del proyecto. Las sesiones pueden perderse al reiniciar el servidor.

## 7. Cierre de sesión (Logout)

**Endpoint:** `POST /ecommer/logout`

El controlador `logout` se encuentra implementado en `src/controllers.js`.

### Funcionamiento

1. El usuario selecciona la opción Cerrar sesión desde el frontend.
2. Se envía una solicitud POST al endpoint `/ecommer/logout`.
3. El backend ejecuta `req.session.destroy()` para destruir la sesión.
4. Se elimina la cookie de sesión del navegador mediante la respuesta del servidor.
5. El frontend puede actualizar su estado y redirigir al usuario al Login.

### Ubicación del botón

**El botón Cerrar sesión no formará parte del formulario de Login.**

Se integrará posteriormente en un menú de usuario, que podría incluir:

- Mi perfil.
- Mis pedidos.
- Cerrar sesión.

La ubicación definitiva del menú pertenece al frontend y se coordinará con los demás integrantes.

**Estado actual:** la funcionalidad de Logout está implementada y fue probada anteriormente. Su integración en el menú de usuario sigue pendiente.

## 8. Consulta de productos y filtros

**Endpoint:** `GET /ecommer/principal`

El backend consulta los productos de MySQL y obtiene información relacionada con:

- Categoría.
- Subcategoría.
- Género.
- Marca.

Se utilizan consultas SQL con `INNER JOIN` para relacionar las tablas correspondientes.

### Filtros disponibles

Los filtros se reciben como parámetros de la URL:

```text
/ecommer/principal?marca=Nike
/ecommer/principal?categoria=Ropa
/ecommer/principal?marca=Adidas&genero=Hombre
```

Se admiten los parámetros `categoria`, `subcategoria`, `genero` y `marca`.

Los filtros pueden combinarse y se aplican mediante consultas parametrizadas.

## 9. Imágenes de productos

Se incorporó la configuración de imágenes de la rama de Jeanpiere.

Las imágenes se almacenan en la carpeta `uploads`.

Express permite acceder a ellas mediante:

```text
http://localhost:3001/uploads/polo_blanco_hombre.jpg
```

Actualmente se incluyen seis imágenes de prendas de vestir.

El backend permite consultar las imágenes directamente; su presentación dentro de las tarjetas de productos corresponde al frontend.

## 10. Configuraciones adicionales

### CORS

Se permite la comunicación con el frontend de React ubicado en `http://localhost:5173`.

Se mantiene `credentials: true` para permitir las cookies utilizadas por las sesiones.

### Morgan

Se utiliza `morgan('dev')` para mostrar las solicitudes HTTP en la terminal y facilitar las pruebas del servidor.

### Git

El archivo `.gitignore` incluye:

```gitignore
.env
node_modules/
```

Los archivos que Git ya estuviera rastreando no dejan de estarlo automáticamente al agregarlos a `.gitignore`.

## 11. Diferencias respecto a master_backend

Esta rama conserva parte de la estructura original e incorpora una implementación propia de autenticación.

### Registro

En `rodrigo-backend`, el formulario envía únicamente correo y contraseña.

El backend obtiene automáticamente el rol Cliente y utiliza los valores predeterminados de MySQL para estado y fecha.

En la versión de `master_backend` revisada previamente, el registro recibía también `id_rol`, `estado` y `fecha_registro`.

### Login

Nuestra implementación:

- Verifica que el usuario esté activo.
- Comprueba la contraseña cifrada.
- Devuelve información pública del usuario.
- Guarda al usuario en una sesión.

En la versión de `master_backend` revisada, el Login validaba las credenciales, pero solamente devolvía un mensaje de éxito.

### Sesiones y Logout

Nuestra rama incorpora:

- Configuración de `express-session`.
- Endpoint para consultar la sesión.
- Endpoint para cerrar sesión.
- Soporte de cookies mediante CORS.

### Organización de archivos

Nuestra rama utiliza `src/controllers.js`, `src/services.js` y `src/routes/Login.routes.js` para la autenticación.

La rama principal organiza parte de esa funcionalidad en otros controladores y archivos de rutas.

**Importante:** estas diferencias corresponden a las versiones revisadas. Deben comprobarse nuevamente antes de fusionar las ramas.

## 12. Estado de las funcionalidades

| Funcionalidad | Estado |
|---|---|
| Conexión con MySQL | Implementada |
| Registro de usuarios | Implementado y probado |
| Inicio de sesión | Implementado y probado |
| Contraseñas cifradas | Implementado |
| Sesiones | Implementadas y probadas |
| Cierre de sesión | Implementado y probado |
| Botón Logout en menú de usuario | Pendiente de integración |
| Consulta de productos | Implementada y probada |
| Filtros de productos | Implementados y probados |
| Acceso a imágenes | Implementado y probado |
| Integración completa con el frontend del equipo | Pendiente |

---

**Rama:** `rodrigo-backend`

Este README describe las funcionalidades de esta rama, incluyendo las configuraciones de productos e imágenes incorporadas selectivamente desde el trabajo de los demás integrantes.