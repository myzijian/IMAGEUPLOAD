// npm i cors express express-fileupload uuid
//npm i -D nodemon concurrently
const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

const app = express();
app.use(cors());
app.use(fileUpload());
app.use((err, req, res, next) => {
  res.status(500).send("Server Error");
});

app.post("/upload", (req, res) => {
  if (!req.files || !req.files.file) {
    return res.status(400).json({ error: "No File Uploaded" });
  }
  const maxSize = 10 * 1024 * 1024; //10mb
  const file = req.files.file;
  if (file.size > maxSize) {
    return res.status(400).json({ error: "File size too large" });
  }

  //unique file name
  const fileName = uuidv4() + path.extname(file.name);
  const upload_dir = `${__dirname}/client/public/uploads`;
  file.mv(`${upload_dir}/${fileName}`, (err) => {
    if (err) {
      return res.status(500).json({ error: "Server Error" });
    }
    res.json({ fileName: fileName, filePath: `/uploads/${fileName}` });
  });
});

app.listen(4000, () => console.log("Server Started running on port 4000"));
