"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { HiMiniAdjustmentsVertical } from "react-icons/hi2";
import { BsWrenchAdjustable } from "react-icons/bs";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
  SignOutButton,
} from "@clerk/nextjs";
import Update from "./Update";

const Navbar = () => {
  return (
    <nav className="sticky top-0 w-full bg-gray-900/95 backdrop-blur-md border-b border-gray-800 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <Image
                src="/logo.png"
                alt="Logo"
                width={30}
                height={30}
                className="object-contain"
              />
              <span className="ml-2 text-xl font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Meal Planner
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <SignedIn>
              <Link
                href="/meal-plan"
                className="text-gray-300 hover:text-white hover:bg-gray-800 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ease-in-out"
              >
                Meal Plan
              </Link>
              <Link
                href="/subscribe"
                className="text-gray-300 hover:text-white hover:bg-gray-800 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ease-in-out"
              >
                Subscriptions
              </Link>
            </SignedIn>
            <SignedOut>
              <Link
                href="/subscribe"
                className="text-gray-300 hover:text-white hover:bg-gray-800 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ease-in-out"
              >
                Subscriptions
              </Link>
            </SignedOut>
          </div>

          <div className="flex items-center space-x-4">
            <SignedIn>
              <UserButton>
                <UserButton.MenuItems>
                  <UserButton.Action
                    label="Update preferences"
                    labelIcon={<HiMiniAdjustmentsVertical />}
                    open="update-preferences"
                  />
                </UserButton.MenuItems>

                <UserButton.UserProfilePage
                  label="Update preferences"
                  labelIcon={<BsWrenchAdjustable />}
                  url="update-preferences"
                >
                  <Update />
                </UserButton.UserProfilePage>
              </UserButton>
              <SignOutButton>
                <button className="bg-red-500/10 text-red-400 hover:bg-red-500/20 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out">
                  Sign out
                </button>
              </SignOutButton>
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <button className="text-gray-300 hover:text-white hover:bg-gray-800 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out">
                  Sign in
                </button>
              </SignInButton>
              <SignUpButton>
                <button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out shadow-lg shadow-purple-500/20">
                  Sign up
                </button>
              </SignUpButton>
            </SignedOut>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
