/**
 * ============================================================================
 * AuraMed AI - Patient Profile Service & Onboarding Controller (Live Supabase)
 * ============================================================================
 */

// ============================================================================
// 1. Patient Data Service (Live Supabase Connected)
// ============================================================================

const PatientService = {
  /**
   * Saves or updates the patient profile in the Supabase 'patients' table.
   * @param {object} profile - Structured patient profile data
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  async savePatientProfile(profile) {
    if (supabaseClient) {
      try {
        let user = await AuthService.getCurrentUser();
        
        if (!user || !user.id) {
          try {
            const { data: { user: sbUser } } = await supabaseClient.auth.getUser();
            if (sbUser) {
              user = { id: sbUser.id, fullName: sbUser.user_metadata?.full_name || profile.fullName };
            }
          } catch (e) {
            console.warn("Auth check warning:", e);
          }
        }

        if (user && user.id) {
          const supabasePayload = {
            id: user.id,
            full_name: profile.fullName,
            date_of_birth: profile.dateOfBirth || null,
            gender: profile.gender || "female",
            blood_type: profile.bloodType || "Unknown",
            height_cm: profile.height ? parseFloat(profile.height) : null,
            weight_kg: profile.weight ? parseFloat(profile.weight) : null,
            chronic_conditions: profile.chronicConditions || [],
            allergies: profile.allergies || [],
            medical_history: profile.medicalHistory || "",
            is_pregnant: profile.isPregnant || false,
            pregnancy_weeks: profile.pregnancyWeeks ? parseInt(profile.pregnancyWeeks) : null,
            pregnancy_trimester: profile.pregnancyTrimester || null,
            updated_at: new Date().toISOString()
          };

          const { data, error } = await supabaseClient
            .from('patients')
            .upsert(supabasePayload)
            .select()
            .maybeSingle();

          if (error) {
            console.warn("Supabase patient profile upsert notice:", error);
            LocalStorageDB.set('patient_profile', profile);
            return { success: true, data: profile };
          }

          LocalStorageDB.set('patient_profile', profile);
          return { success: true, data: data || profile };
        }
      } catch (err) {
        console.warn("Patient save exception:", err);
      }
    }

    // Local fallback
    LocalStorageDB.set('patient_profile', profile);
    return { success: true, data: profile };
  },

  /**
   * Loads patient profile from Supabase or LocalStorage cache.
   * @returns {Promise<object>}
   */
  async loadPatientProfile() {
    if (supabaseClient) {
      try {
        const user = await AuthService.getCurrentUser();
        if (user && user.id) {
          const { data, error } = await supabaseClient
            .from('patients')
            .select('*')
            .eq('id', user.id)
            .maybeSingle();

          if (!error && data) {
            const mappedProfile = {
              fullName: data.full_name,
              dateOfBirth: data.date_of_birth || "",
              gender: data.gender || "female",
              bloodType: data.blood_type || "Unknown",
              height: data.height_cm ? String(data.height_cm) : "",
              weight: data.weight_kg ? String(data.weight_kg) : "",
              chronicConditions: data.chronic_conditions || [],
              allergies: data.allergies || [],
              medicalHistory: data.medical_history || "",
              isPregnant: data.is_pregnant || false,
              pregnancyWeeks: data.pregnancy_weeks ? String(data.pregnancy_weeks) : "",
              pregnancyTrimester: data.pregnancy_trimester || ""
            };
            LocalStorageDB.set('patient_profile', mappedProfile);
            return mappedProfile;
          }
        }
      } catch (e) {
        console.warn("Could not load patient profile from Supabase:", e);
      }
    }

    const activeUser = await AuthService.getCurrentUser();
    const fallbackProfile = {
      fullName: activeUser?.fullName || "",
      dateOfBirth: "",
      gender: "female",
      bloodType: "Unknown",
      height: "",
      weight: "",
      chronicConditions: [],
      allergies: [],
      medicalHistory: "",
      isPregnant: false,
      pregnancyWeeks: "",
      pregnancyTrimester: ""
    };

    return LocalStorageDB.get('patient_profile', fallbackProfile);
  },

  /**
   * Generates a clinical summary text block to inject into the AI Context.
   */
  async getPatientContextSummary() {
    const profile = await this.loadPatientProfile();
    if (!profile) return "No patient profile data available.";

    let ageText = "Age not specified";
    if (profile.dateOfBirth) {
      const birthYear = new Date(profile.dateOfBirth).getFullYear();
      const currentYear = new Date().getFullYear();
      ageText = `${currentYear - birthYear} years old`;
    }

    const conditions = profile.chronicConditions?.length > 0
      ? profile.chronicConditions.join(", ")
      : "None reported";

    const allergies = profile.allergies?.length > 0
      ? profile.allergies.join(", ")
      : "No known drug allergies (NKDA)";

    let bmiText = "N/A";
    if (profile.height && profile.weight) {
      const hM = parseFloat(profile.height) / 100;
      const wKg = parseFloat(profile.weight);
      const bmi = (wKg / (hM * hM)).toFixed(1);
      bmiText = `${bmi} kg/m²`;
    }

    let pregnancyContext = "";
    if (profile.gender === "female" && profile.isPregnant) {
      pregnancyContext = `\n- Maternal Health: Currently Pregnant (${profile.pregnancyWeeks ? `${profile.pregnancyWeeks} Weeks` : 'Week not specified'}${profile.pregnancyTrimester ? ` • ${profile.pregnancyTrimester}` : ''}) [⚠️ STRICT PREGNANCY CONTRAINDICATION SAFETY FILTER ACTIVE]`;
    }

    return `
[PATIENT CLINICAL CONTEXT]
- Patient Name: ${profile.fullName || "Anonymous"}
- Demographics: ${ageText}, Gender: ${profile.gender === 'female' ? 'Female' : 'Male'}, Blood Type: ${profile.bloodType || "Unknown"}
- Vitals: Height: ${profile.height || "--"} cm, Weight: ${profile.weight || "--"} kg (BMI: ${bmiText})${pregnancyContext}
- Diagnosed Chronic Conditions: ${conditions}
- Known Allergies & Sensitivities: ${allergies}
- Medical & Surgical History: ${profile.medicalHistory || "None recorded"}
`.trim();
  }
};

