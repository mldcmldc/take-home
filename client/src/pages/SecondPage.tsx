import { getUrlClicks } from "@/services/url";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
    <div className="max-h-full w-full p-5 text-black bg-slate-50 flex flex-col justify-center items-center">
      <Button asChild className="bg-blue-900 text-white absolute top-5 right-5">
        <Link className="text-xs tracking-widest" to="/">
          Home
        </Link>
      </Button>

      <section className="mt-14">
        <h1 className="text-7xl font-bold bg-gradient-to-r from-slate-800 via-indigo-900 to-sky-700 bg-clip-text text-transparent text-center">
          Analytics
        </h1>
        <Table className="mt-10">
          <TableHeader>
            <TableRow>
              <TableHead className="w-52">Short URL</TableHead>
              <TableHead>Total Clicks</TableHead>
              <TableHead>Unique Visitors</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data &&
              data.map((urlClick) => (
                <TableRow key={urlClick.slug}>
                  <TableCell className="font-medium">{urlClick.slug}</TableCell>
                  <TableCell>{urlClick.total_clicks}</TableCell>
                  <TableCell>{urlClick.unique_visitors}</TableCell>
                </TableRow>
              ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Total number of URLs:</TableCell>
              <TableCell className="text-right">{data?.length}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </section>
    </div>
  );
}

export default SecondPage;
