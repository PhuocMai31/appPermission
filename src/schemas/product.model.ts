import {Schema, model} from "mongoose";

interface IProduct {
    name: string,
    price: string,
    category: string
}
const productSchema = new Schema<IProduct>({
    name: String,
    price: String,
    category: String,
})
const ProductModel = model<IProduct>('Product', productSchema);
export {ProductModel};