"use client";

import React, { useEffect, useState } from "react";
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
import { fetchCategory, insertProduct } from "@/lib/data/fetchPost";

/* ---------- VALIDATION SCHEMA ---------- */
const formSchema = z.object({
  title: z.string().min(5),
  price: z.coerce.number().positive(),
  category: z.string().min(1),
  description: z.string().min(10),
  images: z.array(z.instanceof(File)).min(1),
});

type FormValues = z.infer<typeof formSchema>;

interface Category {
  id: number;
  name: string;
}

interface ImageFile {
  file: File;
}

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

  // ========== LOAD CATEGORIES ==========
  useEffect(() => {
    fetchCategory()
      .then((data) => {
        setCategories(data);
        setIsLoadingCats(false);
      })
      .catch(() => {
        toast.error("Failed to load categories");
        setIsLoadingCats(false);
      });
  }, []);

  // ========== SUBMIT FORM ==========
  async function onSubmit(data: FormValues) {
    const loadingToast = toast.loading("Uploading images...");
    const uploadedUrls: string[] = [];

    // Upload images one by one
    for (const file of data.images) {
      const formData = new FormData();
      formData.append("file", file);

      const res = await uploadImageServer(formData);
      const url = res?.data?.location || res?.location || res?.url;

      if (url) uploadedUrls.push(url);
    }

    toast.dismiss(loadingToast);

    // ===== FINAL PAYLOAD (MATCH ESCUELA API) =====
    const finalPayload = {
      title: data.title,
      price: data.price,
      description: data.description,
      categoryId: Number(data.category), // MUST BE NUMBER
      images: uploadedUrls,
    };

    console.log("FINAL PAYLOAD:", finalPayload);

    try {
      await insertProduct(finalPayload);
      toast.success("Product created successfully!");
      form.reset();
    } catch (err) {
      toast.error("Failed to create product");
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto mt-10">
      <CardHeader>
        <CardTitle>Create Product</CardTitle>
        <CardDescription>
          Fill in the details to list a new product.
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
                  <Input {...field} />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              {/* PRICE */}
              {/* <Controller
                name="price"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Price ($)</FieldLabel>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) =>
                        field.onChange(Number(e.target.value))
                      }
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              /> */}
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
                            isLoadingCats
                              ? "Loading..."
                              : "Select category"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((c) => (
                          <SelectItem
                            key={c.id}
                            value={c.id.toString()}
                          >
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
                    <InputGroupTextarea {...field} rows={4} />
                  </InputGroup>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* IMAGES */}
            <Controller
              name="images"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Product Images</FieldLabel>
                  <ImageUpload
                    onImagesChange={(imgs: ImageFile[]) => {
                      const files = imgs.map((i) => i.file);
                      field.onChange(files);
                    }}
                  />
                  {fieldState.invalid && (
                    <p className="text-sm text-red-500 mt-2">
                      {fieldState.error?.message}
                    </p>
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>

      <CardFooter className="flex justify-end gap-2 border-t pt-6">
        <Button type="button" variant="outline" onClick={() => form.reset()}>
          Reset
        </Button>

        <Button
          type="submit"
          form="product-form"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting
            ? "Uploading..."
            : "Submit Product"}
        </Button>
      </CardFooter>
    </Card>
  );
}
