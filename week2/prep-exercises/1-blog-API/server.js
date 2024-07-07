const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());


//creating a new post
app.post("/posts", (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).send("Title and content are required");
    return;
  }
  fs.writeFile(`${title}.txt`, content )

  res.send("ok");
});

// Reading a post

  app.get("/posts/:title", (req, res) => {
 const { title } = req.params;
const hasPost = fs.existsSync(`${title}`);
if (!hasPost) {
  const post = fs.readFileSync(`${title}.txt`, "utf-8");
  res.jason({ title, content: post });
}else{
  res.status(404).send("Post not found");
}  
  })
  ////////
   


// YOUR CODE GOES IN HERE
app.get("/", function (req, res) {
  res.send("Hello World");
});
app.get("/", function (req, res) {
 
  const { title, content } = req.body;
  const filePath = path.join(__dirname, `${title}.txt`);
  try {
    fs.readFileSync(filePath, content);
    res.send("ok");
    
  } catch (error) {
    res.status(500);
    res.send("Error writing showing file");
  }
});

// update a post
app.put("/posts/:title", (req, res) => {
  // How to get the title and content from the request?
  // What if the request does not have a title and/or content?
  const { title } = req.params;
  const { content } = req.body.content;
  if (!content || !title)  {
    return res.status(400).send('Content is required');
}


  const updatedBlog = fs.writeFileSync(title, content);
  res.send(updatedBlog);
})


  
app.delete('/blogs/:title', (req, res) => {
  // How to get the title from the url parameters?
  const { title } = req.params;
    const filePath = path.join(__dirname, `${title}.txt`);

    if (fs.existsSync(filePath)) {
        try {
            fs.unlinkSync(filePath);
            res.send("ok");
        } catch (error) {
            console.error('Error deleting file:', error);
            res.status(500).send("Error deleting file");
        }
    } else {
        res.status(404).send('This post does not Found!');
    }
})





app.listen(3000);
console.log('Hello the Server is running on http://localhost:3000');