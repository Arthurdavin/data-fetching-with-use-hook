"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import axios from "axios";

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
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import ImageUpload from "./image-upload";
import { uploadImageServer } from "@/lib/data/upload-file";

const baseAPI = process.env.NEXT_PUBLIC_API;

/* ---------------------------------- */
/* TYPES */
/* ---------------------------------- */
interface Category {
  id: string | number;
  name: string;
}

interface ImageFile {
  id: string;
  file: File;
  preview: string;
  progress: number;
  status: "uploading" | "completed" | "error";
  error?: string;
}

/* ---------------------------------- */
/* ZOD SCHEMA */
/* ---------------------------------- */
const formSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters.")
    .max(200, "Title must be at most 200 characters."),
  price: z.coerce.number().positive("Price must be a positive number"),
  category: z.string().min(1, "Please select a category."),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters.")
    .max(100, "Description must be at most 100 characters."),
  images: z.array(z.instanceof(File)).min(1, "At least one image is required"),
});

type FormValues = z.infer<typeof formSchema>;

/* ---------------------------------- */
/* COMPONENT */
/* ---------------------------------- */
export function InsertHookForm() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCats, setIsLoadingCats] = useState(true);

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

  // 1. Fetch categories from API on component mount
  useEffect(() => {
    async function getCategories() {
      try {
        setIsLoadingCats(true);
        const response = await axios.get(`${baseAPI}/api/v1/categories`);
        // Note: If your API returns { data: [...] }, use response.data.data
        setCategories(response.data);
      } catch (error) {
        toast.error("Failed to load categories");
        console.error("Fetch categories error:", error);
      } finally {
        setIsLoadingCats(false);
      }
    }
    getCategories();
  }, []);

  // 2. Handle image changes from the ImageUpload component
  const onhandleImageChange = (images: ImageFile[]) => {
    const files = images.map((img) => img.file);
    form.setValue("images", files, { shouldValidate: true });
  };

  // 3. Form Submission
  async function onSubmit(data: FormValues) {
    const loadingToast = toast.loading("Processing submission...");

    try {
      // Upload images in parallel and get URLs
      const uploadPromises = data.images.map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);

        const res = await uploadImageServer(formData);

        // Robust extraction for Axios response
        const url =
          res?.location ||
          res?.url ||
          res?.link ||
          (Array.isArray(res) ? res[0]?.url : null);

        if (!url) throw new Error("Image upload failed to return a URL");
        return url;
      });

      const imageUrls = await Promise.all(uploadPromises);

      // Create final object with URLs instead of File objects
      const finalPayload = {
        ...data,
        images: imageUrls,
      };

      toast.dismiss(loadingToast);
      toast.success("Product created successfully!");

      console.log("FINAL PAYLOAD:", finalPayload);

      // Display results
      toast("Payload Sent", {
        description: (
          <pre className="mt-2 w-full rounded-md bg-slate-900 p-4 text-white text-[10px] overflow-x-auto">
            {JSON.stringify(finalPayload, null, 2)}
          </pre>
        ),
      });

      // form.reset(); // Uncomment to reset form after success
    } catch (error: any) {
      toast.dismiss(loadingToast);
      toast.error(error.message || "Failed to submit form");
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto mt-10">
      <CardHeader>
        <CardTitle>Create Product</CardTitle>
        <CardDescription>
          Fill in the details and upload product images.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          id="product-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <FieldGroup>
            {/* TITLE */}
            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Product Title</FieldLabel>
                  <Input {...field} placeholder="Enter product name" />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
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
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === "" ? "" : Number(e.target.value),
                        )
                      }
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
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
                    <Select
                      disabled={isLoadingCats}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            isLoadingCats ? "Loading..." : "Select category"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((c) => (
                          <SelectItem key={c.id} value={c.id.toString()}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
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
                    <InputGroupTextarea
                      {...field}
                      rows={4}
                      placeholder="Describe your product..."
                    />
                    <InputGroupAddon align="block-end">
                      <InputGroupText>{field.value.length}/100</InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* IMAGES */}
            {/* <div className="space-y-2">
              <FieldLabel>Images</FieldLabel>
              <ImageUpload onImagesChange={onhandleImageChange} />
              {form.formState.errors.images && (
                <p className="text-sm font-medium text-destructive">
                  {form.formState.errors.images.message as string}
                </p>
              )}
            </div> */}
            {/* IMAGES SECTION */}
            <Controller
              name="images"
              control={form.control}
              render={({ field, fieldState }) => (
                <div className="space-y-2">
                  <FieldLabel>Images</FieldLabel>

                  <ImageUpload
                    // We pass the raw File objects back to the form state
                    onImagesChange={(images: ImageFile[]) => {
                      const files = images.map((img) => img.file);
                      field.onChange(files);
                    }}
                  />

                  {fieldState.invalid && (
                    <p className="text-sm font-medium text-destructive">
                      {fieldState.error?.message}
                    </p>
                  )}
                </div>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>

      <CardFooter className="flex justify-end gap-2 border-t pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            form.reset();
            // You might need a ref to clear the ImageUpload UI manually
          }}
        >
          Reset
        </Button>
        <Button type="submit" form="product-form">
          Submit Product
        </Button>
      </CardFooter>
    </Card>
  );
}
