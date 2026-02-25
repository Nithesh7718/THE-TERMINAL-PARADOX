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

  return false;
}

/**
 * Generate a SEB config XML (.seb) file.
 * 
 * Passwords are NOT embedded — they are checked in-app via Firestore
 * so the admin can change them anytime without redistributing config files.
 * SEB is simply locked (no quit allowed) — exit is controlled in-app.
 */
export function generateSEBConfig(appUrl: string): string {
  const base = appUrl.replace(/\/$/, "");
  const domain = base.replace(/^https?:\/\//, "");

  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN"
  "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>startURL</key>
  <string>${base}/login</string>

  <!-- Quit is fully blocked — exit is controlled in-app via Firestore -->
  <key>allowQuit</key>
  <false/>

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

export function downloadSEBConfig(appUrl: string): void {
  const xml = generateSEBConfig(appUrl);
  const blob = new Blob([xml], { type: "application/seb" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "terminal-paradox.seb";
  a.click();
  URL.revokeObjectURL(url);
}
