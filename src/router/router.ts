import express from "express";
const router = express.Router();
import jwt from 'jsonwebtoken';
const bcrypt = require('bcrypt') ;
import {UserModel} from "../schemas/user.model";
import {ProductModel} from "../schemas/product.model";
import {auth} from "../middleware/auth";
import fileupload from 'express-fileupload';
import cookieParser from 'cookie-parser';
import cookie from 'cookie'
router.use(cookieParser("12345"));
router.use(fileupload({ createParentPath: true }));
router.use("/product", auth);



router.get('/home', (req:any,res)=> {
    res.render('home')
})



router.post("/user/register", async (req,res) =>{
    try{
        const user = await UserModel.findOne({username: req.body.username});
        if(!user){
            let passwordHash = await bcrypt.hash(req.body.password, 10);
            let userData = {
                username: req.body.username,
                role: req.body.role,
                password: passwordHash
            }
            const newUser = await UserModel.create(userData);
            res.json({user: newUser, code: 200})
        } else {
            res.json({err: "User extied"})
        }
    } catch (error) {
        res.json({err: error + "Đây là lỗi khối cattch"})
    }
});
router.get('/user/login', (req,res) => {
    res.render('login')
})
router.post('/user/login', async (req,res) => {
    try{
        const user = await UserModel.findOne({username: req.body.username});
        if(user){
            const comparePass = await bcrypt.compare(req.body.password, user.password);
            if(!comparePass){

                return res.send('sai mat khau')
            }
            let payload = {
                user_id: user["id"],
                username: user["username"],
                role: user["role"]
            }
            const token = jwt.sign(payload, '123456789', {
                expiresIn: 36000,
            });
            res.cookie("name", token )
            res.render('home', {token: token})
        } else {
            return res.json({err: "Sai tài khoản hoặc mật khẩu"})
        }
    }
    catch (error){
          return res.json({err: error + "Đây là lỗi phái khối catch trong router.post('/user/login"})
    }
});
router.get('/create', async (req, res) => {
    res.render('create')
})
router.post('/product/create', async (req: any, res) => {
    try{
        const user = req.decoded;
        console.log(user)
        if(user.role !== "admin"){
            console.log(45)
            return  res.render("error");

        }
        {
            const product = await ProductModel.findOne({name: req.body.name});
            if (!product) {
                let productData = {
                    name: req.body.name,
                    price: req.body.price,
                    category: req.body.category
                }
                const productNew = await ProductModel.create(productData);
                res.render("success")
            } else {
                res.json({err: "Product exited"})
            }
        }
    } catch (error){
        res.json({err: error})
    }
})
router.get('/list', async (req,res) => {
    const products = await ProductModel.find();
    res.render('list', {products: products})
})
export default router;