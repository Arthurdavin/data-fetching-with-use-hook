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
  FieldContent,
  FieldDescription,
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
    .min(5, "Bug title must be at least 5 characters.")
    .max(200, "Bug title must be at most 200 characters."),

  price: z.coerce.number().positive("Price must be a positive number"),

  category: z
    .string()
    .min(1, "Please select a category.")
    .refine((val) => val !== "auto", {
      message: "Please select a specific category.",
    }),

  description: z
    .string()
    .min(10, "Description must be at least 20 characters.")
    .max(100, "Description must be at most 100 characters."),
  images: z
    .array(z.instanceof(File))
    .min(1, "At least one image is required"),
});

type FormValues = z.infer<typeof formSchema>;

/* ---------------------------------- */
/* SAMPLE DATA */
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
    },
  });

  const onhandleImageChage = async (images: ImageFile[]) => {
    // console.log('images: ',images)
    const formData = new FormData();
    for (const image of images) {
      formData.append("file", image.file);
      const res = await uploadImageServer(formData);
      console.log("res", res);
    }
  };

  // function onSubmit(data: FormValues) {
  //   toast("Submitted successfully!", {
  //     description: (
  //       <pre className="mt-2 w-[320px] rounded-md bg-muted p-4 text-sm">
  //         {JSON.stringify(data, null, 2)}
  //       </pre>
  //     ),
  //   });
  // }

  // fig on submit
  async function onSubmit(data: FormValues) {
  try {
    const uploadedImages: string[] = [];

    for (const file of data.images) {
      const formData = new FormData();
      formData.append("file", file);

      const res = await uploadImageServer(formData);
      uploadedImages.push(res.url); // adjust based on your API
    }

    const payload = {
      ...data,
      images: uploadedImages,
    };

    toast("Submitted successfully!", {
      description: (
        <pre className="mt-2 w-[320px] rounded-md bg-muted p-4 text-sm">
          {JSON.stringify(payload, null, 2)}
        </pre>
      ),
    });
  } catch (error) {
    toast.error("Image upload failed");
  }
}


  return (
    <Card className="w-2/4">
      <CardHeader>
        <CardTitle>Product Form</CardTitle>
        <CardDescription>
          Help us improve by reporting bugs you encounter.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form id="bug-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            {/* TITLE */}
            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Product Title</FieldLabel>
                  <Input {...field} placeholder="Login button not working" />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* PRICE */}
            <div className="flex gap-4">
              {/* PRICE */}
              <Controller
                name="price"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Product Price</FieldLabel>
                    <Input
                      type="number"
                      value={field.value}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === "" ? 0 : Number(e.target.value),
                        )
                      }
                      placeholder="100"
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
                    <FieldContent>
                      <FieldLabel>Spoken Language</FieldLabel>
                      <FieldDescription>
                        For best results, select the language you speak
                      </FieldDescription>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </FieldContent>

                    <Select
                      name={field.name}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="auto">Auto</SelectItem>
                        <SelectSeparator />
                        {categories.map((c) => (
                          <SelectItem key={c.value} value={c.value}>
                            {c.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                      rows={5}
                      placeholder="I'm having an issue with the login button on mobile."
                    />
                    <InputGroupAddon align="block-end">
                      <InputGroupText>
                        {field.value.length}/100 characters
                      </InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
          {/* pass by reference */}
          {/* <ImageUpload onImagesChange={(i)=>onhandleImageChage(i)}/> */}
          <ImageUpload onImagesChange={onhandleImageChage} />
        </form>
      </CardContent>

      <CardFooter className="flex flex-col items-start gap-3">
        {/* Helper / placeholder text */}
        <p className="text-sm text-muted-foreground">
          Include steps to reproduce, expected behavior, and what actually
          happened.
        </p>

        {/* Action buttons */}
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
          <Button type="submit" form="bug-form">
            Submit
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
