const folderModel = require("../models/folderModel")
const fileModel = require("../models/fileModel")
const rootModel = require("../models/rootModel")
const userModel = require("../models/userModel")
const fileContainerModel = require("../models/fileContainerModel")
const mongoose = require("mongoose")
const uuid = require("uuid")
const { ObjectId } = require('mongodb');
const archiver = require("archiver");
const { Storage } = require('@google-cloud/storage');
const storage = new Storage();
const path = require("path");
const {GCbucketName} = require("../utils/utils");




exports.createRoot = async (ownerId) => {
    return await rootModel.create({ownerId, dirComponents: [], autorised: [ownerId], isPublic: false,storageVolume:10000000000,usedStorage:0 })
}
exports.createFileContainer = async (type,ownerId,rootId,storageVolumeGB)=>{
    const fileContainer = await fileContainerModel.create({type,ownerId,rootId,fileComponents:[],storageVolume:storageVolumeGB*1000000000})
    return fileContainer._id
}
exports.getFileInfo = (fileId) => {
    return fileModel.findById(fileId)
}
exports.getFolderInfo = (folderId) => {
    return folderModel.findById(folderId)
}
exports.checkIfFileNameAlreadyExists = async (parentFolderId,name) => {

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
   const root = await rootModel.findById(rootId).populate("allSharedFolders.userId").populate("allSharedFolders.sharedFolderId");
const payload = []
    for (const {userId,sharedFolderId} of root.allSharedFolders) {
        console.log('sharedFolderId: ', sharedFolderId);
        console.log('userId: ', userId);

        payload.push({
            folderId:sharedFolderId._id,
            userEmail:userId.email,
            folderName:sharedFolderId.name,
            userId:userId._id
        })
    }

    return payload
}
exports.autorizeUserToEveryNestedFolder=async(userId,folderId,rootId)=>{
    const root = await rootModel.findById(rootId)
    if(root.allSharedFolders.some(sharedFolder=>sharedFolder.userId.equals(userId)&&
        sharedFolder.sharedFolderId.equals(folderId))){
        throw new Error("User is already autorized to this folder")
    }else{
        root.allSharedFolders.push({userId,sharedFolderId:folderId})
    }
    async function autorizeUserToFolder(userId,folderId){
        const folder = await folderModel.findById(folderId).populate("dirComponents")

        if(!folder.autorised.includes(userId)){
            folder.autorised.push(userId)
            await folder.save()
        }else{
            // delete the data for shared folder in root autorized array because we autorize from top level folder
            const index = root.allSharedFolders.indexOf(userId)
            root.allSharedFolders.splice(index,1)
        }
        for (const dir of folder.dirComponents) {
            autorizeUserToFolder(userId,dir._id)
        }
    }
    autorizeUserToFolder(userId,folderId)

    await root.save()
}
exports.unAuthoriseUserFromFolder = async (rootId,userId,folderId) => {
    const root = await rootModel.findById(rootId)
    if(!root) throw new Error("No such root")
    const folder = root.allSharedFolders.find((folder)=>folder.userId==userId&&folder.sharedFolderId==folderId)
    const index =  root.allSharedFolders.indexOf(folder)
    if(index<0) throw new Error("No such folder") 
    
    root.allSharedFolders.splice(index,1)
    async function unAutorizeUserToFolder(userId,folderId){
        const folder = await folderModel.findById(folderId).populate("dirComponents")

        if(folder.autorised.includes(userId)){
            const index= folder.autorised.findIndex((user_id)=>user_id==userId)
            folder.autorised.splice(index,1)
            await folder.save()
        }
        for (const dir of folder.dirComponents) {
            unAutorizeUserToFolder(userId,dir._id)
        }
    }
    unAutorizeUserToFolder(userId,folderId)

    await root.save()

}



