/**
 * ============================================================================
 * AuraMed AI - Medicine Context Manager & Service (Live Supabase Connected)
 * ============================================================================
 */

// ============================================================================
// 1. Medicine Data Service (Live Supabase)
// ============================================================================

const MedicineService = {
  /**
   * Fetches active medicines for the patient from Supabase 'patient_medicines'.
   * @returns {Promise<Array<object>>}
   */
  async loadMedicines() {
    if (supabaseClient) {
      try {
        const user = await AuthService.getCurrentUser();
        if (user && user.id) {
          const { data, error } = await supabaseClient
            .from('patient_medicines')
            .select('*')
            .eq('patient_id', user.id)
            .eq('is_active', true)
            .order('created_at', { ascending: false });

          if (!error && data) {
            LocalStorageDB.set('patient_medicines', data);
            return data;
          } else if (error) {
            console.warn("Supabase load medicines warning:", error);
          }
        }
      } catch (err) {
        console.error("Error loading medicines from Supabase:", err);
      }
    }

    const cached = LocalStorageDB.get('patient_medicines');
    if (cached === null) {
      LocalStorageDB.set('patient_medicines', []);
      return [];
    }
    return cached;
  },

  /**
   * Adds a new medicine to the patient's active regimen in Supabase.
   * @param {object} medicine - Medicine data object { name, dosage, frequency }
   * @returns {Promise<{success: boolean, medicine?: object, error?: string}>}
   */
  async addMedicine(medicine) {
    if (supabaseClient) {
      try {
        const user = await AuthService.getCurrentUser();
        if (user && user.id) {
          const { data, error } = await supabaseClient
            .from('patient_medicines')
            .insert({
              patient_id: user.id,
              name: medicine.name.trim(),
              dosage: medicine.dosage ? medicine.dosage.trim() : "Standard Dose",
              frequency: medicine.frequency ? medicine.frequency.trim() : "Daily",
              is_active: true
            })
            .select()
            .single();

          if (error) {
            console.error("Supabase insert medicine error:", error);
            return { success: false, error: error.message };
          }

          const currentList = LocalStorageDB.get('patient_medicines', []);
          currentList.unshift(data);
          LocalStorageDB.set('patient_medicines', currentList);

          return { success: true, medicine: data };
        }
      } catch (err) {
        console.error("Add medicine exception:", err);
      }
    }

    // Local fallback
    const newMed = {
      id: "med_" + Math.random().toString(36).substr(2, 9),
      name: medicine.name,
      dosage: medicine.dosage || "Standard Dose",
      frequency: medicine.frequency || "Daily",
      addedAt: new Date().toISOString()
    };

    const currentList = await this.loadMedicines();
    currentList.unshift(newMed);
    LocalStorageDB.set('patient_medicines', currentList);

    return { success: true, medicine: newMed };
  },

  /**
   * Removes a medicine from Supabase and cache.
   * @param {string} medicineId - ID of the medicine
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  async removeMedicine(medicineId) {
    if (supabaseClient) {
      try {
        const { error } = await supabaseClient
          .from('patient_medicines')
          .delete()
          .eq('id', medicineId);

        if (error) {
          console.error("Supabase remove medicine error:", error);
        }
      } catch (err) {
        console.error("Remove medicine exception:", err);
      }
    }

    let currentList = LocalStorageDB.get('patient_medicines', []);
    currentList = currentList.filter(m => m.id !== medicineId);
    LocalStorageDB.set('patient_medicines', currentList);

    return { success: true };
  },

  /**
   * Generates a string summary of all active medicines for the AI context.
   */
  async getMedicinesContextSummary() {
    const list = await this.loadMedicines();
    if (!list || list.length === 0) {
      return "[ACTIVE MEDICATIONS: None currently reported by patient]";
    }

    const items = list.map(m => {
      let desc = `- ${m.name}`;
      if (m.dosage) desc += ` (${m.dosage})`;
      if (m.frequency) desc += ` — ${m.frequency}`;
      return desc;
    }).join("\n");

    return `[CURRENT ACTIVE MEDICATIONS (${list.length} total)]\n${items}`;
  }
};

// ============================================================================
// 2. Medicine Bar UI Controller
// ============================================================================

