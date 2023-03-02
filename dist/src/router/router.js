"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt = require('bcrypt');
const user_model_1 = require("../schemas/user.model");
const product_model_1 = require("../schemas/product.model");
const auth_1 = require("../middleware/auth");
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
router.use((0, cookie_parser_1.default)("12345"));
router.use((0, express_fileupload_1.default)({ createParentPath: true }));
router.use("/product", auth_1.auth);
router.get('/home', (req, res) => {
    res.render('home');
});
router.post("/user/register", async (req, res) => {
    try {
        const user = await user_model_1.UserModel.findOne({ username: req.body.username });
        if (!user) {
            let passwordHash = await bcrypt.hash(req.body.password, 10);
            let userData = {
                username: req.body.username,
                role: req.body.role,
                password: passwordHash
            };
            const newUser = await user_model_1.UserModel.create(userData);
            res.json({ user: newUser, code: 200 });
        }
        else {
            res.json({ err: "User extied" });
        }
    }
    catch (error) {
        res.json({ err: error + "Đây là lỗi khối cattch" });
    }
});
router.get('/user/login', (req, res) => {
    res.render('login');
});
router.post('/user/login', async (req, res) => {
    try {
        const user = await user_model_1.UserModel.findOne({ username: req.body.username });
        if (user) {
            const comparePass = await bcrypt.compare(req.body.password, user.password);
            if (!comparePass) {
                return res.send('sai mat khau');
            }
            let payload = {
                user_id: user["id"],
                username: user["username"],
                role: user["role"]
            };
            const token = jsonwebtoken_1.default.sign(payload, '123456789', {
                expiresIn: 36000,
            });
            res.cookie("name", token);
            res.render('home', { token: token });
        }
        else {
            return res.json({ err: "Sai tài khoản hoặc mật khẩu" });
        }
    }
    catch (error) {
        return res.json({ err: error + "Đây là lỗi phái khối catch trong router.post('/user/login" });
    }
});
router.get('/create', async (req, res) => {
    res.render('create');
});
router.post('/product/create', async (req, res) => {
    try {
        const user = req.decoded;
        console.log(user);
        if (user.role !== "admin") {
            console.log(45);
            return res.render("error");
        }
        {
            const product = await product_model_1.ProductModel.findOne({ name: req.body.name });
            if (!product) {
                let productData = {
                    name: req.body.name,
                    price: req.body.price,
                    category: req.body.category
                };
                const productNew = await product_model_1.ProductModel.create(productData);
                res.render("success");
            }
            else {
                res.json({ err: "Product exited" });
            }
        }
    }
    catch (error) {
        res.json({ err: error });
    }
});
router.get('/list', async (req, res) => {
    const products = await product_model_1.ProductModel.find();
    res.render('list', { products: products });
});
exports.default = router;
//# sourceMappingURL=router.js.map