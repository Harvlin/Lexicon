import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Apply saved theme before React paints to avoid FOUC
(() => {
	try {
		const oldKey = 'lexicon:theme';
		const newKey = 'lexigrain:theme';
		let saved = localStorage.getItem(newKey);
		if (!saved) {
			// migrate from old key if present
			const legacy = localStorage.getItem(oldKey);
			if (legacy) {
				saved = legacy;
				try { localStorage.setItem(newKey, legacy); } catch {}
			}
		}
		const system = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
		const theme = (saved === 'dark' || saved === 'light') ? saved : system;
		if (theme === 'dark') document.documentElement.classList.add('dark');
	} catch { /* ignore */ }
})();

createRoot(document.getElementById("root")!).render(<App />);
