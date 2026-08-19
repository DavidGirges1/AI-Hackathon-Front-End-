/**
 * ============================================================================
 * AuraMed AI - Medical Assistant Chat Engine (Live Supabase Connected)
 * ============================================================================
 */

// ============================================================================
// 1. Conversation Data Service (Live Supabase)
// ============================================================================

const ConversationService = {
  /**
   * Loads message history from Supabase 'messages' table.
   * @returns {Promise<Array<object>>}
   */
  async loadMessages() {
    if (supabaseClient) {
      try {
        const user = await AuthService.getCurrentUser();
        if (user && user.id) {
          const { data, error } = await supabaseClient
            .from('messages')
            .select('*')
            .eq('patient_id', user.id)
            .order('created_at', { ascending: true });

          if (!error && data && data.length > 0) {
            LocalStorageDB.set('assistant_messages', data);
            return data;
          }
        }
      } catch (err) {
        console.warn("Could not fetch messages from Supabase:", err);
      }
    }

    const cached = LocalStorageDB.get('assistant_messages');
    if (cached && cached.length > 0) {
      return cached;
    }

    // Default Clinical Welcome Message
    const user = await AuthService.getCurrentUser();
    const profile = await PatientService.loadPatientProfile();
    const medicines = await MedicineService.loadMedicines();
    const displayName = profile?.fullName || user?.fullName || "Patient";
    const medNames = medicines.length > 0 ? medicines.map(m => m.name).join(", ") : "None added yet";

    let maternalNote = "";
    if (profile?.gender === "female" && profile?.isPregnant) {
      maternalNote = `\n- **Maternal Status:** Currently Pregnant (${profile.pregnancyWeeks ? `${profile.pregnancyWeeks} Weeks` : 'Weeks not noted'} • ${profile.pregnancyTrimester || 'Active Trimester'})`;
    }

    const conditionsText = profile?.chronicConditions?.length > 0 ? profile.chronicConditions.join(", ") : "None recorded";
    const allergiesText = profile?.allergies?.length > 0 ? profile.allergies.join(", ") : "No known drug allergies";

    const initialWelcome = {
      id: "msg_welcome_1",
      sender: "assistant",
      content: `Hello **${displayName}**, I'm your **AuraMed AI Clinical Assistant**.\n\nI have loaded your health context into our secure session:\n- **Diagnosed Conditions:** ${conditionsText}\n- **Known Allergies:** ${allergiesText}${maternalNote}\n- **Active Medications:** ${medNames}\n\nYou can ask me questions regarding your medication timings, potential drug interactions, pregnancy-safe alternatives, or preparation for your next doctor's visit.`,
      metadata: { isGreeting: true, hasDisclaimer: true },
      created_at: new Date().toISOString()
    };

    // Save initial welcome to Supabase if logged in
    if (supabaseClient) {
      try {
        const user = await AuthService.getCurrentUser();
        if (user && user.id) {
          const { data } = await supabaseClient
            .from('messages')
            .insert({
              patient_id: user.id,
              sender: initialWelcome.sender,
              content: initialWelcome.content,
              metadata: initialWelcome.metadata
            })
            .select()
            .single();

          if (data) {
            LocalStorageDB.set('assistant_messages', [data]);
            return [data];
          }
        }
      } catch (e) {
        console.warn("Initial message save notice:", e);
      }
    }

    LocalStorageDB.set('assistant_messages', [initialWelcome]);
    return [initialWelcome];
  },

  /**
   * Persists a new message in Supabase.
   * @param {object} msg - Message payload { sender, content, metadata }
   * @returns {Promise<object>}
   */
  async saveMessage(msg) {
    if (supabaseClient) {
      try {
        const user = await AuthService.getCurrentUser();
        if (user && user.id) {
          const { data, error } = await supabaseClient
            .from('messages')
            .insert({
              patient_id: user.id,
              sender: msg.sender,
              content: msg.content,
              metadata: msg.metadata || {}
            })
            .select()
            .single();

          if (!error && data) {
            const currentList = LocalStorageDB.get('assistant_messages', []);
            currentList.push(data);
            LocalStorageDB.set('assistant_messages', currentList);
            return data;
          }
        }
      } catch (err) {
        console.error("Supabase message save error:", err);
      }
    }

    const fullMsg = {
      id: "msg_" + Math.random().toString(36).substr(2, 9),
      sender: msg.sender,
      content: msg.content,
      metadata: msg.metadata || {},
      created_at: new Date().toISOString()
    };

    const messages = await this.loadMessages();
    messages.push(fullMsg);
    LocalStorageDB.set('assistant_messages', messages);

    return fullMsg;
  },

  /**
   * Clears the current conversation thread from Supabase and resets to welcome greeting.
   */
  async clearConversation() {
    if (supabaseClient) {
      try {
        const user = await AuthService.getCurrentUser();
        if (user && user.id) {
          await supabaseClient.from('messages').delete().eq('patient_id', user.id);
        }
      } catch (e) {
        console.warn("Clear conversation error:", e);
      }
    }
    LocalStorageDB.remove('assistant_messages');
    return await this.loadMessages();
  },

  /**
   * Simulated Context-Aware Clinical AI Response Generator.
   */
  async generateAIResponse(userPrompt) {
    const medicines = await MedicineService.loadMedicines();
    const profile = await PatientService.loadPatientProfile();

    const lower = userPrompt.toLowerCase();

    // Simulated inference latency
    await new Promise(resolve => setTimeout(resolve, 1100));

    // Emergency Detection Check
    const emergencyKeywords = ["chest pain", "can't breathe", "shortness of breath", "severe allergic", "anaphylaxis", "suicide", "bleeding profusely", "severe abdominal pain", "decreased fetal movement"];
    for (const kw of emergencyKeywords) {
      if (lower.includes(kw)) {
        return {
          isEmergency: true,
          content: `### 🚨 URGENT MEDICAL ATTENTION REQUIRED\n\nBased on your mention of **"${kw}"**, this symptom may indicate an acute, potentially critical medical situation.\n\n**Immediate Action Steps:**\n1. **Call Emergency Services immediately (911 or your local emergency number).**\n2. Do **not** attempt to drive yourself to the emergency department if you are alone.\n3. If you are pregnant (${profile.pregnancyWeeks || '24'} weeks), contact your on-call obstetrician / Labor & Delivery triage immediately.\n4. Rest in a comfortable, left-lateral or seated position while awaiting responders.\n\n*AuraMed AI cannot assist with active emergencies. Please contact emergency services right away.*`
        };
      }
    }

    // Pregnancy Contraindication Alert
    const isPregnant = profile.gender === "female" && profile.isPregnant;

    if (isPregnant && (lower.includes("lisinopril") || lower.includes("ace inhibitor") || lower.includes("ibuprofen") || lower.includes("advil") || lower.includes("safe in pregnancy") || lower.includes("pregnancy safe"))) {
      return {
        content: `### 🤰 Maternal & Fetal Safety Assessment (${profile.pregnancyWeeks || '24'} Weeks • ${profile.pregnancyTrimester || '2nd Trimester'})\n\n⚠️ **CRITICAL PREGNANCY SAFETY WARNING:**\n- **ACE Inhibitors (Lisinopril):** ACE inhibitors have a **Black Box Warning** during pregnancy (especially 2nd and 3rd trimesters) as they can cause significant fetal renal impairment and oligohydramnios.\n- **NSAIDs (Ibuprofen / Advil):** NSAIDs are generally contraindicated in the second half of pregnancy due to risks of premature closure of the fetal ductus arteriosus.\n\n#### Recommended Pregnancy-Safe Clinical Alternatives (Discuss with OB-GYN):\n- **Hypertension Management:** Labetalol, Methyldopa, or extended-release Nifedipine are standard first-line antihypertensive therapies during pregnancy.\n- **Mild Pain Relief:** Acetaminophen (Tylenol) is generally the preferred first-line analgesic during gestation when taken at recommended dosages under physician supervision.\n\n*Please schedule an immediate consultation with your OB-GYN to review and adjust your antihypertensive regimen.*`
      };
    }

    // Interaction Check Simulation
    if (lower.includes("ibuprofen") || lower.includes("advil") || lower.includes("aspirin") || lower.includes("interaction") || lower.includes("safe to take")) {
      const hasLisinopril = medicines.some(m => m.name.toLowerCase().includes("lisinopril"));

      let interactionNotes = "";
      if (hasLisinopril && (lower.includes("ibuprofen") || lower.includes("advil") || lower.includes("nsaid"))) {
        interactionNotes += `\n- ⚠️ **Lisinopril + NSAID Caution:** Regular or high doses of NSAIDs (like Ibuprofen or Advil) can decrease the blood pressure lowering effectiveness of ACE inhibitors such as Lisinopril and may increase the risk of kidney strain. Acetaminophen (Tylenol) is generally a preferred first-line alternative for mild pain if appropriate.`;
      }
      if (profile.allergies.some(a => a.toLowerCase().includes("aspirin") || a.toLowerCase().includes("nsaid"))) {
        interactionNotes += `\n- 🚫 **Allergy Alert:** Your profile indicates a sensitivity or allergy to NSAIDs.`;
      }

      return {
        content: `### 💊 Medication Interaction Assessment\n\nI evaluated your inquiry against your active profile and ${medicines.length} current medications loaded in Supabase:\n${interactionNotes || "\n- No severe direct interactions detected with standard OTC guidance, but review specific timing considerations below."}\n\n#### Key Clinical Considerations:\n- **Active Medications Evaluated:** ${medicines.map(m => m.name).join(", ") || "None recorded"}\n- **Kidney & Liver Context:** When taking long-term medications, consult with your pharmacist before starting new OTC analgesics.\n- **Recommended Next Step:** If you need pain relief, discuss non-NSAID options such as Acetaminophen or topical treatments with your healthcare provider.`
      };
    }

    // Missed Dose / Timing inquiry
    if (lower.includes("missed") || lower.includes("forgot") || lower.includes("time to take") || lower.includes("schedule")) {
      return {
        content: `### ⏰ Guidance on Medication Schedules & Missed Doses\n\nHere is standard clinical guidance based on your active regimen:\n\n#### General Rule of Thumb for Missed Doses:\n1. **Take it as soon as you remember**, unless it is almost time for your next scheduled dose.\n2. **Never take a double dose** to compensate for a missed one, as this can cause sudden blood pressure fluctuations.\n\n#### Active Regimen Notes:\n${medicines.map(m => `- **${m.name} (${m.dosage || 'Standard'}):** Scheduled as *${m.frequency || 'Daily'}*.`).join('\n')}\n\n*If you frequently miss doses, consider setting a phone alarm or using a pill organizer.*`
      };
    }

    // Side effects / Symptoms inquiry
    if (lower.includes("side effect") || lower.includes("dizzy") || lower.includes("cough") || lower.includes("nausea") || lower.includes("headache") || lower.includes("stomach")) {
      return {
        content: `### 🩺 Symptom & Side Effect Analysis\n\nLet's cross-reference your symptoms with known profiles for your current medications and conditions (**${profile.chronicConditions.join(', ') || 'General'}**):\n\n#### Potential Correlation with Active Medications:\n- **Lisinopril (ACE Inhibitor):** A well-documented, harmless but persistent dry cough occurs in 10-15% of patients. Mild lightheadedness can also occur during dosage adjustments.\n- **Metformin:** Mild gastrointestinal discomfort (nausea, mild diarrhea) is common initially, which is why taking it *with or after meals* is strongly recommended.\n\n#### When to Contact Your Doctor:\n- If dizziness is persistent upon standing (orthostatic hypotension).\n- If gastrointestinal symptoms do not improve after 1-2 weeks.`
      };
    }

    // Lifestyle & Diet inquiry
    if (lower.includes("diet") || lower.includes("food") || lower.includes("lifestyle") || lower.includes("exercise") || lower.includes("hypertension")) {
      return {
        content: `### 🥗 Lifestyle & Nutritional Recommendations\n\nTailored for your profile (${profile.chronicConditions.join(', ') || 'General Wellness'}${isPregnant ? ` • ${profile.pregnancyTrimester || 'Pregnancy'}` : ''}):\n\n#### Dietary Focus Areas:\n- **DASH Diet Principles:** Prioritize leafy greens, berries, potassium-rich foods (if kidney function is normal), and whole grains to support healthy arterial pressure.\n- **Sodium Management:** Aim to keep daily sodium intake under 2,000 mg.\n- **Hydration:** Consistent water intake aids medication metabolism, amniotic fluid maintenance, and renal clearance.`
      };
    }

    // Default Comprehensive Response
    const maternalTag = isPregnant ? ` • 🤰 Pregnant (${profile.pregnancyWeeks || '24'}w, ${profile.pregnancyTrimester || '2nd Trimester'})` : '';

    return {
      content: `### 📋 Clinical Summary & Insights\n\nThank you for your question regarding: *"_${userPrompt}_"*\n\n#### Contextual Evaluation (from Supabase Database):\n- **Patient Profile:** ${profile.fullName || "Patient"}, ${profile.gender === 'female' ? 'Female' : 'Male'}${maternalTag} • Conditions: ${profile.chronicConditions.join(', ') || 'None recorded'}\n- **Active Medications In Context:** ${medicines.map(m => `${m.name} (${m.dosage || 'Dose noted'})`).join(', ') || 'No active medications'}\n\n#### Key Clinical Information:\n- Based on standard medical references, maintaining adherence to prescribed treatment plans while tracking any new or changing symptoms provides the best health outcomes.\n- If you are considering adding any supplements, prenatal vitamins, or OTC products, always ensure they do not interfere with your primary regimen.\n\n#### Suggested Questions for Your Next Clinical Visit:\n1. *"Are my current medication dosages still optimal for my condition and stage of care?"*\n2. *"Are there any routine lab tests due soon?"*`
    };
  }
};