exports.getDetails =async (id,elementType)=>{
    if(elementType==="file"){
        return fileModel.findById(id)
    }else if(elementType==="directory"){
        return folderModel.findById(id).populate("autorised")
    }
}
exports.getFolder = async (id,userId,rootId) => {
    const root = await rootModel.findById(rootId).populate("dirComponents").populate("fileComponents").populate("paidFileContainer")
    let folder = await folderModel.findById(id).populate("dirComponents").populate("fileComponents")

    if(!folder) folder = root

    //to not disturb the actual records
    folder = folder.toObject()

    if(!folder.isPublic){
        if(!folder.autorised.some(id=>id.equals(userId))){
             throw new Error("You are not authorized")
        }
        if(root.paidFileContainer){
                checkForLockedFiles(root.paidFileContainer,folder)
        }


        return folder
    
    }else{
        if(root.paidFileContainer){
            checkForLockedFiles(root.paidFileContainer,folder)
        }

        return folder
    }


}
function checkForLockedFiles(fileContainer,folder){
    console.log(fileContainer)
    if(fileContainer.isLocked){
        for (const file of folder.fileComponents) {
            if(fileContainer.fileComponents.includes(file._id)){
                file.isLocked = true
            }
        }

    }
}
// exports.getFilesFromSharedFolder = async (folderId) => {
//     const folder = await folderModel.findById(folderId).populate("fileComponents") 
//     return folder.fileComponents
// }
async function putInFileContainer(file,root){
    root = await root.populate("freeFileContainer paidFileContainer")
    if(root.freeFileContainer.storageVolume>=file.length){
        root.freeFileContainer.fileComponents.push(file._id)
       await root.freeFileContainer.save()
    }else{
        root.paidFileContainer.fileComponents.push(file._id)
       await root.paidFileContainer.save()
    }

    return root.save()
}
async function removeFromFileContainer(file,root){
    root = await root.populate("freeFileContainer paidFileContainer")

    if(root.freeFileContainer.fileComponents.some(f=>f.equals(file._id))){
        root.freeFileContainer.fileComponents
            .splice(
                root.freeFileContainer.fileComponents.findIndex(f=>f.equals(file._id)),
                1
            )
        await root.freeFileContainer.save()
    }else if(root.paidFileContainer.fileComponents.some(f=>f.equals(file._id))){
        root.paidFileContainer.fileComponents
            .splice(
                root.paidFileContainer.fileComponents.findIndex(f=>f.equals(file._id)),
                1
            )
        await root.paidFileContainer.save()
    }

    return root.save()
}





const getSignedURIFroFileUploadOrDownload =async (fileName,action)=>{
    const bucketName = 'theconfederacyfiles';
    const options = {
        version: 'v4',
        action,
        expires: Date.now() + 15 * 60 * 1000,
    };

    return await storage.bucket(bucketName).file(fileName.toString()).getSignedUrl(options);


}

exports.getSignedURIFroFileUploadOrDownload = getSignedURIFroFileUploadOrDownload




exports.uploadFileToGC=async()=>{
    const bucketName = 'theconfederacyfiles';
    const filename = path.join(__dirname,"../test/1111.docx");
    const myBucket = storage.bucket(bucketName);

    await myBucket.upload(filename, {
        destination: 'destination/file.jpg',
    });

    console.log('File uploaded to Google Cloud Storage.');
}

function storeFileIntoMongoDB(buffer,originalname){
    const gridFile = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
        bucketName: 'files'
    });

    const id = uuid.v4()
    const uploadStream = gridFile.openUploadStreamWithId(id, originalname);

    uploadStream.write(buffer);
    uploadStream.end();
    return uploadStream
}

const getRoot =async (rootId,...populates)=>{
    const root = await rootModel.findById(rootId)
    for (const populate of populates) {
        await root.populate(populate)
    }
    return root
}

const addFileIdIntoFolder =async (folder,file)=>{
    folder.fileComponents.push(file._id)
    await folder.save()
}
const addToUsedStorage =async (root,file)=>{
    root.usedStorage+=Number(file.length)
    await root.save()
}
const removeToUsedStorage = (root,file)=>{
    root.usedStorage-=file.length
}
const createNewMongoDBfileRecord =async (fileName,size,type,rootId,userId)=>{

    return await fileModel.create({
        type,
        length:size,
        createdAt:Date.now(),
        fileName:fileName.slice(0,fileName.lastIndexOf(".")),
        rootId,
        ownerId: userId
    })
}

