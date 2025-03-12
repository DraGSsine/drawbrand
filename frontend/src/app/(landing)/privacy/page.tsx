import React from "react";

const page = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-40 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Privacy Policy
        </h1>

        <div className="space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              Information We Collect
            </h2>
            <p className="text-gray-600">
              We collect and store only the following information:
            </p>
            <ul className="list-disc ml-6 mt-2 text-gray-600">
              <li>Email address (for account authentication)</li>
              <li>Password (encrypted)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              Message Processing
            </h2>
            <p className="text-gray-600">
              Our extension does not store any user messages. All messages are
              sent directly to Google`&apos;s Gemini AI for processing. We act as an
              intermediary to facilitate this communication, but we do not
              retain or store any message content.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              Payment Processing
            </h2>
            <p className="text-gray-600">
              All payments are processed securely through Stripe. We do not
              store your payment information on our servers. Stripe maintains
              the security and privacy of your payment details in accordance
              with their privacy policy and industry standards.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              Data Security
            </h2>
            <p className="text-gray-600">
              We implement appropriate security measures to protect your
              personal information. Passwords are encrypted, and we use secure
              protocols for all data transmission.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              Contact Us
            </h2>
            <p className="text-gray-600">
              If you have any questions about our privacy practices, please
              contact us at ouchen606@gmail.com
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default page;