// ============================================================================
// 2. Assistant UI Controller
// ============================================================================

const AssistantUI = {
  async init() {
    const user = await AuthService.requireAuth();
    if (!user) return;

    this.messagesContainer = document.getElementById('chatMessagesContainer');
    this.promptInput = document.getElementById('promptInput');
    this.sendBtn = document.getElementById('sendPromptBtn');
    this.typingIndicator = document.getElementById('typingIndicator');
    this.charCounter = document.getElementById('charCounter');
    this.clearChatBtn = document.getElementById('clearChatBtn');
    this.exportChatBtn = document.getElementById('exportChatBtn');
    this.patientSummaryPill = document.getElementById('patientSummaryPill');
    this.patientNameDisplay = document.getElementById('patientNameDisplay');

    this.bindEvents();
    await this.loadHeaderPatientContext();
    await this.renderMessages();
  },

  bindEvents() {
    if (this.promptInput) {
      this.promptInput.addEventListener('input', () => {
        this.adjustTextareaHeight();
        this.updateSendButtonState();
      });

      this.promptInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this.handleSendMessage();
        }
      });
    }

    if (this.sendBtn) {
      this.sendBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleSendMessage();
      });
    }

    document.querySelectorAll('[data-prompt-suggestion]').forEach(chip => {
      chip.addEventListener('click', (e) => {
        e.preventDefault();
        const text = chip.getAttribute('data-prompt-suggestion');
        if (this.promptInput) {
          this.promptInput.value = text;
          this.adjustTextareaHeight();
          this.updateSendButtonState();
          this.handleSendMessage();
        }
      });
    });

    if (this.clearChatBtn) {
      this.clearChatBtn.addEventListener('click', async () => {
        if (confirm("Clear current conversation history? Active patient and medication context will be retained.")) {
          await ConversationService.clearConversation();
          await this.renderMessages();
        }
      });
    }

    if (this.exportChatBtn) {
      this.exportChatBtn.addEventListener('click', () => {
        window.print();
      });
    }
  },

  adjustTextareaHeight() {
    if (!this.promptInput) return;
    this.promptInput.style.height = 'auto';
    const newHeight = Math.min(this.promptInput.scrollHeight, 180);
    this.promptInput.style.height = `${Math.max(newHeight, 48)}px`;
  },

  updateSendButtonState() {
    if (!this.promptInput || !this.sendBtn) return;
    const hasText = this.promptInput.value.trim().length > 0;
    this.sendBtn.disabled = !hasText;
    
    if (hasText) {
      this.sendBtn.classList.remove('opacity-40', 'cursor-not-allowed', 'bg-slate-300', 'text-slate-500');
      this.sendBtn.classList.add('bg-teal-700', 'text-white', 'hover:bg-teal-800', 'shadow-sm');
    } else {
      this.sendBtn.classList.add('opacity-40', 'cursor-not-allowed', 'bg-slate-300', 'text-slate-500');
      this.sendBtn.classList.remove('bg-teal-700', 'text-white', 'hover:bg-teal-800', 'shadow-sm');
    }
  },

  async loadHeaderPatientContext() {
    const profile = await PatientService.loadPatientProfile();
    const user = await AuthService.getCurrentUser();
    const displayName = profile?.fullName || user?.fullName || "Patient";

    if (this.patientSummaryPill && this.patientNameDisplay) {
      this.patientNameDisplay.textContent = displayName;
      
      let subtext = profile?.chronicConditions?.[0] || "Active Session";
      if (profile?.gender === "female" && profile?.isPregnant) {
        subtext = `🤰 ${profile.pregnancyTrimester || 'Pregnant'} (${profile.pregnancyWeeks || '24'}w)`;
      } else if (profile?.bloodType && profile.bloodType !== "Unknown") {
        subtext += ` • ${profile.bloodType}`;
      }

      this.patientSummaryPill.title = `Patient: ${displayName} | Gender: ${profile?.gender || 'unspecified'} | Conditions: ${profile?.chronicConditions?.join(', ') || 'None'} | Allergies: ${profile?.allergies?.join(', ') || 'None'}`;
      
      const badge = document.getElementById('patientSubtext');
      if (badge) {
        badge.textContent = subtext;
      }
    }
  },

  async renderMessages() {
    if (!this.messagesContainer) return;
    this.messagesContainer.innerHTML = '';

    const messages = await ConversationService.loadMessages();
    messages.forEach(msg => {
      this.appendMessageElement(msg, false);
    });

    this.scrollToBottom();
    if (window.lucide) window.lucide.createIcons();
  },

  appendMessageElement(msg, animate = true) {
    if (!this.messagesContainer) return;

    const isUser = msg.sender === 'user';
    const msgWrapper = document.createElement('div');
    msgWrapper.className = `flex w-full ${isUser ? 'justify-end' : 'justify-start'} ${animate ? 'message-enter' : ''} mb-5`;

    const timeStr = msg.created_at || msg.createdAt 
      ? new Date(msg.created_at || msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      : '';

    if (isUser) {
      msgWrapper.innerHTML = `
        <div class="max-w-[85%] sm:max-w-[75%] md:max-w-[65%] flex flex-col items-end">
          <div class="px-4 py-3 rounded-2xl rounded-tr-sm bg-teal-700 text-white shadow-sm text-sm sm:text-base leading-relaxed break-words">
            <p class="whitespace-pre-wrap">${this.escapeHTML(msg.content)}</p>
          </div>
          <div class="flex items-center gap-1 mt-1 text-[11px] text-slate-400 font-medium">
            <span>${timeStr}</span>
            <span>• Sent</span>
          </div>
        </div>
      `;
    } else {
      const formattedContent = this.formatMarkdown(msg.content);
      const isEmergency = msg.metadata?.isEmergency;

      msgWrapper.innerHTML = `
        <div class="max-w-[95%] sm:max-w-[85%] md:max-w-[80%] flex items-start gap-3">
          <div class="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex-shrink-0 flex items-center justify-center ${isEmergency ? 'bg-rose-100 text-rose-700 border border-rose-200' : 'bg-teal-700 text-white shadow-sm'}">
            <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
          </div>

          <div class="flex-1 min-w-0">
            <div class="px-4 py-3.5 sm:px-5 sm:py-4 rounded-2xl rounded-tl-sm ${isEmergency ? 'bg-rose-50 border border-rose-200 text-rose-950' : 'bg-white border border-slate-200/90 text-slate-800 shadow-sm'} text-sm sm:text-[15px] leading-relaxed ai-prose">
              ${formattedContent}
            </div>

            <div class="flex items-center justify-between mt-1.5 px-1 text-[11px] text-slate-400">
              <div class="flex items-center gap-2">
                <span class="font-medium text-slate-500">AuraMed AI</span>
                <span>•</span>
                <span>${timeStr}</span>
                <span class="hidden sm:inline">• Clinical Informational Engine</span>
              </div>
              <div class="flex items-center gap-1.5">
                <button type="button" class="copy-msg-btn hover:text-teal-700 hover:bg-slate-100 p-1 rounded transition-colors" title="Copy response" aria-label="Copy response">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                </button>
                <button type="button" class="helpful-btn hover:text-teal-700 hover:bg-slate-100 p-1 rounded transition-colors" title="Helpful" aria-label="Mark helpful">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      `;

      const copyBtn = msgWrapper.querySelector('.copy-msg-btn');
      if (copyBtn) {
        copyBtn.addEventListener('click', () => {
          navigator.clipboard.writeText(msg.content);
          copyBtn.innerHTML = `<svg class="w-3.5 h-3.5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>`;
          setTimeout(() => {
            copyBtn.innerHTML = `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>`;
          }, 1500);
        });
      }

      const helpBtn = msgWrapper.querySelector('.helpful-btn');
      if (helpBtn) {
        helpBtn.addEventListener('click', () => {
          helpBtn.classList.add('text-teal-700', 'bg-teal-50');
        });
      }
    }

    this.messagesContainer.appendChild(msgWrapper);
    if (animate) this.scrollToBottom();
  },

  notifyContextUpdated(text) {
    if (!this.messagesContainer) return;
    const note = document.createElement('div');
    note.className = "flex justify-center my-3 message-enter";
    note.innerHTML = `
      <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100/90 border border-slate-200 text-xs font-medium text-slate-600 shadow-2xs">
        <svg class="w-3.5 h-3.5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        <span>${this.formatMarkdown(text)}</span>
      </div>
    `;
    this.messagesContainer.appendChild(note);
    this.scrollToBottom();
  },

  async handleSendMessage() {
    if (!this.promptInput) return;
    const text = this.promptInput.value.trim();
    if (!text) return;

    this.promptInput.value = '';
    this.adjustTextareaHeight();
    this.updateSendButtonState();

    const userMsg = await ConversationService.saveMessage({
      sender: "user",
      content: text
    });
    this.appendMessageElement(userMsg, true);

    this.showTypingIndicator(true);

    try {
      const aiResponse = await ConversationService.generateAIResponse(text);

      this.showTypingIndicator(false);
      const aiMsg = await ConversationService.saveMessage({
        sender: "assistant",
        content: aiResponse.content,
        metadata: { isEmergency: aiResponse.isEmergency || false }
      });
      this.appendMessageElement(aiMsg, true);

    } catch (err) {
      this.showTypingIndicator(false);
      const errorMsg = await ConversationService.saveMessage({
        sender: "assistant",
        content: "⚠️ I encountered a temporary connection issue while analyzing clinical data. Please try sending your query again.",
        metadata: { isError: true }
      });
      this.appendMessageElement(errorMsg, true);
    }
  },

  showTypingIndicator(show) {
    if (!this.typingIndicator) return;
    if (show) {
      this.typingIndicator.classList.remove('hidden');
      this.scrollToBottom();
    } else {
      this.typingIndicator.classList.add('hidden');
    }
  },

  scrollToBottom() {
    if (!this.messagesContainer) return;
    setTimeout(() => {
      this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }, 40);
  },

  escapeHTML(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  },

  formatMarkdown(text) {
    if (!text) return "";
    let html = text;

    html = html.replace(/^### (.*$)/gim, '<h3 class="text-base font-bold text-slate-900 mt-2 mb-1.5 flex items-center gap-1.5">$1</h3>');
    html = html.replace(/^#### (.*$)/gim, '<h4 class="text-sm font-semibold text-slate-800 mt-2 mb-1">$1</h4>');

    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-teal-900">$1</strong>');
    
    html = html.replace(/\*(.*?)\*/g, '<em class="italic text-slate-600">$1</em>');
    html = html.replace(/_(.*?)_/g, '<em class="italic text-slate-600">$1</em>');

    html = html.replace(/^\s*-\s+(.*)$/gim, '<li class="ml-4 list-disc text-slate-700 text-sm mb-1">$1</li>');
    html = html.replace(/^\s*(\d+)\.\s+(.*)$/gim, '<li class="ml-4 list-decimal text-slate-700 text-sm mb-1">$2</li>');

    html = html.replace(/(<li class="ml-4 list-disc[^>]*>.*?<\/li>\s*)+/g, '<ul class="my-2 space-y-1">$&</ul>');
    html = html.replace(/(<li class="ml-4 list-decimal[^>]*>.*?<\/li>\s*)+/g, '<ol class="my-2 space-y-1">$&</ol>');

    html = html.split('\n\n').map(p => {
      if (p.startsWith('<h3') || p.startsWith('<h4') || p.startsWith('<ul') || p.startsWith('<ol')) {
        return p;
      }
      return `<p class="mb-2 text-slate-700 leading-relaxed text-sm sm:text-base">${p.replace(/\n/g, '<br/>')}</p>`;
    }).join('');

    return html;
  }
};

// Initialize on assistant page load
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('chatMessagesContainer')) {
    AssistantUI.init();
    window.AssistantUI = AssistantUI;
  }
});
