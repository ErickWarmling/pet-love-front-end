import { petLoveApi } from "./api";

export const listFuncionarios = () => petLoveApi.get(`/funcionarios`)