/**
 * Safe Exam Browser (SEB) detection utilities.
 * SEB injects its name into the User-Agent string.
 *   - Windows / macOS: "SebCopy/<version>"
 *   - iOS:             "SebBrowser/<version>"
 */

export function isInSEB(): boolean {
    return /SebCopy|SebBrowser|SafeExamBrowser/i.test(navigator.userAgent);
}

/**
 * Generate a SEB config XML (.seb) file for the given app URL.
 * Admins download this and distribute it to participants.
 */
export function generateSEBConfig(appUrl: string): string {
    const base = appUrl.replace(/\/$/, "");
    // strip protocol for allowedURLs pattern
    const domain = base.replace(/^https?:\/\//, "");
    return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN"
  "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>startURL</key>
  <string>${base}/login</string>

  <!-- Restrict to exam domain only -->
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
  <key>allowQuit</key><false/>
  <key>quitURLConfirm</key><true/>

  <!-- Disable right-click and keyboard shortcuts -->
  <key>browserContextMenuURL</key><false/>

  <!-- Zoom -->
  <key>zoomMode</key><integer>0</integer>

  <!-- SEB version requirements -->
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
