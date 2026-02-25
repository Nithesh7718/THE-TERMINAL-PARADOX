import { ShieldAlert, Monitor, Download, ExternalLink } from "lucide-react";

const SEB_DOWNLOAD_URL = "https://safeexambrowser.org/download_en.html";

export default function SEBRequired() {
    // Convert current URL to SEB protocol and add a flag for fallback detection
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set("seb", "true");
    const sebUrl = currentUrl.toString().replace(/^https?:\/\//, "sebs://");

    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4">
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -left-32 w-96 h-96 bg-red-500/8 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-orange-500/8 rounded-full blur-3xl" />
            </div>

            <div className="relative max-w-md w-full text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-2xl bg-red-500/10 border border-red-500/20">
                    <ShieldAlert className="w-10 h-10 text-red-400" />
                </div>

                <h1 className="text-3xl font-black text-foreground mb-3">
                    Safe Exam Browser Required
                </h1>
                <p className="text-muted-foreground mb-8 leading-relaxed">
                    This exam must be taken using <strong className="text-foreground">Safe Exam Browser (SEB)</strong>.
                    Regular browsers are not permitted to ensure exam integrity.
                </p>

                {/* Auto-launch SEB button */}
                <a
                    href={sebUrl}
                    className="flex items-center justify-center gap-2 w-full px-5 py-3.5 rounded-xl bg-gradient-to-r from-primary to-chart-1 text-primary-foreground font-bold text-sm hover:opacity-90 transition-all shadow-[0_0_20px_rgba(45,212,191,0.25)] mb-4"
                >
                    <ExternalLink className="w-4 h-4" />
                    Launch in Safe Exam Browser
                </a>
                <p className="text-xs text-muted-foreground/50 mb-8">
                    SEB must already be installed. Clicking above will open it automatically.
                </p>

                <div className="bg-card border border-border rounded-2xl p-6 mb-6 text-left space-y-4">
                    <h2 className="text-sm font-semibold text-foreground">Don't have SEB installed?</h2>
                    <ol className="space-y-3">
                        {[
                            { step: "1", text: "Download & install Safe Exam Browser" },
                            { step: "2", text: "Come back to this page and click \"Launch in Safe Exam Browser\"" },
                        ].map(({ step, text }) => (
                            <li key={step} className="flex items-start gap-3">
                                <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                                    {step}
                                </span>
                                <p className="text-sm text-muted-foreground">{text}</p>
                            </li>
                        ))}
                    </ol>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <a
                        href={SEB_DOWNLOAD_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary/10 border border-primary/20 text-primary text-sm font-semibold hover:bg-primary/20 transition-all"
                    >
                        <Download className="w-4 h-4" />
                        Download SEB
                    </a>
                    <div className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-card border border-border text-muted-foreground text-sm">
                        <Monitor className="w-4 h-4" />
                        Windows / macOS / iOS
                    </div>
                </div>

                <p className="mt-6 text-xs text-muted-foreground/50">
                    If you believe this is an error, contact your exam administrator.
                </p>
            </div>
        </div>
    );
}
