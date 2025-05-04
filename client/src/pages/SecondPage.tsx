import { getUrlClicks } from "@/services/url";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router";

type UrlClick = {
  slug: string;
  total_clicks: string;
  unique_visitors: string;
};

function SecondPage() {
  const { data, isLoading, error } = useQuery<UrlClick[]>({
    queryKey: ["urlclicks"],
    queryFn: getUrlClicks,
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {(error as Error).message}</p>;

  return (
    <div className="h-screen w-full text-black bg-slate-50 flex flex-col justify-center items-center">
      <h1 className="text-7xl font-bold bg-gradient-to-r from-slate-800 via-indigo-900 to-sky-700 bg-clip-text text-transparent">
        Analytics
      </h1>
      <Link className="text-lg tracking-widest" to="/">
        Return to Home
      </Link>
      <div className="grid grid-cols-3 gap-2 mt-5">
        {data &&
          data.map((urlClick) => (
            <Card>
              <CardHeader>
                <CardTitle className="text-indigo-900">
                  {urlClick.slug}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Total Clicks:{" "}
                  <span className="font-semibold">{urlClick.total_clicks}</span>
                </p>
                <p>
                  Unique Visitors:
                  <span className="font-semibold">
                    {urlClick.unique_visitors}
                  </span>
                </p>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  );
}

export default SecondPage;
