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

// Optional: Redirect to backend /home if enabled via env (useful for dev)
(() => {
	try {
		const shouldRedirect = import.meta.env.VITE_REDIRECT_TO_BACKEND_HOME === 'true';
		if (!shouldRedirect) return;
		const backendOrigin = import.meta.env.VITE_BACKEND_ORIGIN || 'http://localhost:8080';
		const atRoot = location.pathname === '/' || location.pathname === '/index.html';
		if (atRoot) {
			location.replace(`${backendOrigin.replace(/\/$/, '')}/home`);
		}
	} catch {}
})();

createRoot(document.getElementById("root")!).render(<App />);
