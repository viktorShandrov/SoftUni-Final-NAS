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
  _id:String
  rootId: String;
  ownerId: string;
  name: String;
  dirComponents: folder[];
  fileComponents: file[];
  autorised: String[];
  isPublic: Boolean;
  __v:number
}
export interface file {
  _id:String
  rootId: String;
  fileChunks: String;
  type: String;
  length: Number;
  uploadDate: Date;
  fileName: String;
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
