"use client";
import { email, z } from "zod";
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

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";

import { Input } from "./ui/input";
import { useForm } from "react-hook-form";

const formSchema = z.object({
  email:z.email("Invalid email").nonempty("Please enter your email"),
  password: z.string()
  .min(8,"Password must be at least 8 characters")
  .regex(/[A-Z]{2}/,{message: "Must contain one uppercase letter"})
  .regex(/[a-z]{2}/,{message: "Must contain one lowercase letter"})
  .regex(/[0-9]/,{message: "Must contain one number"})
  .regex(/[^A-Za-z0-9]/,{message: "Must contain one special character"}),
});

// type RegisterType = z.infer<typeof formSchema>;


export default function RegisterForm() {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues:{
      email: " ",
      password:" ",
    },
  })

  const { handleSubmit, control} = form;
  function onSubmit(data: z.infer<typeof formSchema>){
    console.log("Register data: ",data);
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your email and password to register
        </CardDescription>
        <CardAction>
          <Button variant="link">Login</Button>
        </CardAction>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
          >
            {/* Email */}
            <FormField
              control={control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="youremail@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Buttons MUST be inside form */}
            <CardFooter className="flex-col gap-2 px-0">
              <Button type="submit" className="w-full">
                Register
              </Button>
              <Button type="button" variant="outline" className="w-full">
                Register with Google
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
