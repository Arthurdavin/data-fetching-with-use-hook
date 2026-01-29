"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import ImageUpload from "./image-upload";
import { uploadImageServer } from "@/lib/data/upload-file";

/* ---------------------------------- */
/* ZOD SCHEMA */
/* ---------------------------------- */
const formSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters.")
    .max(200, "Title must be at most 200 characters."),
  price: z.coerce.number().positive("Price must be a positive number"),
  category: z
    .string()
    .min(1, "Please select a category.")
    .refine((val) => val !== "auto", {
      message: "Please select a specific category.",
    }),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters.")
    .max(100, "Description must be at most 100 characters."),
  images: z
    .array(z.instanceof(File))
    .min(1, "At least one image is required"),
});

type FormValues = z.infer<typeof formSchema>;

/* ---------------------------------- */
/* TYPES & CONSTANTS */
/* ---------------------------------- */
interface ImageFile {
  id: string;
  file: File;
  preview: string;
  progress: number;
  status: "uploading" | "completed" | "error";
  error?: string;
}

const categories = [
  { value: "frontend", label: "Frontend" },
  { value: "backend", label: "Backend" },
  { value: "ui", label: "UI / UX" },
];

/* ---------------------------------- */
/* COMPONENT */
/* ---------------------------------- */
export function InsertHookForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      price: 0,
      category: "",
      description: "",
      images: [],
    },
  });

  // Connects the ImageUpload component to React Hook Form
  const onhandleImageChange = (images: ImageFile[]) => {
    const files = images.map((img) => img.file);
    form.setValue("images", files, { shouldValidate: true });
  };

  async function onSubmit(data: FormValues) {
    const loadingToast = toast.loading("Uploading product and images...");
    
    try {
      // 1. Map through images and upload each
      const uploadPromises = data.images.map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);

        // This calls your Axios function
        const res = await uploadImageServer(formData);
        
        console.log("Axios API Response:", res);

        /**
         * URL EXTRACTION LOGIC
         * Depending on your API, the URL might be in different places.
         * Common keys: url, location, link, or the first item of an array.
         */
        const extractedUrl = 
          res?.location || 
          res?.url || 
          res?.link || 
          (Array.isArray(res) ? res[0]?.location || res[0]?.url : null);

        if (!extractedUrl) {
          throw new Error("API success, but no URL found in response");
        }

        return extractedUrl;
      });

      // 2. Wait for all uploads to finish
      const imageUrls = await Promise.all(uploadPromises);

      // 3. Create the final object to send to your Database
      const finalPayload = {
        ...data,
        images: imageUrls, // Replaces File[] with string[] (URLs)
      };

      toast.dismiss(loadingToast);
      toast.success("Submission Successful!");

      console.log("FINAL DATA FOR DATABASE:", finalPayload);

      // Show final result in a toast
      toast("Payload Sent", {
        description: (
          <pre className="mt-2 w-full rounded-md bg-slate-900 p-4 text-white text-[10px] overflow-x-auto">
            {JSON.stringify(finalPayload, null, 2)}
          </pre>
        ),
      });

    } catch (error: any) {
      toast.dismiss(loadingToast);
      toast.error(error.message || "Failed to submit form");
      console.error("Submit Error:", error);
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto mt-10">
      <CardHeader>
        <CardTitle>Create Product</CardTitle>
        <CardDescription>Upload images and provide product details.</CardDescription>
      </CardHeader>

      <CardContent>
        <form id="product-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FieldGroup>
            {/* TITLE */}
            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Title</FieldLabel>
                  <Input {...field} placeholder="Product name..." />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              {/* PRICE */}
              <Controller
                name="price"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Price</FieldLabel>
                    <Input
                      type="number"
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value === "" ? 0 : Number(e.target.value))}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              {/* CATEGORY */}
              <Controller
                name="category"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Category</FieldLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((c) => (
                          <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </div>

            {/* DESCRIPTION */}
            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Description</FieldLabel>
                  <InputGroup>
                    <InputGroupTextarea {...field} rows={4} />
                    <InputGroupAddon align="block-end">
                      <InputGroupText>{field.value.length}/100</InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* IMAGES */}
            <div className="space-y-2">
              <FieldLabel>Images</FieldLabel>
              <ImageUpload onImagesChange={onhandleImageChange} />
              {form.formState.errors.images && (
                <p className="text-sm font-medium text-destructive">
                  {form.formState.errors.images.message}
                </p>
              )}
            </div>
          </FieldGroup>
        </form>
      </CardContent>

      <CardFooter className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => form.reset()}>
          Reset
        </Button>
        <Button type="submit" form="product-form">
          Submit
        </Button>
      </CardFooter>
    </Card>
  );
}