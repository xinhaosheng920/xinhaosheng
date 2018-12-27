import axios from 'axios';
let dataServer = '/topicapi'
export const getDataListPage = params => { return axios.get(`${dataServer}/topic/list`, { params: params }); };
export const getDataTotal = params => { return axios.get(`${dataServer}/topic/total`, { params: params }); };
export const editData = params => { return axios.put(`${dataServer}/topic/auth`, params); };
export const Deletes = params => { return axios.delete(`${dataServer}/topic/`, { data: params }); };
 