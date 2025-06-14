import { petLoveApi } from "./api"

export const listEspecies = () => petLoveApi.get(`/especies`)