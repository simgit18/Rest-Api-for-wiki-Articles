const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB");

const articleSchema = mongoose.Schema({
    title: String,
    content: String
})

const Article = mongoose.model("Article",articleSchema);


app.route("/articles")
.get(function(req,res){
    Article.find({},function(err,foundArticles){
        res.send(foundArticles);
    })
})
.post(function(req,res){
    const article = new Article({
        title: req.body.title,
        content: req.body.content
    })

    article.save(function(err){
        if(!err){
            Article.find({},function(err,data){
                console.log(data);
            })
            
        }
    })
    
    res.send("Succesfully sent")
})
.delete(function(req,res){
    Article.deleteMany({},function(err){
        if(!err){
            console.log("Successfully deleted all the articles");
        }
    })
});


//request targetting specific articles//////
app.route("/articles/:articleTitle")
.get(function(req,res){
    Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
        if(foundArticle){
        res.send(foundArticle);
        }
        else{
            console.log(err)
        }
    });
})
.put(function(req,res){
    Article.updateOne({title:req.params.articleTitle},
        {   
            title: req.body.title,
            content: req.body.content
        },
        function(err,updatedArticle){
            if(!err){
                res.send("Update Successfull");
            }
            else{
                res.send(err);
            }
        }
        )
})
.patch(function (req,res) {

    Article.updateOne({title:req.params.articleTitle},
        {   
            $set: req.body,
        },
        function(err,updatedArticle){
            if(!err){
                res.send("Update Successfull");
            }
            else{
                res.send(err);
            }
        }
        )

  })
  .delete(function(req,res){
    Article.deleteOne({title:req.params.articleTitle},function(err){
        if(!err){
            res.send("Successfully deleted the article on "+req.params.articleTitle);
        }
        else{
            res.send(err);
        }
    })
  });







app.listen(3000, function(){
    console.log("Server stareted on port 3000");
})