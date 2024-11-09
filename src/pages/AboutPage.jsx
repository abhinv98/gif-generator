import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Home
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            About Portrait GIF Generator
          </h1>

          <div className="space-y-6 text-gray-600">
            <p>
              Portrait GIF Generator is an AI-powered web application that
              transforms static portraits into animated GIFs. Using advanced
              machine learning models, we bring your photos to life with
              natural-looking animations.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8">
              How It Works
            </h2>
            <p>
              Our application uses the Segmind Live Portrait AI model to analyze
              your portrait and generate realistic animations. The process
              involves:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Facial feature detection and mapping</li>
              <li>Motion synthesis using AI algorithms</li>
              <li>Seamless frame generation</li>
              <li>High-quality GIF compilation</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 mt-8">
              Privacy & Data
            </h2>
            <p>
              We take your privacy seriously. All uploaded images are processed
              securely and are not stored permanently on our servers. The
              generated GIFs are available for immediate download and are
              automatically deleted afterward.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
