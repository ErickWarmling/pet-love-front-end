import { petLoveApi } from "./api"

export const listDonos = () => petLoveApi.get(`/pessoas`)
export const createDono = (data) => petLoveApi.post(`/pessoas`, data)
export const updateDono = (idDono, data) => petLoveApi.put(`/pessoas/${idDono}`, data)
export const deleteDono = (idDono) => petLoveApi.delete(`/pessoas/${idDono}`)