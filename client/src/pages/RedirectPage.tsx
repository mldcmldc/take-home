import { getShortenedUrl } from "@/services/url";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function RedirectPage() {
  const { slug } = useParams();
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchDestination = async () => {
      try {
        const res = await getShortenedUrl(slug);
        if (!res.ok) throw new Error("Not found");

        const data = await res.json();

        window.location.href = data.long_url;
      } catch (err) {
        setError(true);
      }
    };

    fetchDestination();
  }, [slug]);

  if (error) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-slate-800 via-indigo-900 to-sky-700 text-white px-4">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">404</h1>
          <p className="text-sm text-slate-300">
            The link you followed is expired or does not exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-slate-800 via-indigo-900 to-sky-700 text-white px-4">
      <div className="text-center space-y-4">
        <div className="animate-spin h-10 w-10 border-4 border-white border-t-transparent rounded-full mx-auto" />
        <h1 className="text-2xl font-semibold">Redirecting...</h1>
        {slug ? (
          <p className="text-sm text-slate-300">
            Taking you to <span className="underline break-words">{slug}</span>
          </p>
        ) : (
          <p className="text-sm text-red-400">Missing destination URL.</p>
        )}
      </div>
    </div>
  );
}

export default RedirectPage;
