import React from "react";
import Hero from "../components/Hero";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col gap-16 bg-gray-50">
      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Hero />
        {/* Future: below hero we can add features grid or testimonials */}
      </main>

      <footer className="border-t border-gray-100 py-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} CareerCraft. All rights reserved.
      </footer>
    </div>
  );
}
