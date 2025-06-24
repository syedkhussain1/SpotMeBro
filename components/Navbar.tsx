"use client";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { DumbbellIcon, HomeIcon, User2Icon, Dumbbell } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

const Navbar = () => {
  const { isSignedIn } = useUser();
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* logo */}
        <Link
          href="/"
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <div className="relative">
            <Dumbbell className="w-7 h-7 text-primary animate-pulse" />
            <div className="absolute -inset-1 bg-primary/10 rounded-full blur-sm"></div>
          </div>
          <span className="text-2xl font-extrabold tracking-tight text-gray-500">
            SpotMe
            <span className="text-primary relative">
              Bro
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary/20"></span>
            </span>
          </span>
        </Link>

        {/* navigation */}
        <nav className="flex items-center gap-4">
          {isSignedIn ? (
            <>
              <Link
                href="/"
                className="flex items-center gap-2 text-md  text-gray-500 hover:text-primary transation-colors"
              >
                <HomeIcon size={16} />
                <span>Home</span>
              </Link>
              <Link
                href="/generate-plan"
                className="flex items-center gap-2 text-md text-gray-500 hover:text-primary transition-colors"
              >
                <DumbbellIcon size={16} />
                <span>Generate Plan</span>
              </Link>
              <Link
                href="/profile"
                className="flex items-center gap-2 text-md hover:text-primary transation-colors  text-gray-500"
              >
                <User2Icon size={16} />
                <span>Profile</span>
              </Link>
              <Button
                asChild
                variant={"outline"}
                className="ml2 border-primary/50 text-primary"
              >
                <Link href="/generate-plan"> Get Started</Link>
              </Button>
              <UserButton />
            </>
          ) : (
            <>
              <SignInButton>
                <Button
                  variant={"outline"}
                  className="ml2 border-primary/50 text-primary"
                >
                  Sign In
                </Button>
              </SignInButton>
              <SignUpButton>
                <Button
                  variant={"outline"}
                  className="ml2 border-primary/50 text-primary"
                >
                  Sign Up
                </Button>
              </SignUpButton>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
