import '@fontsource/inter/latin-400.css';
import '@fontsource/inter/latin-500.css';
import '@fontsource/inter/latin-600.css';
import '@fontsource/inter/latin-700.css';
import './styles/app.css';
import 'virtual:kid-app';
import { registerSW } from 'virtual:pwa-register';

// Service worker: caches the app shell so the scanner opens with no signal.
if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  registerSW({ immediate: true });
}
