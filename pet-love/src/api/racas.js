import { petLoveApi } from "./api"

export const listRacas = () => petLoveApi.get(`/racas`)