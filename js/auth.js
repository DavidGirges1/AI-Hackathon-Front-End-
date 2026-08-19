/**
 * ============================================================================
 * AuraMed AI - Authentication Service & UI Controller (Live Supabase Auth)
 * ============================================================================
 */

// ============================================================================
// 1. Core Authentication Services
// ============================================================================

const AuthService = {
  /**
   * Authenticates user with email and password via Supabase Auth.
   * @param {string} email - Patient email
   * @param {string} password - Patient password
   * @returns {Promise<{success: boolean, user?: object, error?: string}>}
   */
  async loginUser(email, password) {
    if (!email || !password) {
      return { success: false, error: "Please provide both email and password." };
    }

    if (supabaseClient) {
      try {
        const cleanEmail = email.includes('@') ? email.trim() : `${email.trim()}@auramed.ai`;
        const { data, error } = await supabaseClient.auth.signInWithPassword({
          email: cleanEmail,
          password: password
        });

        if (error) {
          console.error("Supabase sign-in error:", error);
          return { success: false, error: error.message || "Invalid credentials. Please check your email and password." };
        }

        if (data && data.user) {
          const userObj = {
            id: data.user.id,
            email: data.user.email,
            fullName: data.user.user_metadata?.full_name || "Patient",
            authenticatedAt: new Date().toISOString()
          };
          LocalStorageDB.set('auth_user', userObj);

          // Pre-fetch patient profile from Supabase
          try {
            const { data: profileData } = await supabaseClient
              .from('patients')
              .select('*')
              .eq('id', data.user.id)
              .maybeSingle();

            if (profileData) {
              LocalStorageDB.set('patient_profile', {
                fullName: profileData.full_name,
                dateOfBirth: profileData.date_of_birth || "",
                gender: profileData.gender || "unspecified",
                bloodType: profileData.blood_type || "Unknown",
                height: profileData.height_cm ? String(profileData.height_cm) : "",
                weight: profileData.weight_kg ? String(profileData.weight_kg) : "",
                chronicConditions: profileData.chronic_conditions || [],
                allergies: profileData.allergies || [],
                medicalHistory: profileData.medical_history || ""
              });
            }
          } catch (profileErr) {
            console.warn("Could not preload profile on login:", profileErr);
          }

          return { success: true, user: userObj };
        }
      } catch (err) {
        console.error("Login exception:", err);
        return { success: false, error: err.message || "A network error occurred." };
      }
    }

    return { success: false, error: "Supabase connection is not available." };
  },

  /**
   * Registers a new patient account in Supabase Auth & signs them in immediately.
   * @param {object} param0 - Registration parameters { fullName, email, password }
   * @returns {Promise<{success: boolean, user?: object, error?: string}>}
   */
  async registerUser({ fullName, email, password }) {
    if (!fullName || !email || !password) {
      return { success: false, error: "All fields are required to create a patient account." };
    }

    if (password.length < 8) {
      return { success: false, error: "Password must be at least 8 characters long for clinical safety." };
    }

    if (supabaseClient) {
      try {
        const cleanEmail = email.includes('@') ? email.trim() : `${email.trim()}@auramed.ai`;
        
        // 1. Sign Up User
        const { data, error } = await supabaseClient.auth.signUp({
          email: cleanEmail,
          password: password,
          options: {
            data: {
              full_name: fullName.trim()
            }
          }
        });

        if (error) {
          console.error("Supabase registration error:", error);
          return { success: false, error: error.message || "Failed to create account." };
        }

        let activeUser = data?.user;

        // 2. Ensure active session by logging in immediately if no session was returned
        if (!data?.session) {
          const { data: loginData } = await supabaseClient.auth.signInWithPassword({
            email: cleanEmail,
            password: password
          });
          if (loginData?.user) {
            activeUser = loginData.user;
          }
        }

        if (activeUser) {
          const userObj = {
            id: activeUser.id,
            email: activeUser.email,
            fullName: fullName.trim(),
            registeredAt: new Date().toISOString()
          };
          LocalStorageDB.set('auth_user', userObj);

          // 3. Create baseline patient record
          try {
            await supabaseClient.from('patients').upsert({
              id: activeUser.id,
              full_name: fullName.trim(),
              chronic_conditions: [],
              allergies: [],
              updated_at: new Date().toISOString()
            });
          } catch (dbErr) {
            console.warn("Notice: Baseline profile will be updated on intake step.", dbErr);
          }

          LocalStorageDB.set('patient_profile', {
            fullName: fullName.trim(),
            dateOfBirth: "",
            gender: "unspecified",
            bloodType: "Unknown",
            height: "",
            weight: "",
            chronicConditions: [],
            allergies: [],
            medicalHistory: ""
          });

          return { success: true, user: userObj };
        }
      } catch (err) {
        console.error("Registration exception:", err);
        return { success: false, error: err.message || "A network error occurred." };
      }
    }

    return { success: false, error: "Supabase connection is not available." };
  },

  /**
   * Logs out the current patient and clears session.
   */
  async logoutUser() {
    if (supabaseClient) {
      try {
        await supabaseClient.auth.signOut();
      } catch (e) {
        console.warn("Sign out error:", e);
      }
    }
    LocalStorageDB.remove('auth_user');
    LocalStorageDB.remove('patient_profile');
    LocalStorageDB.remove('patient_medicines');
    LocalStorageDB.remove('assistant_messages');
    window.location.href = "login.html";
  },

  /**
   * Returns current active user if signed in.
   */
  async getCurrentUser() {
    if (supabaseClient) {
      try {
        const { data: { user } } = await supabaseClient.auth.getUser();
        if (user) {
          return {
            id: user.id,
            email: user.email,
            fullName: user.user_metadata?.full_name || LocalStorageDB.get('auth_user')?.fullName || "Patient"
          };
        }
      } catch (e) {
        console.warn("Error getting current user:", e);
      }
    }
    return LocalStorageDB.get('auth_user', null);
  },

  /**
   * Route guard checking if patient is logged in.
   */
  async requireAuth() {
    const user = await this.getCurrentUser();
    if (!user) {
      window.location.href = "login.html";
      return null;
    }
    return user;
  }
};

