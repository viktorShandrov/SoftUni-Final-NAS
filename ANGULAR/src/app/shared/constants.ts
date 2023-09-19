

const REST_API_DOMAIN = "http://localhost:3000"
const jsonHeaders = "application/json"
const fileHeaders = "multipart/form-data"
const api = {
  login: "api/users/login",
  register:  "api/users/register",
}
const toastrOptions = {progressBar:true,timeOut:3000}

const HeaderStorageInfoMainColor  = "#0cc0df"
const HeaderStorageInfoColorWhenUpload  = "#29d60b"
const fileExtensions:Array<String> = ["pdf","mp3","html","jpg","png","txt","docx","zip","rar","exe"]
export const constants = {
  fileExtensions,
  REST_API_DOMAIN,
  jsonHeaders,
  fileHeaders,
  api,
  toastrOptions,
  HeaderStorageInfoMainColor,
  HeaderStorageInfoColorWhenUpload
}
