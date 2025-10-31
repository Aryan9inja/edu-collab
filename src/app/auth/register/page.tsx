"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import React from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";

export default function UntitledForm() {
  const router = useRouter();
  const { register } = useAuthStore();
  const [loading, setLoading] = React.useState(false);

  const formSchema = z.object({
    "text-0": z.string(),
    "text-input-0": z.string().max(30).min(3),
    "email-input-0": z.email(),
    "password-input-0": z.string().min(8),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      "text-0": "",
      "text-input-0": "",
      "email-input-0": "",
      "password-input-0": "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    const formData = {
      name: values["text-input-0"],
      email: values["email-input-0"],
      password: values["password-input-0"],
    };
    try {
      await register(formData.email, formData.password, formData.name);
      toast.success("User created successfully");
      router.push("/auth/username-setup");
    } catch (error) {
      console.error(error);
      toast.error("Error creating new user");
      return;
    } finally {
      setLoading(false);
    }
  }

  function onReset() {
    form.reset();
    form.clearErrors();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-sky-50">
      <div className="m-auto w-full max-w-md p-8 bg-white rounded-2xl shadow-xl border border-gray-200">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 14l9-5-9-5-9 5 9 5zm0 0v6m0-6l-9-5m9 5l9-5"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
            Join EduCollab
          </h1>
          <p className="text-gray-600">Create your account to get started</p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            onReset={onReset}
            className="space-y-6 @container"
          >
            <div className="grid grid-cols-12 gap-4">

              <FormField
                control={form.control}
                name="text-input-0"
                render={({ field }) => (
                  <FormItem className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                    <FormLabel className="flex shrink-0 text-gray-700 font-medium">Name</FormLabel>

                    <div className="w-full">
                      <FormControl>
                        <div className="relative w-full">
                          <Input
                            key="text-input-0"
                            placeholder="John Doe"
                            type="text"
                            id="text-input-0"
                            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            {...field}
                          />
                        </div>
                      </FormControl>

                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email-input-0"
                render={({ field }) => (
                  <FormItem className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                    <FormLabel className="flex shrink-0 text-gray-700 font-medium">Email</FormLabel>

                    <div className="w-full">
                      <FormControl>
                        <div className="relative w-full">
                          <Input
                            key="email-input-0"
                            placeholder="johndoe@example.com"
                            type="email"
                            id="email-input-0"
                            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            {...field}
                          />
                        </div>
                      </FormControl>

                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password-input-0"
                render={({ field }) => (
                  <FormItem className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                    <FormLabel className="flex shrink-0 text-gray-700 font-medium">Password</FormLabel>

                    <div className="w-full">
                      <FormControl>
                        <div className="relative w-full">
                          <Input
                            key="password-input-0"
                            placeholder="Minimum 8 characters"
                            type="password"
                            id="password-input-0"
                            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            {...field}
                          />
                        </div>
                      </FormControl>

                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <div className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                <div className="w-full">
                  <Button
                    key="submit-button-0"
                    id="submit-button-0"
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg transition-all"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <svg
                          className="animate-spin size-4 mr-2"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                          />
                        </svg>
                        Creating account...
                      </>
                    ) : (
                      <>
                        <svg
                          className="size-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                          />
                        </svg>
                        Create Account
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </Form>

        {/* Login Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <a
              href="/auth/login"
              className="text-blue-600 hover:text-cyan-600 font-medium transition-colors"
            >
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