// ============================================================================
// 2. UI Helpers & Event Listeners
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) {
    window.lucide.createIcons();
  }

  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    initLoginForm(loginForm);
  }

  const signupForm = document.getElementById('signupForm');
  if (signupForm) {
    initSignupForm(signupForm);
  }

  initPasswordToggles();
});

/**
 * Initializes Password Show/Hide Toggle Buttons
 */
function initPasswordToggles() {
  document.querySelectorAll('[data-toggle-password]').forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = button.getAttribute('data-toggle-password');
      const input = document.getElementById(targetId);
      if (!input) return;

      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';

      const icon = button.querySelector('[data-lucide]');
      if (icon) {
        icon.setAttribute('data-lucide', isPassword ? 'eye-off' : 'eye');
        if (window.lucide) window.lucide.createIcons();
      }
      button.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
      button.setAttribute('aria-pressed', isPassword ? 'true' : 'false');
    });
  });
}

/**
 * Login Form Controller
 */
function initLoginForm(form) {
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const errorAlert = document.getElementById('errorAlert');
  const errorMessage = document.getElementById('errorMessage');
  const submitBtn = document.getElementById('submitBtn');
  const submitSpinner = document.getElementById('submitSpinner');
  const submitText = document.getElementById('submitText');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideError();

    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    let hasError = false;

    if (!username) {
      setInputError(usernameInput, true);
      hasError = true;
    } else {
      setInputError(usernameInput, false);
    }

    if (!password) {
      setInputError(passwordInput, true);
      hasError = true;
    } else {
      setInputError(passwordInput, false);
    }

    if (hasError) {
      showError("Please fill in both required fields.");
      return;
    }

    setButtonLoading(true);

    try {
      const result = await AuthService.loginUser(username, password);
      if (result.success) {
        const profile = LocalStorageDB.get('patient_profile');
        if (profile && profile.fullName && profile.chronicConditions && profile.chronicConditions.length > 0) {
          window.location.href = "assistant.html";
        } else {
          window.location.href = "patient-form.html";
        }
      } else {
        showError(result.error || "Login failed. Please verify your credentials.");
      }
    } catch (err) {
      showError("A connection error occurred. Please try again.");
    } finally {
      setButtonLoading(false);
    }
  });

  function showError(msg) {
    if (errorAlert && errorMessage) {
      errorMessage.textContent = msg;
      errorAlert.classList.remove('hidden');
    }
  }

  function hideError() {
    if (errorAlert) errorAlert.classList.add('hidden');
  }

  function setButtonLoading(loading) {
    if (!submitBtn) return;
    submitBtn.disabled = loading;
    if (submitSpinner) submitSpinner.classList.toggle('hidden', !loading);
    if (submitText) submitText.textContent = loading ? "Authenticating with Supabase..." : "Sign In";
  }
}

/**
 * Sign Up Form Controller & Password Strength Meter
 */
