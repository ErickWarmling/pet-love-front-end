import { petLoveApi } from "./api";

export const listConsultas = () => petLoveApi.get(`/consultas`)
export const createConsulta = (data) => petLoveApi.post(`/consultas`, data)
export const updateConsulta = (idConsulta, data) => petLoveApi.put(`/consultas/${idConsulta}`, data)
export const deleteConsulta = (idConsulta) => petLoveApi.delete(`/consultas/${idConsulta}`)