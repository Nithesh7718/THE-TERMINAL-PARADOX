/**
 * Safe Exam Browser (SEB) detection utilities.
 *
 * Detection methods (in order of reliability):
 *   1. SEB's own JS API:  window.SafeExamBrowser
 *   2. User-Agent string: "SEB", "SebCopy", "SebBrowser", "SafeExamBrowser"
 */

export function isInSEB(): boolean {
  // Method 1: SEB JS API (most reliable)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((window as any).SafeExamBrowser) return true;

  // Method 2: User-Agent (broad match for all SEB versions)
  const ua = navigator.userAgent;
  if (/SEB\/|SebCopy|SebBrowser|SafeExamBrowser/i.test(ua)) return true;

  // Method 3: SEB on iOS uses a WKWebView with specific markers
  if (/SEB/i.test(ua)) return true;

  // Method 4: URL fallback flag (from our SEB launch link)
  if (window.location.search.includes("seb=true")) return true;

  return false;
}

/**
 * SHA256 hash a string — SEB requires hashed passwords in the config.
 */
async function sha256(text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Generate a SEB config XML (.seb) file.
 * 
 * Includes the hashed quit password so SEB's built-in power button
 * prompts for it. Also includes Firestore-driven path in-app.
 */
export async function generateSEBConfig(
  appUrl: string,
  options?: { quitPassword?: string }
): Promise<string> {
  const base = appUrl.replace(/\/$/, "");
  const domain = base.replace(/^https?:\/\//, "");
  const quitPw = options?.quitPassword || "";
  const hashedQuit = quitPw ? await sha256(quitPw) : "";

  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN"
  "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>startURL</key>
  <string>${base}/login</string>

  <!-- Passwords (SHA256 hashed) -->
  ${hashedQuit ? `
  <key>hashedQuitPassword</key>
  <string>${hashedQuit}</string>
  <key>allowQuit</key>
  <true/>` : `
  <key>allowQuit</key>
  <false/>`}

  <!-- Restrict to exam domain + Firebase only -->
  <key>URLFilterEnable</key>
  <true/>
  <key>URLFilterEnableContentFilter</key>
  <false/>
  <key>URLFilterRules</key>
  <array>
    <dict>
      <key>active</key><true/>
      <key>regex</key><false/>
      <key>action</key><integer>1</integer>
      <key>expression</key>
      <string>${domain}</string>
    </dict>
    <dict>
      <key>active</key><true/>
      <key>regex</key><false/>
      <key>action</key><integer>1</integer>
      <key>expression</key>
      <string>firestore.googleapis.com</string>
    </dict>
    <dict>
      <key>active</key><true/>
      <key>regex</key><false/>
      <key>action</key><integer>1</integer>
      <key>expression</key>
      <string>firebase.googleapis.com</string>
    </dict>
    <dict>
      <key>active</key><true/>
      <key>regex</key><false/>
      <key>action</key><integer>1</integer>
      <key>expression</key>
      <string>googleapis.com</string>
    </dict>
  </array>

  <!-- Browser window settings -->
  <key>enableBrowserWindowToolbar</key><false/>
  <key>browserWindowAllowReload</key><true/>
  <key>showReloadButton</key><false/>
  <key>showBackForwardNavigationButtons</key><false/>
  <key>blockPopUpWindows</key><true/>
  <key>newBrowserWindowByLinkPolicy</key><integer>2</integer>

  <!-- Kiosk / lockdown settings -->
  <key>showTaskBar</key><false/>
  <key>enableTouchExit</key><false/>
  <key>quitURLConfirm</key><true/>

  <!-- Disable right-click -->
  <key>browserContextMenuURL</key><false/>

  <!-- Zoom -->
  <key>zoomMode</key><integer>0</integer>

  <key>sebMode</key><integer>0</integer>
</dict>
</plist>`;
}

export async function downloadSEBConfig(appUrl: string, options?: { quitPassword?: string }): Promise<void> {
  const xml = await generateSEBConfig(appUrl, options);
  const blob = new Blob([xml], { type: "application/seb" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "terminal-paradox.seb";
  a.click();
  URL.revokeObjectURL(url);
}
