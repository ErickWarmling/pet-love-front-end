import { petLoveApi } from "./api";

export const listPets = () => petLoveApi.get(`/pets`)
export const listPetsSemDono = (id) => petLoveApi.get(`/pets/sem-dono`)
export const createPet = (data) => petLoveApi.post(`/pets`, data)
export const updatePet = (idPet, data) => petLoveApi.put(`/pets/${idPet}`, data)
export const deletePet = (idPet) => petLoveApi.delete(`/pets/${idPet}`)