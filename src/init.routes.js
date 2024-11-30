import BrandRouter from "./modules/Brands/brand.router.js"
import reviewRouter from "./modules/Review/Review.router.js"
import SubcategoryRouter from "./modules/SubCatogry/SubCategory.router.js"
import addressRouter from "./modules/address/address.router.js"
import cartRouter from "./modules/cart/cart.router.js"
import categoryRouter from "./modules/category/category.router.js"
import CouponRouter from "./modules/coupon/coupon.router.js"
import orderRouter from "./modules/order/order.router.js"
import productRouter from "./modules/products/product.router.js"
import userRouter from "./modules/user/user.router.js"
import wishListRouter from "./modules/wishList/wishList.router.js"
import { generateError } from "./utiles/generateError.js"
import { globalError } from "./utiles/globalErrorMidillware.js"


export function init(app) {
app.use('/Api/v1/categories',categoryRouter)
app.use('/Api/v1/subcategories',SubcategoryRouter)
app.use('/Api/v1/Brands',BrandRouter)
app.use('/Api/v1/products',productRouter)
app.use('/Api/v1/users',userRouter)
app.use('/Api/v1/reviews',reviewRouter)
app.use('/Api/v1/wishLists',wishListRouter)
app.use('/Api/v1/address',addressRouter)
app.use('/Api/v1/Coupons',CouponRouter)
app.use('/Api/v1/carts',cartRouter)
app.use('/Api/v1/orders',orderRouter)
app.all('*',(req,res,next)=>{
    next(new generateError("invalid_url - cannot access this endPoint"+req.originalUrl,404))

})
app.use(globalError)

}