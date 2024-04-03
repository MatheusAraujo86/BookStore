import express from "express";
import { Book } from "../models/bookModel.js";
const router = express.Router();


//Route for saving new book
router.post("/", async (req, res) => {
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
  router.get("/", async (req, res) => {
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
  
  //Route for getting a single book bi id
  router.get("/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const book = await Book.findById(id);
      return res.status(200).send(book);
    } catch (error) {
      console.log(error.message);
      return res.status(500).send({message: error.message});
    }
  });
  
  //Route for deleting a book
  router.delete('/:id', async (req, res) => {
    try{
      const { id } = req.params;
      const result = await Book.findByIdAndDelete(id);
  
      if(!result){
        return res.status(404).send({message: "Book not found"})
      }
  
      return res.status(200).send({message: "Book deleted successfully"});
  
    } catch (error) {
      console.log(error.message);
      return res.status(500).send({message: error.message});
    }
  
  });
  
  //Route for updating a book
  router.put("/:id", async (req, res) => {
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

    export default router;