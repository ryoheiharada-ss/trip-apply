import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FLOW_ORDER, FLOW_PATHS } from "@/lib/constants";

interface FormNavigationProps {
  currentPath: typeof FLOW_PATHS[keyof typeof FLOW_PATHS];
  queryParams?: {
    [key: string]: string | string[];
  };
}

export function FormNavigation({ currentPath, queryParams }: FormNavigationProps) {
  const currentIndex = FLOW_ORDER.indexOf(currentPath as typeof FLOW_ORDER[number]);
  const prevPath = currentIndex > 0 ? FLOW_ORDER[currentIndex - 1] : null;
  const nextPath = currentIndex < FLOW_ORDER.length - 1 ? FLOW_ORDER[currentIndex + 1] : null;

  const createUrl = (path: string) => {
    if (!queryParams) return path;
    const searchParams = new URLSearchParams();
    
    Object.entries(queryParams).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(v => searchParams.append(`${key}`, v));
      } else {
        searchParams.append(key, value);
      }
    });
    
    return `${path}?${searchParams.toString()}`;
  };

  return (
    <div className="flex justify-between pt-8">
      {prevPath ? (
        <Link href={createUrl(prevPath)}>
          <Button variant="outline">戻る</Button>
        </Link>
      ) : <div />}
      
      {nextPath && (
        <Link href={createUrl(nextPath)}>
          <Button>次へ</Button>
        </Link>
      )}
    </div>
  );
}
