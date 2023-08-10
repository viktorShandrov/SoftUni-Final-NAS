

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
export const constants = {
  REST_API_DOMAIN,
  jsonHeaders,
  fileHeaders,
  api,
  toastrOptions,
  HeaderStorageInfoMainColor,
  HeaderStorageInfoColorWhenUpload
}
