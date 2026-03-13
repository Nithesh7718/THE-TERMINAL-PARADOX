import { useEffect } from "react";
import { getUserSession } from "@/react-app/pages/Login";
import { trackTabSwitch } from "@/react-app/lib/userService";
import { subscribeToGameState } from "@/react-app/lib/gameState";
import { toast } from "sonner";

export default function CheatingDetector() {
    useEffect(() => {
        const session = getUserSession();
        if (!session || session.role !== "participant") return;

        let isGameStarted = false;

        // Only track if game is actually started
        const unsub = subscribeToGameState((state) => {
            isGameStarted = state.started;
        });

        const handleVisibilityChange = () => {
            if (document.visibilityState === "hidden" && isGameStarted) {
                // User left the tab
                trackTabSwitch(session.email);
                console.warn("[SECURITY] Tab switch detected and recorded.");
                toast.warning("Security Warning: Tab switching is recorded and may lead to disqualification.", {
                    duration: 5000,
                    position: "top-center"
                });
            }
        };

        const handleBlur = () => {
             if (isGameStarted) {
                // User clicked outside window
                trackTabSwitch(session.email);
                console.warn("[SECURITY] Window focus lost detected.");
             }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        window.addEventListener("blur", handleBlur);

        return () => {
            unsub();
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            window.removeEventListener("blur", handleBlur);
        };
    }, []);

    return null; // Invisible component
}
