import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { shortenUrl } from "@/services/url";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { convertExpiryToDate } from "@/lib/utils";
import { Link } from "react-router";
import { Label } from "@/components/ui/label";
import { getUtmParams, normalizeURL } from "@/utils";

type FormData = {
  longUrl: string;
  slug?: string;
  expiresAt?: string;
};

function HomePage() {
  const { toast } = useToast();
  const [shortenedUrl, setShortenedUrl] = useState("");

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>();

  function handleCopyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Shortened URL copied to clipboard",
    });
  }

  const onSubmit = async ({ longUrl, slug, expiresAt }: FormData) => {
    if (!longUrl) {
      toast({
        title: "Error",
        variant: "destructive",
        description: "Please enter a valid URL",
      });
      return;
    }

    const { url, utmSource, utmMedium, utmCampaign, utmContent, utmTerm } =
      getUtmParams(longUrl);

    const expiryDate = convertExpiryToDate(expiresAt);

    const response = await shortenUrl({
      longUrl: url,
      slug,
      expiresAt: expiryDate,
      utmSource,
      utmMedium,
      utmCampaign,
      utmContent,
      utmTerm,
    });

    if (!response.ok) {
      const errorData = await response.json();

      toast({
        title: "Something went wrong",
        variant: "destructive",
        description: errorData.error.message,
      });
    }

    const data = await response.json();

    setShortenedUrl(data.slug);
  };

  return (
    <div className="h-screen w-full text-black bg-slate-50 flex justify-center items-center">
      <Button
        asChild
        className="bg-blue-900 text-white text-xs absolute top-5 right-5"
      >
        <Link className="tracking-widest" to="/second">
          View Analytics
        </Link>
      </Button>

      <div className="w-full sm:w-8/12 flex flex-col justify-center items-center">
        <section className="w-full text-center">
          <h1 className="text-7xl font-bold bg-gradient-to-r from-slate-800 via-indigo-900 to-sky-700 bg-clip-text text-transparent">
            Shorty
          </h1>
          <p className="text-lg text-gray-500">Shorten URLs with ease</p>
        </section>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-11/12 sm:w-8/12 gap-y-2 flex flex-col items-center mt-5"
        >
          <div className="flex flex-col space-y-1 w-full">
            <Label className="mr-auto text-xs">URL</Label>
            {errors.longUrl && (
              <p className="text-xs text-red-600 font-semibold">
                {errors.longUrl.message}
              </p>
            )}
            <Input
              className="!text-lg !py-6 border border-blue-900"
              type="text"
              placeholder="Let’s shorten your link — paste it here"
              {...register("longUrl", {
                required: true,
                pattern: {
                  value: /^(https?:\/\/)?[\w.-]+\.[a-z]{2,}(\/\S*)?$/,
                  message: "Please enter a valid URL",
                },
              })}
            />
          </div>

          <div className="flex space-x-2 w-full">
            <div className="flex flex-col space-y-1 w-9/12">
              <Label className="mr-auto text-xs">Custom Alias</Label>
              {errors.slug && (
                <p className="text-xs text-red-600 font-semibold">
                  {errors.slug.message}
                </p>
              )}
              <Input
                className="!text-lg !py-6 border border-blue-900"
                type="text"
                placeholder="make your own!"
                {...register("slug", {
                  maxLength: {
                    value: 8,
                    message: "Must be 8 characters or fewer",
                  },
                  pattern: {
                    value: /^[a-zA-Z0-9]+$/,
                    message: "Only letters and numbers allowed",
                  },
                })}
              />
            </div>

            <div className="flex flex-col space-y-1 w-3/12">
              <Label className="mr-auto text-xs mb-auto">Expiry</Label>
              <Controller
                control={control}
                name="expiresAt"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="!h-12 !text-lg border border-blue-900 text-gray-400">
                      <SelectValue placeholder="Expiry" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem className="text-lg" value="1 hour">
                        1 hour
                      </SelectItem>
                      <SelectItem className="text-lg" value="1 day">
                        1 day
                      </SelectItem>
                      <SelectItem className="text-lg" value="7 days">
                        7 days
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-900/80 text-white !text-lg !py-6 text-center"
          >
            Shorten URL
          </Button>

          {shortenedUrl && (
            <Button
              className="!py-6 !mt-8 w-full text-lg text-white bg-gradient-to-r from-slate-800 via-indigo-900 to-sky-700"
              onClick={() =>
                handleCopyToClipboard(`${window.location.host}/${shortenedUrl}`)
              }
              type="button"
            >
              {window.location.host}/{shortenedUrl}
            </Button>
          )}
        </form>
      </div>
    </div>
  );
}

export default HomePage;
