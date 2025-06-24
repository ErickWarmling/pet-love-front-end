import { petLoveApi } from "./api";

export const listAdocoes = () => petLoveApi.get(`/solicitacao-adocao`)
export const createAdocao = (data) => petLoveApi.post('/solicitacao-adocao', data)
export const updateAdocao = (id, data) => petLoveApi.put(`/solicitacao-adocao/${id}`, data)
export const deleteAdocao = (id) => petLoveApi.delete(`/solicitacao-adocao/${id}`)