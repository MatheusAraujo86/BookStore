import express from "express";
import { PORT, mongoDBURL } from "./config.js";
import mongoose from "mongoose";
import { Book } from "./models/bookModel.js";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    console.log(req)
    return res.status(234).send("Hello World");
})

//Route for saving new book
app.post("/books", async (req, res) => {
  try {
    if (!req.body.title || !req.body.author || !req.body.published) {
      return res.status(400).send({ message: "All fields are required" });
    }
    const newBook = {
      title: req.body.title,
      author: req.body.author,
      published: req.body.published,
    };
    const book = new Book(newBook);
    return res.status(201).send(await book.save());

    } catch (error) {
    console.log(error.message);
    return res.status(500).send({message: error.message});
    }
});

//Route for getting all books
app.get("/books", async (req, res) => {
  try {
    const books = await Book.find();
    return res.status(200).send({
      count: books.length,
      data: books
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({message: error.message});
  }
});

//Route for getting a single book bi yd
app.get("/books/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id);
    return res.status(200).send(book);
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({message: error.message});
  }
});

//Route for updating a book
app.put("/books/:id", async (req, res) => {
  try {
    if (!req.body.title || !req.body.author || !req.body.published) {
      return res.status(400).send({ message: "All fields are required" });
    }
    const { id } = req.params;
    const result = await Book.findByIdAndUpdate(id, req.body);

    if (!result) {
      return res.status(404).send({ message: "Book not found" });
    }
    return res.status(200).send({message: "Book updated successfully"});

  } catch (error) {
    console.log(error.message);
    return res.status(500).send({message: error.message});
  }
  });

mongoose.connect(mongoDBURL).then(() => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
  
}).catch((err) => {
  console.log("Error: ", err);
});