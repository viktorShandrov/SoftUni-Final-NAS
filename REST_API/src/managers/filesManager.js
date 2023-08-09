const folderModel = require("../models/folderModel")
const fileModel = require("../models/fileModel")
const rootModel = require("../models/rootModel")
const userModel = require("../models/userModel")
const mongoose = require("mongoose")
const uuid = require("uuid")
const { ObjectId } = require('mongodb');




exports.createRoot = async (ownerId) => {
    const root = await rootModel.create({ownerId, dirComponents: [], autorised: [ownerId], isPublic: false,storageVolume:10000000000,usedStorage:0 })
    return root._id
}
exports.getFileInfo = (fileId) => {
    return fileModel.findById(fileId)
}
exports.checkIfFileNameAlreadyExists = async (parentFolderId,name) => {
    console.log('name1: ', name);
    const file = await folderModel.findById(parentFolderId).populate("fileComponents") || await rootModel.findById(parentFolderId).populate("fileComponents")
    const onlyName = name.substring(0,name.lastIndexOf("."))
    const extension = name.substring(name.lastIndexOf(".")+1)
    for (const component of file.fileComponents) {
        if(component.fileName===onlyName&&component.type===extension){
            return true
        }
    }
    return false
}


exports.getAuthorisedWithUsersFolder = async (rootId,ownerId) => {
   const folders = await folderModel.find({rootId}).populate("autorised");

    const filtered =  folders.filter((folder)=>folder.autorised.some((user) => user._id.equals(ownerId)&&folder.autorised.length>1))
    const payload=[]
    for (const folder of filtered) {
        for (const user of folder.autorised) {
            if(!user._id.equals(ownerId)){
                payload.push({folderId:folder._id,userEmail:user.email,folderName:folder.name,userId:user._id})
            }
        }
    }
    return payload
}
exports.unAuthoriseUserFromFolder = async (folderId,userId,ownerId) => {
    const folder = await folderModel.findById(folderId)
    if(!folder.ownerId.equals(ownerId)){
        throw new Error("You are not the owner")
    }
    const index = folder.autorised.indexOf(userId)
    if(index>-1){
        folder.autorised.splice(index,1)
        await folder.save()
    }else{
        throw new Error("No such shared user")
    }
}
exports.getFolder = async (id) => {
    const folder = await folderModel.findById(id).populate("dirComponents").populate("fileComponents") || await rootModel.findById(id).populate("dirComponents").populate("fileComponents")
    console.log(folder);
    return folder
}
exports.getFilesFromSharedFolder = async (folderId) => {
    const folder = await folderModel.findById(folderId).populate("fileComponents") 
    return folder.fileComponents
}

exports.createFile = async (originalname, buffer, size, rootId, parentFolderId) => {
    console.log('parentFolderId: ', parentFolderId);

    const folder = await folderModel.findById(parentFolderId).populate("fileComponents") || await rootModel.findById(parentFolderId).populate("fileComponents")
    if (folder.fileComponents.some(el => el.fileName === originalname)) {
        throw new Error("File with the same name already exists.")
    }

    const gridFile = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
        bucketName: 'files'
    });

    const id = uuid.v4()
    const uploadStream = gridFile.openUploadStreamWithId(id, originalname);

    uploadStream.write(buffer);
    uploadStream.end();


    const fullFileName = uploadStream.filename;
    const onlyName = fullFileName.substring(0,fullFileName.lastIndexOf('.'));
    const fileExtension = fullFileName.substring(fullFileName.lastIndexOf('.') + 1);


    const newFile = await fileModel.create({
        fileChunks: uploadStream.id,
        type: fileExtension,
        length: size,
        uploadDate: uploadStream.uploadDate,
        fileName: onlyName,
        rootId: rootId,
    })

    folder.fileComponents.push(newFile._id)
    await folder.save()
    const root = await rootModel.findById(rootId)
    console.log('2root: ', root);
    root.usedStorage+=newFile.length
    await root.save()
    return newFile
}

