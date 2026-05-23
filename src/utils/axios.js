import axios from "axios";

const api = axios.create({
    baseURL:"https://wr09fdpz61.execute-api.us-east-2.amazonaws.com"
})

export default api;