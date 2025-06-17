import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, FileX } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground items-center justify-center text-center p-8">
      <div className="space-y-6 max-w-md">
        <div className="flex justify-center">
          <FileX className="h-24 w-24 text-muted-foreground" />
        </div>
        <h1 className="text-4xl font-bold">Article Not Found</h1>
        <p className="text-lg text-muted-foreground">
          The article you are looking for does not exist or has been removed.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <Link href="/blog" prefetch={false}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/" prefetch={false}>
              Go Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
