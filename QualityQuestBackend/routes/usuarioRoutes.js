import express  from "express";
const router = express.Router();
import { 
    registrar,
    autenticar,
    confirmar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    perfil,
    obtenerPerfil
} from "../controllers/usuarioControllers.js";
import checkAuth from "../middleware/checkAuth.js";
//Autenticación, registro, y confirmación de usuarios
router.post("/", registrar); //Crear un nuevo usuario
router.post("/login", autenticar );
router.get('/confirmar/:token', confirmar);
router.post('/olvide-password', olvidePassword);
//router.get('/olvide-password/:token', comprobarToken);
//router.post('/olvide-password/:token', nuevoPassword);
//Como las dos rutas anteriores tiene la misma dirección, de puedne escribir como:
router.route('/olvide-password/:token').get(comprobarToken).post(nuevoPassword);
router.get('/perfil', checkAuth, perfil);
router.get('/perfil/:id', obtenerPerfil);
export default router;
