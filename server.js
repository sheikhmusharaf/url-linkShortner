const express=require("express");
const app=express();
const mongoose=require("mongoose");
const ejs=require("ejs");

const ShortUrl = require("./model/shortUrl");




mongoose.connect("mongodb://127.0.0.1:27017/linkshort",{
    useNewUrlParser:true,
    useUnifiedTopology:true,
}).then(()=>{
    console.log("mongoose connection sucess");
}).catch((err)=>{
    console.log(err,"oops mongoose cant connect")
})
const PORT=process.env.PORT || 3000



app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.set("view engine","ejs");


app.get("/",async(req,res)=>{

    const shortUrls=await ShortUrl.find();
    res.render("index",{shortUrls:shortUrls});
})


app.post("/shortUrls",async(req,res)=>{

    try
    {
    
await ShortUrl.create({full:req.body.fullUrl,clicks:0})

res.redirect("/");
    }
    catch(e){
        console.log(e,"shortUrls validation error")
    }

})

app.get("/:shortUrl",async(req,res)=>{

    try
    {
   const shortUrl=await ShortUrl.findOne({short:req.params.shortUrl});

   if(shortUrl==null) return res.status(404).send("url cant get");

   shortUrl.clicks++;
   await shortUrl.save();

   res.redirect(shortUrl.full);
    }catch(e){
        console.log(e,"cantget urls");
    }
})

app.listen(PORT,()=>{
   console.log(`server is runnig at ${PORT}`) 
})