const saveFileIntoRightPlaces =async (rootId,parentFolderId,file)=>{
    const root = await getRoot(rootId,"fileComponents")

    let folder =  await folderModel.findById(parentFolderId).populate("fileComponents")

    if(!folder) folder = root

    await putInFileContainer(file,root)
    await addFileIdIntoFolder(folder,file)

    await addToUsedStorage(root,file)
}
async function unAttachFromFolder(parentFolder,userId,fileId){
    if(!parentFolder.autorised.includes(userId)){
        throw new Error("You are not able to delete that due to ownership issues")
    }
    parentFolder.fileComponents.splice(parentFolder.fileComponents.findIndex(objId => objId.equals(fileId)), 1)
    return parentFolder.save()
}
async function deleteFileRecord(fileId){
    return fileModel.findByIdAndDelete(fileId)
}
exports.deleteFileOnServer=async(fileId,rootId,parentFolderId,userId)=>{

    await unAttachFileFromEveryPlace(fileId,rootId,parentFolderId,userId)
    await deleteFileRecord(fileId)
}
const unAttachFileFromEveryPlace = async (fileId,rootId,parentFolderId,userId)=>{
    const root = await rootModel.findById(rootId)
    let parentFolder = await folderModel.findById(parentFolderId)
    if(!parentFolder) parentFolder = root

    const file = await fileModel.findById(fileId)

    await unAttachFromFolder(parentFolder,userId,fileId)
    removeToUsedStorage(root,file)
    await removeFromFileContainer(file,root)

}
exports.unAttachFileFromEveryPlace = unAttachFileFromEveryPlace
exports.newFile = async (fileName,size,type,rootId,userId,parentFolderId)=>{
    const file = await  createNewMongoDBfileRecord(fileName,size,type,rootId,userId)


    saveFileIntoRightPlaces(rootId,parentFolderId,file)


    return file
    // storage
    //     .bucket(GCbucketName)
    //     .file(fileName)
    //     .setMetadata({ name:fileName})
    //     .then(() => {
    //         console.log('Metadata set successfully');
    //     })
    //     .catch((err) => {
    //         console.error('Error:', err);
    //     });
}

 /* MONGODB storing LEgacy */ ;  exports.createFile = async (originalname, buffer, size, rootId, parentFolderId,userId) => {

    const root = await rootModel.findById(rootId).populate("fileComponents")

    let folder =  await folderModel.findById(parentFolderId).populate("fileComponents")

    if(!folder) folder = root
    checkIfStorageHaveEnoughtSpace(root,undefined,size)

    if (folder.fileComponents.some(el => el.fileName === originalname)) {
        throw new Error("File with the same name already exists.")
    }


    const uploadStream = storeFileIntoMongoDB(buffer,originalname)

    const fullFileName = uploadStream.fileName
    const onlyName = fullFileName.substring(0,fullFileName.lastIndexOf('.'));
    const fileExtension = fullFileName.substring(fullFileName.lastIndexOf('.') + 1);


    const newFile = await fileModel.create({
        fileChunks: uploadStream.id,
        type: fileExtension,
        length: size,
        createdAt:Date.now(),
        fileName: onlyName,
        rootId,
        userId
    })

    await putInFileContainer(newFile,root)

    folder.fileComponents.push(newFile._id)
    await folder.save()
    root.usedStorage+=newFile.length
    // await root.save()
    return newFile
}

exports.addBytesToStorage= async(rootId,Bytes)=>{
    const root = await rootModel.findById(rootId)
    console.log('root1: ', root);
    root.usedStorage+=Bytes
    await root.save()
}
checkIfStorageHaveEnoughtSpace= async(root,rootId,Bytes)=>{
    if(!root)  root = await rootModel.findById(rootId)

    if(root.usedStorage+Bytes>root.storageVolume){
        throw new Error("There is no enough space")
    }

}

exports.checkIfStorageHaveEnoughtSpace = checkIfStorageHaveEnoughtSpace
exports.createFolder = async (name, rootId, parentFolderId) => {

    const ownerId = (await userModel.findOne({ rootId }))._id

    const folder = await folderModel.findById(parentFolderId).populate("dirComponents") || await rootModel.findById(parentFolderId).populate("dirComponents")

    if (folder.dirComponents.length > 0) {
        if (folder.dirComponents.some(el => el.name === name)) {
            throw new Error("Folder with the same name already exist.")
        }
    }

    const newFolder = await folderModel.create({ ownerId, name, rootId, dirComponents: [], autorised: [ownerId], isPublic: false, parentFolder: parentFolderId,createdAt:Date.now() })
    folder.dirComponents.push(newFolder._id)
    folder.save();

    return newFolder
}


exports.deleteFolder = async (folderId, parentFolderId,userId) => {

    const parentFolder = await folderModel.findById(parentFolderId) || await rootModel.findById(parentFolderId)

    if(!parentFolder.ownerId.equals(userId)){
        throw new Error("You are not able to delete that due to ownership issues")
    }
    const folder = await folderModel.findById(folderId)
    folder.autorised.splice(0)

    parentFolder.dirComponents.splice(parentFolder.dirComponents.findIndex(objId => objId.toString() === folderId), 1)
    parentFolder.save()
    folder.save()
}
/*LEGACY*/ exports.deleteFile = async (fileId, parentFolderId,rootId,userId) => {

    const parentFolder = await folderModel.findById(parentFolderId) || await rootModel.findById(parentFolderId)
    if(!parentFolder.autorised.includes(userId)){
        throw new Error("You are not able to delete that due to ownership issues")
    }
    parentFolder.fileComponents.splice(parentFolder.fileComponents.findIndex(objId => objId.toString() === fileId), 1)
    parentFolder.save()
    const root = await rootModel.findById(rootId)
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
    return rootModel.findById(rootId)
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


    return {topFileExts:payload,fileCount:files.length}
}
exports.getTopFolders=async(rootId,userId)=>{
    let files = await fileModel.find({rootId})
    const folders = await folderModel.find({rootId})
    const filtered = folders.filter((folder)=>folder.autorised.includes(userId))

    const sortedTopFIleExt = filtered.sort((a,b)=>b.fileComponents.length-a.fileComponents.length)

    const payload =[]
    for (const folder of sortedTopFIleExt) {
        payload.push({name:folder.name,count:folder.fileComponents.length})
    }
    

    
    return {topFolders:payload.slice(0,3),fileCount:files.length}
}

