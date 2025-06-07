import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function Terms() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation("/")}
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold tracking-wide">TERMS OF SERVICE</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="p-6 max-w-4xl mx-auto space-y-8">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-[#C6D600]">Terms of Service</h2>
          <p className="text-sm text-gray-400">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <section className="space-y-4">
          <h3 className="text-lg font-medium">Agreement to Terms</h3>
          <div className="space-y-3 text-gray-300">
            <p>
              By accessing and using Thoughtmarks, you agree to be bound by these Terms of Service 
              and our Privacy Policy. If you disagree with any part of these terms, you may not use our service.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-lg font-medium">Description of Service</h3>
          <div className="space-y-3 text-gray-300">
            <p>
              Thoughtmarks is a personal knowledge management application that helps you capture, 
              organize, and explore your thoughts and ideas. Our service includes:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Free tier with basic thoughtmark creation and organization</li>
              <li>Premium subscription with AI-powered insights and advanced features</li>
              <li>Cross-device synchronization and cloud storage</li>
              <li>Export and sharing capabilities</li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-lg font-medium">User Accounts</h3>
          <div className="space-y-3 text-gray-300">
            <p>To use Thoughtmarks, you must:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Be at least 13 years old</li>
              <li>Provide accurate and complete information during registration</li>
              <li>Maintain the security of your account credentials</li>
              <li>Notify us immediately of any unauthorized use of your account</li>
            </ul>
            <p>You are responsible for all activities that occur under your account.</p>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-lg font-medium">Acceptable Use</h3>
          <div className="space-y-3 text-gray-300">
            <p>You agree not to use Thoughtmarks to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe on intellectual property rights of others</li>
              <li>Share harmful, offensive, or illegal content</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Use the service for commercial purposes without permission</li>
              <li>Interfere with or disrupt the service or servers</li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-lg font-medium">Subscription and Billing</h3>
          <div className="space-y-3 text-gray-300">
            <p><strong>Free Tier:</strong> Limited features with no payment required.</p>
            <p><strong>Premium Subscription:</strong></p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Monthly: $4.99/month, billed monthly</li>
              <li>Annual: $34.99/year, billed annually</li>
              <li>Lifetime: $59.99, one-time payment</li>
            </ul>
            <p>Billing terms:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Subscriptions automatically renew unless cancelled</li>
              <li>You can cancel anytime through your account settings</li>
              <li>Refunds are handled according to our refund policy</li>
              <li>Price changes will be communicated 30 days in advance</li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-lg font-medium">Intellectual Property</h3>
          <div className="space-y-3 text-gray-300">
            <p><strong>Your Content:</strong> You retain all rights to the thoughtmarks and content you create. 
            You grant us a limited license to store, display, and process your content solely to provide our service.</p>
            <p><strong>Our Service:</strong> Thoughtmarks, including its design, features, and underlying technology, 
            is protected by copyright and other intellectual property laws.</p>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-lg font-medium">Data and Privacy</h3>
          <div className="space-y-3 text-gray-300">
            <p>We collect and process only essential data:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Name and email address for account management</li>
              <li>Your thoughtmark content to provide the service</li>
              <li>No tracking, analytics, or advertising data</li>
            </ul>
            <p>See our Privacy Policy for complete details on data handling.</p>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-lg font-medium">Service Availability</h3>
          <div className="space-y-3 text-gray-300">
            <p>We strive to provide reliable service, but we cannot guarantee:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>100% uptime or uninterrupted access</li>
              <li>Error-free operation</li>
              <li>Compatibility with all devices or browsers</li>
            </ul>
            <p>We may temporarily suspend service for maintenance or updates with reasonable notice.</p>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-lg font-medium">Limitation of Liability</h3>
          <div className="space-y-3 text-gray-300">
            <p>
              To the maximum extent permitted by law, Thoughtmarks and its operators shall not be liable 
              for any indirect, incidental, special, or consequential damages arising from your use of the service.
            </p>
            <p>
              Our total liability shall not exceed the amount you paid for the service in the 12 months 
              preceding the claim.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-lg font-medium">Termination</h3>
          <div className="space-y-3 text-gray-300">
            <p>Either party may terminate this agreement:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>You:</strong> Can delete your account anytime through settings</li>
              <li><strong>Us:</strong> May suspend accounts for violation of these terms</li>
            </ul>
            <p>Upon termination, you can export your data for 30 days before permanent deletion.</p>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-lg font-medium">Changes to Terms</h3>
          <div className="space-y-3 text-gray-300">
            <p>
              We may update these terms periodically. We will notify you of significant changes by email 
              and update the "Last updated" date. Continued use after changes constitutes acceptance.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-lg font-medium">Governing Law</h3>
          <div className="space-y-3 text-gray-300">
            <p>
              These terms are governed by the laws of the jurisdiction where our company is incorporated. 
              Any disputes will be resolved through binding arbitration.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-lg font-medium">Contact Information</h3>
          <div className="space-y-3 text-gray-300">
            <p>
              Questions about these terms? Contact us through the app settings or reach out directly 
              for clarification on any aspect of our service agreement.
            </p>
          </div>
        </section>

        <div className="pt-8 border-t border-gray-800">
          <p className="text-sm text-gray-500 text-center">
            These terms are designed to be fair and transparent while protecting both users and the service.
          </p>
        </div>
      </div>
    </div>
  );
}