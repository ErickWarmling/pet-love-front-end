import { petLoveApi } from "./api";

export const listAdocoes = () => petLoveApi.get(`/solicitacao-adocao`)