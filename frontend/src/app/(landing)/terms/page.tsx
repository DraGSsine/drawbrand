import React from "react";

const page = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-40 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Terms of Service
        </h1>

        <div className="space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              1. Service Description
            </h2>
            <p className="text-gray-600">
              Our service provides an interface to interact with Google`&apos;s Gemini
              AI through our extension. We facilitate the communication between
              users and the AI service without storing any message content.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              2. Payment Terms
            </h2>
            <p className="text-gray-600">
              All payments are processed securely through Stripe. By making a
              purchase, you agree to provide current, complete, and accurate
              purchase and account information.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              3. Refund Policy
            </h2>
            <p className="text-gray-600">
              We offer a 24-hour money-back guarantee. If you`&apos;re not satisfied
              with our service, you can request a full refund within 24 hours of
              your purchase. To request a refund, please contact our support
              team.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              4. User Responsibilities
            </h2>
            <p className="text-gray-600">
              Users are responsible for maintaining the confidentiality of their
              account credentials and for all activities that occur under their
              account.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              5. Data Processing
            </h2>
            <p className="text-gray-600">
              Messages sent through our extension are processed by Google`&apos;s
              Gemini AI. We do not store or retain any message content. Users
              should be aware that their messages are subject to Google`&apos;s AI
              processing terms and conditions.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              6. Modifications to Service
            </h2>
            <p className="text-gray-600">
              We reserve the right to modify or discontinue the service at any
              time, with or without notice. We shall not be liable to you or any
              third party for any modification, suspension, or discontinuance of
              the service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              7. Contact Information
            </h2>
            <p className="text-gray-600">
              For any questions regarding these terms, please contact us at
              ouchen606@gmail.com.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default page;
