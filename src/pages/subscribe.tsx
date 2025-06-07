import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Check, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";

if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const SubscribeForm = ({ priceId, amount, interval }: { priceId: string; amount: number; interval: string }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/?subscription=success`,
      },
    });

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Payment Successful",
        description: "Welcome to Thoughtmarks Premium!",
      });
    }
    
    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement 
        options={{
          layout: "tabs"
        }}
      />
      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-[#C6D600] text-black hover:bg-[#C6D600]/90"
      >
        {isProcessing ? (
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
            <span>Processing...</span>
          </div>
        ) : (
          `Subscribe for $${amount}${interval ? `/${interval}` : ''}`
        )}
      </Button>
    </form>
  );
};

export default function Subscribe() {
  const [, setLocation] = useLocation();
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly' | 'perpetual'>('monthly');
  const [clientSecret, setClientSecret] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const plans = {
    monthly: { price: 4.99, interval: 'month', priceId: 'price_monthly' },
    yearly: { price: 34.99, interval: 'year', priceId: 'price_yearly' },
    perpetual: { price: 59.99, interval: '', priceId: 'price_perpetual' }
  };

  const initializePayment = async (plan: typeof selectedPlan) => {
    setIsLoading(true);
    try {
      const response = await apiRequest("POST", "/api/create-subscription", {
        priceId: plans[plan].priceId,
        amount: plans[plan].price * 100 // Convert to cents
      });
      const data = await response.json();
      setClientSecret(data.clientSecret);
    } catch (error) {
      toast({
        title: "Payment Setup Failed",
        description: "Please try again or contact support.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const { toast } = useToast();

  useEffect(() => {
    initializePayment(selectedPlan);
  }, [selectedPlan]);

  if (isLoading || !clientSecret) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="max-w-md mx-auto p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Button
              onClick={() => setLocation("/")}
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold">Subscribe</h1>
            <div className="w-10" />
          </div>

          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-[#C6D600] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-400">Setting up payment...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-md mx-auto p-6 pb-24">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={() => setLocation("/")}
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold">Upgrade to Premium</h1>
          <div className="w-10" />
        </div>

        {/* Plan Selection */}
        <div className="space-y-4 mb-8">
          {Object.entries(plans).map(([key, plan]) => (
            <Card 
              key={key}
              className={`p-4 cursor-pointer transition-all ${
                selectedPlan === key 
                  ? 'bg-gradient-to-br from-blue-950 to-purple-950 border-[#C6D600]' 
                  : 'bg-gray-900 border-gray-700 hover:border-gray-600'
              }`}
              onClick={() => setSelectedPlan(key as typeof selectedPlan)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold capitalize">{key} Plan</h3>
                  <p className="text-sm text-gray-400">
                    ${plan.price}{plan.interval && `/${plan.interval}`}
                    {key === 'yearly' && <span className="text-[#C6D600] ml-2">Save $24.89</span>}
                    {key === 'perpetual' && <span className="text-[#C6D600] ml-2">One-time payment</span>}
                  </p>
                </div>
                {selectedPlan === key && (
                  <div className="w-6 h-6 bg-[#C6D600] rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-black" />
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Premium Features */}
        <Card className="bg-gray-900 border-gray-700 p-4 mb-6">
          <div className="flex items-center space-x-3 mb-3">
            <Zap className="w-5 h-5 text-[#C6D600]" />
            <h3 className="font-semibold">Premium Features</h3>
          </div>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="flex items-start space-x-2">
              <Check className="w-4 h-4 text-[#C6D600] mt-0.5" />
              <span>Cross-device synchronization</span>
            </li>
            <li className="flex items-start space-x-2">
              <Check className="w-4 h-4 text-[#C6D600] mt-0.5" />
              <span>AI-powered thoughtmark analysis</span>
            </li>
            <li className="flex items-start space-x-2">
              <Check className="w-4 h-4 text-[#C6D600] mt-0.5" />
              <span>Smart content recommendations</span>
            </li>
            <li className="flex items-start space-x-2">
              <Check className="w-4 h-4 text-[#C6D600] mt-0.5" />
              <span>Advanced connection mapping</span>
            </li>
            <li className="flex items-start space-x-2">
              <Check className="w-4 h-4 text-[#C6D600] mt-0.5" />
              <span>Priority customer support</span>
            </li>
          </ul>
        </Card>

        {/* Payment Form */}
        <Card className="bg-gray-900 border-gray-700 p-6">
          <h3 className="font-semibold mb-4">Payment Information</h3>
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <SubscribeForm 
              priceId={plans[selectedPlan].priceId}
              amount={plans[selectedPlan].price}
              interval={plans[selectedPlan].interval}
            />
          </Elements>
        </Card>

        {/* Security Notice */}
        <p className="text-xs text-gray-500 text-center mt-4">
          Payments are securely processed by Stripe. Your card information is never stored on our servers.
        </p>
      </div>
    </div>
  );
}