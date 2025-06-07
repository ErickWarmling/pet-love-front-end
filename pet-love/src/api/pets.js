import { petLoveApi } from "./api";

export const listPets = () => petLoveApi.get(`/pets`)