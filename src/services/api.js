import axios from "axios";

// https://covid19-brazil-api.vercel.app/api/report/v1/brazil/uf/

const api = axios.create({
    baseURL: 'https://covid19-brazil-api.vercel.app'
});

export default api;