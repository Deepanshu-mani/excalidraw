"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Smartphone, Database, Zap, Globe, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  // Removed automatic redirect - users can now visit home page even when authenticated
  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-white/10">
        <div className="text-2xl font-extrabold tracking-tight text-white select-none">
          Excalidraw
        </div>
        <div className="flex gap-4">
          {isAuthenticated ? (
            <>
              <Link
                href="/dashboard"
                className="px-5 py-2 rounded-md border border-white/20 bg-black text-white hover:bg-white/10 transition font-medium"
              >
                Dashboard
              </Link>
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  setIsAuthenticated(false);
                }}
                className="px-5 py-2 rounded-md bg-white/10 text-white border border-white/20 font-semibold hover:bg-white/20 transition"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/signin"
                className="px-5 py-2 rounded-md border border-white/20 bg-black text-white hover:bg-white/10 transition font-medium"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="px-5 py-2 rounded-md bg-white/10 text-white border border-white/20 font-semibold hover:bg-white/20 transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>
      {/* Hero Section with Video on Right */}
      <section className="flex-1 w-full items-center justify-center text-left px-4 overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto py-16">
        {/* Hero Content */}
        <div className="flex flex-col justify-center text-left md:text-left">
          <h1 className="text-5xl sm:text-7xl font-extrabold mb-6 text-white">
            Draw, Collaborate,
            <br className="hidden sm:block" /> Create Visually.
          </h1>
          <p className="text-lg sm:text-2xl text-white/80 mb-10 max-w-2xl">
            The ultimate online whiteboard for teams & creators. Unleash your
            ideas and collaborate in real-time with powerful drawing tools.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-start">
            <Link href="/signup">
              <button className="px-8 py-3 rounded-md bg-white/10 text-white border border-white/20 font-semibold text-lg hover:bg-white/20 transition">
                Get Started
              </button>
            </Link>
            <a
              href="#features"
              className="px-8 py-3 rounded-md border border-white/20 bg-black text-white font-medium text-lg hover:bg-white/10 transition inline-block"
            >
              Learn More
            </a>
          </div>
        </div>
        {/* Video */}
        <div className="flex justify-center items-center">
          <video
            className="w-full object-cover rounded-lg shadow-lg h-80 md:h-[500px]"
            src="/GenAI.mp4"
            autoPlay
            muted
            preload="auto"
            playsInline
            onLoadedMetadata={(e) => {
              // Skip the first 1 second
              const video = e.currentTarget;
              video.currentTime = 2.5;
            }}
            onTimeUpdate={(e) => {
              const video = e.currentTarget;
              // Loop from 1 second to end
              if (video.currentTime >= video.duration) {
                video.currentTime = 2.5;
                video.play();
              }
            }}
          />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-black text-white py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose Excalidraw
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Visual Collaboration */}
            <div className="relative overflow-hidden flex flex-col items-start gap-3 p-6 rounded-2xl bg-[#111111] text-white shadow-md hover:shadow-lg transition-all cursor-pointer border border-white/10 border-b-4 border-b-white/20">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity pointer-events-none" />
              <Smartphone className="w-10 h-10 text-white/80" />
              <h3 className="text-lg font-semibold">Visual Collaboration</h3>
              <p className="text-sm text-white/70">
                Collaborate in real-time with your team on an infinite canvas
                designed for brainstorming and planning.
              </p>
            </div>

            {/* Data Scraping */}
            <div className="relative overflow-hidden flex flex-col items-start gap-3 p-6 rounded-2xl bg-white text-gray-900 shadow-md hover:shadow-lg transition-all cursor-pointer border border-gray-200 border-b-4 border-b-gray-300">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity pointer-events-none" />
              <Database className="w-10 h-10 text-gray-700" />
              <h3 className="text-lg font-semibold">Data Scraping</h3>
              <p className="text-sm text-gray-600">
                Pull in live data and connect it seamlessly with your drawings
                and notes for deeper insights.
              </p>
            </div>

            {/* Workflow Automation */}
            <div className="relative overflow-hidden flex flex-col items-start gap-3 p-6 rounded-2xl bg-white text-gray-900 shadow-md hover:shadow-lg transition-all cursor-pointer border border-gray-200 border-b-4 border-b-gray-300">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity pointer-events-none" />
              <Zap className="w-10 h-10 text-gray-700" />
              <h3 className="text-lg font-semibold">Workflow Automation</h3>
              <p className="text-sm text-gray-600">
                Automate repetitive tasks with smart integrations to save time
                and boost productivity.
              </p>
            </div>

            {/* Custom Integrations */}
            <div className="relative overflow-hidden flex flex-col items-start gap-3 p-6 rounded-2xl bg-[#111111] text-white shadow-md hover:shadow-lg transition-all cursor-pointer border border-white/10 border-b-4 border-b-white/20">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity pointer-events-none" />
              <Globe className="w-10 h-10 text-white/80" />
              <h3 className="text-lg font-semibold">Custom Integrations</h3>
              <p className="text-sm text-white/70">
                Extend Excalidraw with plugins and integrations tailored to your
                unique workflow.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-4 border-t border-white/10 text-white/60 text-sm">
        &copy; {new Date().getFullYear()} Excalidraw. All rights reserved.
      </footer>
    </div>
  );
}
