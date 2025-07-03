import { Router } from "express";
const router = Router();
import productos from "../productos.js";


// const productos = [
//     {
//         nombre: "Honda XR 250",
//         descripcion: "Una moto ideal para aventuras urbanas y caminos de tierra.",
//         precio: 1350000,
//         imagen: "https://http2.mlstatic.com/D_Q_NP_2X_884135-MLA86042436541_062025-E.webp"
//     },
//     {
//         nombre: "Yamaha FZ 25",
//         descripcion: "Moderna y económica, perfecta para uso diario.",
//         precio: 980000,
//         imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_985217-MLA87070237771_072025-E.webp"
//     },
//     {
//         nombre: "Bajaj Dominar 400",
//         descripcion: "Potente y robusta, ideal para ruta y ciudad.",
//         precio: 1550000,
//         imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_948124-MLA85714310205_062025-E.webp"
//     }
// ];
router.get("/", (req, res) => {
    res.render("home", { productos });
});

router.get("/realtimeproducts", (req, res) => {
    res.render("realTimeProducts");
});



export default router;

