"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "./ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";

/* ✅ Zod Schema */
// const formSchema = z.object({
//   email: z
//     .email("Invalid email address")
//     .nonempty("Please enter your email"),
//   password: z
//     .string()
//     .min(8, "Password must be at least 8 characters"),
// });

const formSchema = z.object({
  email: z.email("Invalid email address").nonempty("Please enter your email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});


/* ✅ Type from schema */

type LoginType = z.infer<typeof formSchema>;

export default function LoginForm() {
  // 1. Define form
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<LoginType>({
    resolver: zodResolver(formSchema),
  });

  function loginSubmit(data: LoginType) {
    console.log("Login data:", data);
  }
  // const {
  //   register,
  //   handleSubmit,
  //   watch,
  //   formState: { errors},
  // }=useForm<z.infer<typeof formSchema>>({
  //   resolver: zodResolver(formSchema),
  // });

  // function loginSubmit(data){
  //   console.log("Login data: ",data);
  // }

  console.log("Email:", watch("email"));

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
        <CardAction>
          <Button variant="link">Sign Up</Button>
        </CardAction>
      </CardHeader>

      <CardContent>
        {/* ✅ FORM START */}
        <form onSubmit={handleSubmit(loginSubmit)} className="space-y-6">
          {/* Email */}
          <div className="grid gap-2">
            <label htmlFor="email">Email</label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="grid gap-2">
            <label htmlFor="password">Password</label>
            <Input
              id="password"
              type="password"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-red-500 text-sm">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* ✅ Buttons MUST be inside form */}
          <CardFooter className="flex-col gap-2 px-0">
            <Button type="submit" className="w-full">
              Login
            </Button>
            <Button type="button" variant="outline" className="w-full">
              Login with Google
            </Button>
          </CardFooter>
        </form>
        {/* ✅ FORM END */}
      </CardContent>
    </Card>
  );
}
