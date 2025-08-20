import * as z from "zod";

// ! start Register Validations.............
const registerSchema = z.object({
  username: z.string().min(1, "Username Is Empty.Please Enter Something"),
  email: z.string().email("Please Enter Valid Email Address"),
  password: z
    .string()
    .min(8, "Pssword Minimum * Character Required")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[!-/:-@[-`{-~]/,
      "Password must contain at least one special character (!@#$%^&* etc.)"
    ),
  confirmPassword: z.string(),
  role: z.enum(["user", "admin"]),
});

export const registerValidate = registerSchema.refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "Password And Confirm Password Not Match",
    path: ["confirmPassword"],
  }
);
export type registerDto = z.infer<typeof registerSchema>;

// ! End Register Validations...........

// ! Start Login Validations............
export const loginValidate = z.object({
  email: z.string().email("Please Enter Valid Email Address"),
  password: z
    .string()
    .min(8, "Pssword Minimum * Character Required")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[!-/:-@[-`{-~]/,
      "Password must contain at least one special character (!@#$%^&* etc.)"
    ),
});

export type loginDto = z.infer<typeof loginValidate>;
