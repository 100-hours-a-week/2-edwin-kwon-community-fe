import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getTest = (req, res) => {
  console.log(__dirname);
  res.sendFile(path.join(__dirname, "../public", "index.html"));
};

export const getSlow = (req, res) => {
  setTimeout(() => {
    res.sendFile(path.join(__dirname, "../public", "index.html"));
  }, 4000);
};

export const postTest = (req, res) => {
  return res.status(200).json({
    status: 200,
    message: "post ok",
    data: req.body,
  });
};

export const putTest = (req, res) => {
  return res.status(201).json({
    status: 201,
    message: "put ok",
    data: req.body,
  });
};

export const patchTest = (req, res) => {
  return res.status(200).json({
    status: 200,
    message: "patch ok",
    data: req.body,
  });
};

export const deleteTest = (req, res) => {
  return res.status(204).end();
};
