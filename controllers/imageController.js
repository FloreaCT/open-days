const multer = require("multer");
const path = require("path");
const db = require("../config/session");
const fs = require("fs");

// Ensure the directory exists
const uploadDir = path.join(__dirname, "../public/images/uploadedImages");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Define storage strategy for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

// Initialize multer with the defined storage
const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // Limit to 2MB
});

// Image handler function
const image = (req, res) => {
  if (!req.file) {
    console.log("No file uploaded");
    return res.redirect("/myEvents");
  }

  const imgName = "/images/uploadedImages/" + req.file.filename;
  const insertData = `UPDATE Events SET image = '${imgName}' WHERE userId = ${req.user.id}`;

  db.myDatabase.query(insertData, (err, result) => {
    if (err) {
      console.error("Error updating database:", err);
      return res.status(500).send("An error occurred while saving the image.");
    }

    console.log("Image uploaded and database updated successfully:", imgName);
    res.redirect("/myEvents");
  });
};

// Export both the upload middleware and the image function
module.exports = {
  upload, // multer middleware
  image, // function to handle the image route
};
