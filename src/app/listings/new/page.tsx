"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { ImagePlus, Trash2, Video } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

const neighbourhoods = [
  "Bodija",
  "Samonda",
  "Agodi GRA",
  "Mokola",
  "Ring Road",
  "Challenge",
  "Dugbe",
  "Ajibode",
  "Agbowo",
  "UI Campus",
  "Iwo Road",
  "New Bodija",
];

const propertyTypes = ["flat", "house", "room", "duplex", "bungalow", "land"] as const;
const listingTypes = ["rent", "sale"] as const;
const pricePeriods = ["monthly", "yearly"] as const;

type ListingForm = {
  title: string;
  description: string;
  type: (typeof listingTypes)[number];
  propertyType: (typeof propertyTypes)[number];
  price: string;
  pricePeriod: (typeof pricePeriods)[number];
  bedrooms: string;
  bathrooms: string;
  address: string;
  neighbourhood: string;
};

type SelectedImage = {
  id: string;
  file: File;
  previewUrl: string;
};

const defaultForm: ListingForm = {
  title: "",
  description: "",
  type: "rent",
  propertyType: "flat",
  price: "",
  pricePeriod: "monthly",
  bedrooms: "",
  bathrooms: "",
  address: "",
  neighbourhood: neighbourhoods[0],
};

