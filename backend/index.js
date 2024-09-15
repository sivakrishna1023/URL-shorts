const express=require("express");
const cors=require("cors");

const app=express();
const {CreateTableUrls}=require('./DataSchema')
const {getClient}=require('./database')


const corsOptions = {
    origin: [
      "http://localhost:5173",
      "http://localhost:4173",
      "http://localhost:3001",
      "http://localhost:3000",
      process.env.CLIENT_URL,
    ],
    methods: ["GET", "POST", "PUT", "DELETE"], 
    credentials: true,
  };
  
app.use(express.json());
app.use(cors(corsOptions));

CreateTableUrls();


app.post("/short",async (req,res)=>{
    const full=req.body.full;
    if(!full){
        console.log(req.body);
        res.status(200).json({
            message:"Please Enter Value"
        })
        return;
    }
    const FullUrlQuery=`SELECT * FROM shorts WHERE "fullurl" = $1`
    const values=[full];
    const client=await getClient();
    const result=await client.query(FullUrlQuery,values);
    if(result.rows.length>0){
        res.status(200).json(result.rows[0]);
    }else{
        const insertQuery=`INSERT INTO shorts (fullurl) VALUES ($1) RETURNING *`
        const newValues=await client.query(insertQuery,values);
        res.status(200).json(newValues.rows[0]);
    }
})


app.get("/:shortUrl",async (req,res)=>{
    if(!req.params || !req.params.shortUrl || req.params.shortUrl.length==0){
        res.status(200).json({
            message:"Plase enter data"
        })
        return;
    }
    const client= await getClient();
    const findQuery=`SELECT * FROM shorts WHERE "short" = $1`
    const values=[req.params.shortUrl];
    const getUrl=await client.query(findQuery,values);
    if(getUrl && getUrl.rows.length>0){
        res.redirect(`${getUrl.rows[0].fullurl}`);
    }else{
        res.status(200).json({
            message:"No Data Entry Found"
        })
    }
})

app.get("/hi",(req,res)=>{
    res.send("Response Received"); 
});

var port=3000

app.listen(port,()=>{
    console.log(`Server running in port:- ${port}`);
})
