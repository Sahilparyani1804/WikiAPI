const express=require("express");
const bodyParser=require("body-parser");
const app=express();
app.set("view-engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
const mongoose=require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/wikiDB",{useNewUrlParser:true}).then(console.log("connected to mongodb"));

const articleSchema={
    title:String,
    content:String
};

const Article=mongoose.model("Article",articleSchema);



app.route("/articles")
.get(function(req,res){
    Article.find({}).then(foundArticles=>{
        res.send(foundArticles);
    }).catch(function(err){
        res.send(err);
    })
})

.post(function(req,res){
    
    const newArticle=new Article({
        title:req.body.title,
        content:req.body.content
    });
    newArticle.save().catch(function(err){
        res.send(err);
    });
}
)

.delete(function(req,res){
    Article.deleteMany({}).catch(function(err){
        res.send(err);
    })
});


app.route("/articles/:articleTitle")

.get(function(req,res){
    Article.findOne({title:req.params.articleTitle}).then(foundArticle=>{
          if(foundArticle){
            res.send(foundArticle)
            
          }else{
            res.send("no match");
          }
    })
})

.put(function(req,res){
    Article.findOneAndUpdate({title:req.params.articleTitle},{title:req.body.title,content:req.body.content},{new:true}).then(updatedArticle=>{
        if(updatedArticle){
            res.send(updatedArticle);
        }else{
            res.send("no match");
        }
    }).catch(function(err){
        res.send(err);
    })
     
})
.patch(function(req,res){
       Article.findOneAndUpdate({title:req.params.articleTitle},{$set:req.body}).then(updatedArticle=>{
        if(updatedArticle){
            res.send(updatedArticle);
        }else{
            res.send("no match");
        }
       }).catch(function(err){
        res.send(err);
       })
}).delete(function(req,res){
       Article.findOneAndDelete({title:req.params.articleTitle}).catch(function(err){
        if(!err){
            res.send("succesfully deleted the article");
        }else{
            res.send(err);
        }
       })
});



















app.listen("3000",function(res){
    console.log("server has started on 3000");
})