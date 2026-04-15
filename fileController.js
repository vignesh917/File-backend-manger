const db = require('../config/db');
const fs = require('fs');
const path = require('path');

// Upload File
exports.uploadFile = (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const sql = "INSERT INTO files (filename, filepath) VALUES (?, ?)";
  db.query(sql, [file.filename, file.path], (err, result) => {
    if (err) return res.status(500).json(err);

    res.json({
      message: "File uploaded successfully",
      file: file.filename
    });
  });
};

// List Files
exports.listFiles = (req, res) => {
  db.query("SELECT * FROM files", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

// Download File
exports.downloadFile = (req, res) => {
  const fileId = req.params.id;

  db.query("SELECT * FROM files WHERE id = ?", [fileId], (err, results) => {
    if (err || results.length === 0) {
      return res.status(404).json({ message: "File not found" });
    }

    const filePath = path.resolve(results[0].filepath);
    res.download(filePath);
  });
};

// Delete File
exports.deleteFile = (req, res) => {
  const fileId = req.params.id;

  db.query("SELECT * FROM files WHERE id = ?", [fileId], (err, results) => {
    if (err || results.length === 0) {
      return res.status(404).json({ message: "File not found" });
    }

    const filePath = results[0].filepath;

    fs.unlink(filePath, (err) => {
      if (err) return res.status(500).json(err);

      db.query("DELETE FROM files WHERE id = ?", [fileId], (err) => {
        if (err) return res.status(500).json(err);

        res.json({ message: "File deleted successfully" });
      });
    });
  });
};