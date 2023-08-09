const router = require("express").Router()
const { isAuth, auth } = require("../utils/authentication");
const fileManager = require("../managers/filesManager");

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const mongoose = require('mongoose');
const userModel = require("../models/userModel");
const fileModel = require("../models/fileModel");



//TODO=> isAuth
router.post('/upload', upload.single('file'), async (req, res) => {
  try {

    const { originalname, buffer, size } = req.file;
    const { rootId, parentFolderId } = req.body;
    
    
    
    const newFile = await fileManager.createFile(originalname, buffer, size, rootId, parentFolderId)
    

    res.status(201).json(newFile)
  } catch (error) {
    console.log('error: ', error);
    console.log(1, error.message);
    res.status(400).json({message:error.message})
  }
});
router.get('/:id/getFileInfo', async (req, res) => {
  try {
    const id = req.params.id
    const fileInfo = await fileManager.getFileInfo(id)
    res.send(JSON.stringify(fileInfo))
  } catch (error) {

    console.log(1, error.message);
    res.send("No such file!", error.message)
  }
});
router.get('/:parentFolderId/:name/checkIfFileNameAlreadyExists', async (req, res) => {
  try {
    const name = req.params.name
    const parentFolderId = req.params.parentFolderId
    const alreadyExists = await fileManager.checkIfFileNameAlreadyExists(parentFolderId,name)
    if(alreadyExists){
      res.status(409).send(JSON.stringify({message:"File with same name and type already exist"}))
    }else{
      res.status(200).send()
    }
  } catch (error) {

    console.log(1, error.message);
    res.send(JSON.stringify(error.message))
  }
});



router.get("/:id/download", isAuth, async (req, res) => {
  const id = req.params.id;
  const fileFromDB = await fileModel.findById(id)
  const gridFile = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: 'files'
  });

  const downloadStream = gridFile.openDownloadStream(fileFromDB.fileChunks);

  res.set({
    'Content-Type': 'application/octet-stream',
    'Content-Disposition': `attachment; filename="${fileFromDB.fileName}.${fileFromDB.type}"`
  });

  downloadStream.pipe(res);
})



router.post("/createFolder", async (req, res) => {
  try {
    const { folderName, parentFolderId } = req.body
    console.log('folderName, parentFolderId: ', folderName, parentFolderId);
    const rootId = (await userModel.findById(req.user._id)).rootId
    const newFolder = await fileManager.createFolder(folderName, rootId, parentFolderId)
    res.status(201).json({newFolder})
  } catch (error) {
    console.log(error.message);
    res.status(409).json({message:"Folder with same name already exists"})
  }
})
router.get("/:rootId/getOnlyRootInfo", async (req, res) => {
  try {
    const { rootId } = req.params
    const folder = await fileManager.getOnlyRootInfo(rootId)
    res.status(200).json({folder})
  } catch (error) {
    console.log(error.message);
    res.status(409).json({message:"Problem with fetching root info"})
  }
})
router.get("/:rootId/topFileExts", async (req, res) => {
  try {
    const { rootId } = req.params
    const topFileExts = await fileManager.getTopFileExts(rootId)
    res.status(200).json({topFileExts})
  } catch (error) {
    console.log(error.message);
    res.status(409).json({message:"Problem with fetching top file extensions info"})
  }
})
router.get("/:rootId/getTopFolders", async (req, res) => {
  try {
    const { rootId } = req.params
    const userId = req.user._id
    const topFolders = await fileManager.getTopFolders(rootId,userId)
    res.status(200).json({topFolders})
  } catch (error) {
    console.log(error.message);
    res.status(409).json({message:"Problem with fetching top file extensions info"})
  }
})
router.post("/deleteItem", async (req, res) => {
  try {
    const {elementId,elementType, parentFolderId } = req.body
    if(elementType === "file"){
      console.log("deleting file");
      await fileManager.deleteFile(elementId,parentFolderId)
    }else if(elementType === "directory"){
      console.log("deleting dolder");
      await fileManager.deleteFolder(elementId, parentFolderId)
    }
    res.end()
  } catch (error) {
    console.log(error.message);
    res.send(JSON.stringify(error.message))
  }
})
router.get("/:id/getDirectory", async (req, res) => {
  try {

    const id = req.params.id
    const folder = await fileManager.getFolder(id)
    res.send(JSON.stringify(folder))
  } catch (error) {
    res.send(error.message)
  }
})
router.get("/:folderId/getFilesFromSharedFolder", async (req, res) => {
  try {

    const folderId = req.params.folderId
    const files = await fileManager.getFilesFromSharedFolder(folderId)
    res.status(200).json(files)
  } catch (error) {
    res.status(400).json({message:error.message})
  }
})
router.get("/getAuthorisedWithUsersFolder",isAuth, async (req, res) => {
  try {

    const {_id,rootId} = req.user

    const folders = await fileManager.getAuthorisedWithUsersFolder(rootId,_id)
    res.status(200).json(folders)
  } catch (error) {
    res.status(400).json({message:error.message})
  }
})
router.post("/unAuthoriseUserFromFolder",isAuth, async (req, res) => {
  try {

    const {_id} = req.user
    const {folderId,userId} = req.body
    await fileManager.unAuthoriseUserFromFolder(folderId,userId,_id)
    res.status(200).json({status:"ok"})
  } catch (error) {
    console.log('error: ', error);
    res.status(400).json({message:error.message})
  }
})
router.get("/:id/getAllParentAutorisedFolders", isAuth, async (req, res) => {
  try {
    const id = req.params.id;
    const folders = await fileManager.getAllParentAutorisedFolders(id, req.user._id)
    res.send(folders)
  } catch (error) {
    console.log(error.message);
    res.send(error.message)
  }
})
router.get("/getSharedWithMeFolders", isAuth, async (req, res) => {
  try {
    const folders = await fileManager.getSharedWithMeFolders(req.user._id)
    res.status(200).json(folders)
  } catch (error) {
    console.log(error.message);
    res.status(400).json(error.message)
  }
})
router.post("/checkIfStorageHaveEnoughtSpace", async (req, res) => {
  try {
    console.log('req.body: ', req.body);
    const Bytes = req.body.Bytes
    const rootId = req.body.rootId
    console.log('Bytes: ', Bytes);
    console.log('rootId: ', rootId);
    await fileManager.checkIfStorageHaveEnoughtSpace(rootId,Bytes)
    console.log("end");
    res.status(200).end()
  } catch (error) {
    console.log(error.message);
    res.status(400).json({message:error.message})
  }
})
router.post("/:folderId/autoriseUserToFolder", async (req, res) => {
  try {
    const {email} = req.body
    const folderId = req.params.folderId
    await fileManager.autoriseUserToFolder(folderId,email)
    res.status(200).end()
  } catch (error) {
    console.log(error);
    res.status(400).json({message:error.message})
  }
})
module.exports = router