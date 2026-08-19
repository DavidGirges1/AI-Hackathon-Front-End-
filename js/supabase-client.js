/**
 * ============================================================================
 * AuraMed AI - Supabase Client & Backend Integration Configuration
 * ============================================================================
 */

const SUPABASE_CONFIG = {
  // Live Supabase project credentials for "AI Hackathon"
  SUPABASE_URL: "https://fwqpqxbhrthxkddvztht.supabase.co",
  SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ3cXBxeGJocnRoeGtkZHZ6dGh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxMzI2NzAsImV4cCI6MjEwMjcwODY3MH0.tjWtnOlh-vsJwITDYgSC3fL1AuhEG-CMhWNsFIBbEJw",
  USE_MOCK_STORAGE: false // Live Supabase Database Enabled
};

// Global Supabase Client Instance
let supabaseClient = null;

function initSupabase() {
  if (window.supabase && SUPABASE_CONFIG.SUPABASE_URL && SUPABASE_CONFIG.SUPABASE_ANON_KEY) {
    try {
      supabaseClient = window.supabase.createClient(
        SUPABASE_CONFIG.SUPABASE_URL,
        SUPABASE_CONFIG.SUPABASE_ANON_KEY,
        {
          auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true
          }
        }
      );
      console.log("⚕️ AuraMed AI: Connected to live Supabase Backend successfully!");
      return supabaseClient;
    } catch (e) {
      console.error("Error initializing Supabase client:", e);
      return null;
    }
  } else {
    console.warn("⚕️ AuraMed AI: Supabase JS CDN not loaded or credentials missing.");
    return null;
  }
}

// Local Storage Fallback Cache Utility (for offline / instant UI render)
const LocalStorageDB = {
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(`auramed_${key}`);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.error(`Error reading ${key} from storage:`, e);
      return defaultValue;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(`auramed_${key}`, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error(`Error writing ${key} to storage:`, e);
      return false;
    }
  },
  remove(key) {
    try {
      localStorage.removeItem(`auramed_${key}`);
    } catch (e) {
      console.error(`Error removing ${key} from storage:`, e);
    }
  },
  clearAll() {
    Object.keys(localStorage)
      .filter(k => k.startsWith('auramed_'))
      .forEach(k => localStorage.removeItem(k));
  }
};

// Initialize immediately on script load
initSupabase();
