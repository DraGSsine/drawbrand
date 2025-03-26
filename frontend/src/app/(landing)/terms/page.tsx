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
              Our service provides an AI-powered platform that converts user-submitted sketches into 
              professional logo designs. We utilize advanced machine learning technology to 
              transform your concept sketches into polished, ready-to-use logo designs.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              2. Payment Terms
            </h2>
            <p className="text-gray-600">
              All payments are processed securely through Stripe. By making a
              purchase, you agree to provide current, complete, and accurate
              purchase and account information. Pricing may vary based on subscription 
              plans or per-generation usage tiers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              3. Refund Policy
            </h2>
            <p className="text-gray-600">
              We offer a 24-hour money-back guarantee. If you&apos;re not satisfied
              with our logo generation service, you can request a full refund within 24 hours of
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
              account. Users must ensure they have the right to submit any sketches or design 
              elements for processing, and that the resulting logos do not infringe on any 
              third-party intellectual property rights.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              5. Data Processing
            </h2>
            <p className="text-gray-600">
              Sketches uploaded to our service are processed by our proprietary AI logo generation 
              technology. While we store your generated logos for your convenience, you retain all 
              rights to your original sketches and the resulting logo designs. We may use anonymized 
              data to improve our AI models.
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