export default function NewListingPage() {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const [step, setStep] = useState(1);
  const [pending, startTransition] = useTransition();
  const [form, setForm] = useState<ListingForm>(defaultForm);
  const [images, setImages] = useState<SelectedImage[]>([]);
  const [video, setVideo] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const imagesRef = useRef<SelectedImage[]>([]);

  const canNext = useMemo(() => {
    if (step === 1) return form.title && form.description;
    if (step === 2) return form.price && form.bedrooms && form.bathrooms;
    if (step === 3) return form.address && form.neighbourhood;
    if (step === 4) return images.length > 0;
    return true;
  }, [form, images.length, step]);

  const updateForm =
    <T extends keyof ListingForm>(field: T) =>
    (value: ListingForm[T]) =>
      setForm((prev) => ({ ...prev, [field]: value }));

  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  useEffect(() => {
    return () => {
      imagesRef.current.forEach((image) => URL.revokeObjectURL(image.previewUrl));
    };
  }, []);

  const handleImageFiles = (files: FileList | null) => {
    if (!files) return;
    setError(null);

    const selectedFiles = Array.from(files);
    const validFiles = selectedFiles.filter((file) =>
      file.type.startsWith("image/"),
    );

    if (validFiles.length !== selectedFiles.length) {
      setError("Only image files can be added to the photo gallery.");
      return;
    }

    const nextImages = validFiles.slice(0, Math.max(0, 10 - images.length)).map((file) => ({
      id: `${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2, 8)}`,
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    if (nextImages.length === 0) {
      setError("You can upload a maximum of 10 photos per listing.");
      return;
    }

    setImages((prev) => [...prev, ...nextImages].slice(0, 10));
  };

  const handleVideoFile = (files: FileList | null) => {
    if (!files) return;
    setError(null);
    const file = files[0];
    if (file && file.size > 200 * 1024 * 1024) {
      setError("Video must be under 200MB.");
      return;
    }
    if (file && !["video/mp4", "video/quicktime"].includes(file.type)) {
      setError("Video must be an MP4 or MOV file.");
      return;
    }
    setVideo(file);
  };

  const removeImage = (imageId: string) => {
    setImages((prev) => {
      const imageToRemove = prev.find((image) => image.id === imageId);
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.previewUrl);
      }
      return prev.filter((image) => image.id !== imageId);
    });
  };

  const uploadImages = async (userId: string) => {
    setUploadProgress(0);
    const urls: string[] = [];

    for (let index = 0; index < images.length; index += 1) {
      const file = images[index].file;
      const safeName = file.name.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9._-]/g, "");
      const path = `${userId}/${Date.now()}-${safeName}`;
      const { error: uploadError } = await supabase.storage
        .from("property-images")
        .upload(path, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("property-images").getPublicUrl(path);
      urls.push(data.publicUrl);
      setUploadProgress(Math.round(((index + 1) / images.length) * 100));
    }

    return urls;
  };

  const uploadVideo = async (userId: string) => {
    if (!video) return null;
    const path = `${userId}/${Date.now()}-${video.name}`;
    const { error: uploadError } = await supabase.storage
      .from("property-videos")
      .upload(path, video, { upsert: true });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from("property-videos").getPublicUrl(path);
    return data.publicUrl;
  };

  const handleSubmit = () => {
    setError(null);

    startTransition(async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("Please log in as a landlord to list a property.");
        return;
      }

      try {
        const imageUrls = await uploadImages(user.id);
        const videoUrl = await uploadVideo(user.id);

        const { error: insertError } = await supabase.from("properties").insert({
          landlord_id: user.id,
          title: form.title,
          description: form.description,
          type: form.type,
          property_type: form.propertyType,
          price: Number(form.price),
          price_period: form.pricePeriod,
          bedrooms: Number(form.bedrooms),
          bathrooms: Number(form.bathrooms),
          address: form.address,
          neighbourhood: form.neighbourhood,
          images: imageUrls,
          video_url: videoUrl,
        });

        if (insertError) throw insertError;

        router.push("/dashboard");
      } catch (submitError: unknown) {
        setError(
          submitError instanceof Error
            ? submitError.message
            : "Something went wrong.",
        );
      }
    });
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#f5f0e4,_#ffffff_45%,_#eef8f2)] px-6 py-16">
      <div className="mx-auto w-full max-w-5xl rounded-3xl border border-emerald-100 bg-white/90 p-10 shadow-[0_30px_70px_rgba(16,42,24,0.08)] backdrop-blur">
        <header className="flex flex-col gap-4">
          <h1 className="text-3xl font-semibold text-slate-900">
            List a new property
          </h1>
          <p className="text-base text-slate-600">
            Share verified details and media so tenants can rent with confidence.
          </p>
        </header>

        <div className="mt-8 flex gap-2 text-sm text-emerald-700">
          {[1, 2, 3, 4, 5].map((current) => (
            <div
              key={current}
              className={`flex h-10 w-10 items-center justify-center rounded-full border ${
                step >= current
                  ? "border-emerald-600 bg-emerald-600 text-white"
                  : "border-emerald-200 text-emerald-700"
              }`}
            >
              {current}
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-6">
          {step === 1 && (
            <section className="grid gap-4">
              <h2 className="text-lg font-semibold text-slate-900">Basic info</h2>
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Title
                <input
                  value={form.title}
                  onChange={(event) => updateForm("title")(event.target.value)}
                  type="text"
                  required
                  className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-base shadow-sm outline-none ring-emerald-300 transition focus:ring-2"
                />
              </label>
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Description
                <textarea
                  value={form.description}
                  onChange={(event) =>
                    updateForm("description")(event.target.value)
                  }
                  required
                  rows={4}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-base shadow-sm outline-none ring-emerald-300 transition focus:ring-2"
                />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  Listing type
                  <select
                    value={form.type}
                    onChange={(event) =>
                      updateForm("type")(event.target.value as ListingForm["type"])
                    }
                    className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-base shadow-sm outline-none"
                  >
                    {listingTypes.map((option) => (
                      <option key={option} value={option}>
                        {option.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  Property type
                  <select
                    value={form.propertyType}
                    onChange={(event) =>
                      updateForm("propertyType")(
                        event.target.value as ListingForm["propertyType"],
                      )
                    }
                    className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-base shadow-sm outline-none"
                  >
                    {propertyTypes.map((option) => (
                      <option key={option} value={option}>
                        {option.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </section>
          )}

          {step === 2 && (
            <section className="grid gap-4">
              <h2 className="text-lg font-semibold text-slate-900">Details</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  Bedrooms
                  <input
                    value={form.bedrooms}
                    onChange={(event) =>
                      updateForm("bedrooms")(event.target.value)
                    }
                    type="number"
                    min={0}
                    className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-base shadow-sm outline-none ring-emerald-300 transition focus:ring-2"
                  />
                </label>
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  Bathrooms
                  <input
                    value={form.bathrooms}
                    onChange={(event) =>
                      updateForm("bathrooms")(event.target.value)
                    }
                    type="number"
                    min={0}
                    className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-base shadow-sm outline-none ring-emerald-300 transition focus:ring-2"
                  />
                </label>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  Price
                  <input
                    value={form.price}
                    onChange={(event) => updateForm("price")(event.target.value)}
                    type="number"
                    min={0}
                    className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-base shadow-sm outline-none ring-emerald-300 transition focus:ring-2"
                  />
                </label>
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  Price period
                  <select
                    value={form.pricePeriod}
                    onChange={(event) =>
                      updateForm("pricePeriod")(
                        event.target.value as ListingForm["pricePeriod"],
                      )
                    }
                    className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-base shadow-sm outline-none"
                  >
                    {pricePeriods.map((option) => (
                      <option key={option} value={option}>
                        {option.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </section>
          )}

          {step === 3 && (
            <section className="grid gap-4">
              <h2 className="text-lg font-semibold text-slate-900">Location</h2>
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Address
                <input
                  value={form.address}
                  onChange={(event) => updateForm("address")(event.target.value)}
                  required
                  type="text"
                  className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-base shadow-sm outline-none ring-emerald-300 transition focus:ring-2"
                />
              </label>
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Neighbourhood
                <select
                  value={form.neighbourhood}
                  onChange={(event) =>
                    updateForm("neighbourhood")(event.target.value)
                  }
                  className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-base shadow-sm outline-none"
                >
                  {neighbourhoods.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            </section>
          )}

          {step === 4 && (
            <section className="grid gap-4">
              <h2 className="text-lg font-semibold text-slate-900">Media</h2>
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Upload photos (up to 10)
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(event) => handleImageFiles(event.target.files)}
                  className="block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm file:mr-4 file:rounded-full file:border-0 file:bg-emerald-100 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-emerald-800"
                />
              </label>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <ImagePlus className="h-4 w-4 text-emerald-700" />
                <span>{images.length}/10 photos selected</span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {images.map((image) => (
                  <div
                    key={image.id}
                    className="overflow-hidden rounded-2xl border border-emerald-100 bg-emerald-50/60"
                  >
                    <div className="relative h-36 w-full">
                      <Image
                        src={image.previewUrl}
                        alt={image.file.name}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(image.id)}
                        className="absolute right-2 top-2 rounded-full bg-white/90 p-2 text-slate-700 shadow-sm"
                        aria-label={`Remove ${image.file.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="p-3 text-xs text-emerald-800">
                      {image.file.name}
                    </div>
                  </div>
                ))}
              </div>
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Upload video tour (optional)
                <input
                  type="file"
                  accept="video/mp4,video/mov"
                  onChange={(event) => handleVideoFile(event.target.files)}
                  className="block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm file:mr-4 file:rounded-full file:border-0 file:bg-emerald-100 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-emerald-800"
                />
              </label>
              {video && (
                <div className="flex items-center gap-2 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-3 text-sm text-emerald-900">
                  <Video className="h-4 w-4" />
                  <span>{video.name}</span>
                </div>
              )}
              {uploadProgress > 0 && (
                <div className="rounded-full bg-emerald-100">
                  <div
                    className="h-2 rounded-full bg-emerald-600"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              )}
            </section>
          )}

          {step === 5 && (
            <section className="grid gap-4">
              <h2 className="text-lg font-semibold text-slate-900">Review</h2>
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4 text-sm text-emerald-900">
                <p className="font-semibold">{form.title}</p>
                <p className="mt-1 text-emerald-900/80">{form.description}</p>
                <p className="mt-2 text-emerald-900/80">
                  {form.propertyType.toUpperCase()} · {form.type.toUpperCase()}
                </p>
                <p className="mt-2 text-emerald-900/80">
                  ₦{Number(form.price || 0).toLocaleString()} /{" "}
                  {form.pricePeriod}
                </p>
                <p className="mt-2 text-emerald-900/80">
                  {form.address}, {form.neighbourhood}
                </p>
                <p className="mt-2 text-emerald-900/80">
                  {images.length} photo(s), {video ? "1 video" : "no video"}
                </p>
              </div>
            </section>
          )}

          {error && (
            <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => setStep((prev) => Math.max(1, prev - 1))}
            disabled={step === 1 || pending}
            className="h-12 rounded-full border border-emerald-200 px-6 text-sm font-semibold text-emerald-800 transition hover:border-emerald-300 disabled:opacity-50"
          >
            Back
          </button>
          <div className="flex gap-3">
            {step < 5 ? (
              <button
                type="button"
                disabled={!canNext || pending}
                onClick={() => setStep((prev) => Math.min(5, prev + 1))}
                className="h-12 rounded-full bg-emerald-700 px-6 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-70"
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                disabled={pending}
                onClick={handleSubmit}
                className="h-12 rounded-full bg-emerald-700 px-6 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {pending ? "Submitting..." : "Publish listing"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
