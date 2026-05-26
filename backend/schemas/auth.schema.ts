import * as z from "zod"

export const Register = z.object({
    name: z.string().min(3),
    email: z.email(),
    password: z.string().min(6).regex(/.*[!@#$%^&*].*/)
})


export const Login = z.object({
    email: z.email(),
    password: z.string()
})