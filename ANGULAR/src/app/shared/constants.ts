

const REST_API_DOMAIN = "http://localhost:3000"
const jsonHeaders = "application/json"
const fileHeaders = "multipart/form-data"
const api = {
  login: "api/users/login",
  register:  "api/users/register",
}
const toastrOptions = {progressBar:true,timeOut:3000}
export const constants = {
  REST_API_DOMAIN,
  jsonHeaders,
  fileHeaders,
  api,
  toastrOptions
}
