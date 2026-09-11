# JARVIS Desktop — Phase 1: Foundation & Neural Interface

JARVIS is a Windows-first desktop AI assistant built on Electron, TypeScript, React, and Vite, featuring a high-performance sci-fi neural interface and a production-grade auto-update pipeline powered by `electron-updater` and GitHub Releases.

---

## 1. How to Install Dependencies

```bash
npm install
```

---

## 2. How to Run Development Build

To run the local Vite development server with the interactive neural interface:

```bash
npm run dev
```

To launch the full Electron desktop shell in development:

```bash
npm run electron:dev
```

---

## 3. How to Create Windows Production Build Locally

To build both the Vite web distribution and the Electron main/preload bundles, and package the Windows NSIS installer `.exe`:

```bash
npm run dist
```

Output directory:
- `release/JARVIS-Setup-1.0.0.exe` (Standalone Windows NSIS Installer)
- `release/latest.yml` (Auto-update metadata)

---

## 4. How to Run Release Workflow (GitHub Actions CI/CD)

The repository includes an automated Windows CI/CD workflow defined in `.github/workflows/release.yml`.

### Automated Flow:
1. Ensure the `version` field in `package.json` is bumped (e.g. `1.0.0` -> `1.0.1`).
2. Commit and push to the `main` branch:
   ```bash
   git add .
   git commit -m "chore: release v1.0.1"
   git push origin main
   ```
3. GitHub Actions executes:
   - Sets up Node 20 on a `windows-latest` runner.
   - Installs dependencies with `npm ci`.
   - Validates that `v1.0.1` has not been published already.
   - Runs `npm run release` (`npm run build && electron-builder --win --publish always`).
   - Generates the GitHub Release `v1.0.1`, attaching the Windows `.exe` and `latest.yml`.

---

## 5. How Versioning Works

JARVIS strictly enforces **Semantic Versioning (SemVer)**: `MAJOR.MINOR.PATCH` (e.g., `1.0.0` -> `1.0.1`).

- The single source of truth for the application version is `package.json`.
- The `VersionService` in `src/services/version.service.ts` and `ConfigService` in `electron/main/config.ts` derive the version directly from package metadata.
- Duplicate versions are blocked by GitHub Actions prior to build execution.

---

## 6. How GitHub Releases Work

- `electron-builder` automatically publishes build artifacts to GitHub Releases using `--publish always`.
- Artifacts published per release:
  1. `JARVIS-Setup-<version>.exe`
  2. `latest.yml` (containing SHA-512 checksums and release dates)
  3. `JARVIS-Setup-<version>.exe.blockmap` (for fast differential updates)

---

## 7. How the Auto-Updater Works

The updater subsystem (`electron/main/services/updater/updater.service.ts`) uses `electron-updater`:
- **Auto-check on Startup**: When running the packaged app, JARVIS checks the GitHub release feed after 3.5 seconds without blocking user interactions.
- **Controlled Download**: Downloads are never forced silently. The UI prompts the user with "Download Update".
- **Real Progress Streaming**: Download progress events emit actual transferred bytes, total size, and percentage directly over IPC (`jarvis:updater-status-changed`).
- **Safe Installation**: Once downloaded (`100%`), the user can click "Restart & Update" to perform a clean restart via NSIS.

---

## 8. How to Test an Update Locally

### Method A: In-App Update Simulation (Development / Preview)
1. Open the application and click the version pill or the Update Center button in Settings.
2. In the Update Center HUD, click **Trigger Available** to verify the notification banner and release prompt.
3. Click **Download Update** to observe real-time progress bar incrementation, byte calculations, and the final "Restart & Update" state.

### Method B: Real Release Verification (Production Flow)
1. Package Build A at version `1.0.0` using `npm run dist`.
2. Install and launch JARVIS `1.0.0`.
3. Bump `package.json` version to `1.0.1`.
4. Run GitHub Actions workflow or run `npm run release` with `GH_TOKEN` configured.
5. Launch the installed `1.0.0` app. It detects `v1.0.1`, prompts for download, streams progress, and updates upon confirmation.

---

## 9. Important GitHub Repository Settings

1. **Repository Permissions**:
   - Go to **Settings** > **Actions** > **General** > **Workflow permissions**.
   - Select **Read and write permissions** (allows `GITHUB_TOKEN` to publish releases).
2. **Configure `electron-builder.yml`**:
   - Update `owner` and `repo` fields to match your GitHub organization / repository name:
     ```yaml
     publish:
       provider: github
       owner: YOUR_GITHUB_USERNAME
       repo: YOUR_JARVIS_REPOSITORY
     ```

---

## 10. Required Secrets & Configuration

- In GitHub Actions, `${{ secrets.GITHUB_TOKEN }}` is automatically provided by GitHub. No personal access token (PAT) needs to be manually stored or hardcoded into the source tree.
