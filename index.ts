import express from 'express';
import bodyParser from "body-parser";
import * as mongoose from "mongoose";
import router from "./src/router/router";
import cookie from 'cookie';
import cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';
dotenv.config();
const port = 3456;
const app = express();
app.use(bodyParser.json());
mongoose.set('strictQuery', true);
console.log(process.env.DATABASE_HOST)
const DB_URL = `mongodb+srv://phuwowsc:Phuocmai123@app.g6n20yq.mongodb.net/?retryWrites=true&w=majority`;
const url = 'mongodb://127.0.0.1:27017/dbtest';
mongoose.connect(DB_URL)
.then(()=> {console.log('connect database success')})
    .catch( (error) => {console.log(error.message)});
app.set('view engine', 'ejs');
app.set('views','./src/views');
app.use('/api', router)
app.use(cookieParser("12345"));


app.listen(port, () =>{
    console.log('app running on port' + port);
})