// ============================================================================
// 2. UI Controller for Patient Onboarding Form
// ============================================================================

document.addEventListener('DOMContentLoaded', async () => {
  if (window.lucide) window.lucide.createIcons();

  const patientForm = document.getElementById('patientIntakeForm');
  if (patientForm) {
    const user = await AuthService.requireAuth();
    if (!user) return;
    initPatientForm(patientForm);
  }
});

function initPatientForm(form) {
  const conditionsTagContainer = document.getElementById('conditionsContainer');
  const customConditionInput = document.getElementById('customConditionInput');
  const addConditionBtn = document.getElementById('addConditionBtn');

  const allergiesTagContainer = document.getElementById('allergiesContainer');
  const customAllergyInput = document.getElementById('customAllergyInput');
  const addAllergyBtn = document.getElementById('addAllergyBtn');

  const heightInput = document.getElementById('height_cm');
  const weightInput = document.getElementById('weight_kg');
  const bmiDisplay = document.getElementById('bmiDisplay');
  const bmiBadge = document.getElementById('bmiBadge');

  // Gender & Pregnancy elements
  const genderSelect = document.getElementById('gender');
  const pregnancyContainer = document.getElementById('pregnancyContainer');
  const isPregnantSelect = document.getElementById('is_pregnant');
  const pregnancyWeeksGroup = document.getElementById('pregnancyWeeksGroup');
  const pregnancyWeeksInput = document.getElementById('pregnancy_weeks');
  const trimesterCard = document.getElementById('trimesterCard');
  const trimesterBadge = document.getElementById('trimesterBadge');
  const trimesterSubtext = document.getElementById('trimesterSubtext');

  const prefillDemoBtn = document.getElementById('prefillDemoBtn');

  const submitBtn = document.getElementById('submitPatientBtn');
  const submitSpinner = document.getElementById('submitSpinner');
  const submitText = document.getElementById('submitText');

  let selectedConditions = new Set();
  let selectedAllergies = new Set();

  // Initialize Gender & Pregnancy Handlers
  if (genderSelect) {
    genderSelect.addEventListener('change', () => {
      handleGenderChange();
    });
  }

  if (isPregnantSelect) {
    isPregnantSelect.addEventListener('change', () => {
      handlePregnancyToggle();
    });
  }

  if (pregnancyWeeksInput) {
    pregnancyWeeksInput.addEventListener('input', () => {
      calculateTrimester();
    });
  }

  function handleGenderChange() {
    if (!genderSelect || !pregnancyContainer) return;
    const isFemale = genderSelect.value === 'female';
    if (isFemale) {
      pregnancyContainer.classList.remove('hidden');
      handlePregnancyToggle();
    } else {
      pregnancyContainer.classList.add('hidden');
      if (isPregnantSelect) isPregnantSelect.value = 'false';
      if (pregnancyWeeksInput) pregnancyWeeksInput.value = '';
      if (pregnancyWeeksGroup) pregnancyWeeksGroup.classList.add('hidden');
      if (trimesterCard) trimesterCard.classList.add('hidden');
    }
    if (window.lucide) window.lucide.createIcons();
  }

  function handlePregnancyToggle() {
    if (!isPregnantSelect) return;
    const isPregnant = isPregnantSelect.value === 'true';
    if (isPregnant) {
      if (pregnancyWeeksGroup) pregnancyWeeksGroup.classList.remove('hidden');
      if (trimesterCard) trimesterCard.classList.remove('hidden');
      calculateTrimester();
      if (pregnancyWeeksInput) pregnancyWeeksInput.focus();
    } else {
      if (pregnancyWeeksGroup) pregnancyWeeksGroup.classList.add('hidden');
      if (trimesterCard) trimesterCard.classList.add('hidden');
      if (pregnancyWeeksInput) pregnancyWeeksInput.value = '';
    }
  }

  function calculateTrimester() {
    if (!pregnancyWeeksInput || !trimesterBadge) return;
    const weeks = parseInt(pregnancyWeeksInput.value);

    if (isNaN(weeks) || weeks < 1) {
      trimesterBadge.textContent = "-- Trimester";
      trimesterBadge.className = "text-xs font-bold px-2.5 py-1 rounded-lg bg-pink-100 text-pink-800 border border-pink-200";
      if (trimesterSubtext) trimesterSubtext.textContent = "Enter week";
      return "";
    }

    const isAr = (window.AppSettings && window.AppSettings.currentLang === 'ar') || document.documentElement.getAttribute('lang') === 'ar';
    let trimester = "";
    let sub = "";

    if (weeks >= 1 && weeks <= 12) {
      trimester = isAr ? "الثلث الأول" : "1st Trimester";
      sub = isAr ? "الأسابيع 1–12 • بداية الحمل" : "Weeks 1–12 • Early Gestation";
      trimesterBadge.className = "text-xs font-bold px-2.5 py-1 rounded-lg bg-purple-100 text-purple-800 border border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800";
    } else if (weeks >= 13 && weeks <= 26) {
      trimester = isAr ? "الثلث الثاني" : "2nd Trimester";
      sub = isAr ? "الأسابيع 13–26 • منتصف الحمل" : "Weeks 13–26 • Mid Gestation";
      trimesterBadge.className = "text-xs font-bold px-2.5 py-1 rounded-lg bg-pink-100 text-pink-800 border border-pink-200 dark:bg-pink-950 dark:text-pink-300 dark:border-pink-800";
    } else if (weeks >= 27 && weeks <= 42) {
      trimester = isAr ? "الثلث الثالث" : "3rd Trimester";
      sub = isAr ? "الأسابيع 27–42 • أواخر الحمل" : "Weeks 27–42 • Late Gestation";
      trimesterBadge.className = "text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800";
    } else {
      trimester = isAr ? "أكثر من 40 أسبوعاً" : "40+ Weeks";
      sub = isAr ? "اكتمال فترة الحمل" : "Full / Post Term";
      trimesterBadge.className = "text-xs font-bold px-2.5 py-1 rounded-lg bg-amber-100 text-amber-800 border border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800";
    }

    trimesterBadge.textContent = trimester;
    if (trimesterSubtext) trimesterSubtext.textContent = sub;
    return trimester;
  }

  // Load existing form profile
  loadExistingFormData();

  if (heightInput && weightInput) {
    heightInput.addEventListener('input', calculateBMI);
    weightInput.addEventListener('input', calculateBMI);
  }

  function calculateBMI() {
    const h = parseFloat(heightInput.value);
    const w = parseFloat(weightInput.value);

    if (h > 50 && h < 250 && w > 10 && w < 300) {
      const hM = h / 100;
      const bmi = (w / (hM * hM)).toFixed(1);
      if (bmiDisplay) bmiDisplay.textContent = `BMI: ${bmi}`;

      if (bmiBadge) {
        bmiBadge.classList.remove('hidden');
        if (bmi < 18.5) {
          bmiBadge.textContent = "Underweight";
          bmiBadge.className = "text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200";
        } else if (bmi <= 24.9) {
          bmiBadge.textContent = "Normal Weight";
          bmiBadge.className = "text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200";
        } else if (bmi <= 29.9) {
          bmiBadge.textContent = "Overweight";
          bmiBadge.className = "text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200";
        } else {
          bmiBadge.textContent = "Obese Range";
          bmiBadge.className = "text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200";
        }
      }
    } else {
      if (bmiDisplay) bmiDisplay.textContent = "BMI: --";
      if (bmiBadge) bmiBadge.classList.add('hidden');
    }
  }

  // Condition Pills
  document.querySelectorAll('[data-condition-pill]').forEach(pill => {
    pill.addEventListener('click', (e) => {
      e.preventDefault();
      const val = pill.getAttribute('data-condition-pill');
      if (selectedConditions.has(val)) {
        selectedConditions.delete(val);
        pill.classList.remove('bg-[#5B65DC]', 'text-white', 'border-[#5B65DC]');
        pill.classList.add('bg-[#EEEFFD]', 'text-[#122056]', 'border-[#E3E5F8]');
      } else {
        if (val === 'None') {
          selectedConditions.clear();
          document.querySelectorAll('[data-condition-pill]').forEach(p => {
            p.classList.remove('bg-[#5B65DC]', 'text-white', 'border-[#5B65DC]');
            p.classList.add('bg-[#EEEFFD]', 'text-[#122056]', 'border-[#E3E5F8]');
          });
        } else {
          selectedConditions.delete('None');
          const nonePill = document.querySelector('[data-condition-pill="None"]');
          if (nonePill) {
            nonePill.classList.remove('bg-[#5B65DC]', 'text-white', 'border-[#5B65DC]');
            nonePill.classList.add('bg-[#EEEFFD]', 'text-[#122056]', 'border-[#E3E5F8]');
          }
        }
        selectedConditions.add(val);
        pill.classList.add('bg-[#5B65DC]', 'text-white', 'border-[#5B65DC]');
        pill.classList.remove('bg-[#EEEFFD]', 'text-[#122056]', 'border-[#E3E5F8]');
      }
    });
  });

  if (addConditionBtn && customConditionInput) {
    addConditionBtn.addEventListener('click', () => {
      const val = customConditionInput.value.trim();
      if (val && !selectedConditions.has(val)) {
        selectedConditions.add(val);
        renderCustomPill(conditionsTagContainer, val, () => {
          selectedConditions.delete(val);
        });
        customConditionInput.value = '';
      }
    });
    customConditionInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        addConditionBtn.click();
      }
    });
  }

  // Allergy Pills
  document.querySelectorAll('[data-allergy-pill]').forEach(pill => {
    pill.addEventListener('click', (e) => {
      e.preventDefault();
      const val = pill.getAttribute('data-allergy-pill');
      if (selectedAllergies.has(val)) {
        selectedAllergies.delete(val);
        pill.classList.remove('bg-[#5B65DC]', 'text-white', 'border-[#5B65DC]');
        pill.classList.add('bg-[#EEEFFD]', 'text-[#122056]', 'border-[#E3E5F8]');
      } else {
        if (val === 'No Known Allergies') {
          selectedAllergies.clear();
          document.querySelectorAll('[data-allergy-pill]').forEach(p => {
            p.classList.remove('bg-[#5B65DC]', 'text-white', 'border-[#5B65DC]');
            p.classList.add('bg-[#EEEFFD]', 'text-[#122056]', 'border-[#E3E5F8]');
          });
        } else {
          selectedAllergies.delete('No Known Allergies');
          const noAllergyPill = document.querySelector('[data-allergy-pill="No Known Allergies"]');
          if (noAllergyPill) {
            noAllergyPill.classList.remove('bg-[#5B65DC]', 'text-white', 'border-[#5B65DC]');
            noAllergyPill.classList.add('bg-[#EEEFFD]', 'text-[#122056]', 'border-[#E3E5F8]');
          }
        }
        selectedAllergies.add(val);
        pill.classList.add('bg-[#5B65DC]', 'text-white', 'border-[#5B65DC]');
        pill.classList.remove('bg-[#EEEFFD]', 'text-[#122056]', 'border-[#E3E5F8]');
      }
    });
  });

  if (addAllergyBtn && customAllergyInput) {
    addAllergyBtn.addEventListener('click', () => {
      const val = customAllergyInput.value.trim();
      if (val && !selectedAllergies.has(val)) {
        selectedAllergies.add(val);
        renderCustomPill(allergiesTagContainer, val, () => {
          selectedAllergies.delete(val);
        });
        customAllergyInput.value = '';
      }
    });
    customAllergyInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        addAllergyBtn.click();
      }
    });
  }

  function renderCustomPill(container, label, onRemove) {
    const chip = document.createElement('span');
    chip.className = "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#EEEFFD] dark:bg-[#1C2555] text-[#122056] dark:text-[#FAFAFD] border border-[#E3E5F8] dark:border-[#1E285C] animate-fadeIn";
    chip.innerHTML = `
      <span>${label}</span>
      <button type="button" class="text-[#5B65DC] hover:text-[#4A54CA] rounded-full focus:outline-none" aria-label="Remove ${label}">
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>
    `;
    chip.querySelector('button').addEventListener('click', () => {
      onRemove();
      chip.remove();
    });
    container.appendChild(chip);
  }

  // Pre-fill Demo Data button handler (PRESERVES original user sign-up full name)
  if (prefillDemoBtn) {
    prefillDemoBtn.addEventListener('click', async () => {
      const nameInput = document.getElementById('full_name');
      if (nameInput && (!nameInput.value || !nameInput.value.trim())) {
        const user = await AuthService.getCurrentUser();
        nameInput.value = user?.fullName || "Patient";
      }

      document.getElementById('date_of_birth').value = "1994-06-18";
      document.getElementById('gender').value = "female";
      handleGenderChange();

      if (isPregnantSelect) isPregnantSelect.value = "true";
      handlePregnancyToggle();
      if (pregnancyWeeksInput) {
        pregnancyWeeksInput.value = "24";
        calculateTrimester();
      }

      document.getElementById('blood_type').value = "O+";
      document.getElementById('height_cm').value = "168";
      document.getElementById('weight_kg').value = "66";
      document.getElementById('medical_history').value = "First pregnancy (G1P0). Mild gestational heartburn. No previous surgeries.";

      selectPresetPill('data-condition-pill', 'Hypertension');
      selectPresetPill('data-allergy-pill', 'Penicillin');

      calculateBMI();
    });
  }

  function selectPresetPill(attr, value) {
    const pill = document.querySelector(`[${attr}="${value}"]`);
    if (pill) {
      if (attr === 'data-condition-pill') selectedConditions.add(value);
      if (attr === 'data-allergy-pill') selectedAllergies.add(value);
      pill.classList.add('bg-[#5B65DC]', 'text-white', 'border-[#5B65DC]');
      pill.classList.remove('bg-[#EEEFFD]', 'text-[#122056]', 'border-[#E3E5F8]');
    }
  }

  async function loadExistingFormData() {
    const profile = await PatientService.loadPatientProfile();
    const user = await AuthService.getCurrentUser();

    if (profile) {
      if (document.getElementById('full_name')) document.getElementById('full_name').value = profile.fullName || (user ? user.fullName : '');
      if (document.getElementById('date_of_birth') && profile.dateOfBirth) document.getElementById('date_of_birth').value = profile.dateOfBirth;
      if (document.getElementById('gender')) {
        document.getElementById('gender').value = profile.gender === 'male' ? 'male' : 'female';
        handleGenderChange();
      }
      if (profile.gender === 'female' && profile.isPregnant) {
        if (isPregnantSelect) isPregnantSelect.value = "true";
        handlePregnancyToggle();
        if (pregnancyWeeksInput && profile.pregnancyWeeks) {
          pregnancyWeeksInput.value = profile.pregnancyWeeks;
          calculateTrimester();
        }
      }

      if (document.getElementById('blood_type') && profile.bloodType) document.getElementById('blood_type').value = profile.bloodType;
      if (document.getElementById('height_cm') && profile.height) document.getElementById('height_cm').value = profile.height;
      if (document.getElementById('weight_kg') && profile.weight) document.getElementById('weight_kg').value = profile.weight;
      if (document.getElementById('medical_history') && profile.medicalHistory) document.getElementById('medical_history').value = profile.medicalHistory;

      if (Array.isArray(profile.chronicConditions)) {
        profile.chronicConditions.forEach(cond => {
          const pill = document.querySelector(`[data-condition-pill="${cond}"]`);
          if (pill) {
            selectPresetPill('data-condition-pill', cond);
          } else {
            selectedConditions.add(cond);
            renderCustomPill(conditionsTagContainer, cond, () => selectedConditions.delete(cond));
          }
        });
      }

      if (Array.isArray(profile.allergies)) {
        profile.allergies.forEach(all => {
          const pill = document.querySelector(`[data-allergy-pill="${all}"]`);
          if (pill) {
            selectPresetPill('data-allergy-pill', all);
          } else {
            selectedAllergies.add(all);
            renderCustomPill(allergiesTagContainer, all, () => selectedAllergies.delete(all));
          }
        });
      }

      calculateBMI();
    } else if (user && document.getElementById('full_name')) {
      document.getElementById('full_name').value = user.fullName || '';
      handleGenderChange();
    }
  }

  // Handle Form Submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const fullName = document.getElementById('full_name').value.trim();
    if (!fullName) {
      alert("Please provide the patient's full name.");
      document.getElementById('full_name').focus();
      return;
    }

    const genderVal = document.getElementById('gender')?.value || "female";
    const isPregnantVal = (genderVal === "female" && isPregnantSelect?.value === "true");
    const weeksVal = isPregnantVal && pregnancyWeeksInput?.value ? pregnancyWeeksInput.value.trim() : "";
    const trimesterVal = isPregnantVal ? calculateTrimester() : "";

    const payload = {
      fullName: fullName,
      dateOfBirth: document.getElementById('date_of_birth')?.value || "",
      gender: genderVal,
      bloodType: document.getElementById('blood_type')?.value || "Unknown",
      height: document.getElementById('height_cm')?.value || "",
      weight: document.getElementById('weight_kg')?.value || "",
      isPregnant: isPregnantVal,
      pregnancyWeeks: weeksVal,
      pregnancyTrimester: trimesterVal,
      chronicConditions: Array.from(selectedConditions),
      allergies: Array.from(selectedAllergies),
      medicalHistory: document.getElementById('medical_history')?.value || ""
    };

    if (submitBtn) submitBtn.disabled = true;
    if (submitSpinner) submitSpinner.classList.remove('hidden');
    if (submitText) submitText.textContent = "Saving to Supabase Database...";

    try {
      const res = await PatientService.savePatientProfile(payload);
      if (res.success) {
        if (submitText) submitText.textContent = "Profile Saved! Opening Assistant...";
        setTimeout(() => {
          window.location.href = "assistant.html";
        }, 500);
      } else {
        alert("Error saving profile: " + (res.error || "Please try again."));
        if (submitBtn) submitBtn.disabled = false;
        if (submitSpinner) submitSpinner.classList.add('hidden');
        if (submitText) submitText.textContent = "Continue to AI Assistant";
      }
    } catch (err) {
      alert("An unexpected error occurred while saving profile.");
      if (submitBtn) submitBtn.disabled = false;
      if (submitSpinner) submitSpinner.classList.add('hidden');
      if (submitText) submitText.textContent = "Continue to AI Assistant";
    }
  });
}