exports.addBytesToStorage= async(rootId,Bytes)=>{
    const root = await rootModel.findById(rootId)
    console.log('root1: ', root);
    root.usedStorage+=Bytes
    await root.save()
}
exports.checkIfStorageHaveEnoughtSpace= async(rootId,Bytes)=>{
    const root = await rootModel.findById(rootId)
    if(root.usedStorage+Bytes>root.storageVolume){
        throw new Error("There is no enought space")
    }
    
}
exports.createFolder = async (name, rootId, parentFolderId) => {

    const ownerId = (await userModel.findOne({ rootId }))._id

    const folder = await folderModel.findById(parentFolderId).populate("dirComponents") || await rootModel.findById(parentFolderId).populate("dirComponents")

    if (folder.dirComponents.length > 0) {
        if (folder.dirComponents.some(el => el.name === name)) {
            throw new Error("Folder with the same name already exist.")
        }
    }

    const newFolder = await folderModel.create({ ownerId, name, rootId, dirComponents: [], autorised: [ownerId], isPublic: false, parentFolder: parentFolderId })
    folder.dirComponents.push(newFolder._id)
    folder.save();

    return newFolder
}


exports.deleteFolder = async (folderId, parentFolderId) => {

    const parentFolder = await folderModel.findById(parentFolderId) || await rootModel.findById(parentFolderId)

    const folder = await folderModel.findById(folderId)
    folder.autorised.splice(0)

    parentFolder.dirComponents.splice(parentFolder.dirComponents.findIndex(objId => objId.toString() === folderId), 1)
    parentFolder.save()
    folder.save()
}
exports.deleteFile = async (fileId, parentFolderId) => {

    const parentFolder = await folderModel.findById(parentFolderId) || await rootModel.findById(parentFolderId)

    parentFolder.fileComponents.splice(parentFolder.fileComponents.findIndex(objId => objId.toString() === fileId), 1)
    parentFolder.save()
    const root = await rootModel.findById(parentFolderId)
    const file = await fileModel.findById(fileId)
    root.usedStorage-=file.length
    await root.save()
    await file.deleteOne()
}


exports.getAllParentAutorisedFolders = async (folderId, userId) => {
    const folders = []
    async function getParentAutorisedFolder(folderId, userId) {

        const folder = await folderModel.findById(folderId);


        if (folder?.autorised.includes(userId)) {

            folders.unshift({ name: folder.name, _id: folder._id })
            await getParentAutorisedFolder(folder.parentFolder, userId)
        }
    }
    await getParentAutorisedFolder(folderId, userId)
    return folders
}

exports.getOnlyRootInfo=async(rootId)=>{
    const root = await rootModel.findById(rootId)
    return root
}
exports.getTopFileExts=async(rootId)=>{
    let files = await fileModel.find({rootId})
    const allfileExt = {}
    for (const file of files) {
        if(allfileExt.hasOwnProperty(file.type)){
            allfileExt[file.type]+=1
        }else{
            allfileExt[file.type]=1
        }
    }

    const sortedTopFIleExt = Object.entries(allfileExt).sort((a,b)=>{
       return b[1]-a[1]
    })
    const payload=[]
    for (let index = 0; index < 3; index++) {
        const element = sortedTopFIleExt[index];
        if(element){
            payload.push({name:element[0],count:element[1]})
        }
    }


    return payload
}
exports.getTopFolders=async(rootId,userId)=>{
    const folders = await folderModel.find({rootId})
    const filtered = folders.filter((folder)=>folder.autorised.includes(userId))

    const sortedTopFIleExt = filtered.sort((a,b)=>b.fileComponents.length-a.fileComponents.length)

    const payload =[]
    for (const folder of sortedTopFIleExt) {
        payload.push({name:folder.name,count:folder.fileComponents.length})
    }
    


    return payload
}

exports.autoriseUserToFolder = async (folderId,email)=>{
    const user = await userModel.findOne({email})
    if(!user){
        throw new Error("No such user")
    }
    const userId = user._id
    const folder = await folderModel.findById(folderId)
    if(!folder.autorised.includes(userId)){
        folder.autorised.push(userId)
    }else{
        throw new Error("User is already autorised")
    }
    await folder.save()

}
exports.getSharedWithMeFolders = async (userId)=>{
    console.log('userId: ', userId);
    const folders = await folderModel.find({
        $and:[
            {autorised:{$in:[new ObjectId(userId)]}},
            {ownerId: { $ne: new ObjectId(userId) }}
        ]
    })
    return folders
}