// exports.autoriseUserToFolder = async (folderId,email)=>{
//     const user = await userModel.findOne({email})
//     if(!user){
//         throw new Error("No such user")
//     }
//     const userId = user._id
//     const folder = await folderModel.findById(folderId)
//     if(!folder.autorised.includes(userId)){
//         folder.autorised.push(userId)
//     }else{
//         throw new Error("User is already autorised")
//     }
//     await folder.save()

// }
exports.makeFolderPublic= async (folderId,userId)=>{
    const folder = await folderModel.findById(folderId)
    if(!folder.autorised.includes(userId)){
        throw new Error("You are not autorised to make the folder public")
    }
    folder.isPublic = true
    return folder.save()
}
exports.unPublicFolder= async (folderId,userId)=>{
    const folder = await folderModel.findById(folderId)
    if(!folder.autorised.includes(userId)){
        throw new Error("You are not autorised to make the folder un-public")
    }
    folder.isPublic = false
    return folder.save()
}
exports.getSharedWithMeFolders = async (userId)=>{

    const user = await userModel.findById(userId)
    if(!user) throw new Error("No such user")
    const rootsWhereUserHaveAuthorizedFolders = await rootModel.find(
        {
            allSharedFolders: {
                $elemMatch: { userId: user._id }
            }
        }
    )
    const allSharedWithMeFoldersIDs = []    
    for (const root of rootsWhereUserHaveAuthorizedFolders) {
        const {allSharedFolders} = root
        allSharedFolders.filter(folder=>folder.userId==userId)
        for (const folder of allSharedFolders) {
            allSharedWithMeFoldersIDs.push(folder.sharedFolderId)
        }
    }

    const allSharedFoldersArr = await folderModel.find({
        _id: { $in: allSharedWithMeFoldersIDs }
    });
    

    const trimedData = allSharedFoldersArr.map((folder)=>{return {_id:folder._id,name:folder.name}})
    return allSharedFoldersArr
}


exports.downloadFile=async(fileId,res)=>{
    const fileFromDB = await fileModel.findById(fileId)
    const gridFile = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
        bucketName: 'files'
    });

    const downloadStream = gridFile.openDownloadStream(fileFromDB.fileChunks);

    res.set({
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${fileFromDB.fileName}.${fileFromDB.type}"`
    });

    downloadStream.pipe(res);
}


exports.downloadFolder=async (folderId,res)=>{
    const zip = archiver('zip', {
        zlib: { level: 9 },
    });


    res.set({
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="zip.zip"`
    });

    zip.pipe(res)


    await populateFolder([],folderId)
    zip.finalize();
}

async function giveFolderFileComponents(folderId, previousFolder) {
    const folderRecord = await folderModel.findById(folderId);

    const folder = {
        name: folderRecord.name,
        folders: [], // Store folder objects here
        files: [],
    };

    if (previousFolder) {
        previousFolder.folders.push(folder); // Store the folder object
    }

    for (const fileComponent of folderRecord.fileComponents) {
        const file = await fileModel.findById(fileComponent)
        folder.files.push({
            name:file.fileName,
            type:file.type,
            link: (await getSignedURIFroFileUploadOrDownload(fileComponent, "read"))[0]
        })
    }

    for (const subFolderId of folderRecord.dirComponents) {
        await giveFolderFileComponents(subFolderId, folder);
    }

    return folder;
}



exports.signGCkeysForFolder=async(folderId)=>{
   return await giveFolderFileComponents(folderId)
}





 async function populateFolder(folderTreeNames,folderId){
    const folder = await folderModel.findById(folderId)
    const updatedFolderTreeNames=[...folderTreeNames,folder.name]
    const filePath = updatedFolderTreeNames.join("/")
    zip.append(Buffer.alloc(0), { name:`${filePath}/` });
    for (const fileId of folder.fileComponents) {
        const file = await fileModel.findById(fileId)

        const gridFile = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
            bucketName: 'files'
        });
        const downloadStream = gridFile.openDownloadStream(file.fileChunks);

        zip.append(downloadStream, { name: `${filePath}/${file.fileName}.${file.type}` });
    }
    for (const nestedFolder of folder.dirComponents) {
        await populateFolder(updatedFolderTreeNames,nestedFolder._id)
    }

}