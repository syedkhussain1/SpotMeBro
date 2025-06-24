import { Dumbbell } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-background/50 backdrop-blur-sm mt-auto">
      {/* Top border glow */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Dumbbell className="w-6 h-6 text-primary animate-pulse" />
              <div className="absolute -inset-1 bg-primary/10 rounded-full blur-sm"></div>
            </div>
            <span className="text-xl font-extrabold tracking-tight">
              SpotMe
              <span className="text-primary relative">
                Bro
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary/20"></span>
              </span>
            </span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6">
            <Link
              href="/generate-plan"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Generate Plan
            </Link>
            <Link
              href="/profile"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Profile
            </Link>
          </div>

          {/* Copyright */}
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} SpotMeBro. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
