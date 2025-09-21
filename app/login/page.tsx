import Link from "next/link";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import {
  LogInIcon,
  ShieldIcon,
  InfoIcon,
  AlertTriangleIcon,
} from "lucide-react";

import { getSession } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Navbar } from "@/components/navbar";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Umedu x CCS — Login",
};

type Props = {
  searchParams: Promise<{ error: string }>;
};

export default async function Login({ searchParams }: Props) {
  const { session } = await getSession();
  const hasInvalidEmailError = (await searchParams).error === "invalid_email";

  if (session) {
    redirect("/forum");
  }

  return (
    <div className="min-h-screen max-w-xl mx-auto container flex flex-col justify-between">
      <section>
        <Navbar />
        <form className="mx-auto max-w-md">
          <Card className="w-full">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">
                Welcome to Umedu
              </CardTitle>
              <CardDescription>
                USLS College of Computing Studies Edition
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {hasInvalidEmailError ? (
                <Alert
                  variant="destructive"
                  className="border-destructive/20 bg-destructive/10"
                >
                  <AlertTriangleIcon className="h-4 w-4 text-destructive" />
                  <AlertDescription className="text-destructive">
                    <div>
                      Only students with{" "}
                      <span className="font-semibold">usls.edu.ph</span> email
                      is allowed to access this platform.
                    </div>
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert
                  variant="default"
                  className="border-primary/20 bg-primary/10"
                >
                  <InfoIcon className="h-4 w-4 text-primary" />
                  <AlertDescription className="text-foreground">
                    <div>
                      Sign in with your{" "}
                      <span className="font-semibold">usls.edu.ph</span> email{" "}
                      to access the private forum.
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex items-start gap-2">
                <ShieldIcon className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">
                  Your email is only used for verification. We don&apos;t store
                  your personal data beyond what&apos;s needed for
                  authentication.
                </p>
              </div>

              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  By signing in, you confirm that you are{" "}
                  <span className="font-semibold">18 years of age</span> or
                  older and you agree to our{" "}
                  <Link href="/terms" className="text-primary hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/guidelines"
                    className="text-primary hover:underline"
                  >
                    Community Guidelines
                  </Link>
                  .
                </p>
              </div>

              <Button
                className="w-full rounded-full h-[44px] px-4 font-medium text-base"
                variant="outline"
                asChild
              >
                <Link
                  href="/auth/google"
                  className="flex items-center justify-center gap-2"
                >
                  <LogInIcon className="size-5" />
                  Sign in with Google
                </Link>
              </Button>
            </CardContent>

            <Separator />

            <CardFooter className="flex flex-col space-y-4">
              <p className="text-xs text-muted-foreground/70 italic">
                This platform is not affiliated with any educational
                institution.
              </p>
            </CardFooter>
          </Card>
        </form>
      </section>

      <Footer />
    </div>
  );
}
