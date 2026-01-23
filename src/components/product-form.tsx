"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Field, FieldLabel, FieldDescription, FieldError } from "./ui/field";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useState } from "react";
import { Form } from "./ui/form";
import { useForm } from "react-hook-form";

const formSchema = z.object({
  title: z.string().min(1),
  price: z.number().min(0),
  category: z.array(z.string()).min(1, {
    error: "Please select at least one item",
  }),
  descriptionofproduct: z.string(),
  name_6785074597: z.string(),
});

export default function FormProduct() {
  const [files, setFiles] = useState<File[] | null>(null);

  const dropZoneConfig = {
    maxFiles: 5,
    maxSize: 1024 * 1024 * 4,
    multiple: true,
  };
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: ["React"],
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      console.log(values);
      toast(
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(values, null, 2)}</code>
        </pre>,
      );
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-3xl mx-auto py-10"
      >
        <Field>
          <FieldLabel htmlFor="title">Title</FieldLabel>
          <Input
            id="title"
            placeholder="iphone 17 pro mac"
            {...form.register("title")}
          />
          <FieldDescription>This is your public display name.</FieldDescription>
          <FieldError>{form.formState.errors.title?.message}</FieldError>
        </Field>

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-6">
            <Field>
              <FieldLabel htmlFor="price">price</FieldLabel>
              <Input
                id="price"
                placeholder="200 USD"
                type="number"
                {...form.register("price", { valueAsNumber: true })}
              />
              <FieldDescription>
                This is input price of product
              </FieldDescription>
              <FieldError>{form.formState.errors.price?.message}</FieldError>
            </Field>
          </div>

          <div className="col-span-6">
            <Field>
              <FieldLabel htmlFor="category">Category</FieldLabel>
              <Input
                id="category"
                placeholder="category"
                {...form.register("category")}
              />

              <FieldError>{form.formState.errors.category?.message}</FieldError>
            </Field>
          </div>
        </div>
        <Field>
          <FieldLabel htmlFor="description of product">
            description of product
          </FieldLabel>
          <Textarea
            id="description of product"
            placeholder="description of product"
            {...form.register("descriptionofproduct")}
          />
          <FieldDescription>
            You can @mention other users and organizations.
          </FieldDescription>
          <FieldError>
            {form.formState.errors.descriptionofproduct?.message}
          </FieldError>
        </Field>
        <Field>
          <FieldLabel htmlFor="name_6785074597">Select File</FieldLabel>
          <Input
            id="name_6785074597"
            placeholder="Placeholder"
            {...form.register("name_6785074597")}
          />
          <FieldDescription>Select a file to upload.</FieldDescription>
          <FieldError>
            {form.formState.errors.name_6785074597?.message}
          </FieldError>
        </Field>
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
