import z from "zod";
export const singinInput=z.object({
    name:z.string().min(6).max(20),
    email:z.string().email(),
    password:z.string().min(6).max(20)});
    export type singinInput=z.infer<typeof singinInput>;

export const singupInput=z.object({
    email:z.string().email(),
    password:z.string().min(6).max(20)});
    export type singupInput=z.infer<typeof singupInput>;