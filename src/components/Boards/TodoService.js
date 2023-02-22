import axios from "axios";
import CONSTANT_LIST from "../../appConfig";

const API_ENDPOINT = CONSTANT_LIST.API_PATH + "/todo"

// Todo Service

export const addTodo = (value) => {
    return axios.post(API_ENDPOINT, value)
}