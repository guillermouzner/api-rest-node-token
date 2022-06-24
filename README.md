# api-rest-nodejs-express-jwt-mongoDB

- [Documentacion](https://pruebarestgu.herokuapp.com/api/v1/doc/)

> Disclaimer: Esta documentacion tiene como objetivo mostrar el funcionamiento del refreshToken y token para la autenticacion de los usuarios,
> es por eso que se obviaron varias validaciones.
> La idea de la app con las validaciones correspondientes se puede ver en: https://github.com/guillermouzner/app-node
 

- Api Rest creada con Node.js y Express que utiliza JWT para la autenticación y comunicación con el usuario y MongoDB como base de datos.
Al crear un usuario y/o iniciar sesión se nos genera un token de validación que se almacena en memoria RAM y sirve para hacer peticiones a rutas protegidas y un refresh token que se guarda como cookie y servirá para validar que existe un token valido.
Ambos tokens tienen tiempo de expiración.

```javascript
export const register = async (req, res) => {
    /* desestructura el request body y obtiene email y password y lo paso al modelo User para guardar el usuario en base de datos,
    MongoDB generara id de forma automatica.
    Ese id lo paso como parametro a la funcion generateToken() y como esta funcion retorna un objeto, obtengo el token y su expiracion.
    Una vez que se genera el token, tambien se generará otro token en la funcion generateRefreshToken() que se guarda como una cookie y le paso como
    parametro el id del usuario y un response.
    */
    const { email, password } = req.body;
    try {
        const user = new User({ email, password });

        await user.save();

        // jwt token
        const { token, expiresIn } = generateToken(user.id);
        generateRefreshToken(user.id, res);

        return res.json({ redirec: "/login", token, expiresIn });
    } catch (error) {
        return res.status(500).json({ error: "error de servidor" });
    }
};

```
> Con el login pasa algo similar a register solo que antes valida que el usuario y contraseña sean correctos.

## Middlewares

```javascript
export const generateToken = (uid) => {
    /* con el id del usuario que recibe genera jwt para hacer peticiones a rutas protegidas
    uid --> user.id
    */
    const expiresIn = 60 * 15;
    try {
        const token = jwt.sign({ uid }, process.env.JWT_SECRET, { expiresIn });
        return { token, expiresIn };
    } catch (error) {
        console.log(error);
    }
};

export const generateRefreshToken = (uid, res) => {
    /* con el id del usuario que recibe genera jwt y lo guardamos en una cookie.
    RefreshToken no tiene autorizacion para hacer peticiones pero sirve para devolver un token valido.
    */
    const expiresIn = 60 * 60 * 60;
    try {
        const refreshToken = jwt.sign({ uid }, process.env.JWT_REFRESH, {
            expiresIn,
        });
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            // secure: !(process.env.MODO === "developer"),
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });
    } catch (error) {
        console.log(error);
    }
};

```

### Refresh Token
- Utilidad: si quiero ingresar a una ruta protegida necesito autorizacion, no tengo el token pero si un refreshToken ya que lo guardé en una cookie.
Entonces lo que hace este refreshToken es mandar una solicitud al servidor y el servidor verifica que el refreshToken sea valido y me devuelve un token
valido con el cual puedo hacer la peticion a la ruta protegida.
El token valido solo vive en memoria RAM del cliente, no estara almacenado en ninguna parte.

```javascript
export const requireRefreshToken = (req, res, next) => {
    try {
        const refreshTokenCookie = req.cookies.refreshToken;
        if (!refreshTokenCookie) throw new Error("No existe el token");
        const { uid } = jwt.verify(refreshTokenCookie, process.env.JWT_REFRESH);
        req.uid = uid;
        next();
    } catch (error) {
        console.log(error.message);

        return res.status(401).json({ errors: tokenErrors[error.message] });
    }
};
```
