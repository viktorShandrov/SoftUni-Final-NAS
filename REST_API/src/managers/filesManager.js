const folderModel = require("../models/folderModel")
const fileModel = require("../models/fileModel")
const rootModel = require("../models/rootModel")
const userModel = require("../models/userModel")
const mongoose = require("mongoose")
const uuid = require("uuid")




exports.createRoot = async (ownerId) => {
    const root = await rootModel.create({ dirComponents: [], autorised: [ownerId], isPublic: false })
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


exports.getFolder = async (id) => {
    const folder = await folderModel.findById(id).populate("dirComponents").populate("fileComponents") || await rootModel.findById(id).populate("dirComponents").populate("fileComponents")
    return folder
}

exports.createFile = async (originalname, buffer, size, rootId, parentFolderId) => {

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
    return newFile
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
    console.log('parentFolder: ', parentFolder);


    parentFolder.dirComponents.splice(parentFolder.dirComponents.findIndex(objId => objId.toString() === folderId), 1)
    parentFolder.save()
}
exports.deleteFile = async (fileId, parentFolderId) => {

    const parentFolder = await folderModel.findById(parentFolderId) || await rootModel.findById(parentFolderId)

    parentFolder.fileComponents.splice(parentFolder.fileComponents.findIndex(objId => objId.toString() === fileId), 1)
    parentFolder.save()
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


