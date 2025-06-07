import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { PageLayout } from "@/components/page-layout";
import { 
  Settings as SettingsIcon, 
  Bell, 
  Database, 
  Download, 
  User, 
  LogOut, 
  Palette, 
  CreditCard, 
  Shield, 
  HelpCircle, 
  Info,
  Star,
  Crown,
  Smartphone,
  Volume2,
  Brain
} from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { useAuth } from "@/hooks/use-auth";
import { getAuth, signOut } from "firebase/auth";
import { useLocation } from "wouter";

type Theme = "light" | "dark" | "system";

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [notifications, setNotifications] = useState({
    push: true,
    email: true,
    sms: false,
    marketing: false,
  });

  const handleSignOut = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account.",
      });
      setLocation("/auth");
    } catch (error) {
      toast({
        title: "Error signing out",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleExportData = () => {
    toast({
      title: "Export initiated",
      description: "Your data will be downloaded shortly.",
    });
  };

  return (
    <PageLayout title="Settings" showBackButton={true} showNewButton={true}>
      <div className="max-w-2xl mx-auto">

        {/* Welcome & Integration Guide */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center space-x-2">
                <Brain className="w-5 h-5 text-primary" />
                <span>Welcome to Thoughtmarks</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Capture fleeting thoughts without breaking your flow. Use voice commands, quick notes, or AI-powered categorization to build your personal knowledge base effortlessly.
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setLocation("/about")}
                className="bg-primary/10 border-primary/30 hover:bg-primary/20 hover:border-primary/50 text-primary hover:text-primary"
              >
                Learn More
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Authentication Section - Show if not authenticated */}
        {!isAuthenticated && (
          <div className="space-y-4 mb-8">
            <h2 className="text-lg font-semibold text-foreground">Account</h2>
            <div className="bg-card rounded-lg p-4 border border-border space-y-3">
              <Button
                onClick={() => setLocation("/auth")}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <User className="w-4 h-4 mr-2" />
                Sign In / Sign Up
              </Button>
              <p className="text-sm text-muted-foreground text-center">
                Sign in to sync your data across devices and unlock premium features
              </p>
            </div>
          </div>
        )}

        {/* Premium Features Section */}
        <div className="space-y-4 mb-8">
          <h2 className="text-lg font-semibold text-foreground">Premium Features</h2>
          <div className="bg-card rounded-lg p-4 border border-border">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Crown className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium">Thoughtmarks Premium</p>
                  <p className="text-sm text-muted-foreground">Unlock advanced AI features</p>
                </div>
              </div>
              <Button 
                onClick={() => setLocation("/subscribe")}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Upgrade
              </Button>
            </div>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-primary" />
                <span>Advanced AI categorization</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-primary" />
                <span>Unlimited thoughtmarks</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-primary" />
                <span>Voice-to-text with AI insights</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-primary" />
                <span>Export to multiple formats</span>
              </div>
            </div>
          </div>
        </div>

        {/* Theme Section */}
        <div className="space-y-4 mb-8">
          <h2 className="text-lg font-semibold text-foreground">Appearance</h2>
          <div className="bg-card rounded-lg p-4 border border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Palette className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium">Theme</p>
                  <p className="text-sm text-muted-foreground">Choose your preferred theme</p>
                </div>
              </div>
              <Select value={theme} onValueChange={(value: Theme) => setTheme(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Voice & Shortcuts Section */}
        <div className="space-y-4 mb-8">
          <h2 className="text-lg font-semibold text-foreground">Voice & Shortcuts</h2>
          <div className="bg-card rounded-lg p-4 border border-border space-y-4">
            <Button
              variant="ghost"
              className="w-full justify-start text-left p-3 h-auto"
              onClick={() => {
                toast({
                  title: "Siri Shortcuts Setup",
                  description: "Go to Settings > Siri & Search > Add to Siri and search for Thoughtmarks to add voice commands.",
                });
              }}
            >
              <Smartphone className="w-5 h-5 mr-3 text-primary" />
              <div>
                <p className="font-medium">Add Siri Shortcuts</p>
                <p className="text-sm text-muted-foreground">Enable "Hey Siri, capture thoughtmark" voice commands</p>
              </div>
            </Button>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="space-y-4 mb-8">
          <h2 className="text-lg font-semibold text-foreground">Notifications</h2>
          <div className="bg-card rounded-lg p-4 border border-border space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Bell className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium">Push Notifications</p>
                  <p className="text-sm text-muted-foreground">Get notified about important updates</p>
                </div>
              </div>
              <Switch 
                checked={notifications.push}
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, push: checked }))}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Volume2 className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive updates via email</p>
                </div>
              </div>
              <Switch 
                checked={notifications.email}
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, email: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Smartphone className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium">SMS Notifications</p>
                  <p className="text-sm text-muted-foreground">Get text message alerts</p>
                </div>
              </div>
              <Switch 
                checked={notifications.sms}
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, sms: checked }))}
              />
            </div>
          </div>
        </div>

        {/* Data Section */}
        <div className="space-y-4 mb-8">
          <h2 className="text-lg font-semibold text-foreground">Data</h2>
          <div className="bg-card rounded-lg p-4 border border-border space-y-3">
            <Button
              variant="ghost"
              className="w-full justify-start text-left p-3 h-auto"
              onClick={() => setLocation("/recently-deleted")}
            >
              <Database className="w-5 h-5 mr-3 text-primary" />
              <div>
                <p className="font-medium">Recently Deleted</p>
                <p className="text-sm text-muted-foreground">Restore deleted thoughtmarks</p>
              </div>
            </Button>
            
            <Button
              variant="ghost"
              className="w-full justify-start text-left p-3 h-auto"
              onClick={handleExportData}
            >
              <Download className="w-5 h-5 mr-3 text-primary" />
              <div>
                <p className="font-medium">Export Data</p>
                <p className="text-sm text-muted-foreground">Download your thoughtmarks</p>
              </div>
            </Button>
          </div>
        </div>

        {/* Profile Section - Show if authenticated */}
        {isAuthenticated && (
          <div className="space-y-4 mb-8">
            <h2 className="text-lg font-semibold text-foreground">Profile</h2>
            <div className="bg-card rounded-lg p-4 border border-border space-y-4">
              <div className="space-y-2">
                <Label htmlFor="displayName" className="text-sm">Display Name</Label>
                <Input
                  id="displayName"
                  defaultValue={user?.displayName || ""}
                  placeholder="Enter your display name"
                  readOnly
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm">Email</Label>
                <Input
                  id="email"
                  defaultValue={user?.email || ""}
                  placeholder="Enter your email"
                  type="email"
                  readOnly
                />
              </div>
              
              <Button className="w-full">
                Update Profile
              </Button>
            </div>
          </div>
        )}

        {/* Support & Info Section */}
        <div className="space-y-4 mb-8">
          <h2 className="text-lg font-semibold text-foreground">Support & Information</h2>
          <div className="bg-card rounded-lg p-4 border border-border space-y-3">
            <Button
              variant="ghost"
              className="w-full justify-start text-left p-3 h-auto"
              onClick={() => setLocation("/about")}
            >
              <Info className="w-5 h-5 mr-3 text-primary" />
              <div>
                <p className="font-medium">About Thoughtmarks</p>
                <p className="text-sm text-muted-foreground">Learn about our mission and features</p>
              </div>
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start text-left p-3 h-auto"
              onClick={() => setLocation("/faq")}
            >
              <HelpCircle className="w-5 h-5 mr-3 text-primary" />
              <div>
                <p className="font-medium">FAQ</p>
                <p className="text-sm text-muted-foreground">Frequently asked questions</p>
              </div>
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start text-left p-3 h-auto"
              onClick={() => setLocation("/privacy")}
            >
              <Shield className="w-5 h-5 mr-3 text-primary" />
              <div>
                <p className="font-medium">Privacy Policy</p>
                <p className="text-sm text-muted-foreground">How we protect your data</p>
              </div>
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start text-left p-3 h-auto"
              onClick={() => setLocation("/terms")}
            >
              <Shield className="w-5 h-5 mr-3 text-primary" />
              <div>
                <p className="font-medium">Terms of Service</p>
                <p className="text-sm text-muted-foreground">Usage terms and conditions</p>
              </div>
            </Button>
          </div>
        </div>

        {/* Account Actions - Show if authenticated */}
        {isAuthenticated && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Account</h2>
            <div className="bg-card rounded-lg p-4 border border-border">
              <Button
                variant="destructive"
                onClick={handleSignOut}
                className="w-full justify-start"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
}