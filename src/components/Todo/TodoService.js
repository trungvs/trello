import axios from "axios";
import CONSTANT_LIST from "../../appConfig";

const API_ENDPOINT = CONSTANT_LIST.API_PATH + "/todo"

// Todo Service

export const addTodo = (value) => {
    return axios.post(API_ENDPOINT, value)
}

export const getTodoById = (id) => {
    let url = API_ENDPOINT + `/${id}`
    return axios.get(url)
}

export const editTodo = (id, value) => {
    let url = API_ENDPOINT + `/${id}`
    return axios.put(url, value)
}

export const deleteTodo = (id) => {
    let url = API_ENDPOINT + `/${id}`
    return axios.delete(url)
}

export const rankTodo = (id, value) => {
    let url = API_ENDPOINT + `/${id}`
    return axios.put(url, value)
}