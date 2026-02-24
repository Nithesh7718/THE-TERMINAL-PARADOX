import { useNavigate } from "react-router";
import { Button } from "@/react-app/components/ui/button";
import { Terminal, ArrowLeft } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 text-center px-6">
        <div className="inline-flex items-center justify-center w-24 h-24 mb-8 rounded-2xl bg-gradient-to-br from-destructive/20 to-destructive/5 border border-destructive/30">
          <Terminal className="w-12 h-12 text-destructive" />
        </div>

        <h1 className="text-8xl font-black mb-4 bg-gradient-to-r from-destructive to-chart-4 bg-clip-text text-transparent">
          404
        </h1>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Terminal Not Found
        </h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          The path you're looking for doesn't exist in this paradox. Head back
          to the challenge hub.
        </p>

        <Button
          size="lg"
          onClick={() => navigate("/")}
          className="bg-gradient-to-r from-primary to-chart-1 hover:opacity-90 text-primary-foreground gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </Button>
      </div>
    </div>
  );
}
