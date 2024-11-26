import express from 'express';
import{
    obtenerProductos,
    nuevoProducto,
    obtenerProducto,
    editarProducto,
    eliminarProducto,
    agregarCreador,
    eliminarCreador,
    obtenerPrecio
} from '../controllers/productoController.js';
import checkAuth from '../middleware/checkAuth.js';

const router = express.Router();

//router.get('/', checkAuth, obtenerProductos);
//router.post('/', checkAuth, nuevoProducto);
//Como las dos rutas anteriores tiene la misma dirección, de pueden escribir como:
router
    .route("/")
    .get(obtenerProductos)
    .post(checkAuth, nuevoProducto)
;
router
    .route('/:id')
    .get(obtenerProducto)
    .put(checkAuth, editarProducto)
    .delete(checkAuth, eliminarProducto)
;
router.get('/precio/:id', checkAuth, obtenerPrecio);
router.post('/agregarCreador/:id', checkAuth, agregarCreador);
router.delete('/eliminarCreador/:id', checkAuth, eliminarCreador);
export default router;