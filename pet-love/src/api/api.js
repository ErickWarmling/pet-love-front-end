import axios from "axios";

export const petLoveApi = axios.create(
    {
        baseURL: 'http://localhost:8080/api'
    }
)