import Link from "next/link";
import { MessageSquareTextIcon } from "lucide-react";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { HighlightText } from "@/components/highlight-text";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col container justify-between max-w-xl mx-auto">
      <section>
        <Navbar />
        <div className="flex items-center flex-col">
          <h1 className="font-extrabold tracking-tighter text-8xl">
            um<i>edu</i>
          </h1>
          <p className="text-muted-foreground font-medium text-center">
            USLS College of Computing Studies Edition
          </p>

          <Button asChild className="mt-4" variant="outline">
            <Link href="/login">
              Access the private forum <MessageSquareTextIcon />
            </Link>
          </Button>

          <div className="leading-7 text-center mt-16 text-muted-foreground">
            Fully{" "}
            <HighlightText>
              <Link className="hover:text-primary transition-all" href="/about">
                anonymous
              </Link>
            </HighlightText>{" "}
            and{" "}
            <HighlightText>
              <Link
                className="hover:text-primary transition-all"
                href="https://github.com/joshxfi/umedu-ccs"
                target="_blank"
              >
                open-source
              </Link>
            </HighlightText>
            platform for students to connect with their peers. No personal
            information is stored, ensuring your privacy is protected.{" "}
            <Link href="/about" className="text-white">
              Learn more &rarr;
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
