export interface Dirs {
  name: string;
  _id: string;
}
export interface files {
  name: string;
  _id: string;
}
export interface Completions {
  name: string;
  _id: string;
}
export interface folder {
  elementType?:String
  _id:String
  rootId: String;
  ownerId: string;
  name: String;
  dirComponents: folder[];
  fileComponents: file[];
  autorised: String[];
  isPublic: Boolean;
  isDisappearing:Boolean;
  isCrossed:Boolean;
  __v:number
}
export interface file {
  elementType?:String
  _id:String
  rootId: String;

  fileChunks: String;
  type: String;
  isLocked?:Boolean
  length: Number;
  uploadDate: Date;
  fileName: String;
  isDisappearing:Boolean;
  isCrossed:Boolean;
  __v:number

}
export interface topExtI{
  name:string
  count:number
  domElementHeight?:number
}
export interface topFolders{
  name:string
  count:number
  domElementHeight?:number
}
export interface sharedWithUsersFolderIn{
  folderId:string,
  userId:string,
  userEmail:string,
  folderName:string,
}
