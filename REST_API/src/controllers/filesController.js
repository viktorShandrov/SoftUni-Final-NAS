const router = require("express").Router()
const { isAuth, auth } = require("../utils/authentication");
const fileManager = require("../managers/filesManager");
const userModel = require("../models/userModel");
const fileModel = require("../models/fileModel");
const folderModel = require("../models/folderModel");

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const archiver = require('archiver');
const mongoose = require('mongoose');
const express = require("express");

router.use(express.urlencoded({ extended: true, limit: "1gb" }))
router.use(express.json({ limit: "1gb" }))

//TODO=> isAuth
router.post('/upload', upload.single('file'), async (req, res) => {
  try {

    const { originalname, buffer, size } = req.file;
    const { rootId, parentFolderId } = req.body;
    const userId =req.user._id
    
    
    
    // const newFile = await fileManager.createFile(originalname, buffer, size, rootId, parentFolderId,userId)
    fileManager.getSignedURIFroFileUpload(originalname)

    res.status(201).json(newFile)
  } catch (error) {

    res.status(400).json({message:error.message})
  }
});
router.get('/:id/:elementType/getElementInfo', async (req, res) => {
  try {
    const {id,elementType} = req.params
    let info
    if(elementType=="file"){
       info = await fileManager.getFileInfo(id)
    }else{
       info = await fileManager.getFolderInfo(id)
    }
    res.status(200).json(info)
  } catch (error) {
    console.log('error: ', error);

    res.status(400).json({message:"No such file"})
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

    res.status(400).json({message:error.message})
  }
});



router.get("/:id/:elementType/download", isAuth, async (req, res) => {
  try {
    let {id,elementType} = req.params;

    if(elementType==="file"){

      await fileManager.downloadFile(id,res)

  }else{
      await fileManager.downloadFolder(id,res)
  }
    
  } catch (error) {
    console.log('error: ', error);
    res.status(400).json({message:error.message})
  }
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
    res.status(409).json({message:error.message})
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
    const payload = await fileManager.getTopFileExts(rootId)
    res.status(200).json(payload)
  } catch (error) {
    console.log(error.message);
    res.status(409).json({message:"Problem with fetching top file extensions info"})
  }
})
router.get("/:rootId/getTopFolders", async (req, res) => {
  try {
    const { rootId } = req.params
    const userId = req.user._id
    const payload = await fileManager.getTopFolders(rootId,userId)
    res.status(200).json(payload)
  } catch (error) {
    console.log(error.message);
    res.status(409).json({message:"Problem with fetching top file extensions info"})
  }
})
router.post("/deleteItem", async (req, res) => {
  try {
    const {elementId,elementType, parentFolderId } = req.body
    const {rootId,_id}=req.user


      if(elementType === "file"){
        await fileManager.deleteFile(elementId,parentFolderId,rootId,_id)
      }else if(elementType === "directory"){
        await fileManager.deleteFolder(elementId, parentFolderId,_id)
      }
    res.status(200).end()
  } catch (error) {

    res.status(400).json({message:error.message})
  }
})

router.post("/:id/getDetails",async (req,res)=>{
  try {
    const {elementType} = req.body
    const {id} = req.params

  const  element = await fileManager.getDetails(id,elementType)
  res.status(200).json({element})
} catch (error) {
    res.status(400).json({message:error.message})
  }
})
router.get("/:id/getDirectory", async (req, res) => {
  try {

    const id = req.params.id
    const userId = req.user._id
    const folder = await fileManager.getFolder(id,userId,req.user.rootId)
    res.status(200).json(folder)
  } catch (error) {
    res.status(400).json({message:error.message})
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

    const {_id,rootId} = req.user
    const {folderId,userId} = req.body
    const folder = await folderModel.findById(folderId)
    if(!folder) throw new Error("No such folder")
    
    if(_id.toString()==folder.ownerId.toString()){
      await fileManager.unAuthoriseUserFromFolder(rootId,userId,folderId)
    }else{
      throw new Error("You are not able to unshare this folder due to ownership issues")
    }
    res.status(200).end()
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
    res.status(400).json({message:error.message})
  }
})
router.get("/getSharedWithMeFolders", isAuth, async (req, res) => {
  try {
    const folders = await fileManager.getSharedWithMeFolders(req.user._id)
    res.status(200).json(folders)
  } catch (error) {
    res.status(400).json({message:error.message})
  }
})
router.post("/checkIfStorageHaveEnoughtSpace", async (req, res) => {
  try {
    console.log('req.body: ', req.body);
    const Bytes = req.body.Bytes
    const rootId = req.body.rootId
    console.log('Bytes: ', Bytes);
    console.log('rootId: ', rootId);
    await fileManager.checkIfStorageHaveEnoughtSpace(undefined,rootId,Bytes)
    console.log("end");
    res.status(200).end()
  } catch (error) {
    res.status(400).json({message:error.message})
  }
})
router.post("/:folderId/autoriseUserToFolder", async (req, res) => {
  try {
    const {_id,rootId} = req.user
    const {folderId} = req.params
    const {email} = req.body
    const user = await userModel.findOne({email})
    if(!user){
      throw new Error("No such user")
    }
    const folder = await folderModel.findById(folderId)

    if(_id.toString()==folder.ownerId.toString()){
      await fileManager.autorizeUserToEveryNestedFolder(user._id,folderId,rootId)
    }else{
      throw new Error("You are not able to share this folder due to ownership issues")
    }

    res.status(200).end()
  } catch (error) {
    console.log(error);
    res.status(400).json({message:error.message})
  }
})
router.post("/makeFolderPublic", async (req, res) => {
  try {
    const {folderId} = req.body
    const userId = req.user._id
      await fileManager.makeFolderPublic(folderId,userId)
    res.status(200).json({message:"Successfully made public"})
  } catch (error) {
    res.status(400).json({message:error.message})
  }
})
router.post("/unPublicFolder", async (req, res) => {
  try {
    const {folderId} = req.body
    const userId = req.user._id
      await fileManager.unPublicFolder(folderId,userId)
    res.status(200).json({message:"Successfully made un-public"})
  } catch (error) {
    res.status(400).json({message:error.message})
  }
})
module.exports = router