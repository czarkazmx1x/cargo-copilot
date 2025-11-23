# ⚡ Kargo Kopilot: Quick Start

**Time to Hello World:** < 5 minutes

## 📋 Prerequisites
1.  **Node.js** v18+ installed.
2.  **Google AI Studio Key** (Gemini API).
3.  A code editor (VS Code recommended).

## 🚀 Setup Steps

### 1. Configuration
Create a `.env` file in the root (or set in your deployment platform):
```bash
API_KEY=AIzaSy...YourGeminiKey
```

### 2. Installation
No complex build steps for this version. The dependencies are imported via **Import Map** in `index.html` or standard package manager if you ejected.

*If using the provided file structure directly:*
Just run the development server provided by your environment (e.g., `npm start`, `vite`, or the specific AI Studio runner).

### 3. Running the App
1.  Open the application URL.
2.  Navigate to **Classify** to test single AI calls.
3.  Navigate to **Orders**, select checkboxes, and click **"Process Batch"**.

## 🛠️ Key Commands

| Action | How to trigger |
|--------|----------------|
| **Trigger Batch** | Select orders in `Orders.tsx` -> Click Sticky Header Button. |
| **View Progress** | Automatically redirects to `Batch.tsx`. |
| **Clear Data** | Refresh the browser (Data is in-memory). |

## 🚨 Top 3 Troubleshooting Issues

1.  **"Gemini Service Error"**
    *   *Check:* Is your API Key valid?
    *   *Check:* Are you passing a massive image? (Resize to < 4MB).

2.  **Progress Bar Stuck**
    *   *Check:* Did the mock `processBatch` loop hit an error? Check console logs.

3.  **Styles Missing**
    *   *Check:* Internet connection (Tailwind is loaded via CDN).

## 💡 Pro Tips
*   **Fast Data:** The `Orders.tsx` file has a `MOCK_ORDERS` constant. specific test cases there to test the batch processor.
*   **Performance:** The app uses `lucide-react` via CDN. If icons fail to load, check the version in `index.html`.
