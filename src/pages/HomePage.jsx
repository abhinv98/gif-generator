import React from "react";
import { Link } from "react-router-dom";
import { Camera, Image, Info } from "lucide-react";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-primary-100">
      <div className="max-w-6xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center animate-fade-in">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-6xl animate-slide-down">
            Portrait Animation Generator
          </h1>
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto animate-fade-in">
            Transform your photos into living memories with our AI-powered
            portrait animator
          </p>

          {/* Main CTA Button */}
          <div className="mt-8 animate-bounce-in">
            <Link
              to="/generator"
              className="inline-flex items-center px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-all duration-300 hover:scale-105 transform"
            >
              <Camera className="h-6 w-6 mr-2" />
              Create Animation
            </Link>
          </div>

          {/* Features Grid */}
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Create Animation Card */}
            <Link
              to="/generator"
              className="block group relative rounded-xl border border-gray-200 bg-white p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 transform"
            >
              <div className="flex flex-col items-center">
                <Camera className="h-12 w-12 text-primary-500 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="mt-4 text-lg font-semibold text-gray-900">
                  Create Animation
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  Upload a photo or take a selfie to create your animated
                  portrait
                </p>
              </div>
            </Link>

            {/* Gallery Card */}
            <Link
              to="/gallery"
              className="block group relative rounded-xl border border-gray-200 bg-white p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 transform"
            >
              <div className="flex flex-col items-center">
                <Image className="h-12 w-12 text-primary-500 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="mt-4 text-lg font-semibold text-gray-900">
                  Gallery
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  Browse your collection of animated portraits
                </p>
              </div>
            </Link>

            {/* About Card */}
            <Link
              to="/about"
              className="block group relative rounded-xl border border-gray-200 bg-white p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 transform"
            >
              <div className="flex flex-col items-center">
                <Info className="h-12 w-12 text-primary-500 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="mt-4 text-lg font-semibold text-gray-900">
                  How It Works
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  Learn about our AI-powered animation technology
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;