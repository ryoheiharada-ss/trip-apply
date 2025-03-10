import { Header } from "@/components/header";
import { Layout } from "@/components/layout";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  return (
    <Layout>
      <div className="space-y-6">
        <Header />
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <p className="text-muted-foreground">
                以下のステップで出張申請を行います：
              </p>
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                <li>基本情報の入力</li>
                <li>出張内容の入力</li>
                <li>経費の入力</li>
                <li>内容の確認</li>
                <li>申請の確定</li>
              </ol>
              <div className="pt-4">
                <Link href="/travel-request/step1">
                  <Button>申請を開始する</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
