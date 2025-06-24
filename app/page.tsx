import { Button } from "@/components/ui/button";
import UserPlan from "@/components/UserPlan";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen text-foreground overflow-hidden">
      <section className="relative z-10 py-24 flex-grow">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative">
            {/* LEFT SIDE CONTENT */}
            <div className="lg:col-span-5 relative">
              {/* IMAGE CONTANINER */}
              <img
                src="/undraw_personal-trainer_bqkg.png"
                alt="AI Fitness Coach"
                className="size-full object-cover object-center"
              />

              {/* TERMINAL OVERLAY */}
              {/* <TerminalOverlay /> */}
            </div>

            {/* RIGHT SIDE CONTENT */}
            <div className="lg:col-span-7 space-y-8 relative">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                <div>
                  <span className="text-gray-600">Elevate Your</span>
                </div>
                <div>
                  <span className="text-primary">Fitness Journey</span>
                </div>
                <div className="pt-2">
                  <span className="text-gray-600">Using</span>
                </div>
                <div className="pt-2">
                  <span className="text-gray-600">AI</span>
                  <span className="text-primary"> Technology</span>
                </div>
              </h1>

              {/* SEPERATOR LINE */}
              <div className="h-px w-full bg-gradient-to-r from-primary via-secondary to-primary opacity-50 "></div>

              <p className="text-xl text-muted-foreground w-2/3">
                Talk to our AI assistant and get personalized diet plans and
                workout routines designed just for you
              </p>

              {/* BUTTON */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button
                  size="lg"
                  asChild
                  className="overflow-hidden bg-primary text-primary-foreground px-8 py-6 text-lg font-medium"
                >
                  <Link
                    href={"/generate-plan"}
                    className="flex items-center font-mono"
                  >
                    Build Your Plan
                    <ArrowRightIcon className="ml-2 size-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <UserPlan />
    </div>
  );
};
export default HomePage;
