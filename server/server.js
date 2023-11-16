const express = require("express");
const mongoose = require("mongoose")
const app = express();
require('dotenv').config()
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const Comment = require('./model/Comment');
const io = new Server(server, {
  cors: {
    origin: "*",
  }
});


io.on('connection', (socket) => {
  socket.on("getData", async () => {
    const comments = await Comment.find({}).lean();
    socket.emit("takeData", comments)
  });
  socket.on("getIp", () => {
    let address = socket.handshake.address
    socket.emit("takeIp", address)
  })
  socket.on("takeData", async (text, grade, lecturer) => {
    const comment = new Object({
        grade: grade,
        text: text,
        lecturer: lecturer,
        date: new Date(),
        name: 'Anonymous',
        likes: [],
        dislikes: []
    });

    await Comment.collection.insertOne(comment)
  });
  socket.on("getSpecificData", async (lecturer) => {
    const comments = await Comment.find({}).lean();
    const newArr = []
    comments.map((item) => {
      if (item.lecturer == lecturer)
      {
        newArr.push(item)
      }
    })
    socket.emit("takeSpecificData", newArr)
  });
  function rate()
  {}
  socket.on("like", async (id) => {
    let address = socket.handshake.address
    const comment = await Comment.findOne({_id: id});
    const likesList = comment.likes;
    const index = likesList.indexOf(address)
    if (index !== -1)
    {
      likesList.splice(index, 1);
    }
    else
    {
      likesList.push(address)
    }
    let newvalue = { $set: {likes: likesList} };
    socket.emit("takeLikes", likesList)
    await Comment.updateOne({_id: id}, newvalue);
    
  })
  socket.on("dislike", async (id) => {
    let address = socket.handshake.address
    const comment = await Comment.findOne({_id: id});
    const dislikesList = comment.dislikes;
    const index = dislikesList.indexOf(address)
    if (index !== -1)
    {
      dislikesList.splice(index, 1);
    }
    else
    {
      dislikesList.push(address)
    }
    let newvalue = { $set: {dislikes: dislikesList} };
    socket.emit("takeDislikes", dislikesList)
    await Comment.updateOne({_id: id}, newvalue);
  })
});


async function start() {
  try {
    mongoose.connect(process.env.TOKEN);
    server.listen(3001, () => {
      console.log("listening on http://127.0.0.1:3000/");
    });
  } catch (e) {
    console.log(e);
  }
}

start();
