import axios from "axios";
import CONSTANT_LIST from "../../appConfig";

const API_ENDPOINT = CONSTANT_LIST.API_PATH + "/board"

export const getAllBoard = (id) => {
    if (id) {
        return axios.get(API_ENDPOINT + `/${id}`)
    } else {
        return axios.get(API_ENDPOINT + "/0")
    }
}

export const addBoard = (data) => {
    return axios.post(API_ENDPOINT, data)
}

export const deleteBoard = (id) => {
    let url = API_ENDPOINT + `/${id}`
    return axios.delete(url)
}

export const editBoard = (id, value) => {
    let url = API_ENDPOINT + `/${id}`
    return axios.put(url, value)
}

export const rankBoard = (id, value) => {
    let url = API_ENDPOINT + `/rank/${id}`
    return axios.put(url, value)
}