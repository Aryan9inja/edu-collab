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
import { Upload } from "lucide-react";
import { authService } from "@/services/auth";
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
    <div className="min-h-screen flex items-center justify-center">
      <div className="m-auto w-full max-w-md p-4 border rounded-lg shadow-lg">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            onReset={onReset}
            className="space-y-8 @container"
          >
            <div className="grid grid-cols-12 gap-4">
              <div
                key="text-0"
                id="text-0"
                className=" col-span-12 col-start-auto"
              >
                <h2
                  style={{ textAlign: "center" }}
                  className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0"
                >
                  Signup Form
                </h2>
              </div>

              <FormField
                control={form.control}
                name="text-input-0"
                render={({ field }) => (
                  <FormItem className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                    <FormLabel className="flex shrink-0">Name</FormLabel>

                    <div className="w-full">
                      <FormControl>
                        <div className="relative w-full">
                          <Input
                            key="text-input-0"
                            placeholder="John Doe"
                            type="text"
                            id="text-input-0"
                            className=" "
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
                    <FormLabel className="flex shrink-0">Email</FormLabel>

                    <div className="w-full">
                      <FormControl>
                        <div className="relative w-full">
                          <Input
                            key="email-input-0"
                            placeholder="johndoe@example.com"
                            type="email"
                            id="email-input-0"
                            className=" "
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
                    <FormLabel className="flex shrink-0">Password</FormLabel>

                    <div className="w-full">
                      <FormControl>
                        <div className="relative w-full">
                          <Input
                            key="password-input-0"
                            placeholder="password"
                            type="password"
                            id="password-input-0"
                            className=" "
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
                    className="w-full"
                    type="submit"
                    variant="default"
                    disabled={loading}
                  >
                    {loading ? (
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
                    ) : (
                      <Upload className="size-4" strokeWidth="2" />
                    )}
                    {loading ? "Loading..." : "Submit"}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
