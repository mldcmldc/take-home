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

  function getUtmParams(url: string) {
    const parsedUrl = new URL(url);
    const params = new URLSearchParams(parsedUrl.search);

    const utmSource = params.get("utm_source") ?? undefined;
    const utmMedium = params.get("utm_medium") ?? undefined;
    const utmCampaign = params.get("utm_campaign") ?? undefined;
    const utmContent = params.get("utm_content") ?? undefined;
    const utmTerm = params.get("utm_term") ?? undefined;

    return {
      utmSource,
      utmMedium,
      utmCampaign,
      utmContent,
      utmTerm,
    };
  }

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

    const { utmSource, utmMedium, utmCampaign, utmContent, utmTerm } =
      getUtmParams(longUrl);

    const expiryDate = convertExpiryToDate(expiresAt);

    const response = await shortenUrl({
      longUrl,
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
      <div className="w-8/12 flex flex-col justify-center items-center">
        <section className="w-full text-center">
          <h1 className="text-7xl font-bold bg-gradient-to-r from-slate-800 via-indigo-900 to-sky-700 bg-clip-text text-transparent">
            Shorty
          </h1>
          <Link className="text-lg tracking-widest" to="/second">
            View Analytics
          </Link>
        </section>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-8/12 space-y-4 flex flex-col items-center"
        >
          <div className="h-10">
            {errors.longUrl && (
              <p className="text-sm text-red-600 mt-4 font-semibold">
                {errors.longUrl.message}
              </p>
            )}
          </div>
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
          <div className="flex space-x-2 w-full">
            <Input
              className="w-8/12 !text-lg !py-6 border border-blue-900"
              type="text"
              placeholder="Add a short, branded touch to your URL"
              {...register("slug")}
            />

            <Controller
              control={control}
              name="expiresAt"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="!h-12 w-4/12 !text-lg border border-blue-900 text-gray-400">
                    <SelectValue placeholder="Expiry" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem className="text-lg" value="1 hour">
                      1 hour
                    </SelectItem>
                    <SelectItem className="text-lg" value="24 hours">
                      24 hours
                    </SelectItem>
                    <SelectItem className="text-lg" value="7 days">
                      7 days
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
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
