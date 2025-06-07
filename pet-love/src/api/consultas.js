import { petLoveApi } from "./api";

export const listConsultas = () => petLoveApi.get(`/consultas`)