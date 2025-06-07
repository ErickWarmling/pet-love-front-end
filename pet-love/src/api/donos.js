import { petLoveApi } from "./api"

export const listDonos = () => petLoveApi.get(`/pessoas`)