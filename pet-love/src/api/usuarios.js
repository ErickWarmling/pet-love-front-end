import { petLoveApi } from "./api";

export const listUsuarios = () => petLoveApi.get(`/usuarios`)
export const createUsuario = (data) => petLoveApi.post(`/usuarios`, data)
export const updateUsuario = (idUsuario, data) => petLoveApi.put(`/usuarios/${idUsuario}`, data)
export const deleteUsuario = (idUsuario) => petLoveApi.delete(`/usuarios/${idUsuario}`)
export const loginUsuario = (loginDTO) => petLoveApi.post(`/usuarios/login`, loginDTO)