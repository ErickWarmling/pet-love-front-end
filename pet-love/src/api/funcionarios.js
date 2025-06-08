import { petLoveApi } from "./api";

export const listFuncionarios = () => petLoveApi.get(`/funcionarios`)
export const createFuncionario = (data) => petLoveApi.post(`/funcionarios`, data)
export const updateFuncionario = (idFuncionario, data) => petLoveApi.put(`/funcionarios/${idFuncionario}`, data)
export const deleteFuncionario = (idFuncionario) => petLoveApi.delete(`/funcionarios/${idFuncionario}`)