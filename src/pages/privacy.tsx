import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function Privacy() {
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
          <h1 className="text-xl font-bold tracking-wide">PRIVACY POLICY</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="p-6 max-w-4xl mx-auto space-y-8">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-[#C6D600]">Privacy Policy</h2>
          <p className="text-sm text-gray-400">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <section className="space-y-4">
          <h3 className="text-lg font-medium">What We Collect</h3>
          <div className="space-y-3 text-gray-300">
            <p>We collect only essential information to provide our service:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Name:</strong> To personalize your experience and identify your account</li>
              <li><strong>Email Address:</strong> For account authentication and essential service communications</li>
              <li><strong>Thoughtmark Content:</strong> The thoughts and ideas you choose to save in our app</li>
            </ul>
            <p className="text-sm text-gray-400">
              We do not collect any other personal information, device data, location data, or behavioral analytics.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-lg font-medium">How We Use Your Information</h3>
          <div className="space-y-3 text-gray-300">
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Provide and maintain your Thoughtmarks account</li>
              <li>Enable secure authentication through Firebase</li>
              <li>Send essential service notifications (account security, service updates)</li>
              <li>Process premium subscription payments through Stripe</li>
            </ul>
            <p className="text-sm text-gray-400">
              We never use your information for advertising, marketing, or any other purposes.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-lg font-medium">Data Storage & Security</h3>
          <div className="space-y-3 text-gray-300">
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Your data is encrypted in transit and at rest</li>
              <li>Account authentication is handled by Google Firebase</li>
              <li>Payment processing is handled by Stripe (we never store payment details)</li>
              <li>Your thoughtmark content is stored securely in our database</li>
              <li>We implement industry-standard security measures</li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-lg font-medium">Third-Party Services</h3>
          <div className="space-y-3 text-gray-300">
            <p>We use these trusted services to operate our app:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Google Firebase:</strong> For secure authentication</li>
              <li><strong>Stripe:</strong> For payment processing</li>
              <li><strong>OpenAI:</strong> For AI-powered thoughtmark analysis (premium feature)</li>
            </ul>
            <p className="text-sm text-gray-400">
              Each service has their own privacy policies governing how they handle your data.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-lg font-medium">Your Rights</h3>
          <div className="space-y-3 text-gray-300">
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Access:</strong> View all data we have about you</li>
              <li><strong>Export:</strong> Download your thoughtmarks in multiple formats</li>
              <li><strong>Delete:</strong> Permanently delete your account and all associated data</li>
              <li><strong>Modify:</strong> Update your name or email address at any time</li>
            </ul>
            <p className="text-sm text-gray-400">
              To exercise these rights, contact us through the app's settings or email us directly.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-lg font-medium">Data Sharing</h3>
          <div className="space-y-3 text-gray-300">
            <p><strong>We do not sell, rent, or share your personal information with third parties.</strong></p>
            <p>The only exceptions are:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>When you explicitly choose to share thoughtmarks using our sharing features</li>
              <li>If required by law or to protect our legal rights</li>
              <li>In case of a business transfer (with 30 days notice)</li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-lg font-medium">Cookies & Tracking</h3>
          <div className="space-y-3 text-gray-300">
            <p>We use minimal cookies only for:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Keeping you logged in to your account</li>
              <li>Remembering your app preferences</li>
            </ul>
            <p className="text-sm text-gray-400">
              We do not use tracking cookies, analytics, or advertising cookies.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-lg font-medium">Changes to This Policy</h3>
          <div className="space-y-3 text-gray-300">
            <p>
              If we make changes to this privacy policy, we will notify you by email and update 
              the "Last updated" date above. Continued use of the service after changes means 
              you accept the updated policy.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-lg font-medium">Contact Us</h3>
          <div className="space-y-3 text-gray-300">
            <p>
              Questions about this privacy policy? Contact us through the app settings 
              or reach out directly for prompt assistance.
            </p>
          </div>
        </section>

        <div className="pt-8 border-t border-gray-800">
          <p className="text-sm text-gray-500 text-center">
            This privacy policy is designed to be transparent and user-friendly. 
            We believe in minimal data collection and maximum user control.
          </p>
        </div>
      </div>
    </div>
  );
}