const MedicineUI = {
  activeMedicines: [],

  async init() {
    this.container = document.getElementById('medicineChipsContainer');
    this.emptyState = document.getElementById('medicineEmptyState');
    this.countBadge = document.getElementById('medicineCountBadge');
    this.composerContextBadge = document.getElementById('composerContextBadge');

    this.modal = document.getElementById('addMedicineModal');
    this.openModalBtn = document.getElementById('openAddMedBtn');
    this.closeModalBtn = document.getElementById('closeAddMedBtn');
    this.cancelModalBtn = document.getElementById('cancelAddMedBtn');
    this.form = document.getElementById('addMedicineForm');

    this.bindEvents();
    await this.refresh();
  },

  bindEvents() {
    if (this.openModalBtn) {
      this.openModalBtn.addEventListener('click', () => this.showModal());
    }

    if (this.closeModalBtn) {
      this.closeModalBtn.addEventListener('click', () => this.hideModal());
    }

    if (this.cancelModalBtn) {
      this.cancelModalBtn.addEventListener('click', () => this.hideModal());
    }

    // Modal background click close
    if (this.modal) {
      this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal) this.hideModal();
      });
    }

    // Escape key close
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal && !this.modal.classList.contains('hidden')) {
        this.hideModal();
      }
    });

    // Form submit
    if (this.form) {
      this.form.addEventListener('submit', (e) => this.handleFormSubmit(e));
    }
  },

  showModal() {
    if (!this.modal) return;
    this.modal.classList.remove('hidden');
    const nameInput = document.getElementById('medName');
    if (nameInput) {
      setTimeout(() => nameInput.focus(), 50);
    }
  },

  hideModal() {
    if (!this.modal) return;
    this.modal.classList.add('hidden');
    if (this.form) this.form.reset();
  },

  async handleFormSubmit(e) {
    e.preventDefault();
    const nameInput = document.getElementById('medName');
    const dosageInput = document.getElementById('medDosage');
    const frequencyInput = document.getElementById('medFrequency');

    const name = nameInput.value.trim();
    if (!name) {
      nameInput.focus();
      return;
    }

    const payload = {
      name: name,
      dosage: dosageInput ? dosageInput.value.trim() : "",
      frequency: frequencyInput ? frequencyInput.value.trim() : ""
    };

    const submitBtn = document.getElementById('submitMedBtn');
    if (submitBtn) submitBtn.disabled = true;

    try {
      await MedicineService.addMedicine(payload);
      this.hideModal();
      await this.refresh();

      if (window.AssistantUI && typeof window.AssistantUI.notifyContextUpdated === 'function') {
        window.AssistantUI.notifyContextUpdated(`Added **${name}** (${payload.dosage || 'standard dose'}) to active medication context in Supabase.`);
      }
    } catch (err) {
      alert("Error adding medication: " + err.message);
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  },

  async refresh() {
    this.activeMedicines = await MedicineService.loadMedicines();
    this.render();
  },

  render() {
    if (!this.container) return;

    // Clear chips (leave + button)
    const chips = this.container.querySelectorAll('.med-chip-item');
    chips.forEach(c => c.remove());

    const count = this.activeMedicines.length;

    // Update count badges
    if (this.countBadge) {
      this.countBadge.textContent = count;
      this.countBadge.className = count > 0 
        ? "inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold rounded-full bg-[#EEEFFD] text-[#5B65DC] dark:bg-[#1C2555] dark:text-[#8F9AF0]"
        : "hidden";
    }

    if (this.composerContextBadge) {
      if (count > 0) {
        this.composerContextBadge.innerHTML = `
          <span class="w-2 h-2 rounded-full bg-[#5B65DC] animate-pulse"></span>
          <span class="text-xs font-medium text-[#5B65DC] dark:text-[#8F9AF0]">${count} Med${count > 1 ? 's' : ''} in Context</span>
        `;
        this.composerContextBadge.className = "flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EEEFFD] dark:bg-[#1C2555] border border-[#E3E5F8] dark:border-[#1E285C]";
      } else {
        this.composerContextBadge.innerHTML = `
          <span class="w-2 h-2 rounded-full bg-slate-400"></span>
          <span class="text-xs font-medium text-[#828EA8]">No Meds in Context</span>
        `;
        this.composerContextBadge.className = "flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-[#161E45] border border-slate-200 dark:border-[#1E285C]";
      }
    }

    if (count === 0) {
      if (this.emptyState) this.emptyState.classList.remove('hidden');
    } else {
      if (this.emptyState) this.emptyState.classList.add('hidden');

      // Insert chips before the add button
      this.activeMedicines.forEach(med => {
        const chip = document.createElement('div');
        chip.className = "med-chip-item flex-shrink-0 group inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-white dark:bg-[#111736] text-[#122056] dark:text-[#FAFAFD] border border-[#E3E5F8] dark:border-[#1E285C] shadow-sm hover:border-[#5B65DC] hover:shadow transition-all animate-fadeIn";
        chip.title = `${med.name} ${med.dosage || ''} - ${med.frequency || ''}`;
        
        chip.innerHTML = `
          <span class="text-[#5B65DC] dark:text-[#8F9AF0] font-bold flex items-center">
            <svg class="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
            </svg>
            ${med.name}
          </span>
          ${med.dosage ? `<span class="text-[#828EA8] font-normal">${med.dosage}</span>` : ''}
          <button type="button" class="remove-med-btn text-[#828EA8] hover:text-rose-600 hover:bg-rose-50 rounded-full p-0.5 transition-colors focus:outline-none focus:ring-1 focus:ring-rose-400" aria-label="Remove ${med.name}">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        `;

        chip.querySelector('.remove-med-btn').addEventListener('click', async (e) => {
          e.stopPropagation();
          await this.handleRemove(med.id, med.name);
        });

        // Insert before the '+ Add Medicine' button in the container
        if (this.openModalBtn) {
          this.container.insertBefore(chip, this.openModalBtn);
        } else {
          this.container.appendChild(chip);
        }
      });
    }

    if (window.lucide) window.lucide.createIcons();
  },

  async handleRemove(id, name) {
    await MedicineService.removeMedicine(id);
    await this.refresh();

    if (window.AssistantUI && typeof window.AssistantUI.notifyContextUpdated === 'function') {
      window.AssistantUI.notifyContextUpdated(`Removed **${name}** from medication context.`);
    }
  }
};

// Initialize if on assistant page
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('medicineChipsContainer')) {
    MedicineUI.init();
  }
});