function initSignupForm(form) {
  const nameInput = document.getElementById('fullName');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const termsCheckbox = document.getElementById('termsCheckbox');
  const errorAlert = document.getElementById('errorAlert');
  const errorMessage = document.getElementById('errorMessage');
  const submitBtn = document.getElementById('submitBtn');
  const submitSpinner = document.getElementById('submitSpinner');
  const submitText = document.getElementById('submitText');

  const strengthMeter = document.getElementById('passwordStrengthBar');
  const strengthText = document.getElementById('passwordStrengthText');
  const reqLength = document.getElementById('req-length');
  const reqUpper = document.getElementById('req-upper');
  const reqNumber = document.getElementById('req-number');
  const reqSpecial = document.getElementById('req-special');

  if (passwordInput && strengthMeter) {
    passwordInput.addEventListener('input', () => {
      evaluatePasswordStrength(passwordInput.value);
    });
  }

  function evaluatePasswordStrength(val) {
    let score = 0;
    const hasLen = val.length >= 8;
    const hasUpper = /[A-Z]/.test(val);
    const hasNum = /[0-9]/.test(val);
    const hasSpecial = /[^A-Za-z0-9]/.test(val);

    updateReqBadge(reqLength, hasLen);
    updateReqBadge(reqUpper, hasUpper);
    updateReqBadge(reqNumber, hasNum);
    updateReqBadge(reqSpecial, hasSpecial);

    if (hasLen) score += 25;
    if (hasUpper) score += 25;
    if (hasNum) score += 25;
    if (hasSpecial) score += 25;

    strengthMeter.style.width = `${score}%`;

    if (score <= 25) {
      strengthMeter.className = "h-full bg-rose-500 transition-all duration-300 rounded-full";
      if (strengthText) strengthText.textContent = "Weak";
      if (strengthText) strengthText.className = "text-xs font-semibold text-rose-600";
    } else if (score <= 50) {
      strengthMeter.className = "h-full bg-amber-500 transition-all duration-300 rounded-full";
      if (strengthText) strengthText.textContent = "Fair";
      if (strengthText) strengthText.className = "text-xs font-semibold text-amber-600";
    } else if (score <= 75) {
      strengthMeter.className = "h-full bg-sky-500 transition-all duration-300 rounded-full";
      if (strengthText) strengthText.textContent = "Good";
      if (strengthText) strengthText.className = "text-xs font-semibold text-sky-600";
    } else {
      strengthMeter.className = "h-full bg-teal-600 transition-all duration-300 rounded-full";
      if (strengthText) strengthText.textContent = "Clinical-Grade Strong";
      if (strengthText) strengthText.className = "text-xs font-semibold text-teal-700";
    }
  }

  function updateReqBadge(element, met) {
    if (!element) return;
    if (met) {
      element.classList.add('text-teal-700', 'font-medium');
      element.classList.remove('text-slate-400');
    } else {
      element.classList.remove('text-teal-700', 'font-medium');
      element.classList.add('text-slate-400');
    }
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideError();

    const fullName = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    let hasError = false;

    if (!fullName) {
      setInputError(nameInput, true);
      hasError = true;
    } else {
      setInputError(nameInput, false);
    }

    if (!email || !email.includes('@')) {
      setInputError(emailInput, true);
      hasError = true;
    } else {
      setInputError(emailInput, false);
    }

    if (!password || password.length < 8) {
      setInputError(passwordInput, true);
      hasError = true;
    } else {
      setInputError(passwordInput, false);
    }

    if (termsCheckbox && !termsCheckbox.checked) {
      showError("Please accept the Health Data Privacy Terms to proceed.");
      return;
    }

    if (hasError) {
      showError("Please complete all required fields with a valid email and 8+ char password.");
      return;
    }

    setButtonLoading(true);

    try {
      const result = await AuthService.registerUser({ fullName, email, password });
      if (result.success) {
        if (submitText) submitText.textContent = "Account Created! Opening Intake Form...";
        setTimeout(() => {
          window.location.href = "patient-form.html";
        }, 600);
      } else {
        showError(result.error || "Failed to create account.");
        setButtonLoading(false);
      }
    } catch (err) {
      showError("An unexpected error occurred. Please try again.");
      setButtonLoading(false);
    }
  });

  function showError(msg) {
    if (errorAlert && errorMessage) {
      errorMessage.textContent = msg;
      errorAlert.classList.remove('hidden');
    }
  }

  function hideError() {
    if (errorAlert) errorAlert.classList.add('hidden');
  }

  function setButtonLoading(loading) {
    if (!submitBtn) return;
    submitBtn.disabled = loading;
    if (submitSpinner) submitSpinner.classList.toggle('hidden', !loading);
    if (submitText) submitText.textContent = loading ? "Creating Supabase Account..." : "Create Account";
  }
}

/**
 * Visual input error styling
 */
function setInputError(input, isError) {
  if (!input) return;
  if (isError) {
    input.classList.add('border-rose-300', 'bg-rose-50/30', 'focus:ring-rose-500/20');
    input.classList.remove('border-slate-200', 'focus:ring-teal-500/20');
  } else {
    input.classList.remove('border-rose-300', 'bg-rose-50/30', 'focus:ring-rose-500/20');
    input.classList.add('border-slate-200', 'focus:ring-teal-500/20');
  }
}
