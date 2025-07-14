import  {z} from 'zod'

export const userValidationSchema = z.object({
    username:z.string().min(3,"Name is required").trim(),
    password:z.string().min(6,"Password is required"),
    firstName:z.string().min(3,"First Name is required"),
    lastName:z.string().min(3,"Last Name is required")

})