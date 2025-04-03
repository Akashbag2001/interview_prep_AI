"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import FormField from "./FormField";
import { useRouter } from "next/navigation";

// Define schemas outside the component to keep them stable
const signUpSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(3, "Password must be at least 3 characters"),
});

const signInSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(3, "Password must be at least 3 characters"),
});

type FormType = "sign-in" | "sign-up";

const AuthForm = ({ type }: { type: FormType }) => {
  const router = useRouter(); // Moved above onSubmit

  // Choose schema based on form type
  const formSchema = type === "sign-up" ? signUpSchema : signInSchema;

  // 1. Define form with proper default values
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: type === "sign-up"
      ? { name: "", email: "", password: "" }
      : { email: "", password: "" },
  });

  // 2. Define submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (type === "sign-up") {
        toast.success("Account created successfully! Please Sign-in");
        router.push("/sign-in");
      } else {
        toast.success("Signed in successfully!");
        router.push("/");
      }
    } catch (error) {
      console.error("Error submitting the auth form", error);
      toast.error(`There was an error: ${error}`);
    }
  }

  const isSignIn = type === "sign-in";

  return (
    <div className="card-border lg:min-w-[566px]">
      <div className="flex flex-col gap-6 card py-14 px-10">
        <div className="flex flex-row gap-2 justify-center">
          <Image src="/logo.svg" alt="logo" height={32} width={38} />
          <h2 className="text-primary-100">Prep-wise</h2>
          <h3>Practice Job Interviews with AI</h3>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6 mt-4 form"
          >
            {!isSignIn && (
              <FormField
                control={form.control}
                name="name" // Fixed from "Name" to "name"
                placeholder="Your Name"
                label="Username"
              />
            )}
            <FormField
              control={form.control}
              name="email"
              label="Email"
              type="email"
              placeholder="Your Email"
            />
            <FormField
              control={form.control}
              name="password"
              label="Password"
              type="password"
              placeholder="Your Password"
            />
            <Button className="btn" type="submit">
              {isSignIn ? "Sign in" : "Create an account"}
            </Button>
          </form>
        </Form>

        <p className="text-center">
          {isSignIn ? "No Account Yet?" : "Have an account already?"}
          <Link
            href={!isSignIn ? "/sign-in" : "/sign-up"}
            className="font-bold text-user-primary ml-1"
          >
            {!isSignIn ? "Sign-in" : "Sign-up"}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
