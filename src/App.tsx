import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ErrorBoundary } from "@/components/error-boundary";
import { ThemeProvider } from "@/components/theme-provider";
import { useAuth } from "@/hooks/use-auth";

// Pages
import Dashboard from "@/pages/dashboard";
import BinDetail from "@/pages/bin-detail";
import BinDetailByName from "@/pages/bin-detail-by-name";
import AllBins from "@/pages/all-bins";
import CreateThoughtmark from "@/pages/create-thoughtmark";
import CreateBin from "@/pages/create-bin";
import ThoughtmarkDetail from "@/pages/thoughtmark-detail";
import SearchResults from "@/pages/search-results";
import Auth from "@/pages/auth";
import RecentlyDeleted from "@/pages/recently-deleted";
import Settings from "@/pages/settings";
import AllThoughtmarks from "@/pages/all-thoughtmarks";
import About from "@/pages/about";
import FAQ from "@/pages/faq";
import AIAssistant from "@/pages/ai-assistant";
import Subscribe from "@/pages/subscribe";
import Collaborate from "@/pages/collaborate";
import Privacy from "@/pages/privacy";
import Terms from "@/pages/terms";
import NotFound from "@/pages/not-found";

function AppRoutes() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/all-bins" component={AllBins} />
      <Route path="/bin/:name" component={BinDetailByName} />
      <Route path="/bins/:id" component={BinDetail} />
      <Route path="/create" component={CreateThoughtmark} />
      <Route path="/create-bin" component={CreateBin} />
      <Route path="/thoughtmark/:id" component={ThoughtmarkDetail} />
      <Route path="/search" component={SearchResults} />
      <Route path="/trash" component={RecentlyDeleted} />
      <Route path="/settings" component={Settings} />
      <Route path="/all" component={AllThoughtmarks} />
      <Route path="/about" component={About} />
      <Route path="/faq" component={FAQ} />
      <Route path="/ai-assistant" component={AIAssistant} />
      <Route path="/subscribe" component={Subscribe} />
      <Route path="/collaborate" component={Collaborate} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/terms" component={Terms} />
      <Route path="/auth" component={Auth} />
      <Route component={NotFound} />
    </Switch>
  );
}

function Router() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#C6D600] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Optional authentication - allow guest access to most features
  return <AppRoutes />;
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark" storageKey="thoughtmarks-ui-theme">
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
