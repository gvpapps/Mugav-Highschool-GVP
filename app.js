/**
 * ==========================================================================
 * शालेय पोषण आहार (MDM) Application Core Controller & Engine
 * ==========================================================================
 */

const STORAGE_KEY = 'MDM_APP_DATA_V1';

const app = {

  // सुरक्षित कूटबद्ध ॲक्टिव्हेशन हॅश (SHA-256 Hashes - पासवर्ड कुठेही सेव्ह किंवा डिस्प्ले होत नाही)
  ACTIVATION_HASHES: {
    'a331a544e0a77f6a3e0c0935dd56fef48307b8700fc8d0d1cd20fda0d5951b6b': { days: 30, type: 'demo', name: '1 महिना डेमो (30 दिवस)' },
    'd1d165a6b5f47b3af08842db98701f1c1750ba95913f58a1d582c21305a9cc3d': { days: 365, type: 'yearly', name: '1 वर्ष पूर्ण परवाना (365 दिवस)' }
  },

  // सुरक्षित शाळा डिलीट PIN हॅश (SHA-256 Hash - PIN: Ican@123)
  DELETE_PIN_HASH: 'af9470302e8ae1d23fdc6dbf798c547270eda21c7e960719e2633b6613644805',

  ACTIVATION_STORAGE_KEY: 'MDM_ACTIVATION_DATA',
  ACTIVE_UDISE_STORAGE_KEY: 'MDM_CURRENT_UDISE',
  REGISTERED_SCHOOLS_KEY: 'MDM_REGISTERED_SCHOOLS',

  // Current Active Tab
  currentTab: 'daily',

  // Current Active Section ('primary' = इ. १ ते ५, 'upper' = इ. ६ ते ८)
  activeSection: 'primary',

  // Master Data Model
  data: {
    settings: {
      schoolName: "रा.जि.प. प्राथमिक शाळा मेंगाळवाडी",
      udise: "27240304501",
      centre: "खांडस",
      taluka: "कर्जत",
      district: "रायगड",
      headmaster: "श्री. सचिव / मुख्याध्यापक",
      assistantTeacher: "श्री. सहशिक्षक",
      president: "श्री. अध्यक्ष (शा. व्य. स.)",
      cookName: "सौ. स्वयंपाकी / मदतनीस",
      schoolLevel: 'both', // 'both' | 'primary' | 'upper'
      pat: 9,              // backwards compatible
      patPrimary: 9,
      patUpper: 15,
      fuelRate: 1.51,      // backwards compatible
      fuelRatePrimary: 1.51,
      fuelRateUpper: 2.17,
      cookHonorarium: 2500,
      cookCount: 1
    },

    // Master Ingredients & Per-Child Rates (1-5 Primary & 6-8 Upper Primary)
    ingredients: {
      rice: { id: "rice", name: "तांदूळ", defaultRate: 0.10, ratePrimary: 0.10, rateUpper: 0.15, unit: "kg", category: "grain" },
      moong_dal: { id: "moong_dal", name: "मुगडाळ", defaultRate: 0.02, ratePrimary: 0.02, rateUpper: 0.03, unit: "kg", category: "pulse" },
      tur_dal: { id: "tur_dal", name: "तूरडाळ", defaultRate: 0.02, ratePrimary: 0.02, rateUpper: 0.03, unit: "kg", category: "pulse" },
      masoor_dal: { id: "masoor_dal", name: "मसूरडाळ", defaultRate: 0.02, ratePrimary: 0.02, rateUpper: 0.03, unit: "kg", category: "pulse" },
      matki: { id: "matki", name: "मटकी", defaultRate: 0.02, ratePrimary: 0.02, rateUpper: 0.03, unit: "kg", category: "pulse" },
      moong: { id: "moong", name: "मूग", defaultRate: 0.02, ratePrimary: 0.02, rateUpper: 0.03, unit: "kg", category: "pulse" },
      chavali: { id: "chavali", name: "चवळी", defaultRate: 0.02, ratePrimary: 0.02, rateUpper: 0.03, unit: "kg", category: "pulse" },
      chana: { id: "chana", name: "हरभरा", defaultRate: 0.02, ratePrimary: 0.02, rateUpper: 0.03, unit: "kg", category: "pulse" },
      vatana: { id: "vatana", name: "वाटाणा", defaultRate: 0.02, ratePrimary: 0.02, rateUpper: 0.03, unit: "kg", category: "pulse" },
      cumin: { id: "cumin", name: "जिरे", defaultRate: 0.00020, ratePrimary: 0.00020, rateUpper: 0.00030, unit: "kg", category: "spice" },
      mustard: { id: "mustard", name: "मोहरी", defaultRate: 0.00015, ratePrimary: 0.00015, rateUpper: 0.000225, unit: "kg", category: "spice" },
      turmeric: { id: "turmeric", name: "हळद", defaultRate: 0.00015, ratePrimary: 0.00015, rateUpper: 0.000225, unit: "kg", category: "spice" },
      chilli: { id: "chilli", name: "मिरची पावडर", defaultRate: 0.00300, ratePrimary: 0.00300, rateUpper: 0.00450, unit: "kg", category: "spice" },
      oil: { id: "oil", name: "सोयाबीन तेल", defaultRate: 0.00500, ratePrimary: 0.00500, rateUpper: 0.00750, unit: "kg", category: "oil" },
      salt: { id: "salt", name: "मीठ", defaultRate: 0.00070, ratePrimary: 0.00070, rateUpper: 0.00105, unit: "kg", category: "salt" },
      masala: { id: "masala", name: "कांदा-लसून मसाला", defaultRate: 0.00090, ratePrimary: 0.00090, rateUpper: 0.00135, unit: "kg", category: "spice" },
      soyavadi: { id: "soyavadi", name: "सोयावडी", defaultRate: 0.02, ratePrimary: 0.02, rateUpper: 0.03, unit: "kg", category: "pulse" }
    },

    // Master Menus & Associated Ingredients (4-Week Cyclic Timetable)
    menus: [
      { id: "veg_pulav", name: "व्हेजिटेबल पुलाव", pulseKey: "vatana", dayCode: 2, dayName: "सोमवार (आठवडा 1, 3)" },
      { id: "moong_khichdi", name: "मूगडाळ खिचडी", pulseKey: "moong_dal", dayCode: 3, dayName: "मंगळवार / शुक्रवार" },
      { id: "moog_shevga_varan", name: "मूग शेवग्याचे वरण", pulseKey: "tur_dal", pulseKeys: ["moong", "tur_dal"], pulseSplit: { moong: 0.010, tur_dal: 0.010 }, dayCode: 4, dayName: "बुधवार" },
      { id: "chavali_khichdi", name: "चवळी खिचडी", pulseKey: "chavali", dayCode: 5, dayName: "गुरुवार (आठवडा 1, 3)" },
      { id: "matki_usal", name: "मटकी उसळभात", pulseKey: "matki", dayCode: 6, dayName: "शुक्रवार / शनिवार" },
      { id: "masale_bhat", name: "मसालेभात", pulseKey: "tur_dal", dayCode: 7, dayName: "शनिवार (आठवडा 1, 3)" },
      { id: "soya_pulav", name: "सोयाबीन पुलाव", pulseKey: "soyavadi", dayCode: 2, dayName: "सोमवार (आठवडा 2, 4)" },
      { id: "masoori_pulav", name: "मसूरी पुलाव", pulseKey: "masoor_dal", dayCode: 3, dayName: "मंगळवार (आठवडा 2, 4)" },
      { id: "matar_pulav", name: "मटार पुलाव", pulseKey: "vatana", dayCode: 5, dayName: "गुरुवार (आठवडा 2, 4)" },
      { id: "god_bhat", name: "गोड भात", pulseKey: "nil", dayCode: 0, dayName: "विशेष मेन्यू" },
      { id: "non_veg", name: "नॉन व्हेज / पूरक आहार", pulseKey: "nil", dayCode: 0, dayName: "विशेष मेन्यू" },
      { id: "varan_bhat", name: "वरणभात", pulseKey: "tur_dal", dayCode: 0, dayName: "विशेष मेन्यू" },
      { id: "holiday", name: "सुट्टी", pulseKey: null, dayCode: 0, dayName: "सुट्टी" }
    ],

    // Baseline Opening Stock from Official Excel (इ. १ ते ५)
    initialStock: {
      rice: 160.6,
      moong_dal: 8.68,
      tur_dal: 2.82,
      masoor_dal: 18.54,
      matki: 11.76,
      moong: 0.0,
      chavali: 0.0,
      chana: 0.0,
      vatana: 15.14,
      cumin: 3.011,
      mustard: 3.224,
      turmeric: 3.233,
      chilli: 0.0,
      oil: 12.875,
      salt: 8.85,
      masala: 3.24,
      soyavadi: 0.0
    },

    // Baseline Opening Stock for Upper Primary (इ. ६ ते ८)
    initialStockUpper: {
      rice: 100.0,
      moong_dal: 6.0,
      tur_dal: 5.0,
      masoor_dal: 10.0,
      matki: 8.0,
      moong: 0.0,
      chavali: 0.0,
      chana: 0.0,
      vatana: 10.0,
      cumin: 2.0,
      mustard: 2.0,
      turmeric: 2.0,
      chilli: 0.0,
      oil: 10.0,
      salt: 6.0,
      masala: 2.5,
      soyavadi: 0.0
    },

    // Received Stock Transactions (इ. १ ते ५)
    stockReceipts: [],

    // Received Stock Transactions (इ. ६ ते ८)
    stockReceiptsUpper: [],

    // Damaged Stock Transactions (इ. १ ते ५)
    damagedStock: [],

    // Damaged Stock Transactions (इ. ६ ते ८)
    damagedStockUpper: [],

    // Daily Records keyed by 'YYYY-MM-DD' (इ. १ ते ५)
    records: {},

    // Daily Records keyed by 'YYYY-MM-DD' (इ. ६ ते ८)
    recordsUpper: {},

    // Taste Register Records (इ. १ ते ५)
    tasteRecords: {},

    // Taste Register Records (इ. ६ ते ८)
    tasteRecordsUpper: {},

    // Custom Demands for Form B (इ. १ ते ५)
    customDemands: {},

    // Custom Demands for Form B (इ. ६ ते ८)
    customDemandsUpper: {},

    // Sample data initialized flag
    initialSampleLoaded: false
  },

  /**
   * Initialize Application
   */
  init() {
    this.loadState();
    this.populateInitialSampleDataIfEmpty();
    this.setupDatePickers();
    this.populateMenuDropdown();
    this.bindEvents();
    this.initCalcTableVisibility();
    this.refreshAllViews();
    this.renderCurrentTab();
    
    // Check Access Control (Activation Screen & School UDISE Login)
    this.checkAccessControl();

    // Initialize Real-time Cloud Synchronization
    if (typeof cloudSync !== 'undefined') {
      cloudSync.init();
    }

    // Auto-run test suite in background to verify correctness
    testSuite.runAllTests();
  },

  // =========================================================================
  // DUAL SECTION (१-५ प्राथमिक व ६-८ उच्च प्राथमिक) HELPERS & ROUTING
  // =========================================================================

  /**
   * Get active section ('primary' or 'upper')
   */
  getActiveSection() {
    return this.activeSection || 'primary';
  },

  /**
   * Get human readable active section name in Marathi
   */
  getActiveSectionName(section = this.activeSection) {
    return (section === 'upper') ? 'इयत्ता ६ ते ८ (उच्च प्राथमिक)' : 'इयत्ता १ ते ५ (प्राथमिक)';
  },

  /**
   * Switch between Primary (1-5) and Upper Primary (6-8) sections
   */
  switchSection(section) {
    if (section !== 'primary' && section !== 'upper') return;
    this.activeSection = section;

    // 1. Add state class to body for global theme accents
    if (document.body) {
      document.body.classList.remove('section-primary-active', 'section-upper-active');
      document.body.classList.add(section === 'upper' ? 'section-upper-active' : 'section-primary-active');
    }

    // 2. Update active state on all section toggle buttons in the UI with tactile bounce animation
    document.querySelectorAll('.section-toggle-btn, .section-switcher-btn, .btn-section-toggle').forEach(btn => {
      const isTarget = btn.dataset.section === section;
      btn.classList.toggle('active', isTarget);
      if (isTarget) {
        btn.classList.add('section-click-bounce');
        setTimeout(() => btn.classList.remove('section-click-bounce'), 450);
      }
    });

    // 3. Update Daily Section Ribbon accent theme
    const dailyRibbon = document.getElementById('dailySectionRibbon') || document.querySelector('.daily-section-ribbon');
    if (dailyRibbon) {
      dailyRibbon.classList.remove('ribbon-theme-primary', 'ribbon-theme-upper');
      dailyRibbon.classList.add(section === 'upper' ? 'ribbon-theme-upper' : 'ribbon-theme-primary');
    }

    // 4. Update Daily Entry Form Card Title with prominent section badge and pat
    const entryTitle = document.getElementById('dailyEntryCardTitle');
    const patP = this.getActivePat('primary');
    const patU = this.getActivePat('upper');
    if (entryTitle) {
      if (section === 'upper') {
        entryTitle.innerHTML = `🎓 <strong style="color: #1d4ed8;">इ. ६ ते ८ दैनिक उपस्थिती व मेनू</strong> <span class="badge" style="background:#dbeafe; color:#1e40af; font-size:0.75rem; padding: 2px 7px; border-radius: 6px; font-weight: 800;">पट: ${patU} मुले</span>`;
      } else {
        entryTitle.innerHTML = `🎒 <strong style="color: #166534;">इ. १ ते ५ दैनिक उपस्थिती व मेनू</strong> <span class="badge" style="background:#dcfce7; color:#166534; font-size:0.75rem; padding: 2px 7px; border-radius: 6px; font-weight: 800;">पट: ${patP} मुले</span>`;
      }
    }

    // 5. Subtle haptic feedback for mobile
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try { navigator.vibrate(30); } catch(e) {}
    }

    // 6. Update header meta badges
    this.updateHeaderMeta();

    // 7. Re-render current tab view with newly active section
    this.renderCurrentTab();

    if (this.currentTab === 'daily') {
      this.onDateChanged();
      this.renderQuickAttendanceChips();
    }

    const currentPat = (section === 'upper') ? patU : patP;
    const secName = (section === 'upper') ? '🎓 इ. ६ ते ८ (उच्च प्राथमिक)' : '🎒 इ. १ ते ५ (प्राथमिक)';
    this.showToast(`🎯 विभाग निवडला: ${secName} (पट: ${currentPat})`, 'info');
  },

  /**
   * Get Pat count for the active (or specified) section
   */
  getActivePat(section = this.activeSection) {
    if (!this.data || !this.data.settings) return 9;
    if (section === 'upper') {
      return parseInt(this.data.settings.patUpper) || 15;
    }
    return parseInt(this.data.settings.patPrimary !== undefined ? this.data.settings.patPrimary : this.data.settings.pat) || 9;
  },

  /**
   * Get Fuel rate for the active (or specified) section
   */
  getActiveFuelRate(section = this.activeSection) {
    if (!this.data || !this.data.settings) return 1.51;
    if (section === 'upper') {
      return parseFloat(this.data.settings.fuelRateUpper) || 2.17;
    }
    return parseFloat(this.data.settings.fuelRatePrimary !== undefined ? this.data.settings.fuelRatePrimary : this.data.settings.fuelRate) || 1.51;
  },

  /**
   * Get Ingredient Grammage Rate (kg per student) for active or specified section
   */
  getIngredientRate(key, section = this.activeSection) {
    const ing = this.data && this.data.ingredients && this.data.ingredients[key];
    if (!ing) return 0;
    if (section === 'upper') {
      if (ing.rateUpper !== undefined) return ing.rateUpper;
      if (key === 'rice') return 0.15;
      if (ing.category === 'pulse') return 0.03;
      if (key === 'oil') return 0.0075;
      return +(ing.defaultRate * 1.5).toFixed(6);
    }
    return ing.ratePrimary !== undefined ? ing.ratePrimary : (ing.defaultRate || 0);
  },

  /**
   * Get active daily records dictionary ({ [dateStr]: record })
   */
  getActiveRecords(section = this.activeSection) {
    if (section === 'upper') {
      if (!this.data.recordsUpper) this.data.recordsUpper = {};
      return this.data.recordsUpper;
    }
    if (!this.data.records) this.data.records = {};
    return this.data.records;
  },

  /**
   * Get active taste records dictionary
   */
  getActiveTasteRecords(section = this.activeSection) {
    if (section === 'upper') {
      if (!this.data.tasteRecordsUpper) this.data.tasteRecordsUpper = {};
      return this.data.tasteRecordsUpper;
    }
    if (!this.data.tasteRecords) this.data.tasteRecords = {};
    return this.data.tasteRecords;
  },

  /**
   * Get active opening stock
   */
  getActiveInitialStock(section = this.activeSection) {
    if (section === 'upper') {
      if (!this.data.initialStockUpper) this.data.initialStockUpper = {};
      return this.data.initialStockUpper;
    }
    if (!this.data.initialStock) this.data.initialStock = {};
    return this.data.initialStock;
  },

  /**
   * Get active stock receipts
   */
  getActiveReceipts(section = this.activeSection) {
    if (section === 'upper') {
      if (!this.data.stockReceiptsUpper) this.data.stockReceiptsUpper = [];
      return this.data.stockReceiptsUpper;
    }
    if (!this.data.stockReceipts) this.data.stockReceipts = [];
    return this.data.stockReceipts;
  },

  /**
   * Get active damaged stock
   */
  getActiveDamaged(section = this.activeSection) {
    if (section === 'upper') {
      if (!this.data.damagedStockUpper) this.data.damagedStockUpper = [];
      return this.data.damagedStockUpper;
    }
    if (!this.data.damagedStock) this.data.damagedStock = [];
    return this.data.damagedStock;
  },

  /**
   * Get active custom demands for Form B
   */
  getActiveCustomDemands(section = this.activeSection) {
    if (section === 'upper') {
      if (!this.data.customDemandsUpper) this.data.customDemandsUpper = {};
      return this.data.customDemandsUpper;
    }
    if (!this.data.customDemands) this.data.customDemands = {};
    return this.data.customDemands;
  },

  // =========================================================================
  // MULTI-SCHOOL (MULTI-TENANT) DATA MANAGEMENT & REGISTRY
  // =========================================================================

  /**
   * Dynamic local storage key per school UDISE
   */
  getSchoolStorageKey(udise) {
    const clean = String(udise || '27240304501').trim().replace(/[^a-zA-Z0-9_-]/g, '_');
    return `MDM_SCHOOL_DATA_${clean}`;
  },

  /**
   * Dedicated backup vault key per school UDISE
   */
  getSchoolBackupKey(udise) {
    const clean = String(udise || '27240304501').trim().replace(/[^a-zA-Z0-9_-]/g, '_');
    return `MDM_SCHOOL_BACKUP_${clean}`;
  },

  /**
   * Get active UDISE
   */
  getActiveUdise() {
    return String(
      (this.data && this.data.settings && this.data.settings.udise)
      || localStorage.getItem(this.ACTIVE_UDISE_STORAGE_KEY)
      || '27240304501'
    ).trim();
  },

  /**
   * Get registered schools list from device storage
   */
  getRegisteredSchools() {
    try {
      const raw = localStorage.getItem(this.REGISTERED_SCHOOLS_KEY);
      if (raw !== null) {
        const list = JSON.parse(raw);
        if (Array.isArray(list)) return list;
      }
    } catch (e) {
      console.warn("Could not read registered schools:", e);
    }
    const defaultList = [
      {
        udise: "27240304501",
        schoolName: (this.data && this.data.settings && this.data.settings.schoolName) || "रा.जि.प. प्राथमिक शाळा मेंगाळवाडी",
        centre: (this.data && this.data.settings && this.data.settings.centre) || "खांडस",
        taluka: (this.data && this.data.settings && this.data.settings.taluka) || "कर्जत",
        district: (this.data && this.data.settings && this.data.settings.district) || "रायगड",
        pat: (this.data && this.data.settings && this.data.settings.pat) || 9,
        lastActive: new Date().toISOString()
      }
    ];
    try {
      localStorage.setItem(this.REGISTERED_SCHOOLS_KEY, JSON.stringify(defaultList));
    } catch (e) {}
    return defaultList;
  },

  /**
   * Register or update school in the device registry
   */
  registerSchool(schoolInfo) {
    if (!schoolInfo || !schoolInfo.udise) return;
    const cleanUdise = String(schoolInfo.udise).trim();
    if (cleanUdise.length !== 11) return;

    const list = this.getRegisteredSchools();
    const idx = list.findIndex(s => s.udise === cleanUdise);
    const updated = {
      udise: cleanUdise,
      schoolName: schoolInfo.schoolName || (cleanUdise === '27240304501' ? 'रा.जि.प. प्राथमिक शाळा मेंगाळवाडी' : `शाळा (${cleanUdise})`),
      centre: schoolInfo.centre || 'खांडस',
      taluka: schoolInfo.taluka || 'कर्जत',
      district: schoolInfo.district || 'रायगड',
      pat: parseInt(schoolInfo.pat) || 9,
      lastActive: new Date().toISOString()
    };

    if (idx >= 0) {
      list[idx] = Object.assign({}, list[idx], updated);
    } else {
      list.unshift(updated);
    }
    try {
      localStorage.setItem(this.REGISTERED_SCHOOLS_KEY, JSON.stringify(list));
    } catch (e) {}
  },

  /**
   * Open Delete School Modal with PIN verification
   */
  openDeleteSchoolModal(udise) {
    if (!udise) return;
    const cleanUdise = String(udise).trim();
    const list = this.getRegisteredSchools();
    const school = list.find(s => s.udise === cleanUdise);
    const name = school ? school.schoolName : `शाळा (${cleanUdise})`;

    const targetUdiseInp = document.getElementById('deleteSchoolTargetUdise');
    const nameDisplay = document.getElementById('deleteSchoolTargetName');
    const udiseDisplay = document.getElementById('deleteSchoolTargetCode');
    const pinInp = document.getElementById('deleteSchoolPinInput');
    const alertBox = document.getElementById('deleteSchoolAlert');

    if (targetUdiseInp) targetUdiseInp.value = cleanUdise;
    if (nameDisplay) nameDisplay.textContent = name;
    if (udiseDisplay) udiseDisplay.textContent = cleanUdise;
    if (pinInp) {
      pinInp.value = '';
      pinInp.classList.remove('is-invalid');
    }
    if (alertBox) {
      alertBox.textContent = '';
      alertBox.classList.add('d-none');
    }

    const modal = document.getElementById('deleteSchoolModal');
    if (modal) {
      modal.style.display = 'flex';
      if (pinInp) setTimeout(() => pinInp.focus(), 200);
    } else {
      // Fallback for headless environments
      const enteredPin = prompt(`⚠️ शाळा '${name}' डिलीट करण्यासाठी सुरक्षा PIN टाका:`);
      if (enteredPin) {
        this.deleteSchool(cleanUdise, enteredPin);
      }
    }
  },

  /**
   * Close Delete School Modal and wipe PIN
   */
  closeDeleteSchoolModal() {
    const pinInp = document.getElementById('deleteSchoolPinInput');
    if (pinInp) pinInp.value = '';
    const modal = document.getElementById('deleteSchoolModal');
    if (modal) modal.style.display = 'none';
  },

  /**
   * Confirm PIN and execute deletion
   */
  confirmDeleteSchool() {
    const targetUdiseInp = document.getElementById('deleteSchoolTargetUdise');
    const pinInp = document.getElementById('deleteSchoolPinInput');
    const alertBox = document.getElementById('deleteSchoolAlert');

    const udise = targetUdiseInp ? targetUdiseInp.value.trim() : '';
    const pin = pinInp ? pinInp.value.trim() : '';

    if (pinInp) pinInp.value = ''; // Never keep PIN in DOM

    if (!pin) {
      if (alertBox) {
        alertBox.textContent = '❌ कृपया शाळा डिलीट करण्यासाठी सुरक्षा PIN प्रविष्ट करा.';
        alertBox.classList.remove('d-none');
      }
      if (pinInp) {
        pinInp.classList.add('is-invalid');
        pinInp.focus();
      }
      return false;
    }

    if (this.sha256(pin) !== this.DELETE_PIN_HASH) {
      if (alertBox) {
        alertBox.textContent = '❌ चुकीचा सुरक्षा PIN! शाळा डिलीट करता येणार नाही.';
        alertBox.classList.remove('d-none');
      }
      if (pinInp) {
        pinInp.classList.add('is-invalid');
        pinInp.focus();
      }
      return false;
    }

    // PIN is correct! Close modal and execute deletion
    this.closeDeleteSchoolModal();
    return this.executeDeleteSchool(udise);
  },

  /**
   * Execute permanent school deletion: removes storage bucket, backup, and registry entry
   */
  executeDeleteSchool(udise) {
    if (!udise) return false;
    const cleanUdise = String(udise).trim();
    const list = this.getRegisteredSchools();
    const school = list.find(s => s.udise === cleanUdise);
    const name = school ? school.schoolName : `शाळा (${cleanUdise})`;

    const activeUdise = this.getActiveUdise();
    const isDeletingActive = (activeUdise === cleanUdise);

    // 1. Remove storage data and backups
    localStorage.removeItem(this.getSchoolStorageKey(cleanUdise));
    localStorage.removeItem(this.getSchoolBackupKey(cleanUdise));

    // 2. Remove from registry
    let updatedList = list.filter(s => s.udise !== cleanUdise);
    localStorage.setItem(this.REGISTERED_SCHOOLS_KEY, JSON.stringify(updatedList));

    this.showToast(`🗑️ '${name}' शाळा यशस्वीरित्या डिलीट केली.`, 'info');

    // 3. If currently active school was deleted
    if (isDeletingActive) {
      localStorage.removeItem(this.ACTIVE_UDISE_STORAGE_KEY);
      if (this.data && this.data.settings) {
        this.data.settings.udise = '';
      }
      this.closeSchoolSwitcherModal();
      if (updatedList.length > 0) {
        // Switch to the first available school without re-saving deleted school
        this.loginSchool(updatedList[0].udise);
      } else {
        // Return to login screen
        this.checkAccessControl();
      }
    } else {
      this.renderRegisteredSchoolsList();
    }
    return true;
  },

  /**
   * Delete school method with optional PIN verification
   * If PIN not passed, opens PIN prompt modal
   */
  deleteSchool(udise, pin = null) {
    if (!udise) return false;
    if (pin !== null) {
      if (this.sha256(String(pin).trim()) !== this.DELETE_PIN_HASH) {
        this.showToast('❌ चुकीचा सुरक्षा PIN!', 'danger');
        return false;
      }
      return this.executeDeleteSchool(udise);
    }
    this.openDeleteSchoolModal(udise);
    return true;
  },

  /**
   * Alias for backwards compatibility
   */
  removeRegisteredSchool(udise) {
    this.deleteSchool(udise);
  },

  /**
   * Open Edit School Modal
   */
  openEditSchoolModal(udise) {
    if (!udise) return;
    const cleanUdise = String(udise).trim();
    const list = this.getRegisteredSchools();
    const school = list.find(s => s.udise === cleanUdise);
    if (!school) return;

    // Populate modal inputs
    const originalUdiseInp = document.getElementById('editSchoolOriginalUdise');
    const nameInp = document.getElementById('editSchoolName');
    const udiseInp = document.getElementById('editSchoolUdise');
    const centreInp = document.getElementById('editSchoolCentre');
    const talukaInp = document.getElementById('editSchoolTaluka');
    const districtInp = document.getElementById('editSchoolDistrict');
    const patInp = document.getElementById('editSchoolPat');
    const alertBox = document.getElementById('editSchoolAlert');

    if (originalUdiseInp) originalUdiseInp.value = cleanUdise;
    if (nameInp) nameInp.value = school.schoolName || '';
    if (udiseInp) udiseInp.value = cleanUdise;
    if (centreInp) centreInp.value = school.centre || '';
    if (talukaInp) talukaInp.value = school.taluka || '';
    if (districtInp) districtInp.value = school.district || '';
    if (patInp) patInp.value = school.pat || 9;
    if (alertBox) {
      alertBox.textContent = '';
      alertBox.classList.add('d-none');
    }

    const modal = document.getElementById('editSchoolModal');
    if (modal) modal.style.display = 'flex';
  },

  /**
   * Close Edit School Modal
   */
  closeEditSchoolModal() {
    const modal = document.getElementById('editSchoolModal');
    if (modal) modal.style.display = 'none';
  },

  /**
   * Save Edited School details
   */
  saveEditedSchool() {
    const originalUdise = (document.getElementById('editSchoolOriginalUdise') ? document.getElementById('editSchoolOriginalUdise').value : '').trim();
    const name = (document.getElementById('editSchoolName') ? document.getElementById('editSchoolName').value : '').trim();
    const newUdise = (document.getElementById('editSchoolUdise') ? document.getElementById('editSchoolUdise').value : '').trim();
    const centre = (document.getElementById('editSchoolCentre') ? document.getElementById('editSchoolCentre').value : '').trim();
    const taluka = (document.getElementById('editSchoolTaluka') ? document.getElementById('editSchoolTaluka').value : '').trim();
    const district = (document.getElementById('editSchoolDistrict') ? document.getElementById('editSchoolDistrict').value : '').trim();
    const pat = parseInt(document.getElementById('editSchoolPat') ? document.getElementById('editSchoolPat').value : '9') || 9;
    const alertBox = document.getElementById('editSchoolAlert');

    if (!name) {
      if (alertBox) {
        alertBox.textContent = '❌ कृपया शाळेचे नाव प्रविष्ट करा.';
        alertBox.classList.remove('d-none');
      }
      return false;
    }

    if (!/^\d{11}$/.test(newUdise)) {
      if (alertBox) {
        alertBox.textContent = '❌ UDISE कोड अचूक 11 इंग्रजी अंकांचा असावा (उदा. 27240304501).';
        alertBox.classList.remove('d-none');
      }
      return false;
    }

    // Check if new UDISE collides with another existing school
    if (newUdise !== originalUdise) {
      const list = this.getRegisteredSchools();
      if (list.some(s => s.udise === newUdise)) {
        if (alertBox) {
          alertBox.textContent = `❌ या UDISE (${newUdise}) सह आधीच दुसरी शाळा यादीत अस्तित्वात आहे!`;
          alertBox.classList.remove('d-none');
        }
        return false;
      }

      // Migrate storage bucket from originalUdise to newUdise
      const oldStorageKey = this.getSchoolStorageKey(originalUdise);
      const newStorageKey = this.getSchoolStorageKey(newUdise);
      const oldBackupKey = this.getSchoolBackupKey(originalUdise);
      const newBackupKey = this.getSchoolBackupKey(newUdise);

      const oldData = localStorage.getItem(oldStorageKey);
      if (oldData) {
        try {
          const parsed = JSON.parse(oldData);
          if (parsed.settings) parsed.settings.udise = newUdise;
          localStorage.setItem(newStorageKey, JSON.stringify(parsed));
          localStorage.removeItem(oldStorageKey);
        } catch(e) {}
      }

      const oldBackup = localStorage.getItem(oldBackupKey);
      if (oldBackup) {
        try {
          const parsedB = JSON.parse(oldBackup);
          if (parsedB.settings) parsedB.settings.udise = newUdise;
          localStorage.setItem(newBackupKey, JSON.stringify(parsedB));
          localStorage.removeItem(oldBackupKey);
        } catch(e) {}
      }

      // If this was active school, update active UDISE pointer
      if (this.getActiveUdise() === originalUdise) {
        localStorage.setItem(this.ACTIVE_UDISE_STORAGE_KEY, newUdise);
      }
    }

    // Update the school's local stored data settings
    const targetKey = this.getSchoolStorageKey(newUdise);
    const existingRaw = localStorage.getItem(targetKey);
    let targetData = null;
    if (existingRaw) {
      try { targetData = JSON.parse(existingRaw); } catch(e) {}
    }
    if (!targetData) targetData = this.createDefaultSchoolData(newUdise, name);
    if (!targetData.settings) targetData.settings = {};

    targetData.settings.schoolName = name;
    targetData.settings.udise = newUdise;
    targetData.settings.centre = centre;
    targetData.settings.taluka = taluka;
    targetData.settings.district = district;
    targetData.settings.pat = pat;
    localStorage.setItem(targetKey, JSON.stringify(targetData));

    // Update active in-memory app.data if currently loaded school is this school
    const isCurrentlyActive = (localStorage.getItem(this.ACTIVE_UDISE_STORAGE_KEY) === newUdise) ||
                              (this.data && this.data.settings && (this.data.settings.udise === originalUdise || this.data.settings.udise === newUdise));

    if (isCurrentlyActive) {
      localStorage.setItem(this.ACTIVE_UDISE_STORAGE_KEY, newUdise);
      if (this.data && this.data.settings) {
        this.data.settings.schoolName = name;
        this.data.settings.udise = newUdise;
        this.data.settings.centre = centre;
        this.data.settings.taluka = taluka;
        this.data.settings.district = district;
        this.data.settings.pat = pat;
      }
      this.updateHeaderMeta();
      if (typeof cloudSync !== 'undefined' && cloudSync.onSchoolSwitched) {
        cloudSync.onSchoolSwitched(newUdise);
      }
    }

    // Update registry entry
    let list = this.getRegisteredSchools();
    // Remove old entry if UDISE changed
    if (newUdise !== originalUdise) {
      list = list.filter(s => s.udise !== originalUdise);
    }
    const existingIdx = list.findIndex(s => s.udise === newUdise);
    const schoolEntry = {
      udise: newUdise,
      schoolName: name,
      centre: centre,
      taluka: taluka,
      district: district,
      pat: pat,
      lastActive: new Date().toISOString()
    };
    if (existingIdx >= 0) {
      list[existingIdx] = Object.assign({}, list[existingIdx], schoolEntry);
    } else {
      list.unshift(schoolEntry);
    }
    localStorage.setItem(this.REGISTERED_SCHOOLS_KEY, JSON.stringify(list));

    // Re-render UI
    this.renderRegisteredSchoolsList();
    this.closeEditSchoolModal();
    this.showToast(`🎉 शाळा माहिती यशस्वीरीत्या जतन झाली! (${name})`, 'success');
    return true;
  },

  /**
   * Factory function to create clean default data for an uninitialized school
   */
  createDefaultSchoolData(udise, schoolName = '') {
    return {
      settings: {
        schoolName: schoolName || (udise === '27240304501' ? "रा.जि.प. प्राथमिक शाळा मेंगाळवाडी" : `शाळा (UDISE: ${udise})`),
        udise: udise,
        centre: "खांडस",
        taluka: "कर्जत",
        district: "रायगड",
        headmaster: "श्री. सचिव / मुख्याध्यापक",
        assistantTeacher: "श्री. सहशिक्षक",
        president: "श्री. अध्यक्ष (शा. व्य. स.)",
        cookName: "सौ. स्वयंपाकी / मदतनीस",
        pat: 9,
        fuelRate: 1.51,
        cookHonorarium: 2500,
        cookCount: 1
      },
      ingredients: {
        rice: { id: "rice", name: "तांदूळ", defaultRate: 0.10, unit: "kg", category: "grain" },
        moong_dal: { id: "moong_dal", name: "मुगडाळ", defaultRate: 0.02, unit: "kg", category: "pulse" },
        tur_dal: { id: "tur_dal", name: "तूरडाळ", defaultRate: 0.02, unit: "kg", category: "pulse" },
        masoor_dal: { id: "masoor_dal", name: "मसूरडाळ", defaultRate: 0.02, unit: "kg", category: "pulse" },
        matki: { id: "matki", name: "मटकी", defaultRate: 0.02, unit: "kg", category: "pulse" },
        moong: { id: "moong", name: "मूग", defaultRate: 0.02, unit: "kg", category: "pulse" },
        chavali: { id: "chavali", name: "चवळी", defaultRate: 0.02, unit: "kg", category: "pulse" },
        chana: { id: "chana", name: "हरभरा", defaultRate: 0.02, unit: "kg", category: "pulse" },
        vatana: { id: "vatana", name: "वाटाणा", defaultRate: 0.02, unit: "kg", category: "pulse" },
        cumin: { id: "cumin", name: "जिरे", defaultRate: 0.00020, unit: "kg", category: "spice" },
        mustard: { id: "mustard", name: "मोहरी", defaultRate: 0.00015, unit: "kg", category: "spice" },
        turmeric: { id: "turmeric", name: "हळद", defaultRate: 0.00015, unit: "kg", category: "spice" },
        chilli: { id: "chilli", name: "मिरची पावडर", defaultRate: 0.00300, unit: "kg", category: "spice" },
        oil: { id: "oil", name: "सोयाबीन तेल", defaultRate: 0.00500, unit: "kg", category: "oil" },
        salt: { id: "salt", name: "मीठ", defaultRate: 0.00070, unit: "kg", category: "salt" },
        masala: { id: "masala", name: "कांदा-लसून मसाला", defaultRate: 0.00090, unit: "kg", category: "spice" },
        soyavadi: { id: "soyavadi", name: "सोयावडी", defaultRate: 0.02, unit: "kg", category: "pulse" }
      },
      menus: [
        { id: "veg_pulav", name: "व्हेजिटेबल पुलाव", pulseKey: "vatana", dayCode: 2, dayName: "सोमवार (आठवडा 1, 3)" },
        { id: "moong_khichdi", name: "मूगडाळ खिचडी", pulseKey: "moong_dal", dayCode: 3, dayName: "मंगळवार / शुक्रवार" },
        { id: "moog_shevga_varan", name: "मूग शेवग्याचे वरण", pulseKey: "tur_dal", pulseKeys: ["moong", "tur_dal"], pulseSplit: { moong: 0.010, tur_dal: 0.010 }, dayCode: 4, dayName: "बुधवार" },
        { id: "chavali_khichdi", name: "चवळी खिचडी", pulseKey: "chavali", dayCode: 5, dayName: "गुरुवार (आठवडा 1, 3)" },
        { id: "matki_usal", name: "मटकी उसळभात", pulseKey: "matki", dayCode: 6, dayName: "शुक्रवार / शनिवार" },
        { id: "masale_bhat", name: "मसालेभात", pulseKey: "tur_dal", dayCode: 7, dayName: "शनिवार (आठवडा 1, 3)" },
        { id: "soya_pulav", name: "सोयाबीन पुलाव", pulseKey: "soyavadi", dayCode: 2, dayName: "सोमवार (आठवडा 2, 4)" },
        { id: "masoori_pulav", name: "मसूरी पुलाव", pulseKey: "masoor_dal", dayCode: 3, dayName: "मंगळवार (आठवडा 2, 4)" },
        { id: "matar_pulav", name: "मटार पुलाव", pulseKey: "vatana", dayCode: 5, dayName: "गुरुवार (आठवडा 2, 4)" },
        { id: "god_bhat", name: "गोड भात", pulseKey: "nil", dayCode: 0, dayName: "विशेष मेन्यू" },
        { id: "non_veg", name: "नॉन व्हेज / पूरक आहार", pulseKey: "nil", dayCode: 0, dayName: "विशेष मेन्यू" },
        { id: "varan_bhat", name: "वरणभात", pulseKey: "tur_dal", dayCode: 0, dayName: "विशेष मेन्यू" },
        { id: "holiday", name: "सुट्टी", pulseKey: null, dayCode: 0, dayName: "सुट्टी" }
      ],
      initialStock: {
        rice: (udise === '27240304501' ? 160.6 : 0.0),
        moong_dal: (udise === '27240304501' ? 8.68 : 0.0),
        tur_dal: (udise === '27240304501' ? 2.82 : 0.0),
        masoor_dal: (udise === '27240304501' ? 18.54 : 0.0),
        matki: (udise === '27240304501' ? 11.76 : 0.0),
        moong: 0.0,
        chavali: 0.0,
        chana: 0.0,
        vatana: (udise === '27240304501' ? 15.14 : 0.0),
        cumin: (udise === '27240304501' ? 3.011 : 0.0),
        mustard: (udise === '27240304501' ? 3.224 : 0.0),
        turmeric: (udise === '27240304501' ? 3.233 : 0.0),
        chilli: 0.0,
        oil: (udise === '27240304501' ? 12.875 : 0.0),
        salt: (udise === '27240304501' ? 8.85 : 0.0),
        masala: (udise === '27240304501' ? 3.24 : 0.0),
        soyavadi: 0.0
      },
      stockReceipts: [],
      damagedStock: [],
      records: {},
      tasteRecords: {},
      customDemands: {},
      initialSampleLoaded: (udise === '27240304501')
    };
  },

  /**
   * Switch school directly from Header Quick Switcher
   */
  switchSchoolDirectly(targetUdise) {
    if (!targetUdise || targetUdise.length !== 11) return;
    const current = this.getActiveUdise();
    if (targetUdise === current) {
      this.closeSchoolSwitcherModal();
      return;
    }

    // Save current school first
    this.saveState(true);

    // Set new active UDISE
    localStorage.setItem(this.ACTIVE_UDISE_STORAGE_KEY, targetUdise);

    // Load new school data
    this.loadState(targetUdise);

    // Notify cloud sync
    if (typeof cloudSync !== 'undefined') {
      if (cloudSync.onSchoolSwitched) cloudSync.onSchoolSwitched(targetUdise);
      if (cloudSync.config && cloudSync.config.enabled && cloudSync.config.firebaseUrl) {
        cloudSync.pullFromCloud(true);
      }
    }

    this.closeSchoolSwitcherModal();
    this.checkAccessControl();
    this.refreshAllViews();
    this.renderCurrentTab();
    this.showToast(`🔄 शाळा बदलली: ${this.data.settings.schoolName} (${targetUdise})`, 'success');
  },

  openSchoolSwitcherModal() {
    const modal = document.getElementById('schoolSwitcherModal');
    if (!modal) return;
    this.renderRegisteredSchoolsList();
    modal.style.display = 'flex';
  },

  closeSchoolSwitcherModal() {
    const modal = document.getElementById('schoolSwitcherModal');
    if (modal) modal.style.display = 'none';
  },

  toggleSchoolSwitcherModal() {
    const modal = document.getElementById('schoolSwitcherModal');
    if (!modal) return;
    if (modal.style.display === 'flex') {
      this.closeSchoolSwitcherModal();
    } else {
      this.openSchoolSwitcherModal();
    }
  },

  /**
   * Render registered schools list on login screen and header switcher modal
   */
  renderRegisteredSchoolsList() {
    const list = this.getRegisteredSchools();
    const currentUdise = this.getActiveUdise();

    // 1. Render in School Login Screen (#registeredSchoolsList)
    const loginListEl = document.getElementById('registeredSchoolsList');
    const recentBox = document.getElementById('recentSchoolBox');
    if (recentBox) recentBox.classList.add('d-none'); // superseded by dynamic list

    if (loginListEl) {
      if (!list || list.length === 0) {
        loginListEl.innerHTML = '<div class="text-muted small text-center py-2">कोणतीही शाळा सेव्ह केलेली नाही. खाली 11 अंकी UDISE टाका.</div>';
      } else {
        loginListEl.innerHTML = list.map(s => `
          <div class="school-card-item ${s.udise === currentUdise ? 'active' : ''}">
            <div class="school-card-details">
              <strong class="school-card-name">${s.schoolName}</strong>
              <div class="school-card-meta">
                <span>UDISE: <code>${s.udise}</code></span>
                <span>केंद्र: ${s.centre || 'खांडस'}</span>
                <span>पट: ${s.pat || 9}</span>
              </div>
            </div>
            <div class="school-card-actions">
              <button type="button" class="btn btn-sm btn-outline-primary btn-icon-action" title="शाळा माहिती संपादन करा" onclick="app.openEditSchoolModal('${s.udise}')">
                ✏️ संपादन
              </button>
              <button type="button" class="btn btn-sm btn-outline-danger btn-icon-action" title="शाळा डिलीट करा" onclick="app.deleteSchool('${s.udise}')">
                🗑️ हटवा
              </button>
              <button type="button" class="btn btn-sm btn-success px-3" onclick="app.loginSchool('${s.udise}')">
                प्रवेश करा ⚡
              </button>
            </div>
          </div>
        `).join('');
      }
    }

    // 2. Render in Header Switcher Modal (#schoolSwitcherModalList)
    const modalListEl = document.getElementById('schoolSwitcherModalList');
    if (modalListEl) {
      if (!list || list.length === 0) {
        modalListEl.innerHTML = '<div class="text-muted small text-center py-3">कोणतीही शाळा सेव्ह केलेली नाही.</div>';
      } else {
        modalListEl.innerHTML = list.map(s => {
          const isActive = (s.udise === currentUdise);
          return `
            <div class="school-card-item ${isActive ? 'active' : ''}">
              <div class="school-card-details">
                <div class="d-flex align-items-center gap-2">
                  <strong class="school-card-name">${s.schoolName}</strong>
                  ${isActive ? '<span class="badge bg-success text-white" style="font-size: 0.72rem;">सध्या सक्रिय</span>' : ''}
                </div>
                <div class="school-card-meta">
                  <span>UDISE: <code>${s.udise}</code></span>
                  <span>केंद्र: ${s.centre || 'खांडस'}</span>
                  <span>पट: ${s.pat || 9}</span>
                </div>
              </div>
              <div class="school-card-actions">
                <button type="button" class="btn btn-sm btn-outline-primary btn-icon-action" title="शाळा माहिती संपादन करा" onclick="app.openEditSchoolModal('${s.udise}')">
                  ✏️ संपादन
                </button>
                <button type="button" class="btn btn-sm btn-outline-danger btn-icon-action" title="शाळा डिलीट करा" onclick="app.deleteSchool('${s.udise}')">
                  🗑️ हटवा
                </button>
                ${isActive ? 
                  `<button type="button" class="btn btn-sm btn-outline-secondary" disabled>निवडलेली</button>` : 
                  `<button type="button" class="btn btn-sm btn-outline-primary" onclick="app.switchSchoolDirectly('${s.udise}')">स्विच करा 🔄</button>`
                }
              </div>
            </div>
          `;
        }).join('');
      }
    }
  },

  // =========================================================================
  // ACCESS CONTROL: ACTIVATION & SCHOOL UDISE LOGIN
  // =========================================================================

  /**
   * Get valid activation data from storage if not expired
   */
  getActivationData() {
    try {
      const raw = localStorage.getItem(this.ACTIVATION_STORAGE_KEY);
      if (!raw) return null;
      const data = JSON.parse(raw);
      if (data && data.activated && data.expiryDate && Date.now() < Number(data.expiryDate)) {
        return data;
      }
    } catch (e) {
      console.warn("Error reading activation data:", e);
    }
    return null;
  },

  /**
   * Check access control rules on app load or state transition
   */
  checkAccessControl() {
    const actScreen = document.getElementById('activationScreen');
    const loginScreen = document.getElementById('schoolLoginScreen');
    const appWrapper = document.getElementById('app');

    // 1. Check Activation Status (30-day Demo / 365-day Full License)
    const actData = this.getActivationData();
    if (!actData) {
      if (actScreen) actScreen.style.display = 'flex';
      if (loginScreen) loginScreen.style.display = 'none';
      if (appWrapper) appWrapper.style.display = 'none';
      const pwdInp = document.getElementById('activationPasswordInput');
      if (pwdInp) setTimeout(() => pwdInp.focus(), 200);
      return false;
    }

    // Activation is valid! Hide activation screen
    if (actScreen) actScreen.style.display = 'none';
    const licBadge = document.getElementById('activeLicenseLabel');
    if (licBadge) licBadge.textContent = actData.name || 'सक्रिय';

    // 2. Check School UDISE Login (Direct login without password)
    const activeUdise = localStorage.getItem(this.ACTIVE_UDISE_STORAGE_KEY);
    if (!activeUdise || activeUdise.trim().length !== 11) {
      if (loginScreen) loginScreen.style.display = 'flex';
      if (appWrapper) appWrapper.style.display = 'none';

      // Render recent and registered schools
      this.renderRegisteredSchoolsList();

      // Populate recent school box if previous school data is found
      const prevUdise = (this.data && this.data.settings) ? this.data.settings.udise : '';
      const prevName = (this.data && this.data.settings) ? this.data.settings.schoolName : '';
      const rBox = document.getElementById('recentSchoolBox');
      if (rBox && prevUdise && prevUdise.length === 11) {
        rBox.classList.remove('d-none');
        const rName = document.getElementById('recentSchoolName');
        const rUdise = document.getElementById('recentSchoolUdise');
        if (rName) rName.textContent = prevName || 'शाळा';
        if (rUdise) rUdise.textContent = `UDISE: ${prevUdise}`;
      }

      const uInp = document.getElementById('schoolUdiseInput');
      if (uInp) setTimeout(() => uInp.focus(), 200);
      return false;
    }

    // Both Activation & School UDISE are valid! Show main app!
    if (loginScreen) loginScreen.style.display = 'none';
    if (appWrapper) appWrapper.style.display = 'flex';

    // Sync active UDISE with settings & header badge
    if (this.data && this.data.settings) {
      this.data.settings.udise = activeUdise;
    }
    const hUdise = document.getElementById('headerUdiseCode');
    if (hUdise) hUdise.textContent = activeUdise;

    this.updateHeaderMeta();
    return true;
  },

  /**
   * One-way SHA-256 cryptographic hash (Zero password storage)
   */
  sha256(ascii) {
    function rightRotate(value, amount) { return (value >>> amount) | (value << (32 - amount)); }
    const mathPow = Math.pow; const maxWord = mathPow(2, 32);
    let i, j, result = '', words = [], asciiBitLength = ascii.length * 8, hash = [], k = [], primeCounter = 0, isComposite = {};
    for (let candidate = 2; primeCounter < 64; candidate++) {
      if (!isComposite[candidate]) {
        for (i = 0; i < 313; i += candidate) { isComposite[i] = candidate; }
        hash[primeCounter] = (mathPow(candidate, 0.5) * maxWord) | 0;
        k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
      }
    }
    ascii += '\x80';
    while (ascii.length % 64 - 56) ascii += '\x00';
    for (i = 0; i < ascii.length; i++) {
      j = ascii.charCodeAt(i);
      words[i >> 2] |= j << ((3 - i) % 4) * 8;
    }
    words[words.length] = (asciiBitLength / maxWord) | 0;
    words[words.length] = asciiBitLength;
    for (j = 0; j < words.length;) {
      const w = words.slice(j, j += 16);
      const oldHash = hash;
      hash = hash.slice(0, 8);
      for (i = 0; i < 64; i++) {
        const w15 = w[i - 15], w2 = w[i - 2];
        const a = hash[0], e = hash[4];
        const temp1 = hash[7]
          + (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25))
          + ((e & hash[5]) ^ (~e & hash[6]))
          + k[i]
          + (w[i] = (i < 16) ? w[i] : (
            w[i - 16]
            + (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3))
            + w[i - 7]
            + (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10))
          ) | 0);
        const temp2 = (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22))
          + ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]));
        hash = [(temp1 + temp2) | 0].concat(hash);
        hash[4] = (hash[4] + temp1) | 0;
      }
      for (i = 0; i < 8; i++) { hash[i] = (hash[i] + oldHash[i]) | 0; }
    }
    for (i = 0; i < 8; i++) {
      for (let b = 3; b >= 0; b--) {
        const byte = (hash[i] >> (b * 8)) & 255;
        result += (byte < 16 ? '0' : '') + byte.toString(16);
      }
    }
    return result;
  },

  /**
   * Verify entered activation password using SHA-256 hash comparison
   */
  verifyActivation() {
    const pwdInput = document.getElementById('activationPasswordInput');
    const alertBox = document.getElementById('activationAlert');
    const val = (pwdInput ? pwdInput.value : '').trim();

    // Immediately clear password input from memory & DOM
    if (pwdInput) pwdInput.value = '';

    const inputHash = this.sha256(val);
    const keyConfig = this.ACTIVATION_HASHES[inputHash];
    if (!keyConfig) {
      if (alertBox) {
        alertBox.textContent = '❌ चुकीचा ॲक्टिव्हेशन पासवर्ड! कृपया वैध पासवर्ड प्रविष्ट करा.';
        alertBox.classList.remove('d-none');
      }
      if (pwdInput) {
        pwdInput.classList.add('is-invalid');
        pwdInput.focus();
      }
      return false;
    }

    // Valid hash match! Store only expiration date and license type, NEVER the password!
    const durationMs = keyConfig.days * 24 * 60 * 60 * 1000;
    const expiryDate = Date.now() + durationMs;
    const actData = {
      activated: true,
      activatedAt: Date.now(),
      type: keyConfig.type,
      days: keyConfig.days,
      expiryDate: expiryDate,
      name: keyConfig.name
    };

    localStorage.setItem(this.ACTIVATION_STORAGE_KEY, JSON.stringify(actData));

    if (alertBox) alertBox.classList.add('d-none');
    if (pwdInput) pwdInput.classList.remove('is-invalid');

    this.showToast(`🎉 ॲप यशस्वीरीत्या ॲक्टिव्हेट झाले! (${keyConfig.name})`, 'success');
    this.checkAccessControl();
    return true;
  },

  /**
   * Direct School Login using 11-digit UDISE (No password needed)
   * Supports optional targetUdise argument (e.g. 1-click login from list)
   */
  loginSchool(targetUdise = null) {
    const udiseInput = document.getElementById('schoolUdiseInput');
    const alertBox = document.getElementById('schoolLoginAlert');
    const udise = String(targetUdise || (udiseInput ? udiseInput.value : '')).trim();

    if (!/^\d{11}$/.test(udise)) {
      if (alertBox) {
        alertBox.textContent = '❌ कृपया योग्य 11 अंकी UDISE कोड टाका (उदा. 27240304501).';
        alertBox.classList.remove('d-none');
      }
      if (udiseInput) {
        udiseInput.classList.add('is-invalid');
        udiseInput.focus();
      }
      return false;
    }

    // Save previous state before switching if there was an active school
    const prevActiveUdise = localStorage.getItem(this.ACTIVE_UDISE_STORAGE_KEY);
    if (prevActiveUdise && prevActiveUdise !== udise) {
      this.saveState(true);
    }

    // Save active UDISE
    localStorage.setItem(this.ACTIVE_UDISE_STORAGE_KEY, udise);

    // Load state for this school
    this.loadState(udise);

    // Register school
    this.registerSchool({
      udise: udise,
      schoolName: (this.data && this.data.settings && this.data.settings.schoolName) || '',
      centre: (this.data && this.data.settings && this.data.settings.centre) || '',
      taluka: (this.data && this.data.settings && this.data.settings.taluka) || '',
      district: (this.data && this.data.settings && this.data.settings.district) || '',
      pat: (this.data && this.data.settings && this.data.settings.pat) || 9
    });

    if (alertBox) alertBox.classList.add('d-none');
    if (udiseInput) {
      udiseInput.value = '';
      udiseInput.classList.remove('is-invalid');
      udiseInput.classList.remove('is-valid');
    }

    // Notify cloud sync of school switch
    if (typeof cloudSync !== 'undefined') {
      if (cloudSync.onSchoolSwitched) cloudSync.onSchoolSwitched(udise);
      if (cloudSync.config && cloudSync.config.enabled && cloudSync.config.firebaseUrl) {
        cloudSync.pullFromCloud(true);
      }
    }

    this.showToast(`🎉 शाळा UDISE (${udise}) सह थेट लॉगिन यशस्वी!`, 'success');
    this.checkAccessControl();
    this.refreshAllViews();
    this.renderCurrentTab();
    return true;
  },

  /**
   * Logout current school to allow switching schools (preserves activation)
   */
  logoutSchool() {
    if (confirm("तुम्हाला खात्री आहे का? सध्याच्या शाळेतून (UDISE) लॉगआउट करून नवीन शाळा कोड टाकायचा आहे का?")) {
      this.saveState(true);
      localStorage.removeItem(this.ACTIVE_UDISE_STORAGE_KEY);
      this.showToast('ℹ️ शाळा लॉगआउट झाली. नवीन UDISE टाकून लॉगिन करा.', 'info');
      this.checkAccessControl();
      this.renderRegisteredSchoolsList();
      const uInp = document.getElementById('schoolUdiseInput');
      if (uInp) {
        uInp.value = '';
        uInp.focus();
      }
    }
  },

  /**
   * Quick 1-click login for recent school
   */
  quickLoginRecentSchool() {
    const list = this.getRegisteredSchools();
    if (list && list.length > 0) {
      this.loginSchool(list[0].udise);
      return;
    }
    const prevUdise = (this.data && this.data.settings) ? this.data.settings.udise : '';
    if (prevUdise && prevUdise.length === 11) {
      this.loginSchool(prevUdise);
    }
  },

  /**
   * Real-time digit filter and character count on UDISE input
   */
  onUdiseInput(input) {
    if (!input) return;
    input.value = input.value.replace(/\D/g, '').slice(0, 11);
    const countEl = document.getElementById('udiseDigitCount');
    if (countEl) countEl.textContent = `${input.value.length} / 11`;
    if (input.value.length === 11) {
      input.classList.remove('is-invalid');
      input.classList.add('is-valid');
    } else {
      input.classList.remove('is-valid');
    }
  },

  /**
   * Toggle password input visibility (show / hide)
   */
  togglePasswordVisibility(inputId, iconId) {
    const inp = document.getElementById(inputId);
    const icon = document.getElementById(iconId);
    if (!inp) return;
    if (inp.type === 'password') {
      inp.type = 'text';
      if (icon) icon.textContent = '🙈';
    } else {
      inp.type = 'password';
      if (icon) icon.textContent = '👁️';
    }
  },

  /**
   * Load state from localStorage with multi-school isolation and permanent safety
   */
  loadState(targetUdise = null) {
    try {
      const udise = targetUdise 
        || localStorage.getItem(this.ACTIVE_UDISE_STORAGE_KEY) 
        || (this.data && this.data.settings && this.data.settings.udise) 
        || '27240304501';

      const schoolStorageKey = this.getSchoolStorageKey(udise);
      const schoolBackupKey = this.getSchoolBackupKey(udise);

      let saved = localStorage.getItem(schoolStorageKey);

      // Migration check: If new key not yet created, migrate legacy data if matching udise
      if (!saved) {
        const legacySaved = localStorage.getItem(STORAGE_KEY);
        if (legacySaved) {
          try {
            const parsedLegacy = JSON.parse(legacySaved);
            const legacyUdise = (parsedLegacy.settings && parsedLegacy.settings.udise) || '27240304501';
            if (legacyUdise === udise || udise === '27240304501') {
              saved = legacySaved;
              localStorage.setItem(schoolStorageKey, legacySaved);
            }
          } catch(e) {}
        }
      }

      if (saved) {
        const parsed = JSON.parse(saved);
        this.data.settings = Object.assign({}, this.data.settings, parsed.settings);
        this.data.initialStock = Object.assign({}, this.data.initialStock, parsed.initialStock);
        if (parsed.initialStockUpper) {
          this.data.initialStockUpper = Object.assign({}, this.data.initialStockUpper, parsed.initialStockUpper);
        }
        if (parsed.menus && Array.isArray(parsed.menus) && parsed.menus.length > 0) {
          this.data.menus = parsed.menus;
        }
        if (parsed.ingredients) {
          this.data.ingredients = Object.assign({}, this.data.ingredients, parsed.ingredients);
        }
        this.data.stockReceipts = parsed.stockReceipts || [];
        this.data.stockReceiptsUpper = parsed.stockReceiptsUpper || [];
        this.data.damagedStock = parsed.damagedStock || [];
        this.data.damagedStockUpper = parsed.damagedStockUpper || [];
        this.data.records = parsed.records || {};
        this.data.recordsUpper = parsed.recordsUpper || {};
        this.data.tasteRecords = parsed.tasteRecords || {};
        this.data.tasteRecordsUpper = parsed.tasteRecordsUpper || {};
        this.data.customDemands = parsed.customDemands || {};
        this.data.customDemandsUpper = parsed.customDemandsUpper || {};
        this.data.initialSampleLoaded = (parsed.initialSampleLoaded === true);
      } else {
        // Brand new school with no local data yet!
        const defaultData = this.createDefaultSchoolData(udise);
        this.data.settings = defaultData.settings;
        this.data.ingredients = defaultData.ingredients;
        this.data.menus = defaultData.menus;
        this.data.initialStock = defaultData.initialStock;
        this.data.initialStockUpper = defaultData.initialStockUpper || {};
        this.data.stockReceipts = defaultData.stockReceipts;
        this.data.stockReceiptsUpper = defaultData.stockReceiptsUpper || [];
        this.data.damagedStock = defaultData.damagedStock;
        this.data.damagedStockUpper = defaultData.damagedStockUpper || [];
        this.data.records = defaultData.records;
        this.data.recordsUpper = defaultData.recordsUpper || {};
        this.data.tasteRecords = defaultData.tasteRecords;
        this.data.tasteRecordsUpper = defaultData.tasteRecordsUpper || {};
        this.data.customDemands = defaultData.customDemands;
        this.data.customDemandsUpper = defaultData.customDemandsUpper || {};
        this.data.initialSampleLoaded = defaultData.initialSampleLoaded;
      }

      // Safeguard: Restore from per-school dedicated backup if records are empty
      const savedSchoolBackup = localStorage.getItem(schoolBackupKey);
      if (savedSchoolBackup) {
        try {
          const permSchool = JSON.parse(savedSchoolBackup);
          if (permSchool && permSchool.records && Object.keys(permSchool.records).length > 0 && Object.keys(this.data.records || {}).length === 0) {
            this.data.records = Object.assign({}, permSchool.records, this.data.records);
          }
          if (permSchool && permSchool.recordsUpper && Object.keys(this.data.recordsUpper || {}).length === 0) {
            this.data.recordsUpper = Object.assign({}, permSchool.recordsUpper, this.data.recordsUpper);
          }
          if (permSchool && permSchool.tasteRecords && Object.keys(this.data.tasteRecords || {}).length === 0) {
            this.data.tasteRecords = Object.assign({}, permSchool.tasteRecords, this.data.tasteRecords);
          }
          if (permSchool && permSchool.tasteRecordsUpper && Object.keys(this.data.tasteRecordsUpper || {}).length === 0) {
            this.data.tasteRecordsUpper = Object.assign({}, permSchool.tasteRecordsUpper, this.data.tasteRecordsUpper);
          }
        } catch(e) {}
      } else if (udise === '27240304501') {
        // Fallback to legacy permanent records only for the original default school
        const savedPermRecords = localStorage.getItem('MDM_PERMANENT_RECORDS');
        if (savedPermRecords && Object.keys(this.data.records || {}).length === 0) {
          try {
            const permRecs = JSON.parse(savedPermRecords);
            this.data.records = Object.assign({}, permRecs, this.data.records);
          } catch(e) {}
        }
      }

      if (!this.data.tasteRecords) this.data.tasteRecords = {};
      if (!this.data.tasteRecordsUpper) this.data.tasteRecordsUpper = {};
      if (!this.data.records) this.data.records = {};
      if (!this.data.recordsUpper) this.data.recordsUpper = {};
      if (!this.data.stockReceiptsUpper) this.data.stockReceiptsUpper = [];
      if (!this.data.damagedStockUpper) this.data.damagedStockUpper = [];
      if (!this.data.customDemandsUpper) this.data.customDemandsUpper = {};
      if (!this.data.initialStockUpper) this.data.initialStockUpper = {};
      if (!this.data.settings) this.data.settings = {};

      // Ensure active UDISE is set on settings
      this.data.settings.udise = udise;

      if (this.data.settings.patPrimary === undefined) {
        this.data.settings.patPrimary = this.data.settings.pat || 9;
      }
      if (this.data.settings.patUpper === undefined) {
        this.data.settings.patUpper = 15;
      }
      if (this.data.settings.fuelRatePrimary === undefined) {
        this.data.settings.fuelRatePrimary = this.data.settings.fuelRate || 1.51;
      }
      if (this.data.settings.fuelRateUpper === undefined) {
        this.data.settings.fuelRateUpper = 2.17;
      }
      if (!this.data.settings.schoolLevel) {
        this.data.settings.schoolLevel = 'both';
      }

      if (!this.data.settings.cookHonorarium || this.data.settings.cookHonorarium === 1500) {
        this.data.settings.cookHonorarium = 2500;
      }

      // Ensure all 4-Week Cyclic Timetable menus exist and have proper pulseSplit
      const officialWeeklyMenus = [
        { id: "veg_pulav", name: "व्हेजिटेबल पुलाव", pulseKey: "vatana", dayCode: 2, dayName: "सोमवार (आठवडा 1, 3)" },
        { id: "moong_khichdi", name: "मूगडाळ खिचडी", pulseKey: "moong_dal", dayCode: 3, dayName: "मंगळवार / शुक्रवार" },
        { id: "moog_shevga_varan", name: "मूग शेवग्याचे वरण", pulseKey: "tur_dal", pulseKeys: ["moong", "tur_dal"], pulseSplit: { moong: 0.010, tur_dal: 0.010 }, dayCode: 4, dayName: "बुधवार" },
        { id: "chavali_khichdi", name: "चवळी खिचडी", pulseKey: "chavali", dayCode: 5, dayName: "गुरुवार (आठवडा 1, 3)" },
        { id: "matki_usal", name: "मटकी उसळभात", pulseKey: "matki", dayCode: 6, dayName: "शुक्रवार / शनिवार" },
        { id: "masale_bhat", name: "मसालेभात", pulseKey: "tur_dal", dayCode: 7, dayName: "शनिवार (आठवडा 1, 3)" },
        { id: "soya_pulav", name: "सोयाबीन पुलाव", pulseKey: "soyavadi", dayCode: 2, dayName: "सोमवार (आठवडा 2, 4)" },
        { id: "masoori_pulav", name: "मसूरी पुलाव", pulseKey: "masoor_dal", dayCode: 3, dayName: "मंगळवार (आठवडा 2, 4)" },
        { id: "matar_pulav", name: "मटार पुलाव", pulseKey: "vatana", dayCode: 5, dayName: "गुरुवार (आठवडा 2, 4)" },
        { id: "god_bhat", name: "गोड भात", pulseKey: "nil", dayCode: 0, dayName: "विशेष मेन्यू" },
        { id: "non_veg", name: "नॉन व्हेज / पूरक आहार", pulseKey: "nil", dayCode: 0, dayName: "विशेष मेन्यू" },
        { id: "varan_bhat", name: "वरणभात", pulseKey: "tur_dal", dayCode: 0, dayName: "विशेष मेन्यू" }
      ];

      officialWeeklyMenus.forEach(om => {
        const existing = this.data.menus.find(m => m.id === om.id || m.name === om.name);
        if (!existing) {
          this.data.menus.push(om);
        } else {
          if (om.pulseSplit) existing.pulseSplit = om.pulseSplit;
          if (om.pulseKeys) existing.pulseKeys = om.pulseKeys;
          if (om.pulseKey && !existing.pulseKey) existing.pulseKey = om.pulseKey;
        }
      });

      // Canonical 17-item Ingredient Sequence: तांदूळ, मुगडाळ, तूरडाळ, मसूरडाळ, मटकी, मूग, चवळी, हरभरा, वाटाणा, जिरे, मोहरी, हळद, मिरची पावडर, सोयाबीन तेल, मीठ, कांदा-लसून मसाला, सोयावडी
      const targetOrder = [
        'rice', 'moong_dal', 'tur_dal', 'masoor_dal', 'matki', 'moong', 'chavali',
        'chana', 'vatana', 'cumin', 'mustard', 'turmeric', 'chilli',
        'oil', 'salt', 'masala', 'soyavadi'
      ];

      const defaultDefs = {
        rice: { id: "rice", name: "तांदूळ", defaultRate: 0.10, ratePrimary: 0.10, rateUpper: 0.15, unit: "kg", category: "grain" },
        moong_dal: { id: "moong_dal", name: "मुगडाळ", defaultRate: 0.02, ratePrimary: 0.02, rateUpper: 0.03, unit: "kg", category: "pulse" },
        tur_dal: { id: "tur_dal", name: "तूरडाळ", defaultRate: 0.02, ratePrimary: 0.02, rateUpper: 0.03, unit: "kg", category: "pulse" },
        masoor_dal: { id: "masoor_dal", name: "मसूरडाळ", defaultRate: 0.02, ratePrimary: 0.02, rateUpper: 0.03, unit: "kg", category: "pulse" },
        matki: { id: "matki", name: "मटकी", defaultRate: 0.02, ratePrimary: 0.02, rateUpper: 0.03, unit: "kg", category: "pulse" },
        moong: { id: "moong", name: "मूग", defaultRate: 0.02, ratePrimary: 0.02, rateUpper: 0.03, unit: "kg", category: "pulse" },
        chavali: { id: "chavali", name: "चवळी", defaultRate: 0.02, ratePrimary: 0.02, rateUpper: 0.03, unit: "kg", category: "pulse" },
        chana: { id: "chana", name: "हरभरा", defaultRate: 0.02, ratePrimary: 0.02, rateUpper: 0.03, unit: "kg", category: "pulse" },
        vatana: { id: "vatana", name: "वाटाणा", defaultRate: 0.02, ratePrimary: 0.02, rateUpper: 0.03, unit: "kg", category: "pulse" },
        cumin: { id: "cumin", name: "जिरे", defaultRate: 0.00020, ratePrimary: 0.00020, rateUpper: 0.00030, unit: "kg", category: "spice" },
        mustard: { id: "mustard", name: "मोहरी", defaultRate: 0.00015, ratePrimary: 0.00015, rateUpper: 0.000225, unit: "kg", category: "spice" },
        turmeric: { id: "turmeric", name: "हळद", defaultRate: 0.00015, ratePrimary: 0.00015, rateUpper: 0.000225, unit: "kg", category: "spice" },
        chilli: { id: "chilli", name: "मिरची पावडर", defaultRate: 0.00300, ratePrimary: 0.00300, rateUpper: 0.00450, unit: "kg", category: "spice" },
        oil: { id: "oil", name: "सोयाबीन तेल", defaultRate: 0.00500, ratePrimary: 0.00500, rateUpper: 0.00750, unit: "kg", category: "oil" },
        salt: { id: "salt", name: "मीठ", defaultRate: 0.00070, ratePrimary: 0.00070, rateUpper: 0.00105, unit: "kg", category: "salt" },
        masala: { id: "masala", name: "कांदा-लसून मसाला", defaultRate: 0.00090, ratePrimary: 0.00090, rateUpper: 0.00135, unit: "kg", category: "spice" },
        soyavadi: { id: "soyavadi", name: "सोयावडी", defaultRate: 0.02, ratePrimary: 0.02, rateUpper: 0.03, unit: "kg", category: "pulse" }
      };

      const orderedIngs = {};
      const srcIngs = this.data.ingredients || {};

      targetOrder.forEach(k => {
        if (srcIngs[k]) {
          orderedIngs[k] = Object.assign({}, defaultDefs[k], srcIngs[k]);
          if (orderedIngs[k].ratePrimary === undefined) orderedIngs[k].ratePrimary = orderedIngs[k].defaultRate || defaultDefs[k].ratePrimary;
          if (orderedIngs[k].rateUpper === undefined) orderedIngs[k].rateUpper = defaultDefs[k].rateUpper;
        } else {
          orderedIngs[k] = defaultDefs[k];
        }
      });

      // Preserve any custom ingredients explicitly created by the user (starting with custom_)
      Object.keys(srcIngs).forEach(k => {
        if (!orderedIngs[k] && k.startsWith('custom_')) {
          orderedIngs[k] = srcIngs[k];
        }
      });

      this.data.ingredients = orderedIngs;

      // Ensure varan_bhat menu uses tur_dal
      if (this.data.menus && Array.isArray(this.data.menus)) {
        this.data.menus.forEach(m => {
          if (m.id === 'varan_bhat') {
            m.pulseKey = 'tur_dal';
          }
        });
      }

      // Reorder initialStock entries strictly matching the target order
      const orderedStock = {};
      Object.keys(this.data.ingredients).forEach(k => {
        orderedStock[k] = (this.data.initialStock && this.data.initialStock[k] !== undefined) ? this.data.initialStock[k] : 0.0;
      });
      this.data.initialStock = orderedStock;

      const orderedStockUpper = {};
      Object.keys(this.data.ingredients).forEach(k => {
        orderedStockUpper[k] = (this.data.initialStockUpper && this.data.initialStockUpper[k] !== undefined) ? this.data.initialStockUpper[k] : 0.0;
      });
      this.data.initialStockUpper = orderedStockUpper;

      // Auto-sync all existing daily records so menuName matches actual grains consumed
      if (this.data.records) {
        Object.keys(this.data.records).forEach(d => {
          const r = this.data.records[d];
          if (r && !r.isHoliday && r.children > 0 && r.quantities) {
            const synced = this.getDisplayMenuName(r);
            if (synced && synced !== 'सुट्टी') {
              r.menuName = synced;
            }
          }
        });
      }

      // Immediately save clean ordered state for this school
      this.saveState(true);

      // Register this school in registry
      this.registerSchool({
        udise: udise,
        schoolName: this.data.settings.schoolName,
        centre: this.data.settings.centre,
        taluka: this.data.settings.taluka,
        district: this.data.settings.district,
        pat: this.data.settings.pat
      });

      this.updateHeaderMeta();
    } catch (e) {
      console.warn("Could not load stored state, using default:", e);
    }
  },

  /**
   * Save state to localStorage with multi-school isolation and dedicated safety vault
   */
  saveState(skipCloud = false) {
    try {
      const currentUdise = (this.data && this.data.settings && this.data.settings.udise)
        || localStorage.getItem(this.ACTIVE_UDISE_STORAGE_KEY)
        || '27240304501';

      const schoolStorageKey = this.getSchoolStorageKey(currentUdise);
      const schoolBackupKey = this.getSchoolBackupKey(currentUdise);

      const schoolData = {
        settings: this.data.settings,
        initialStock: this.data.initialStock,
        initialStockUpper: this.data.initialStockUpper || {},
        menus: this.data.menus,
        ingredients: this.data.ingredients,
        stockReceipts: this.data.stockReceipts,
        stockReceiptsUpper: this.data.stockReceiptsUpper || [],
        damagedStock: this.data.damagedStock,
        damagedStockUpper: this.data.damagedStockUpper || [],
        records: this.data.records,
        recordsUpper: this.data.recordsUpper || {},
        tasteRecords: this.data.tasteRecords,
        tasteRecordsUpper: this.data.tasteRecordsUpper || {},
        customDemands: this.data.customDemands,
        customDemandsUpper: this.data.customDemandsUpper || {},
        initialSampleLoaded: this.data.initialSampleLoaded,
        savedAt: new Date().toISOString()
      };

      // 1. Primary school-isolated storage
      localStorage.setItem(schoolStorageKey, JSON.stringify(schoolData));

      // 2. Dedicated school-isolated backup
      localStorage.setItem(schoolBackupKey, JSON.stringify(schoolData));

      // 3. Register or update school in the device registry
      this.registerSchool({
        udise: currentUdise,
        schoolName: this.data.settings.schoolName,
        centre: this.data.settings.centre,
        taluka: this.data.settings.taluka,
        district: this.data.settings.district,
        pat: this.data.settings.pat
      });

      // 4. Backwards compatibility for single-school legacy tests / fallback
      if (currentUdise === '27240304501') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(schoolData));
        localStorage.setItem('MDM_PERMANENT_RECORDS', JSON.stringify(this.data.records || {}));
        localStorage.setItem('MDM_PERMANENT_RECORDS_UPPER', JSON.stringify(this.data.recordsUpper || {}));
        localStorage.setItem('MDM_PERMANENT_TASTE_RECORDS', JSON.stringify(this.data.tasteRecords || {}));
        localStorage.setItem('MDM_PERMANENT_TASTE_RECORDS_UPPER', JSON.stringify(this.data.tasteRecordsUpper || {}));
        localStorage.setItem('MDM_PERMANENT_SCHOOL_SETTINGS', JSON.stringify(this.data.settings || {}));
        localStorage.setItem('MDM_PERMANENT_INGREDIENTS', JSON.stringify(this.data.ingredients || {}));
        localStorage.setItem('MDM_PERMANENT_MENUS', JSON.stringify(this.data.menus || []));
        localStorage.setItem('MDM_PERMANENT_RECEIPTS', JSON.stringify(this.data.stockReceipts || []));
        localStorage.setItem('MDM_PERMANENT_INITIAL_STOCK', JSON.stringify(this.data.initialStock || {}));

        const currentRecCount = Object.keys(this.data.records || {}).length;
        if (currentRecCount > 0) {
          localStorage.setItem('MDM_LAST_KNOWN_GOOD_BACKUP', JSON.stringify({
            records: this.data.records,
            tasteRecords: this.data.tasteRecords,
            settings: this.data.settings,
            initialStock: this.data.initialStock,
            stockReceipts: this.data.stockReceipts,
            damagedStock: this.data.damagedStock,
            savedAt: new Date().toISOString()
          }));
        }
      }

      // 5. Trigger Cloud Auto-Sync in background if enabled (debounced and never if skipCloud is true)
      if (!skipCloud && typeof cloudSync !== 'undefined' && cloudSync.config && cloudSync.config.enabled && cloudSync.config.autoSync) {
        if (!cloudSync.isSyncing) {
          cloudSync.scheduleDebouncedPush();
        }
      }
    } catch (e) {
      console.error("Failed to save state:", e);
    }
  },

  /**
   * Emergency Restore: Recovers data from multi-layer local permanent vaults & safety snapshots
   */
  emergencyRestoreData() {
    try {
      const currentUdise = this.getActiveUdise();
      let recoveredRecords = null;
      let sourceName = '';

      // 1. Try school-specific backup vault
      const schoolBackupKey = this.getSchoolBackupKey(currentUdise);
      const rawSchoolBackup = localStorage.getItem(schoolBackupKey);
      if (rawSchoolBackup) {
        try {
          const schoolBackup = JSON.parse(rawSchoolBackup);
          if (schoolBackup && schoolBackup.records && Object.keys(schoolBackup.records).length > 0) {
            recoveredRecords = schoolBackup.records;
            sourceName = `शाळा (${currentUdise}) स्थानिक सुरक्षित बॅकअप`;
            if (schoolBackup.initialStock) this.data.initialStock = schoolBackup.initialStock;
            if (schoolBackup.tasteRecords) this.data.tasteRecords = schoolBackup.tasteRecords;
            if (schoolBackup.settings) this.data.settings = Object.assign({}, this.data.settings, schoolBackup.settings);
          }
        } catch(e) {}
      }

      // 2. Try MDM_LAST_KNOWN_GOOD_BACKUP (if default school or not yet recovered)
      if (!recoveredRecords || Object.keys(recoveredRecords).length === 0) {
        const rawGood = localStorage.getItem('MDM_LAST_KNOWN_GOOD_BACKUP');
        if (rawGood) {
          try {
            const good = JSON.parse(rawGood);
            if (good && good.records && Object.keys(good.records).length > 0) {
              recoveredRecords = good.records;
              sourceName = 'स्थानिक सुरक्षित बॅकअप (Local Good Backup)';
              if (good.initialStock) this.data.initialStock = good.initialStock;
              if (good.tasteRecords) this.data.tasteRecords = good.tasteRecords;
              if (good.settings) this.data.settings = Object.assign({}, this.data.settings, good.settings);
            }
          } catch(e) {}
        }
      }

      // 3. Try MDM_PERMANENT_RECORDS
      if (!recoveredRecords || Object.keys(recoveredRecords).length === 0) {
        const rawPerm = localStorage.getItem('MDM_PERMANENT_RECORDS');
        if (rawPerm) {
          try {
            const perm = JSON.parse(rawPerm);
            if (perm && Object.keys(perm).length > 0) {
              recoveredRecords = perm;
              sourceName = 'स्थानिक कायमस्वरूपी व्हॉल्ट (Permanent Records Vault)';
            }
          } catch(e) {}
        }
      }

      if (recoveredRecords && Object.keys(recoveredRecords).length > 0) {
        const count = Object.keys(recoveredRecords).length;
        if (confirm(`🚑 ${sourceName} मध्ये ${count} दैनंदिन नोंदी सुरक्षित सापडल्या आहेत!\n\nहा डेटा त्वरित परत आणायचा (Restore करायचा) का?`)) {
          this.data.records = Object.assign({}, this.data.records, recoveredRecords);
          this.saveState();
          this.loadState();
          this.refreshAllViews();
          if (typeof this.onDateChanged === 'function') this.onDateChanged();
          this.renderCurrentTab();

          // Push to cloud if configured
          if (typeof cloudSync !== 'undefined' && cloudSync.config && cloudSync.config.enabled && cloudSync.config.firebaseUrl) {
            cloudSync.pushToCloud(true);
          }

          alert(`🎉 अभिनंदन! ${count} दैनंदिन नोंदी यशस्वीरित्या पुनर्प्राप्त (Restore) झाल्या आहेत!`);
          return true;
        }
      } else {
        // Try Cloud backup
        if (typeof cloudSync !== 'undefined' && cloudSync.config && cloudSync.config.firebaseUrl) {
          if (confirm('या डिव्हाइसवर स्थानिक बॅकअप सापडला नाही. क्लाऊड बॅकअप व्हॉल्टमधून (Cloud Backup) शोधायचा का?')) {
            cloudSync.restoreFromCloudBackup();
            return;
          }
        }
        alert('या ब्राऊझरमध्ये कोणताही जुना बॅकअप सापडला नाही. कृपया ज्या कॉम्प्युटरवर पूर्वी डेटा भरला होता, तो कॉम्प्युटर उघडून हीच रिकव्हरी प्रोसेस करा.');
      }
    } catch (e) {
      alert('डेटा रिकव्हर करताना अडचण आली: ' + e.message);
    }
  },

  /**
   * Preload actual December 2019 data from the uploaded Excel if storage is empty
   * Only applicable to default school 27240304501
   */
  populateInitialSampleDataIfEmpty() {
    const activeUdise = (this.data && this.data.settings && this.data.settings.udise) || '27240304501';
    if (activeUdise !== '27240304501') return;
    if (this.data.initialSampleLoaded || Object.keys(this.data.records).length > 0) return;

    // Default sample data corresponding to Sheet '1 to 5 (2)' in mdm_1-5_July18.xlsx
    const dec2019Records = [
      { day: 1, code: 1, menu: "", children: 0, plates: 0, holiday: true },
      { day: 2, code: 2, menu: "मुगडाळ खिचडी", children: 8, plates: 8 },
      { day: 3, code: 3, menu: "वरणभात", children: 8, plates: 8 },
      { day: 4, code: 4, menu: "उसळभात (वाटाणा/हरभरा)", children: 7, plates: 7 },
      { day: 5, code: 5, menu: "खिचडी", children: 7, plates: 7 },
      { day: 6, code: 6, menu: "आमटीभात", children: 7, plates: 7 },
      { day: 7, code: 7, menu: "उसळभात (मटकी)", children: 7, plates: 7 },
      { day: 8, code: 1, menu: "", children: 0, plates: 0, holiday: true },
      { day: 9, code: 2, menu: "मुगडाळ खिचडी", children: 8, plates: 8 },
      { day: 10, code: 3, menu: "वरणभात", children: 8, plates: 8 },
      { day: 11, code: 4, menu: "उसळभात (वाटाणा/हरभरा)", children: 9, plates: 9 },
      { day: 12, code: 5, menu: "खिचडी", children: 9, plates: 9 },
      { day: 13, code: 6, menu: "आमटीभात", children: 0, plates: 0, holiday: true },
      { day: 14, code: 7, menu: "उसळभात (मटकी)", children: 9, plates: 9 },
      { day: 15, code: 1, menu: "", children: 0, plates: 0, holiday: true },
      { day: 16, code: 2, menu: "मुगडाळ खिचडी", children: 9, plates: 9 },
      { day: 17, code: 3, menu: "वरणभात", children: 9, plates: 9 },
      { day: 18, code: 4, menu: "उसळभात (वाटाणा/हरभरा)", children: 9, plates: 9 },
      { day: 19, code: 5, menu: "खिचडी", children: 8, plates: 8 },
      { day: 20, code: 6, menu: "आमटीभात", children: 8, plates: 8 },
      { day: 21, code: 7, menu: "उसळभात (मटकी)", children: 7, plates: 7 },
      { day: 22, code: 1, menu: "", children: 0, plates: 0, holiday: true },
      { day: 23, code: 2, menu: "मुगडाळ खिचडी", children: 9, plates: 9 },
      { day: 24, code: 3, menu: "वरणभात", children: 8, plates: 8 },
      { day: 25, code: 0, menu: "", children: 0, plates: 0, holiday: true, remarks: "नाताळ सुट्टी" },
      { day: 26, code: 5, menu: "खिचडी", children: 7, plates: 7 },
      { day: 27, code: 6, menu: "आमटीभात", children: 8, plates: 8 },
      { day: 28, code: 7, menu: "उसळभात (मटकी)", children: 6, plates: 6 },
      { day: 29, code: 0, menu: "", children: 0, plates: 0, holiday: true },
      { day: 30, code: 2, menu: "मुगडाळ खिचडी", children: 7, plates: 7 },
      { day: 31, code: 3, menu: "वरणभात", children: 8, plates: 8 }
    ];

    dec2019Records.forEach(item => {
      const dateStr = `2019-12-${String(item.day).padStart(2, '0')}`;
      const rec = this.calculateDay(dateStr, item.children, item.menu, item.plates);
      if (item.holiday) rec.isHoliday = true;
      if (item.remarks) rec.remarks = item.remarks;
      this.data.records[dateStr] = rec;
    });

    this.data.initialSampleLoaded = true;
    this.saveState();
  },

  /**
   * Set up today's date and month pickers
   */
  setupDatePickers() {
    const today = new Date();
    const todayStr = today.toISOString().substring(0, 10);
    const monthStr = todayStr.substring(0, 7);

    const entryDateInput = document.getElementById('entryDate');
    if (entryDateInput) {
      entryDateInput.value = todayStr;
    }

    const regMonth = document.getElementById('registerMonthSelect');
    if (regMonth) regMonth.value = monthStr;

    const exMonth = document.getElementById('monthlyExcelPicker');
    if (exMonth) exMonth.value = monthStr;

    const fbMonth = document.getElementById('formbMonthPicker');
    if (fbMonth) fbMonth.value = monthStr;

    const expMonth = document.getElementById('exportMonthSelect');
    if (expMonth) expMonth.value = monthStr;
  },

  /**
   * Populate Menu dropdown options
   */
  populateMenuDropdown() {
    const menuSelect = document.getElementById('entryMenu');
    if (!menuSelect) return;

    const currentVal = menuSelect.value;
    menuSelect.innerHTML = '';
    
    this.data.menus.forEach(menu => {
      if (menu.id === 'holiday') return; // Handled by toggle
      const opt = document.createElement('option');
      opt.value = menu.name;
      opt.textContent = `${menu.dayName ? menu.dayName + ' - ' : ''}${menu.name}`;
      menuSelect.appendChild(opt);
    });

    const dateInput = document.getElementById('entryDate');
    const dateStr = dateInput ? dateInput.value : '';
    const defMenu = dateStr ? this.getDefaultMenuForDay(dateStr) : '';

    if (this.data.menus.some(m => m.name === currentVal)) {
      menuSelect.value = currentVal;
    } else if (defMenu && this.data.menus.some(m => m.name === defMenu)) {
      menuSelect.value = defMenu;
    }
  },

  /**
   * Prompt to permanently add a new menu to configuration
   */
  promptAddNewMenu() {
    const menuName = prompt('नवीन मेन्यूचे नाव टाका (उदा. मटकी पुलाव, हरभरा उसळ, सोयाबीन भात):');
    if (!menuName || !menuName.trim()) return;

    const trimmedName = menuName.trim();
    // Check if already exists
    if (this.data.menus.some(m => m.name === trimmedName)) {
      this.showToast('हा मेन्यू आधीच यादीमध्ये अस्तित्वात आहे.', 'warning');
      return;
    }

    const pulseListStr = Object.keys(this.data.ingredients)
      .filter(k => this.data.ingredients[k].category === 'pulse')
      .map(k => `${k} (${this.data.ingredients[k].name})`)
      .join(', ');

    const pulseKey = prompt(`या मेन्यूसाठी मुख्य कडधान्य/डाळ कोड निवडा (${pulseListStr}):`, 'tur_dal');
    const validPulse = (pulseKey && this.data.ingredients[pulseKey.trim()]) ? pulseKey.trim() : 'tur_dal';

    this.data.menus.push({
      id: `custom_${Date.now()}`,
      name: trimmedName,
      pulseKey: validPulse,
      dayCode: 0,
      dayName: "विशेष मेन्यू"
    });

    this.saveState();
    this.refreshAllViews();
    const sel = document.getElementById('entryMenu');
    if (sel) sel.value = trimmedName;
    this.onMenuSelectChange();
    this.showToast(`✅ '${trimmedName}' मेन्यू यशस्वीरित्या जोडला गेला!`, 'success');
  },

  /**
   * Edit currently selected menu (rename or change pulse)
   */
  editCurrentSelectedMenu() {
    const menuSelect = document.getElementById('entryMenu');
    if (!menuSelect) return;
    const currentName = menuSelect.value;
    if (currentName === '__custom__' || currentName === 'सुट्टी') {
      this.showToast('कृपया संपादित करण्यासाठी नियमित मेन्यू निवडा.', 'warning');
      return;
    }

    const menuObj = this.data.menus.find(m => m.name === currentName);
    if (!menuObj) return;

    const newName = prompt(`'${currentName}' मेन्यूचे नवीन नांव टाका:`, menuObj.name);
    if (!newName || !newName.trim()) return;

    const pulseListStr = Object.keys(this.data.ingredients)
      .filter(k => this.data.ingredients[k].category === 'pulse')
      .map(k => `${k} (${this.data.ingredients[k].name})`)
      .join(', ');

    const newPulse = prompt(`या मेन्यूसाठी कडधान्य/डाळ कोड टाका (${pulseListStr}):`, menuObj.pulseKey || 'tur_dal');

    menuObj.name = newName.trim();
    if (newPulse && this.data.ingredients[newPulse.trim()]) {
      menuObj.pulseKey = newPulse.trim();
    }

    this.saveState();
    this.refreshAllViews();
    menuSelect.value = menuObj.name;
    this.onMenuSelectChange();
    this.showToast(`✅ '${menuObj.name}' मेन्यू अद्ययावत झाला!`, 'success');
  },

  /**
   * Derive reflected menu name based on selected grains/pulses
   */
  getReflectedMenuName(selectedMenu, isHoliday, customMenuInputVal, grainsList) {
    if (isHoliday) return "सुट्टी";
    if (customMenuInputVal && customMenuInputVal.trim()) return customMenuInputVal.trim();

    // 1. If an existing recognized menu name was selected, respect it directly!
    if (selectedMenu && selectedMenu !== '__custom__' && selectedMenu !== 'इतर मेन्यू' && selectedMenu !== 'सुट्टी') {
      const known = this.data.menus.find(m => m.name === selectedMenu);
      if (known) return known.name;
    }

    // 2. If grainsList was explicitly selected in manual mode:
    if (Array.isArray(grainsList) && grainsList.length > 0) {
      const nonRice = grainsList.filter(k => k !== 'rice');
      const hasRice = grainsList.includes('rice');

      if (nonRice.length === 0) {
        return hasRice ? "साधा भात" : "सुट्टी";
      }

      // Check if user has selected moong + tur_dal (मूग शेवग्याचे वरण)
      if (nonRice.length === 2 && nonRice.includes('moong') && nonRice.includes('tur_dal')) {
        return "मूग शेवग्याचे वरण";
      }

      // Check if user has a configured menu specifically for this single pulse
      if (nonRice.length === 1) {
        const pk = nonRice[0];
        const matchingMenu = this.data.menus.find(m => m.pulseKey === pk);
        if (matchingMenu) return matchingMenu.name;
      }

      const pulseNames = nonRice.map(k => (this.data.ingredients[k] ? this.data.ingredients[k].name : k));

      if (nonRice.length === 1) {
        return hasRice ? `उसळभात (${pulseNames[0]})` : `${pulseNames[0]} उसळ`;
      }

      return hasRice ? `उसळभात (${pulseNames.join(', ')})` : `${pulseNames.join(', ')} उसळ`;
    }

    return selectedMenu || "वरणभात";
  },

  /**
   * Universal display menu name resolver for registers, monthly matrix, and exports
   * Strictly synchronized with the actual grains and pulses consumed in that day's record!
   */
  getDisplayMenuName(rec) {
    if (!rec) return "वरणभात";
    if (rec.isHoliday || rec.children === 0) {
      return (rec.isHoliday && rec.remarks && rec.remarks.trim()) ? rec.remarks.trim() : "सुट्टी";
    }

    const q = rec.quantities || {};
    const pulseKeys = ['moong_dal', 'tur_dal', 'masoor_dal', 'matki', 'moong', 'chavali', 'chana', 'vatana', 'soyavadi'];
    const activePulses = pulseKeys.filter(pk => q[pk] && q[pk] > 0.0001);

    // 1. DUAL PULSE: मूग (moong) + तूरडाळ (tur_dal) -> मूग शेवग्याचे वरण
    if (activePulses.includes('moong') && activePulses.includes('tur_dal')) {
      return "मूग शेवग्याचे वरण";
    }

    // 2. SINGLE PULSE: Exactly 1 pulse consumed on this day
    if (activePulses.length === 1) {
      const pk = activePulses[0];
      switch (pk) {
        case 'moong_dal':
          return "मूगडाळ खिचडी";
        case 'tur_dal':
          if (rec.menuName && rec.menuName.includes('वरण')) return "वरणभात";
          return "मसालेभात";
        case 'masoor_dal':
          if (rec.menuName && rec.menuName.includes('खिचडी')) return "मसूरडाळ खिचडी";
          return "मसूरी पुलाव";
        case 'matki':
          return "मटकी उसळभात";
        case 'moong':
          return "मूग उसळभात";
        case 'chavali':
          return "चवळी खिचडी";
        case 'chana':
          return "हरभरा उसळभात";
        case 'vatana':
          if (rec.menuName && rec.menuName.includes('मटार')) return "मटार पुलाव";
          if (rec.dayCode === 5) return "मटार पुलाव";
          return "व्हेजिटेबल पुलाव";
        case 'soyavadi':
          return "सोयाबीन पुलाव";
      }
    }

    // 3. COMBINATION PULSES: e.g. वाटाणा + हरभरा
    if (activePulses.length > 1) {
      if (activePulses.includes('vatana') && activePulses.includes('chana')) {
        return "उसळभात (वाटाणा/हरभरा)";
      }
      const pulseNames = activePulses.map(k => (this.data.ingredients[k] ? this.data.ingredients[k].name : k));
      return `उसळभात (${pulseNames.join(', ')})`;
    }

    // 4. ONLY RICE CONSUMED (0 pulse days: गोड भात / नॉन व्हेज)
    if (q.rice && q.rice > 0) {
      if (rec.menuName && (rec.menuName.includes('नॉन') || rec.menuName.includes('अंडी') || rec.menuName.includes('पूरक'))) {
        return "नॉन व्हेज / पूरक आहार";
      }
      return "गोड भात";
    }

    // 5. If no quantities recorded yet (planned day or empty day), resolve from 4-week timetable
    if (rec.date) {
      const defMenu = this.getDefaultMenuForDay(rec.date);
      if (defMenu && defMenu !== 'सुट्टी') return defMenu;
    }

    // 6. Existing valid menu name fallback
    if (rec.menuName && rec.menuName.trim() && rec.menuName !== 'इतर मेन्यू' && rec.menuName !== '__custom__' && rec.menuName !== 'सुट्टी') {
      return rec.menuName.trim();
    }

    return "वरणभात";
  },

  /**
   * Handler when Menu dropdown changes
   */
  onMenuSelectChange() {
    const menuSelect = document.getElementById('entryMenu');
    const customRow = document.getElementById('customMenuRow');
    if (!menuSelect) return;

    if (menuSelect.value === '__custom__') {
      if (customRow) customRow.style.display = 'flex';
    } else {
      if (customRow) customRow.style.display = 'none';
      
      // If in manual mode, pre-tick matching grain/pulse
      const menuObj = this.data.menus.find(m => m.name === menuSelect.value);
      if (menuObj) {
        document.querySelectorAll('.grain-select-cb').forEach(cb => {
          if (cb.dataset.key === 'rice') {
            cb.checked = true;
          } else if (!menuObj.pulseKey || menuObj.pulseKey === 'nil' || menuObj.pulseKey === 'none') {
            cb.checked = false; // Only rice used for nil (God Bhat / Non-veg)
          } else if (menuSelect.value.includes('शेवग्याचे वरण') || (menuObj.pulseKeys && menuObj.pulseKeys.length > 1)) {
            const keys = menuObj.pulseKeys || ['moong', 'tur_dal'];
            cb.checked = keys.includes(cb.dataset.key);
          } else if (menuSelect.value.includes('वाटाणा/हरभरा')) {
            cb.checked = (cb.dataset.key === 'vatana' || cb.dataset.key === 'chana');
          } else {
            cb.checked = (cb.dataset.key === menuObj.pulseKey);
          }
        });
      }
    }
    this.onInputsChanged();
  },

  /**
   * Handler when Grain Selection Mode changes (auto vs manual)
   */
  onGrainModeChange(mode) {
    const manualBox = document.getElementById('manualGrainsSelectionBox');
    if (mode === 'manual') {
      if (manualBox) manualBox.style.display = 'block';
      this.renderManualGrainsCheckboxes();
    } else {
      if (manualBox) manualBox.style.display = 'none';
    }
    this.onInputsChanged();
  },

  /**
   * Render dynamic checkboxes for manual grain/pulse selection in Daily Entry
   */
  renderManualGrainsCheckboxes(selectedList = null) {
    const grid = document.getElementById('manualGrainsCheckboxGrid');
    if (!grid) return;

    let activeKeys = selectedList;
    if (!activeKeys) {
      const currentChecked = [];
      document.querySelectorAll('.grain-select-cb:checked').forEach(cb => currentChecked.push(cb.dataset.key));
      if (currentChecked.length > 0) {
        activeKeys = currentChecked;
      } else {
        const menuSelect = document.getElementById('entryMenu');
        const menuObj = this.data.menus.find(m => m.name === menuSelect?.value);
        const activePulse = menuObj ? menuObj.pulseKey : 'tur_dal';
        activeKeys = ['rice', activePulse];
      }
    }

    grid.innerHTML = '';
    const grains = Object.keys(this.data.ingredients).filter(k => {
      const cat = this.data.ingredients[k].category;
      return cat === 'pulse' || cat === 'grain' || cat === 'other';
    });

    grains.forEach(key => {
      const ing = this.data.ingredients[key];
      const isChecked = activeKeys.includes(key);
      const emoji = ing.category === 'grain' ? '🍚' : (ing.category === 'pulse' ? '🥣' : '🌾');

      const label = document.createElement('label');
      label.className = 'checkbox-chip';
      label.innerHTML = `
        <input type="checkbox" class="grain-select-cb" data-key="${key}" ${isChecked ? 'checked' : ''} onchange="app.onInputsChanged()">
        <span>${emoji} ${ing.name} (${ing.defaultRate} ${ing.unit})</span>
      `;
      grid.appendChild(label);
    });
  },

  /**
   * Bind DOM Event Listeners
   */
  bindEvents() {
    // Daily entry triggers
    const entryDate = document.getElementById('entryDate');
    if (entryDate) {
      entryDate.addEventListener('change', () => this.onDateChanged());
    }

    const entryChildren = document.getElementById('entryChildren');
    if (entryChildren) {
      entryChildren.addEventListener('input', () => this.onInputsChanged());
    }

    const entryMenu = document.getElementById('entryMenu');
    if (entryMenu) {
      entryMenu.addEventListener('change', () => this.onMenuSelectChange());
    }

    const entryCustomMenuName = document.getElementById('entryCustomMenuName');
    if (entryCustomMenuName) {
      entryCustomMenuName.addEventListener('input', () => this.onInputsChanged());
    }

    const entryHolidayToggle = document.getElementById('entryHolidayToggle');
    if (entryHolidayToggle) {
      entryHolidayToggle.addEventListener('change', () => this.onHolidayToggleChanged());
    }

    // Drag and drop for Excel
    const dropzone = document.getElementById('excelDropzone');
    if (dropzone) {
      dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.classList.add('dragover');
      });
      dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));
      dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('dragover');
        if (e.dataTransfer.files.length > 0) {
          this.handleExcelFileUpload({ target: { files: e.dataTransfer.files } });
        }
      });
    }

    // Auto-save school & officers details on input so they are never lost
    ['setSchoolName', 'setUdise', 'setCentre', 'setTaluka', 'setDistrict', 'setPat', 'setHeadmaster', 'setPresident', 'setAssistantTeacher', 'setCookName', 'setFuelRate', 'setCookHonorarium', 'setCookCount'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', () => this.autoSaveSchoolSettings());
      }
    });

    // Window Print setup for A4 fit
    window.addEventListener('beforeprint', () => {
      const printSlip = document.getElementById('printSlipContainer');
      if (this.currentTab === 'formb' || document.body.classList.contains('print-formb')) {
        if (printSlip) printSlip.innerHTML = '';
        document.body.classList.remove('print-landscape', 'print-monthly', 'print-yearly', 'print-register', 'print-slip', 'print-taste', 'printing-taste');
        document.body.classList.add('print-formb', 'print-portrait');
      } else if (this.currentTab === 'taste' || document.body.classList.contains('print-taste') || document.body.classList.contains('printing-taste')) {
        if (printSlip) printSlip.innerHTML = '';
        document.body.classList.remove('print-landscape', 'print-monthly', 'print-yearly', 'print-register', 'print-slip', 'print-formb');
        document.body.classList.add('print-taste', 'print-portrait');
      } else if (this.currentTab === 'monthly') {
        if (printSlip) printSlip.innerHTML = '';
        document.body.classList.remove('print-portrait', 'print-formb', 'print-yearly', 'print-register', 'print-slip', 'print-taste', 'printing-taste');
        document.body.classList.add('print-monthly', 'print-landscape');
      } else if (this.currentTab === 'yearly') {
        if (printSlip) printSlip.innerHTML = '';
        document.body.classList.remove('print-portrait', 'print-formb', 'print-monthly', 'print-register', 'print-slip', 'print-taste', 'printing-taste');
        document.body.classList.add('print-yearly', 'print-landscape');
      } else if (document.body.classList.contains('print-slip')) {
        // Handled specifically by printDailySlip
      } else {
        if (printSlip) printSlip.innerHTML = '';
        document.body.classList.remove('print-portrait', 'print-formb', 'print-slip', 'print-taste', 'printing-taste');
        document.body.classList.add('print-landscape');
      }
    });

    window.addEventListener('afterprint', () => {
      document.body.classList.remove('print-formb', 'print-taste', 'printing-taste', 'print-portrait', 'print-landscape', 'print-monthly', 'print-yearly', 'print-register', 'print-slip');
      const printSlip = document.getElementById('printSlipContainer');
      if (printSlip) printSlip.innerHTML = '';
    });
  },

  /**
   * Auto-save school & officer metadata quietly to prevent data loss
   */
  autoSaveSchoolSettings() {
    const sName = document.getElementById('setSchoolName');
    if (sName && sName.value.trim()) this.data.settings.schoolName = sName.value.trim();

    const u = document.getElementById('setUdise');
    if (u) this.data.settings.udise = u.value.trim();

    const c = document.getElementById('setCentre');
    if (c) this.data.settings.centre = c.value.trim();

    const t = document.getElementById('setTaluka');
    if (t) this.data.settings.taluka = t.value.trim();

    const d = document.getElementById('setDistrict');
    if (d) this.data.settings.district = d.value.trim();

    const p = document.getElementById('setPat');
    if (p && parseInt(p.value)) this.data.settings.pat = parseInt(p.value);

    const hm = document.getElementById('setHeadmaster');
    if (hm) this.data.settings.headmaster = hm.value.trim();

    const pres = document.getElementById('setPresident');
    if (pres) this.data.settings.president = pres.value.trim();

    const asst = document.getElementById('setAssistantTeacher');
    if (asst) this.data.settings.assistantTeacher = asst.value.trim();

    const cook = document.getElementById('setCookName');
    if (cook) this.data.settings.cookName = cook.value.trim();

    const fr = document.getElementById('setFuelRate');
    if (fr && parseFloat(fr.value)) this.data.settings.fuelRate = parseFloat(fr.value);

    const ch = document.getElementById('setCookHonorarium');
    if (ch && parseInt(ch.value)) this.data.settings.cookHonorarium = parseInt(ch.value);

    const cc = document.getElementById('setCookCount');
    if (cc && parseInt(cc.value)) this.data.settings.cookCount = parseInt(cc.value);

    this.saveState();
    this.updateHeaderMeta();
  },

  /**
   * Update header metadata badges
   */
  updateHeaderMeta() {
    const headerSchool = document.getElementById('headerSchoolName');
    if (headerSchool) {
      headerSchool.textContent = `${this.data.settings.schoolName} | केंद्र: ${this.data.settings.centre} | ता. ${this.data.settings.taluka}, जि. ${this.data.settings.district}`;
    }

    const patBadge = document.getElementById('headerPatCount');
    if (patBadge) patBadge.textContent = this.getActivePat();

    const patLbl = document.getElementById('headerPatLabel');
    if (patLbl) {
      patLbl.textContent = this.activeSection === 'upper' ? 'पट (६-८):' : 'पट (१-५):';
    }

    const secPills = document.querySelectorAll('.section-toggle-btn');
    secPills.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.section === this.activeSection);
    });

    const activeSecBadge = document.getElementById('headerActiveSectionBadge');
    if (activeSecBadge) {
      activeSecBadge.textContent = this.activeSection === 'upper' ? '🎓 इ. ६ ते ८ (उच्च प्राथमिक)' : '🎒 इ. १ ते ५ (प्राथमिक)';
    }

    const todayDate = new Date();
    const todayBadge = document.getElementById('headerTodayText');
    if (todayBadge) {
      todayBadge.textContent = `आज: ${this.formatDateEnglish(todayDate, true)} (${this.getDayNameMarathi(todayDate.toISOString().substring(0, 10))})`;
    }

    const udiseBadge = document.getElementById('headerUdiseCode');
    if (udiseBadge) {
      udiseBadge.textContent = this.data.settings.udise || '27240304501';
    }
  },

  /**
   * Format date strictly in English numerals (e.g. 17/08/2026 or 17 ऑगस्ट 2026)
   */
  formatDateEnglish(dateObj, withMonthName = false) {
    const d = (dateObj instanceof Date) ? dateObj : new Date(dateObj);
    if (isNaN(d.getTime())) return '';
    const day = String(d.getDate()).padStart(2, '0');
    const year = d.getFullYear();
    if (withMonthName) {
      const marathiMonths = ['जानेवारी', 'फेब्रुवारी', 'मार्च', 'एप्रिल', 'मे', 'जून', 'जुलै', 'ऑगस्ट', 'सप्टेंबर', 'ऑक्टोबर', 'नोव्हेंबर', 'डिसेंबर'];
      return `${d.getDate()} ${marathiMonths[d.getMonth()]} ${year}`;
    }
    const month = String(d.getMonth() + 1).padStart(2, '0');
    return `${day}/${month}/${year}`;
  },

  /**
   * Format time strictly in English numerals (e.g. 06:30 PM)
   */
  formatTimeEnglish(dateObj) {
    const d = (dateObj instanceof Date) ? dateObj : new Date(dateObj);
    if (isNaN(d.getTime())) return '';
    let hours = d.getHours();
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${hours}:${minutes} ${ampm}`;
  },

  /**
   * Refresh all application tabs and views to reflect updated settings immediately
   */
  refreshAllViews() {
    this.updateHeaderMeta();
    this.populateMenuDropdown();

    const fuelHint = document.getElementById('fuelRateHint');
    if (fuelHint) {
      fuelHint.textContent = `दर: रु. ${this.data.settings.fuelRate || 1.51} प्रति विद्यार्थी`;
    }

    // Refresh active and background tabs
    this.renderDailyRegister();
    this.renderMonthlyExcelSheet();
    this.renderFormB();
    this.renderYearlyReport();
    this.renderStockView();
    this.renderSettingsView();

    // Re-evaluate live calculation on Daily Entry if active
    this.renderQuickAttendanceChips();
    this.renderManualGrainsCheckboxes();
    this.onInputsChanged();
  },

  /**
   * Switch Active Tab
   */
  switchTab(tabId) {
    this.currentTab = tabId;
    document.querySelectorAll('.nav-tab').forEach(t => {
      t.classList.toggle('active', t.dataset.tab === tabId);
    });

    document.querySelectorAll('.bottom-nav-item').forEach(b => {
      b.classList.toggle('active', b.dataset.tab === tabId);
    });

    document.querySelectorAll('.tab-panel').forEach(p => {
      p.classList.toggle('active', p.id === `tab-${tabId}`);
    });

    this.renderCurrentTab();
  },

  openMobileMoreDrawer() {
    const drawer = document.getElementById('mobileMoreDrawer');
    if (drawer) {
      drawer.style.display = 'flex';
      setTimeout(() => drawer.classList.add('open'), 10);
    }
  },

  closeMobileMoreDrawer(e) {
    if (e && e.target && e.target.closest('.mobile-drawer-content') && !e.target.classList.contains('drawer-close-btn') && !e.target.closest('.drawer-tile')) return;
    const drawer = document.getElementById('mobileMoreDrawer');
    if (drawer) {
      drawer.classList.remove('open');
      setTimeout(() => { drawer.style.display = 'none'; }, 220);
    }
  },

  /**
   * Render view for currently active tab
   */
  renderCurrentTab() {
    switch (this.currentTab) {
      case 'daily':
        this.onDateChanged();
        break;
      case 'register':
        this.renderDailyRegister();
        break;
      case 'monthly':
        this.renderMonthlyExcelSheet();
        break;
      case 'formb':
        this.renderFormB();
        break;
      case 'yearly':
        this.renderYearlyReport();
        break;
      case 'taste':
        this.onTasteTabOpen();
        break;
      case 'stock':
        this.renderStockView();
        break;
      case 'settings':
        this.renderSettingsView();
        break;
      case 'tests':
        testSuite.runAllTests();
        break;
    }
  },

  // =========================================================================
  // CORE CALCULATION ENGINE
  // =========================================================================

  /**
   * Get Marathi Day Name from YYYY-MM-DD
   */
  getDayNameMarathi(dateStr) {
    const dayOfWeek = new Date(dateStr + "T12:00:00").getDay(); // 0 = Sun, 1 = Mon ... 6 = Sat
    const map = ["रविवार", "सोमवार", "मंगळवार", "बुधवार", "गुरुवार", "शुक्रवार", "शनिवार"];
    return map[dayOfWeek];
  },

  /**
   * Get Short Marathi Day Name (रवि, सोम, मंगळ, बुध, गुरू, शुक्र, शनि)
   */
  getDayShortMarathi(dateStr) {
    const dayOfWeek = new Date(dateStr + "T12:00:00").getDay();
    const map = ["रवि", "सोम", "मंगळ", "बुध", "गुरू", "शुक्र", "शनि"];
    return map[dayOfWeek] || '';
  },

  /**
   * Get Day Code (0=सुट्टी, 1=रविवार, 2=सोमवार, 3=मंगळवार, 4=बुधवार, 5=गुरुवार, 6=शुक्रवार, 7=शनिवार)
   */
  getDayCode(dateStr) {
    const dayOfWeek = new Date(dateStr + "T12:00:00").getDay();
    if (dayOfWeek === 0) return 1; // 1 = रविवार
    return dayOfWeek + 1; // 2=Mon, 3=Tue, 4=Wed, 5=Thu, 6=Fri, 7=Sat
  },

  /**
   * Get Default Menu for a given Date based on Official 4-Week Cycle:
   * आठवडा 1 (तारीख 1 ते 7): व्हेजिटेबल पुलाव, मूगडाळ खिचडी, मूग शेवग्याचे वरण, चवळी खिचडी, मटकी उसळभात, मसालेभात
   * आठवडा 2 (तारीख 8 ते 14): सोयाबीन पुलाव, मसूरी पुलाव, मूग शेवग्याचे वरण, मटार पुलाव, मूगडाळ खिचडी, मटकी उसळभात
   * आठवडा 3 (तारीख 15 ते 20): व्हेजिटेबल पुलाव, मूगडाळ खिचडी, मूग शेवग्याचे वरण, चवळी खिचडी, मटकी उसळभात, मसालेभात
   * आठवडा 4 (तारीख 21 ते 31): सोयाबीन पुलाव, मसूरी पुलाव, मूग शेवग्याचे वरण, मटार पुलाव, मूगडाळ खिचडी, मटकी उसळभात
   */
  getDefaultMenuForDay(dateStr) {
    const dayCode = this.getDayCode(dateStr);
    if (dayCode === 1) return "सुट्टी"; // 1 = रविवार

    let dayNum = 1;
    if (dateStr && typeof dateStr === 'string' && dateStr.length >= 10) {
      dayNum = parseInt(dateStr.substring(8, 10), 10) || 1;
    }

    // आठवडा 1 (तारीख 1 ते 7) आणि आठवडा 3 (तारीख 15 ते 20)
    const isWeek1or3 = (dayNum >= 1 && dayNum <= 7) || (dayNum >= 15 && dayNum <= 20);

    if (isWeek1or3) {
      switch (dayCode) {
        case 2: return "व्हेजिटेबल पुलाव"; // सोमवार (वाटाणे)
        case 3: return "मूगडाळ खिचडी";    // मंगळवार (मूगडाळ)
        case 4: return "मूग शेवग्याचे वरण"; // बुधवार (मूग, तूरडाळ)
        case 5: return "चवळी खिचडी";       // गुरुवार (चवळी)
        case 6: return "मटकी उसळभात";      // शुक्रवार (मटकी)
        case 7: return "मसालेभात";         // शनिवार (तूरडाळ)
      }
    } else {
      // आठवडा 2 (तारीख 8 ते 14) आणि आठवडा 4/5 (तारीख 21 ते 31)
      switch (dayCode) {
        case 2: return "सोयाबीन पुलाव";    // सोमवार (सोयाबीन वडी)
        case 3: return "मसूरी पुलाव";       // मंगळवार (मसूरडाळ)
        case 4: return "मूग शेवग्याचे वरण"; // बुधवार (मूग, तूरडाळ)
        case 5: return "मटार पुलाव";       // गुरुवार (वाटाणे)
        case 6: return "मूगडाळ खिचडी";    // शुक्रवार (मूगडाळ)
        case 7: return "मटकी उसळभात";      // शनिवार (मटकी)
      }
    }

    const matchingMenus = this.data.menus.filter(m => m.dayCode === dayCode);
    if (matchingMenus.length > 0) {
      return matchingMenus[matchingMenus.length - 1].name;
    }
    return "मूगडाळ खिचडी";
  },

  /**
   * Generate an empty day object
   */
  calculateEmptyDay(dateStr) {
    const dayName = this.getDayNameMarathi(dateStr);
    const dayCode = this.getDayCode(dateStr);
    const isSunday = (dayCode === 1);

    return {
      date: dateStr,
      dayName: isSunday ? "रविवार" : dayName,
      dayCode: dayCode,
      isHoliday: isSunday,
      menuName: isSunday ? "सुट्टी" : this.getDefaultMenuForDay(dateStr),
      children: 0,
      plates: 0,
      fuelCost: 0,
      remarks: "",
      quantities: {}
    };
  },

  /**
   * Main calculation engine method: Computes all ingredient quantities exactly
   * @param {string} dateStr - 'YYYY-MM-DD'
   * @param {number} childrenCount - Beneficiary count
   * @param {string} [menuNameOverride] - Optional selected menu
   * @param {number} [platesOverride] - Optional plates count (defaults to children)
   * @param {Array<string>} [customGrainsList] - Optional explicit list of selected ingredient keys
   * @param {string} [sectionOverride] - Optional section override ('primary' or 'upper')
   */
  calculateDay(dateStr, childrenCount, menuNameOverride, platesOverride, customGrainsList, sectionOverride) {
    const section = sectionOverride || this.activeSection || 'primary';
    const dayName = this.getDayNameMarathi(dateStr);
    const dayCode = this.getDayCode(dateStr);
    const children = Math.max(0, parseInt(childrenCount) || 0);
    const plates = (platesOverride !== undefined && platesOverride !== null) ? Math.max(0, parseInt(platesOverride) || 0) : children;

    const isSunday = (dayCode === 1);
    let selectedMenu = menuNameOverride || this.getDefaultMenuForDay(dateStr);

    const isHoliday = isSunday || selectedMenu === "सुट्टी" || children === 0;

    const quantities = {};
    let fuelCost = 0;

    if (!isHoliday && children > 0) {
      if (Array.isArray(customGrainsList) && customGrainsList.length > 0) {
        // MANUAL MODE: Calculate only explicitly selected grains/pulses using section rate
        customGrainsList.forEach(key => {
          const rate = this.getIngredientRate(key, section);
          if (rate > 0) {
            quantities[key] = +(children * rate).toFixed(4);
          }
        });
      } else {
        // AUTO MODE: Derive grains based on Menu configuration
        // 1. Rice (तांदूळ)
        const riceRate = this.getIngredientRate('rice', section);
        quantities.rice = +(children * riceRate).toFixed(4);

        // 2. Pulse / Dal based on Menu
        let menuObj = this.data.menus.find(m => m.name === selectedMenu);
        if (!menuObj) {
          const normSel = selectedMenu.replace(/मु/g, 'मू');
          menuObj = this.data.menus.find(m => m.name.replace(/मु/g, 'मू') === normSel);
          if (!menuObj) {
            menuObj = this.data.menus.find(m => m.name.includes(selectedMenu) || selectedMenu.includes(m.name) || m.name.replace(/मु/g, 'मू').includes(normSel));
            if (!menuObj) {
              const defName = this.getDefaultMenuForDay(dateStr);
              menuObj = this.data.menus.find(m => m.name === defName);
              if (!menuObj) {
                menuObj = this.data.menus.find(m => m.dayCode === dayCode);
              }
            }
          }
        }

        // Special handling for dual-pulse menu: "मूग शेवग्याचे वरण" (Primary: मूग 10g + तूरडाळ 10g; Upper: मूग 15g + तूरडाळ 15g)
        if (selectedMenu.includes('शेवग्याचे वरण') || (menuObj && menuObj.pulseSplit)) {
          const pulseMult = (section === 'upper') ? 1.5 : 1.0;
          const split = (menuObj && menuObj.pulseSplit) ? menuObj.pulseSplit : { moong: 0.010, tur_dal: 0.010 };
          Object.keys(split).forEach(pk => {
            if (this.data.ingredients[pk]) {
              quantities[pk] = +(children * (split[pk] * pulseMult)).toFixed(4);
            }
          });
        } else {
          const pulseKey = menuObj ? menuObj.pulseKey : "tur_dal";
          if (pulseKey && pulseKey !== 'nil' && pulseKey !== 'none' && this.data.ingredients[pulseKey]) {
            const pulseRate = this.getIngredientRate(pulseKey, section);
            quantities[pulseKey] = +(children * pulseRate).toFixed(4);
          }
        }
      }

      // 3. Spices & Condiments (calculated on all working days using section rate)
      Object.keys(this.data.ingredients).forEach(key => {
        const ing = this.data.ingredients[key];
        if (ing && (ing.category === 'spice' || ing.category === 'oil' || ing.category === 'salt')) {
          const rate = this.getIngredientRate(key, section);
          quantities[key] = +(children * rate).toFixed(5);
        }
      });

      // 4. Fuel & Veg subsidy = Plates * Rate for active section
      const activeFuelRate = this.getActiveFuelRate(section);
      fuelCost = +(plates * activeFuelRate).toFixed(2);
    }

    return {
      date: dateStr,
      section: section,
      dayName: isSunday ? "रविवार" : dayName,
      dayCode: isHoliday && !isSunday ? 0 : dayCode,
      isHoliday: isHoliday && children === 0,
      menuName: isSunday ? "सुट्टी" : selectedMenu,
      children: isHoliday && children === 0 ? 0 : children,
      plates: isHoliday && children === 0 ? 0 : plates,
      fuelCost: fuelCost,
      remarks: "",
      quantities: quantities,
      grainSelectMode: (Array.isArray(customGrainsList) && customGrainsList.length > 0) ? 'manual' : 'auto',
      selectedGrains: customGrainsList || [],
      updatedAt: new Date().toISOString()
    };
  },

  /**
   * Format Practical Kitchen Display Quantity (e.g., 2.5 kg or 250 g)
   */
  formatKitchenQuantity(qtyKg, unit = 'kg') {
    if (!qtyKg || qtyKg <= 0) return '—';

    if (qtyKg >= 1) {
      return `${qtyKg.toFixed(2)} kg`;
    } else if (qtyKg >= 0.001) {
      const grams = +(qtyKg * 1000).toFixed(1);
      return `${grams} g`;
    } else {
      const mg = +(qtyKg * 1000000).toFixed(0);
      return `${mg} mg`;
    }
  },

  // =========================================================================
  // TAB 1: DAILY ENTRY ACTIONS & EVENT HANDLERS
  // =========================================================================

  /**
   * Event: When date picker changes
   */
  onDateChanged() {
    const dateInput = document.getElementById('entryDate');
    if (!dateInput || !dateInput.value) return;

    const dateStr = dateInput.value;
    const dayName = this.getDayNameMarathi(dateStr);
    const dayCode = this.getDayCode(dateStr);
    const isSunday = (dayCode === 1);

    // Update Day text and tag
    const dayTextEl = document.getElementById('entryDayText');
    const dayCodeEl = document.getElementById('entryDayCodeTag');
    if (dayTextEl) dayTextEl.textContent = dayName;
    if (dayCodeEl) dayCodeEl.textContent = `कोड: ${dayCode}`;

    // Check if we already have a record for this date in active section
    const activeRecs = this.getActiveRecords();
    const existingRec = activeRecs[dateStr];
    const holidayToggle = document.getElementById('entryHolidayToggle');
    const childrenInput = document.getElementById('entryChildren');
    const menuSelect = document.getElementById('entryMenu');
    const customRow = document.getElementById('customMenuRow');
    const customMenuInput = document.getElementById('entryCustomMenuName');
    const remarksInput = document.getElementById('entryRemarks');
    const statusPill = document.getElementById('entryStatusPill');
    const radioAuto = document.getElementById('grainModeAuto');
    const radioManual = document.getElementById('grainModeManual');
    const manualBox = document.getElementById('manualGrainsSelectionBox');

    if (existingRec) {
      if (statusPill) statusPill.textContent = `🔵 ${this.getActiveSectionName()} जतन केलेली नोंद`;
      if (childrenInput) childrenInput.value = existingRec.children;
      
      // Menu resolution
      const isKnownMenu = this.data.menus.some(m => m.name === existingRec.menuName);
      if (menuSelect) {
        if (isKnownMenu) {
          menuSelect.value = existingRec.menuName;
          if (customRow) customRow.style.display = 'none';
        } else {
          menuSelect.value = '__custom__';
          if (customRow) customRow.style.display = 'flex';
          if (customMenuInput) customMenuInput.value = existingRec.menuName;
        }
      }

      // Grain Mode resolution
      if (existingRec.grainSelectMode === 'manual') {
        if (radioManual) radioManual.checked = true;
        if (manualBox) manualBox.style.display = 'block';
        const selectedGrains = existingRec.selectedGrains || Object.keys(existingRec.quantities || {});
        this.renderManualGrainsCheckboxes(selectedGrains);
      } else {
        if (radioAuto) radioAuto.checked = true;
        if (manualBox) manualBox.style.display = 'none';
        this.renderManualGrainsCheckboxes();
      }

      if (remarksInput) remarksInput.value = existingRec.remarks || '';
      if (holidayToggle) holidayToggle.value = existingRec.isHoliday ? 'holiday' : 'working';
    } else {
      if (statusPill) statusPill.textContent = `🟢 ${this.getActiveSectionName()} नवीन नोंद`;
      if (customRow) customRow.style.display = 'none';
      if (radioAuto) radioAuto.checked = true;
      if (manualBox) manualBox.style.display = 'none';
      this.renderManualGrainsCheckboxes();

      if (isSunday) {
        if (holidayToggle) holidayToggle.value = 'holiday';
        if (childrenInput) childrenInput.value = 0;
      } else {
        if (holidayToggle) holidayToggle.value = 'working';
        if (childrenInput) childrenInput.value = this.getActivePat();
        if (menuSelect) menuSelect.value = this.getDefaultMenuForDay(dateStr);
      }
      if (remarksInput) remarksInput.value = '';
    }

    // Update Dual Status Ribbon & Section Badges
    const pRec = this.data.records && this.data.records[dateStr];
    const uRec = this.data.recordsUpper && this.data.recordsUpper[dateStr];

    const pTextEl = document.getElementById('statusPrimaryText');
    const uTextEl = document.getElementById('statusUpperText');
    const pChip = document.getElementById('dailyStatusPrimaryChip');
    const uChip = document.getElementById('dailyStatusUpperChip');

    if (pTextEl) {
      if (pRec) {
        pTextEl.innerHTML = `<span class="text-success font-bold">✅ भरली (${pRec.children} लाभार्थी - ${pRec.menuName})</span>`;
        if (pChip) pChip.classList.add('status-done');
      } else {
        pTextEl.innerHTML = `<span class="text-muted">⏳ नोंद बाकी</span>`;
        if (pChip) pChip.classList.remove('status-done');
      }
    }

    if (uTextEl) {
      if (uRec) {
        uTextEl.innerHTML = `<span class="text-success font-bold">✅ भरली (${uRec.children} लाभार्थी - ${uRec.menuName})</span>`;
        if (uChip) uChip.classList.add('status-done');
      } else {
        uTextEl.innerHTML = `<span class="text-muted">⏳ नोंद बाकी</span>`;
        if (uChip) uChip.classList.remove('status-done');
      }
    }

    const saveBtn = document.getElementById('btnSaveDaily');
    if (saveBtn) {
      saveBtn.innerHTML = `<span>💾 आजची ${this.getActiveSectionName()} नोंद जतन करा</span>`;
    }

    const fuelHint = document.getElementById('fuelRateHint');
    if (fuelHint) {
      fuelHint.textContent = `दर: रु. ${this.getActiveFuelRate()} प्रति विद्यार्थी (${this.getActiveSectionName()})`;
    }

    this.onInputsChanged();
    this.renderRecentDaysRibbon();
  },

  /**
   * Event: When Holiday toggle changes
   */
  onHolidayToggleChanged() {
    const holidayToggle = document.getElementById('entryHolidayToggle');
    const childrenInput = document.getElementById('entryChildren');

    if (holidayToggle && holidayToggle.value === 'holiday') {
      if (childrenInput) childrenInput.value = 0;
    } else {
      if (childrenInput && parseInt(childrenInput.value) === 0) {
        childrenInput.value = this.data.settings.pat || 8;
      }
    }
    this.onInputsChanged();
  },

  /**
   * Adjust children count by delta (+1 or -1)
   */
  adjustChildren(delta) {
    const childrenInput = document.getElementById('entryChildren');
    if (!childrenInput) return;
    const current = parseInt(childrenInput.value) || 0;
    const updated = Math.max(0, current + delta);
    childrenInput.value = updated;
    this.onInputsChanged();
  },

  /**
   * Reactive live recalculation on inputs change (plates = children automatically)
   */
  onInputsChanged() {
    const dateInput = document.getElementById('entryDate');
    const childrenInput = document.getElementById('entryChildren');
    const menuSelect = document.getElementById('entryMenu');
    const customMenuInput = document.getElementById('entryCustomMenuName');
    const holidayToggle = document.getElementById('entryHolidayToggle');
    const fuelInput = document.getElementById('entryFuelCost');
    const isManualMode = document.getElementById('grainModeManual')?.checked;

    if (!dateInput || !childrenInput) return;

    const dateStr = dateInput.value;
    const children = parseInt(childrenInput.value) || 0;
    const plates = children; // Beneficiaries and plates are always identical

    const isHoliday = (holidayToggle && holidayToggle.value === 'holiday') || children === 0;
    
    // Collect manual grains if in manual mode
    let manualGrainsList = null;
    if (isManualMode) {
      manualGrainsList = [];
      document.querySelectorAll('.grain-select-cb:checked').forEach(cb => {
        manualGrainsList.push(cb.dataset.key);
      });
    }

    let menuName = "वरणभात";
    if (isHoliday) {
      menuName = "सुट्टी";
    } else if (menuSelect && menuSelect.value === '__custom__') {
      menuName = (customMenuInput && customMenuInput.value.trim()) ? customMenuInput.value.trim() : "इतर मेन्यू";
    } else if (isManualMode && manualGrainsList && manualGrainsList.length > 0) {
      menuName = this.getReflectedMenuName(menuSelect?.value, false, customMenuInput?.value, manualGrainsList);
    } else if (menuSelect) {
      menuName = menuSelect.value;
    }

    // Perform live calculation
    const calc = this.calculateDay(dateStr, isHoliday ? 0 : children, menuName, isHoliday ? 0 : plates, manualGrainsList);

    if (fuelInput) {
      fuelInput.value = calc.fuelCost;
    }

    this.renderLiveCalculationTable(calc);
  },

  /**
   * Render the Live Calculation Table on Daily Entry screen
   */
  renderLiveCalculationTable(calc) {
    const tableBody = document.getElementById('calcTableBody');
    const subtitle = document.getElementById('calcSubtitle');
    const chipRice = document.getElementById('chipRice');
    const chipPulse = document.getElementById('chipPulse');
    const chipOil = document.getElementById('chipOil');
    const chipFuel = document.getElementById('chipFuel');
    const totalKgEl = document.getElementById('calcTotalGrainsKg');
    const totalKitchenEl = document.getElementById('calcTotalGrainsKitchen');
    const alertBanner = document.getElementById('stockAlertBanner');
    const alertDetails = document.getElementById('stockAlertDetails');

    if (!tableBody) return;
    tableBody.innerHTML = '';

    if (subtitle) {
      subtitle.textContent = calc.children > 0 
        ? `${calc.children} विद्यार्थ्यांसाठी आवश्यक प्रमाण (${calc.menuName} - ${calc.grainSelectMode === 'manual' ? 'स्वतः निवडलेली कडधान्ये' : 'स्वयंचलित मेन्यू'})`
        : `सुट्टी किंवा 0 उपस्थिती (कोणतेही धान्य आवश्यक नाही)`;
    }

    if (chipRice) chipRice.textContent = `${(calc.quantities.rice || 0).toFixed(3)} kg`;
    
    // Find active pulse(s) / grains
    let pulseQty = 0;
    let pulseNames = [];
    Object.keys(this.data.ingredients).forEach(k => {
      const ing = this.data.ingredients[k];
      if (k !== 'rice' && (ing.category === 'pulse' || ing.category === 'grain' || ing.category === 'other') && calc.quantities[k] > 0) {
        pulseQty += calc.quantities[k];
        pulseNames.push(ing.name);
      }
    });

    if (chipPulse) {
      if (pulseQty > 0) {
        chipPulse.textContent = `${pulseQty.toFixed(3)} kg (${pulseNames.join('+')})`;
      } else if (calc.children > 0 && (calc.quantities.rice || 0) > 0) {
        chipPulse.textContent = `0.000 kg (निरंक / डाळ नाही)`;
      } else {
        chipPulse.textContent = `0.000 kg (डाळ/उसळ)`;
      }
    }
    if (chipOil) chipOil.textContent = `${(calc.quantities.oil ? calc.quantities.oil * 1000 : 0).toFixed(0)} g/ml`;
    if (chipFuel) chipFuel.textContent = `रु. ${calc.fuelCost}`;

    // Update Compact Daily Glance Summary Elements
    const compactRice = document.getElementById('compactRice');
    const compactPulse = document.getElementById('compactPulse');
    const compactOil = document.getElementById('compactOil');
    const compactFuel = document.getElementById('compactFuel');

    if (compactRice) compactRice.textContent = `${(calc.quantities.rice || 0).toFixed(3)} kg`;
    if (compactPulse) {
      if (pulseQty > 0) {
        compactPulse.textContent = `${pulseQty.toFixed(3)} kg (${pulseNames.join('+')})`;
      } else if (calc.children > 0 && (calc.quantities.rice || 0) > 0) {
        compactPulse.textContent = '0.000 kg (डाळ नाही)';
      } else {
        compactPulse.textContent = '0.000 kg';
      }
    }
    if (compactOil) compactOil.textContent = `${(calc.quantities.oil ? calc.quantities.oil * 1000 : 0).toFixed(0)} g`;
    if (compactFuel) compactFuel.textContent = `₹${calc.fuelCost}`;

    // Compute current available stock for the date
    const stockState = this.computeStockForDate(calc.date);
    let hasShortage = false;
    let shortageDetails = [];

    let totalGrains = (calc.quantities.rice || 0) + pulseQty;
    if (totalKgEl) totalKgEl.textContent = `${totalGrains.toFixed(3)} kg`;
    if (totalKitchenEl) totalKitchenEl.textContent = this.formatKitchenQuantity(totalGrains);

    // =========================================================================
    // UPDATE TOP HERO STATS CARDS (LIVE METRICS)
    // =========================================================================
    const heroChildren = document.getElementById('heroStatChildren');
    const heroPat = document.getElementById('heroStatPat');
    const heroAttRate = document.getElementById('heroStatAttRate');
    const heroMenu = document.getElementById('heroStatMenu');
    const heroPulse = document.getElementById('heroStatPulse');
    const heroDay = document.getElementById('heroStatDay');
    const heroTotalGrains = document.getElementById('heroStatTotalGrains');
    const heroBreakdown = document.getElementById('heroStatRiceDalBreakdown');
    const heroFuelCost = document.getElementById('heroStatFuelCost');
    const heroFuelRate = document.getElementById('heroStatFuelRate');

    const totalPat = this.getActivePat(calc.section || this.activeSection);
    if (heroChildren) heroChildren.textContent = calc.children;
    if (heroPat) heroPat.textContent = totalPat;
    if (heroAttRate) {
      if (calc.isHoliday || calc.children === 0) {
        heroAttRate.textContent = '0% (सुट्टी / 0 नोंद)';
        heroAttRate.style.background = '#fee2e2';
        heroAttRate.style.color = '#991b1b';
      } else {
        const pct = Math.min(100, (calc.children / totalPat) * 100).toFixed(1);
        heroAttRate.textContent = `${pct}% उपस्थिती`;
        heroAttRate.style.background = '#dcfce7';
        heroAttRate.style.color = '#166534';
      }
    }

    if (heroMenu) heroMenu.textContent = calc.isHoliday ? 'शाळा सुट्टी' : calc.menuName;
    if (heroPulse) {
      if (pulseNames.length > 0) {
        heroPulse.textContent = pulseNames.join(', ');
      } else if (calc.children > 0 && (calc.quantities.rice || 0) > 0) {
        heroPulse.textContent = 'निरंक (फक्त तांदूळ)';
      } else {
        heroPulse.textContent = 'डाळ / उसळ';
      }
    }
    if (heroDay) heroDay.textContent = `${calc.dayName} (वार कोड: ${calc.dayCode})`;

    if (heroTotalGrains) heroTotalGrains.textContent = totalGrains.toFixed(3);
    if (heroBreakdown) heroBreakdown.textContent = `तांदूळ: ${(calc.quantities.rice || 0).toFixed(3)} + डाळ: ${pulseQty.toFixed(3)} kg`;

    if (heroFuelCost) heroFuelCost.textContent = calc.fuelCost.toFixed(2);
    if (heroFuelRate) heroFuelRate.textContent = `दर: ₹${this.getActiveFuelRate(calc.section || this.activeSection)} / विद्यार्थी`;

    // Highlight matching quick attendance chip
    document.querySelectorAll('.quick-chip-btn').forEach(btn => {
      const val = parseInt(btn.dataset.val);
      btn.classList.toggle('active', val === calc.children);
    });

    // Render Filtered Rows in Calculation Table
    const activeFilter = this.calcFilter || 'all';
    Object.keys(this.data.ingredients).forEach(key => {
      const ing = this.data.ingredients[key];
      
      // Filter logic
      if (activeFilter === 'grain' && ing.category !== 'grain' && ing.category !== 'pulse') return;
      if (activeFilter === 'spice' && ing.category !== 'spice') return;

      const reqQty = calc.quantities[key] || 0;
      const isApplicable = reqQty > 0;
      const availStock = stockState[key] || 0;
      const appliedRate = this.getIngredientRate(key, calc.section || this.activeSection);

      const isShort = isApplicable && (availStock < reqQty);
      if (isShort) {
        hasShortage = true;
        shortageDetails.push(`${ing.name} (उपलब्ध: ${availStock.toFixed(2)} kg, आवश्यक: ${reqQty.toFixed(2)} kg)`);
      }

      const tr = document.createElement('tr');
      if (isApplicable) tr.className = 'highlight-row';
      if (isShort) tr.className = 'shortage-row';

      tr.innerHTML = `
        <td><strong>${ing.name}</strong></td>
        <td>${appliedRate} ${ing.unit}</td>
        <td class="text-right"><strong>${isApplicable ? reqQty.toFixed(ing.category === 'spice' ? 5 : 3) : '0.000'}</strong></td>
        <td class="text-right"><span class="kitchen-qty-badge">${this.formatKitchenQuantity(reqQty, ing.unit)}</span></td>
        <td class="text-right">${availStock.toFixed(3)} kg</td>
        <td class="text-center">
          ${isShort ? '<span class="badge badge-danger">⚠️ अपुरा साठा</span>' : (isApplicable ? '<span class="badge badge-success">✓ लागू</span>' : '<span class="badge badge-secondary">—</span>')}
        </td>
      `;
      tableBody.appendChild(tr);
    });

    if (alertBanner && alertDetails) {
      if (hasShortage) {
        alertBanner.style.display = 'flex';
        alertDetails.textContent = `अपुरा साठा: ${shortageDetails.join(', ')}. कृपया प्राप्त धान्याची नोंद तपासा.`;
      } else {
        alertBanner.style.display = 'none';
      }
    }
  },

  /**
   * Render Quick Attendance Chips based on School PAT
   */
  renderQuickAttendanceChips() {
    const container = document.getElementById('quickAttChipsContainer');
    if (!container) return;
    container.innerHTML = '';

    const pat = parseInt(this.data.settings.pat) || 9;
    const chipsData = [];

    // Full 100% attendance chip
    chipsData.push({ val: pat, label: `100% सर्व पट (${pat})` });

    // Descending variations (up to 4 lower values if pat > 1)
    for (let i = 1; i <= 4 && (pat - i) > 0; i++) {
      chipsData.push({ val: pat - i, label: `${pat - i} विद्यार्थी` });
    }

    // Holiday / 0 attendance chip
    chipsData.push({ val: 0, label: `सुट्टी / 0`, isHoliday: true });

    chipsData.forEach(c => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `quick-chip-btn ${c.isHoliday ? 'holiday-chip' : ''}`;
      btn.dataset.val = c.val;
      btn.textContent = c.label;
      btn.onclick = () => this.setQuickChildren(c.val);
      container.appendChild(btn);
    });
  },

  /**
   * Set Attendance via 1-Click Quick Chip
   */
  setQuickChildren(val) {
    const childrenInput = document.getElementById('entryChildren');
    const holidayToggle = document.getElementById('entryHolidayToggle');
    if (childrenInput) childrenInput.value = val;
    if (holidayToggle) {
      holidayToggle.value = (val === 0) ? 'holiday' : 'working';
    }
    this.onInputsChanged();
  },

  /**
   * Filter calculation table by category ('all', 'grain', 'spice')
   */
  filterCalcTable(category) {
    this.calcFilter = category;
    document.querySelectorAll('.calc-filter-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.filter === category);
    });
    this.onInputsChanged();
  },

  /**
   * Save the current Daily Entry form to state & storage
   */
  saveCurrentRecord() {
    const dateInput = document.getElementById('entryDate');
    const childrenInput = document.getElementById('entryChildren');
    const menuSelect = document.getElementById('entryMenu');
    const customMenuInput = document.getElementById('entryCustomMenuName');
    const holidayToggle = document.getElementById('entryHolidayToggle');
    const remarksInput = document.getElementById('entryRemarks');
    const isManualMode = document.getElementById('grainModeManual')?.checked;

    if (!dateInput || !dateInput.value) {
      this.showToast('कृपया वैध तारीख निवडा', 'danger');
      return;
    }

    const dateStr = dateInput.value;
    const children = parseInt(childrenInput.value) || 0;
    const plates = children;
    const isHoliday = (holidayToggle && holidayToggle.value === 'holiday') || children === 0;

    // Collect manual grains if in manual mode
    let manualGrainsList = null;
    if (isManualMode) {
      manualGrainsList = [];
      document.querySelectorAll('.grain-select-cb:checked').forEach(cb => {
        manualGrainsList.push(cb.dataset.key);
      });
    }

    let menuName = "वरणभात";
    if (isHoliday) {
      menuName = "सुट्टी";
    } else if (menuSelect && menuSelect.value === '__custom__') {
      menuName = (customMenuInput && customMenuInput.value.trim()) ? customMenuInput.value.trim() : "इतर मेन्यू";
    } else if (isManualMode && manualGrainsList && manualGrainsList.length > 0) {
      menuName = this.getReflectedMenuName(menuSelect?.value, false, customMenuInput?.value, manualGrainsList);
    } else if (menuSelect) {
      menuName = menuSelect.value;
    }

    const activeSection = this.getActiveSection();
    const record = this.calculateDay(dateStr, isHoliday ? 0 : children, menuName, isHoliday ? 0 : plates, manualGrainsList, activeSection);
    record.remarks = remarksInput ? remarksInput.value.trim() : '';
    if (!isHoliday && children > 0) {
      record.menuName = this.getDisplayMenuName(record);
    }

    if (activeSection === 'upper') {
      if (!this.data.recordsUpper) this.data.recordsUpper = {};
      this.data.recordsUpper[dateStr] = record;
    } else {
      if (!this.data.records) this.data.records = {};
      this.data.records[dateStr] = record;
    }

    // स्वयंचलित चव नोंद सिंक: फक्त दैनिक मध्ये नोंद भरल्यावरच चव ऑटो ने भरणे
    const targetTaste = (activeSection === 'upper') ? this.getActiveTasteRecords('upper') : this.getActiveTasteRecords('primary');
    if (!isHoliday && children > 0) {
      const existingTaste = targetTaste[dateStr];
      if (!existingTaste || existingTaste.isAuto) {
        const dObj = new Date(dateStr + "T12:00:00");
        const dNum = dObj.getDate();
        const shortRemarks = ["उत्तम", "चविष्ट", "उत्तम", "चांगली", "चविष्ट"];
        const rIdx = (dNum - 1) % shortRemarks.length;
        targetTaste[dateStr] = {
          date: dateStr,
          section: activeSection,
          time: '12:00 PM',
          menuName: record.menuName,
          testerName: this.data.settings.headmaster || 'मुख्याध्यापक',
          testerRole: 'मुख्याध्यापक',
          quality: 'उत्कृष्ट',
          tasteRemark: shortRemarks[rIdx],
          isAuto: true
        };
      } else {
        existingTaste.menuName = record.menuName;
      }
    } else {
      // ज्या दिवशी आहार भरला नाही (सुट्टी किंवा 0 मुले), त्या दिवशी चव नोंद कोरी ठेवणे
      if (targetTaste[dateStr] && targetTaste[dateStr].isAuto) {
        delete targetTaste[dateStr];
      }
    }

    this.saveState();

    // Synchronize month pickers to the recorded month
    const yearMonth = dateStr.substring(0, 7);
    const regMonth = document.getElementById('registerMonthSelect');
    if (regMonth) regMonth.value = yearMonth;
    const exMonth = document.getElementById('monthlyExcelPicker');
    if (exMonth) exMonth.value = yearMonth;
    const fbMonth = document.getElementById('formbMonthPicker');
    if (fbMonth) fbMonth.value = yearMonth;

    // Check status of other section to inform user
    const otherSection = (activeSection === 'primary') ? 'upper' : 'primary';
    const otherSecName = (activeSection === 'primary') ? 'इ. ६ ते ८ (उच्च प्राथमिक)' : 'इ. १ ते ५ (प्राथमिक)';
    const otherRecs = (activeSection === 'primary') ? (this.data.recordsUpper || {}) : (this.data.records || {});
    const isOtherSaved = !!otherRecs[dateStr];

    if (!isOtherSaved) {
      this.showToast(`✅ दि. ${dateStr} ची ${this.getActiveSectionName()} नोंद (${record.menuName}, ${children} विद्यार्थी) जतन झाली! आता ${otherSecName} ची नोंद करा.`, 'success');
    } else {
      this.showToast(`✅ दि. ${dateStr} ची ${this.getActiveSectionName()} नोंद (${record.menuName}, ${children} विद्यार्थी) यशस्वीरित्या जतन झाली! (दोन्ही विभाग पूर्ण)`, 'success');
    }

    this.refreshAllViews();
    this.onDateChanged();
  },

  /**
   * Open Dual Quick Entry Modal (१ ते ५ आणि ६ ते ८ एकाच वेळी)
   */
  openDualEntryModal() {
    const modal = document.getElementById('dualEntryModal');
    if (!modal) return;
    const dateInput = document.getElementById('entryDate');
    const dateStr = dateInput ? dateInput.value : new Date().toISOString().substring(0, 10);

    const modalDate = document.getElementById('dualEntryDateDisplay');
    if (modalDate) modalDate.textContent = dateStr;

    const pRec = this.data.records && this.data.records[dateStr];
    const uRec = this.data.recordsUpper && this.data.recordsUpper[dateStr];

    const pInp = document.getElementById('dualEntryPrimaryChildren');
    const uInp = document.getElementById('dualEntryUpperChildren');

    if (pInp) pInp.value = pRec ? pRec.children : this.getActivePat('primary');
    if (uInp) uInp.value = uRec ? uRec.children : this.getActivePat('upper');

    modal.style.display = 'flex';
  },

  closeDualEntryModal() {
    const modal = document.getElementById('dualEntryModal');
    if (modal) modal.style.display = 'none';
  },

  /**
   * Toggle Visibility of Part 2 (आवश्यक किराणा व पाककृती प्रमाण तक्ता)
   * Keeps the Daily Entry page clean, compact and decluttered
   */
  toggleCalcCard() {
    const calcCard = document.getElementById('calculationCard');
    const entryGrid = document.querySelector('.entry-grid');
    const textSpan = document.getElementById('calcToggleText');
    const toggleBtn = document.getElementById('btnHideCalcCard');

    const isHidden = calcCard && (calcCard.style.display === 'none' || calcCard.classList.contains('hidden'));
    const willShow = isHidden;

    if (calcCard) {
      calcCard.style.display = willShow ? 'block' : 'none';
      calcCard.classList.toggle('hidden', !willShow);
    }
    if (entryGrid) {
      entryGrid.classList.toggle('calc-hidden', !willShow);
    }
    if (textSpan) {
      textSpan.textContent = willShow ? '🙈 सविस्तर हिशोब तक्ता लपवा ▴' : '👁️ सविस्तर किराणा तक्ता पहा (View Details) ▾';
    }
    if (toggleBtn) {
      toggleBtn.innerHTML = willShow ? '<span>🙈 तक्ता लपवा (Hide)</span>' : '<span>👁️ दाखवा (View)</span>';
    }

    try {
      localStorage.setItem('MDM_CALC_TABLE_VISIBLE', willShow ? '1' : '0');
    } catch(e) {}

    this.showToast(willShow ? '📊 सविस्तर किराणा व धान्य हिशोब तक्ता उघडला' : '🧹 दैनिक नोंद स्क्रीन सुटसुटीत (तक्ता लपवला)', 'info');
  },

  /**
   * Initialize calculation table visibility based on user preference
   */
  initCalcTableVisibility() {
    let savedPref = '0';
    try {
      savedPref = localStorage.getItem('MDM_CALC_TABLE_VISIBLE') || '0';
    } catch(e) {}

    const shouldShow = (savedPref === '1');
    const calcCard = document.getElementById('calculationCard');
    const entryGrid = document.querySelector('.entry-grid');
    const textSpan = document.getElementById('calcToggleText');
    const toggleBtn = document.getElementById('btnHideCalcCard');

    if (calcCard) {
      calcCard.style.display = shouldShow ? 'block' : 'none';
      calcCard.classList.toggle('hidden', !shouldShow);
    }
    if (entryGrid) {
      entryGrid.classList.toggle('calc-hidden', !shouldShow);
    }
    if (textSpan) {
      textSpan.textContent = shouldShow ? '🙈 सविस्तर हिशोब तक्ता लपवा ▴' : '👁️ सविस्तर किराणा तक्ता पहा (View Details) ▾';
    }
    if (toggleBtn) {
      toggleBtn.innerHTML = shouldShow ? '<span>🙈 तक्ता लपवा (Hide)</span>' : '<span>👁️ दाखवा (View)</span>';
    }
  },

  saveDualRecords() {
    const dateInput = document.getElementById('entryDate');
    if (!dateInput || !dateInput.value) return;
    const dateStr = dateInput.value;

    const pInp = document.getElementById('dualEntryPrimaryChildren');
    const uInp = document.getElementById('dualEntryUpperChildren');
    const menuSelect = document.getElementById('entryMenu');
    const customMenuInput = document.getElementById('entryCustomMenuName');
    const holidayToggle = document.getElementById('entryHolidayToggle');
    const remarksInput = document.getElementById('entryRemarks');

    const pChildren = Math.max(0, parseInt(pInp?.value) || 0);
    const uChildren = Math.max(0, parseInt(uInp?.value) || 0);
    const isHoliday = (holidayToggle && holidayToggle.value === 'holiday');

    let menuName = "वरणभात";
    if (isHoliday) {
      menuName = "सुट्टी";
    } else if (menuSelect && menuSelect.value === '__custom__') {
      menuName = (customMenuInput && customMenuInput.value.trim()) ? customMenuInput.value.trim() : "इतर मेन्यू";
    } else if (menuSelect) {
      menuName = menuSelect.value;
    }

    const remarks = remarksInput ? remarksInput.value.trim() : '';

    // 1. Primary Record (1-5)
    const recPrimary = this.calculateDay(dateStr, isHoliday ? 0 : pChildren, menuName, isHoliday ? 0 : pChildren, null, 'primary');
    recPrimary.remarks = remarks;
    if (!isHoliday && pChildren > 0) recPrimary.menuName = this.getDisplayMenuName(recPrimary);
    if (!this.data.records) this.data.records = {};
    this.data.records[dateStr] = recPrimary;

    // 2. Upper Primary Record (6-8)
    const recUpper = this.calculateDay(dateStr, isHoliday ? 0 : uChildren, menuName, isHoliday ? 0 : uChildren, null, 'upper');
    recUpper.remarks = remarks;
    if (!isHoliday && uChildren > 0) recUpper.menuName = this.getDisplayMenuName(recUpper);
    if (!this.data.recordsUpper) this.data.recordsUpper = {};
    this.data.recordsUpper[dateStr] = recUpper;

    // Auto Taste records for both
    if (!isHoliday) {
      const dObj = new Date(dateStr + "T12:00:00");
      const shortRemarks = ["उत्तम", "चविष्ट", "उत्तम", "चांगली", "चविष्ट"];
      const rIdx = (dObj.getDate() - 1) % shortRemarks.length;

      if (pChildren > 0) {
        if (!this.data.tasteRecords) this.data.tasteRecords = {};
        this.data.tasteRecords[dateStr] = {
          date: dateStr,
          section: 'primary',
          time: '12:00 PM',
          menuName: recPrimary.menuName,
          testerName: this.data.settings.headmaster || 'मुख्याध्यापक',
          testerRole: 'मुख्याध्यापक',
          quality: 'उत्कृष्ट',
          tasteRemark: shortRemarks[rIdx],
          isAuto: true
        };
      }
      if (uChildren > 0) {
        if (!this.data.tasteRecordsUpper) this.data.tasteRecordsUpper = {};
        this.data.tasteRecordsUpper[dateStr] = {
          date: dateStr,
          section: 'upper',
          time: '12:00 PM',
          menuName: recUpper.menuName,
          testerName: this.data.settings.headmaster || 'मुख्याध्यापक',
          testerRole: 'मुख्याध्यापक',
          quality: 'उत्कृष्ट',
          tasteRemark: shortRemarks[rIdx],
          isAuto: true
        };
      }
    }

    this.saveState();
    this.closeDualEntryModal();
    this.showToast(`✅ दि. ${dateStr} ची १-५ (${pChildren} मुले) आणि ६-८ (${uChildren} मुले) दोन्ही नोंदी यशस्वीरित्या जतन झाल्या!`, 'success');
    this.refreshAllViews();
    this.onDateChanged();
  },

  /**
   * Reset the daily entry form
   */
  resetDailyForm() {
    this.onDateChanged();
    this.showToast('फॉर्म पूर्ववत केला आहे.', 'warning');
  },

  /**
   * Print Daily Kitchen Slip
   */
  printDailySlip() {
    const dateInput = document.getElementById('entryDate');
    if (!dateInput) return;
    const dateStr = dateInput.value;
    const rec = this.data.records[dateStr] || this.calculateDay(dateStr, document.getElementById('entryChildren').value);

    const printContainer = document.getElementById('printSlipContainer');
    if (!printContainer) return;

    printContainer.innerHTML = `
      <div style="padding: 20px; font-family: sans-serif; border: 1px dashed #000; max-width: 400px; margin: 0 auto;">
        <h3 style="text-align: center; margin-bottom: 5px;">${this.data.settings.schoolName}</h3>
        <p style="text-align: center; font-size: 13px; margin: 0;">दैनिक पोषण आहार स्लिप</p>
        <hr style="margin: 10px 0;">
        <p><strong>दिनांक:</strong> ${rec.date} (${rec.dayName})</p>
        <p><strong>आजचा मेन्यू:</strong> ${rec.menuName}</p>
        <p><strong>उपस्थित विद्यार्थी:</strong> ${rec.children} | <strong>ताटे:</strong> ${rec.plates}</p>
        <hr style="margin: 10px 0;">
        <h4>आवश्यक स्वयंपाक साहित्य:</h4>
        <ul style="padding-left: 20px; font-size: 14px; line-height: 1.6;">
          <li>तांदूळ: <strong>${this.formatKitchenQuantity(rec.quantities.rice || 0)}</strong></li>
          ${Object.keys(rec.quantities).filter(k => k !== 'rice').map(k => `<li>${this.data.ingredients[k].name}: <strong>${this.formatKitchenQuantity(rec.quantities[k])}</strong></li>`).join('')}
        </ul>
        <hr style="margin: 10px 0;">
        <p style="font-size: 12px; text-align: right;">मुख्याध्यापक / स्वयंपाकी स्वाक्षरी</p>
      </div>
    `;

    document.body.classList.remove('print-formb', 'print-monthly', 'print-yearly', 'print-register');
    document.body.classList.add('print-slip', 'print-portrait');
    setTimeout(() => {
      window.print();
    }, 150);
  },

  /**
   * Render Recent Days Ribbon at bottom of Daily Entry
   */
  renderRecentDaysRibbon() {
    const grid = document.getElementById('recentDaysGrid');
    if (!grid) return;
    grid.innerHTML = '';

    const sortedDates = Object.keys(this.data.records).sort().reverse().slice(0, 8);
    sortedDates.forEach(dateStr => {
      const rec = this.data.records[dateStr];
      const card = document.createElement('div');
      card.className = 'recent-day-card';
      card.onclick = () => {
        document.getElementById('entryDate').value = dateStr;
        this.onDateChanged();
      };
      card.innerHTML = `
        <div class="recent-date">${dateStr.substring(8, 10)}/${dateStr.substring(5, 7)}</div>
        <div class="recent-menu">${rec.isHoliday ? '🏖️ सुट्टी' : rec.menuName}</div>
        <div class="recent-children">${rec.children} विद्यार्थी</div>
      `;
      grid.appendChild(card);
    });
  },

  // =========================================================================
  // MONTHLY STOCK ENGINE & REGISTER
  // =========================================================================

  /**
   * Calculate Opening Stock as of target date 00:00 (Initial stock + Receipts strictly before targetDate - Consumed strictly before targetDate)
   */
  computeStockForDate(targetDateStr, section = this.activeSection) {
    const initStock = this.getActiveInitialStock(section);
    const receipts = this.getActiveReceipts(section);
    const records = this.getActiveRecords(section);
    const damaged = this.getActiveDamaged(section);

    const balances = Object.assign({}, initStock);

    // Add all receipts before target date (strictly before 00:00 of target date)
    (receipts || []).forEach(r => {
      if (r.date < targetDateStr) {
        Object.keys(r.items || {}).forEach(k => {
          balances[k] = (balances[k] || 0) + (parseFloat(r.items[k]) || 0);
        });
      }
    });

    // Subtract all consumption before (and not including) target date
    Object.keys(records || {}).forEach(d => {
      if (d < targetDateStr) {
        const rec = records[d];
        Object.keys(rec.quantities || {}).forEach(k => {
          balances[k] = (balances[k] || 0) - (rec.quantities[k] || 0);
        });
      }
    });

    // Subtract all damaged / expired stock before target date
    (damaged || []).forEach(d => {
      if (d.date < targetDateStr) {
        Object.keys(d.items || {}).forEach(k => {
          balances[k] = (balances[k] || 0) - (parseFloat(d.items[k]) || 0);
        });
      }
    });

    return balances;
  },

  /**
   * Calculate current live available stock (Initial Stock + ALL Receipts - ALL Consumption - ALL Damaged Stock to date)
   */
  computeCurrentLiveStock(section = this.activeSection) {
    if (section === 'combined') {
      const pStock = this.computeCurrentLiveStock('primary');
      const uStock = this.computeCurrentLiveStock('upper');
      const combined = {};
      Object.keys(this.data.ingredients).forEach(k => {
        combined[k] = +((pStock[k] || 0) + (uStock[k] || 0)).toFixed(4);
      });
      return combined;
    }

    const initStock = this.getActiveInitialStock(section);
    const receipts = this.getActiveReceipts(section);
    const records = this.getActiveRecords(section);
    const damaged = this.getActiveDamaged(section);

    const balances = Object.assign({}, initStock);

    (receipts || []).forEach(r => {
      Object.keys(r.items || {}).forEach(k => {
        balances[k] = (balances[k] || 0) + (parseFloat(r.items[k]) || 0);
      });
    });

    Object.keys(records || {}).forEach(d => {
      const rec = records[d];
      Object.keys(rec.quantities || {}).forEach(k => {
        balances[k] = (balances[k] || 0) - (rec.quantities[k] || 0);
      });
    });

    (damaged || []).forEach(d => {
      Object.keys(d.items || {}).forEach(k => {
        balances[k] = (balances[k] || 0) - (parseFloat(d.items[k]) || 0);
      });
    });

    return balances;
  },

  /**
   * Compute full monthly stock summary (Opening, Received, Consumed, Closing, Totals)
   * Consumed includes: Cooking Consumption + Damaged / Expired stock in that particular month
   */
  computeMonthlyStock(yearMonth, section = this.activeSection) {
    const [yearStr, monthStr] = yearMonth.split('-');
    const year = parseInt(yearStr);
    const month = parseInt(monthStr);
    const daysInMonth = new Date(year, month, 0).getDate();

    const firstDateOfMonth = `${yearMonth}-01`;
    const lastDateOfMonth = `${yearMonth}-${String(daysInMonth).padStart(2, '0')}`;

    const records = this.getActiveRecords(section);
    const receipts = this.getActiveReceipts(section);
    const damagedStock = this.getActiveDamaged(section);

    // 1. Opening Balance at start of month
    const opening = this.computeStockForDate(firstDateOfMonth, section);

    // 2. Received during the month
    const received = {};
    Object.keys(this.data.ingredients).forEach(k => received[k] = 0);

    (receipts || []).forEach(r => {
      if (r.date >= firstDateOfMonth && r.date <= lastDateOfMonth) {
        Object.keys(r.items || {}).forEach(k => {
          received[k] = (received[k] || 0) + (parseFloat(r.items[k]) || 0);
        });
      }
    });

    // 3. Total Available = Opening + Received
    const totalAvailable = {};
    Object.keys(this.data.ingredients).forEach(k => {
      totalAvailable[k] = (opening[k] || 0) + (received[k] || 0);
    });

    // 4. Consumed during the month (Cooking meals + Damaged / Expired Grain Write-off)
    const cookingConsumed = {};
    const damaged = {};
    const consumed = {};
    Object.keys(this.data.ingredients).forEach(k => {
      cookingConsumed[k] = 0;
      damaged[k] = 0;
      consumed[k] = 0;
    });

    let totalPlates = 0;
    let workingDays = 0;
    let totalFuel = 0;

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${yearMonth}-${String(day).padStart(2, '0')}`;
      const rec = records[dateStr];
      if (rec && !rec.isHoliday && rec.children > 0) {
        workingDays++;
        totalPlates += (rec.plates || rec.children);
        totalFuel += (rec.fuelCost || 0);

        Object.keys(rec.quantities || {}).forEach(k => {
          cookingConsumed[k] = (cookingConsumed[k] || 0) + (rec.quantities[k] || 0);
        });
      }
    }

    // Add Damaged / Expired stock transactions for this specific month
    (damagedStock || []).forEach(d => {
      if (d.date >= firstDateOfMonth && d.date <= lastDateOfMonth) {
        Object.keys(d.items || {}).forEach(k => {
          damaged[k] = (damaged[k] || 0) + (parseFloat(d.items[k]) || 0);
        });
      }
    });

    // Total Consumed / Reduced = Cooking Consumption + Damaged stock write-off
    Object.keys(this.data.ingredients).forEach(k => {
      consumed[k] = +((cookingConsumed[k] || 0) + (damaged[k] || 0)).toFixed(4);
    });

    // 5. Closing Balance = Total Available - Consumed
    const closing = {};
    Object.keys(this.data.ingredients).forEach(k => {
      closing[k] = +(totalAvailable[k] - (consumed[k] || 0)).toFixed(4);
    });

    return {
      yearMonth,
      section,
      opening,
      received,
      totalAvailable,
      cookingConsumed,
      damaged,
      consumed,
      closing,
      totalPlates,
      workingDays,
      totalFuel: +totalFuel.toFixed(2)
    };
  },

  // =========================================================================
  // TAB 2: DAILY REGISTER RENDERING
  // =========================================================================

  onRegisterMonthChange() {
    this.renderDailyRegister();
  },

  renderDailyRegister() {
    const monthPicker = document.getElementById('registerMonthSelect');
    if (!monthPicker) return;
    const yearMonth = monthPicker.value;

    const summary = this.computeMonthlyStock(yearMonth, this.activeSection);

    // Update section badge and switcher controls if present
    const regSectionBadge = document.getElementById('registerSectionBadge');
    if (regSectionBadge) {
      regSectionBadge.textContent = this.getActiveSectionName();
    }
    const btnRegP = document.getElementById('regTogglePrimary');
    const btnRegU = document.getElementById('regToggleUpper');
    if (btnRegP && btnRegU) {
      btnRegP.classList.toggle('active', this.activeSection === 'primary');
      btnRegU.classList.toggle('active', this.activeSection === 'upper');
    }

    // Update stat cards
    document.getElementById('statWorkingDays').textContent = summary.workingDays;
    document.getElementById('statTotalPlates').textContent = summary.totalPlates;
    document.getElementById('statTotalRice').textContent = `${(summary.consumed.rice || 0).toFixed(2)} kg`;
    
    const pulseTotal = (summary.consumed.moong_dal || 0) + 
                       (summary.consumed.masoor_dal || 0) + 
                       (summary.consumed.matki || 0) + 
                       (summary.consumed.moong || 0) + 
                       (summary.consumed.chavali || 0) + 
                       (summary.consumed.chana || 0) + 
                       (summary.consumed.vatana || 0) + 
                       (summary.consumed.soyavadi || 0) + 
                       (summary.consumed.tur_dal || 0);
    document.getElementById('statTotalPulses').textContent = `${pulseTotal.toFixed(2)} kg`;
    document.getElementById('statTotalFuel').textContent = `रु. ${summary.totalFuel}`;

    // Populate Table Rows
    const tableBody = document.getElementById('registerTableBody');
    const tableFoot = document.getElementById('registerTableFoot');
    if (!tableBody) return;
    tableBody.innerHTML = '';

    const [yearStr, monthStr] = yearMonth.split('-');
    const daysInMonth = new Date(parseInt(yearStr), parseInt(monthStr), 0).getDate();
    const records = this.getActiveRecords();

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${yearMonth}-${String(day).padStart(2, '0')}`;
      const rec = records[dateStr] || this.calculateEmptyDay(dateStr);
      const isHoliday = rec.isHoliday || rec.children === 0;

      const q = rec.quantities || {};
      const pulseDaily = (q.moong_dal || 0) + (q.masoor_dal || 0) + (q.matki || 0) + 
                         (q.moong || 0) + (q.chavali || 0) + (q.chana || 0) + 
                         (q.vatana || 0) + (q.soyavadi || 0) + (q.tur_dal || 0);

      const tr = document.createElement('tr');
      if (isHoliday) tr.className = 'holiday-row';

      tr.innerHTML = `
        <td class="text-center"><strong>${day}</strong></td>
        <td>${rec.dayName}</td>
        <td class="text-center">${rec.dayCode}</td>
        <td>${isHoliday ? 'सुट्टी' : this.getDisplayMenuName(rec)}</td>
        <td class="text-center">${rec.children}</td>
        <td class="text-center">${rec.plates}</td>
        <td class="text-right">${isHoliday ? '0' : (q.rice || 0).toFixed(3)}</td>
        <td class="text-right">${q.moong_dal ? q.moong_dal.toFixed(3) : '—'}</td>
        <td class="text-right">${q.tur_dal ? q.tur_dal.toFixed(3) : '—'}</td>
        <td class="text-right">${q.masoor_dal ? q.masoor_dal.toFixed(3) : '—'}</td>
        <td class="text-right">${q.matki ? q.matki.toFixed(3) : '—'}</td>
        <td class="text-right">${q.moong ? q.moong.toFixed(3) : '—'}</td>
        <td class="text-right">${q.chavali ? q.chavali.toFixed(3) : '—'}</td>
        <td class="text-right">${q.chana ? q.chana.toFixed(3) : '—'}</td>
        <td class="text-right">${q.vatana ? q.vatana.toFixed(3) : '—'}</td>
        <td class="text-right">${q.soyavadi ? q.soyavadi.toFixed(3) : '—'}</td>
        <td class="text-right"><strong>${isHoliday ? '0' : pulseDaily.toFixed(3)}</strong></td>
        <td class="text-right">${q.cumin ? (q.cumin * 1000).toFixed(1) : '—'}</td>
        <td class="text-right">${q.mustard ? (q.mustard * 1000).toFixed(1) : '—'}</td>
        <td class="text-right">${q.turmeric ? (q.turmeric * 1000).toFixed(1) : '—'}</td>
        <td class="text-right">${q.chilli ? (q.chilli * 1000).toFixed(1) : '—'}</td>
        <td class="text-right">${q.oil ? (q.oil * 1000).toFixed(0) : '—'}</td>
        <td class="text-right">${q.salt ? (q.salt * 1000).toFixed(1) : '—'}</td>
        <td class="text-right">${q.masala ? (q.masala * 1000).toFixed(1) : '—'}</td>
        <td class="text-right">${isHoliday ? '0' : rec.fuelCost}</td>
        <td><small>${rec.remarks || ''}</small></td>
        <td class="no-print text-center">
          <button class="btn btn-sm btn-outline-primary" onclick="app.editDayRecord('${dateStr}')">✏️ बदल</button>
        </td>
      `;
      tableBody.appendChild(tr);
    }

    // Foot summary row
    if (tableFoot) {
      tableFoot.innerHTML = `
        <tr style="background: #f1f5f9; font-weight: 800;">
          <td colspan="4" class="text-center">एकूण महिना बेरीज:</td>
          <td class="text-center">${summary.totalPlates}</td>
          <td class="text-center">${summary.totalPlates}</td>
          <td class="text-right">${(summary.consumed.rice || 0).toFixed(3)}</td>
          <td class="text-right">${(summary.consumed.moong_dal || 0).toFixed(3)}</td>
          <td class="text-right">${(summary.consumed.tur_dal || 0).toFixed(3)}</td>
          <td class="text-right">${(summary.consumed.masoor_dal || 0).toFixed(3)}</td>
          <td class="text-right">${(summary.consumed.matki || 0).toFixed(3)}</td>
          <td class="text-right">${(summary.consumed.moong || 0).toFixed(3)}</td>
          <td class="text-right">${(summary.consumed.chavali || 0).toFixed(3)}</td>
          <td class="text-right">${(summary.consumed.chana || 0).toFixed(3)}</td>
          <td class="text-right">${(summary.consumed.vatana || 0).toFixed(3)}</td>
          <td class="text-right">${(summary.consumed.soyavadi || 0).toFixed(3)}</td>
          <td class="text-right">${pulseTotal.toFixed(3)}</td>
          <td class="text-right">${((summary.consumed.cumin || 0) * 1000).toFixed(1)}</td>
          <td class="text-right">${((summary.consumed.mustard || 0) * 1000).toFixed(1)}</td>
          <td class="text-right">${((summary.consumed.turmeric || 0) * 1000).toFixed(1)}</td>
          <td class="text-right">${((summary.consumed.chilli || 0) * 1000).toFixed(1)}</td>
          <td class="text-right">${((summary.consumed.oil || 0) * 1000).toFixed(0)}</td>
          <td class="text-right">${((summary.consumed.salt || 0) * 1000).toFixed(1)}</td>
          <td class="text-right">${((summary.consumed.masala || 0) * 1000).toFixed(1)}</td>
          <td class="text-right">रु. ${summary.totalFuel}</td>
          <td colspan="2"></td>
        </tr>
      `;
    }
  },

  editDayRecord(dateStr) {
    this.switchTab('daily');
    const dateInput = document.getElementById('entryDate');
    if (dateInput) {
      dateInput.value = dateStr;
      this.onDateChanged();
    }
  },

  printDailyRegister() {
    this.switchTab('register');
    this.setPrintPageOrientation('landscape');
    document.body.classList.remove('print-portrait', 'print-formb', 'print-yearly', 'print-monthly');
    document.body.classList.add('print-register', 'print-landscape');
    setTimeout(() => {
      window.print();
    }, 150);
  },

  // =========================================================================
  // TAB 3: MONTHLY EXCEL SHEET VIEW (हुबेहूब मूळ एक्सेल फॉरमॅट)
  // =========================================================================

  onMonthlyExcelChange() {
    const picker = document.getElementById('monthlyExcelPicker');
    if (picker && picker.value) {
      const ym = picker.value;
      const [yearStr, monthStr] = ym.split('-');
      const year = parseInt(yearStr);
      const month = parseInt(monthStr);

      const acadStartYear = (month >= 4) ? year : (year - 1);
      const acadEndYear = acadStartYear + 1;
      const finYearVal = `${acadStartYear}-${acadEndYear}`;

      const yearlySelect = document.getElementById('yearlyYearSelect');
      if (yearlySelect && Array.from(yearlySelect.options).some(o => o.value === finYearVal)) {
        yearlySelect.value = finYearVal;
      }

      const regPicker = document.getElementById('registerMonthSelect');
      if (regPicker) regPicker.value = ym;
      const fbPicker = document.getElementById('formbMonthPicker');
      if (fbPicker) fbPicker.value = ym;
      const expPicker = document.getElementById('exportMonthSelect');
      if (expPicker) expPicker.value = ym;
    }
    this.renderMonthlyExcelSheet();
  },

  openYearlyFromMonthly() {
    const picker = document.getElementById('monthlyExcelPicker');
    const yearMonth = picker ? picker.value : '2024-04';
    const [yearStr, monthStr] = yearMonth.split('-');
    const year = parseInt(yearStr);
    const month = parseInt(monthStr);

    const acadStartYear = (month >= 4) ? year : (year - 1);
    const acadEndYear = acadStartYear + 1;
    const finYear = `${acadStartYear}-${acadEndYear}`;

    const yearlySelect = document.getElementById('yearlyYearSelect');
    if (yearlySelect) {
      if (Array.from(yearlySelect.options).some(o => o.value === finYear)) {
        yearlySelect.value = finYear;
      }
    }

    this.switchTab('yearly');
    this.renderYearlyReport();
    this.showToast(`📅 सन ${acadStartYear}-${acadEndYear} चा वार्षिक अहवाल उघडला आहे.`, 'info');
  },

  renderMonthlyExcelSheet() {
    const picker = document.getElementById('monthlyExcelPicker');
    if (!picker) return;
    const yearMonth = picker.value;

    const [yearStr, monthStr] = yearMonth.split('-');
    const year = parseInt(yearStr);
    const month = parseInt(monthStr);
    const daysInMonth = new Date(year, month, 0).getDate();

    const monthNamesMarathi = [
      '', 'जानेवारी', 'फेब्रुवारी', 'मार्च', 'एप्रिल', 'मे', 'जून',
      'जुलै', 'ऑगस्ट', 'सप्टेंबर', 'ऑक्टोबर', 'नोव्हेंबर', 'डिसेंबर'
    ];

    const acadStartYear = (month >= 4) ? year : (year - 1);
    const acadEndYear = acadStartYear + 1;
    const secTitle = this.activeSection === 'upper' ? 'इ. 6 वी ते 8 वी' : 'इ. 1 ली ते 5 वी';
    document.getElementById('excelHeaderTitle').textContent = `शालेय पोषण आहार सन ${acadStartYear}-${acadEndYear} ${secTitle}`;
    document.getElementById('exSchoolName').textContent = this.data.settings.schoolName;
    document.getElementById('exCentre').textContent = this.data.settings.centre;
    document.getElementById('exTaluka').textContent = this.data.settings.taluka;
    document.getElementById('exDistrict').textContent = this.data.settings.district;
    document.getElementById('exMonthText').textContent = `${monthNamesMarathi[month]} ${year}`;
    
    // Update section toggle buttons
    const btnMonP = document.getElementById('monTogglePrimary');
    const btnMonU = document.getElementById('monToggleUpper');
    if (btnMonP && btnMonU) {
      btnMonP.classList.toggle('active', this.activeSection === 'primary');
      btnMonU.classList.toggle('active', this.activeSection === 'upper');
    }

    const exRateFuel = document.getElementById('exRateFuel');
    if (exRateFuel) exRateFuel.textContent = this.getActiveFuelRate();

    // Dynamically update all ingredient rates in Monthly Excel table header according to active section
    Object.keys(this.data.ingredients || {}).forEach(k => {
      const el = document.getElementById(`exRate_${k}`);
      if (el) el.textContent = this.getIngredientRate(k, this.activeSection);
    });

    const summary = this.computeMonthlyStock(yearMonth, this.activeSection);
    const op = summary.opening;
    const rc = summary.received;
    const totAvail = summary.totalAvailable;
    const con = summary.consumed;
    const clo = summary.closing;

    const tableBody = document.getElementById('officialExcelTableBody');
    if (!tableBody) return;
    tableBody.innerHTML = '';

    // Row 7: Opening Stock
    const trOpen = document.createElement('tr');
    trOpen.style.background = '#f8fafc';
    trOpen.innerHTML = `
      <td></td>
      <td colspan="4" style="text-align: left; font-weight: 700;">मागील शिल्लक धान्य/किराणा :-</td>
      <td>${(op.rice || 0).toFixed(2)}</td>
      <td>${(op.moong_dal || 0).toFixed(2)}</td>
      <td>${(op.tur_dal || 0).toFixed(2)}</td>
      <td>${(op.masoor_dal || 0).toFixed(2)}</td>
      <td>${(op.matki || 0).toFixed(2)}</td>
      <td>${(op.moong || 0).toFixed(2)}</td>
      <td>${(op.chavali || 0).toFixed(2)}</td>
      <td>${(op.chana || 0).toFixed(2)}</td>
      <td>${(op.vatana || 0).toFixed(2)}</td>
      <td>${(op.cumin || 0).toFixed(3)}</td>
      <td>${(op.mustard || 0).toFixed(3)}</td>
      <td>${(op.turmeric || 0).toFixed(3)}</td>
      <td>${(op.chilli || 0).toFixed(3)}</td>
      <td>${(op.oil || 0).toFixed(3)}</td>
      <td>${(op.salt || 0).toFixed(3)}</td>
      <td>${(op.masala || 0).toFixed(3)}</td>
      <td>${(op.soyavadi || 0).toFixed(2)}</td>
      <td></td>
    `;
    tableBody.appendChild(trOpen);

    // Row 8: Received Stock
    const trRec = document.createElement('tr');
    trRec.style.background = '#f8fafc';
    trRec.innerHTML = `
      <td></td>
      <td colspan="4" style="text-align: left; font-weight: 700;">प्राप्त धान्य/किराणा :-</td>
      <td>${(rc.rice || 0).toFixed(2)}</td>
      <td>${(rc.moong_dal || 0).toFixed(2)}</td>
      <td>${(rc.tur_dal || 0).toFixed(2)}</td>
      <td>${(rc.masoor_dal || 0).toFixed(2)}</td>
      <td>${(rc.matki || 0).toFixed(2)}</td>
      <td>${(rc.moong || 0).toFixed(2)}</td>
      <td>${(rc.chavali || 0).toFixed(2)}</td>
      <td>${(rc.chana || 0).toFixed(2)}</td>
      <td>${(rc.vatana || 0).toFixed(2)}</td>
      <td>${(rc.cumin || 0).toFixed(3)}</td>
      <td>${(rc.mustard || 0).toFixed(3)}</td>
      <td>${(rc.turmeric || 0).toFixed(3)}</td>
      <td>${(rc.chilli || 0).toFixed(3)}</td>
      <td>${(rc.oil || 0).toFixed(3)}</td>
      <td>${(rc.salt || 0).toFixed(3)}</td>
      <td>${(rc.masala || 0).toFixed(3)}</td>
      <td>${(rc.soyavadi || 0).toFixed(2)}</td>
      <td></td>
    `;
    tableBody.appendChild(trRec);

    // Row 9: Total Available
    const trTot = document.createElement('tr');
    trTot.style.background = '#e2e8f0';
    trTot.innerHTML = `
      <td></td>
      <td colspan="4" style="text-align: left; font-weight: 800;">एकूण प्राप्त धान्य/किराणा :-</td>
      <td>${(totAvail.rice || 0).toFixed(2)}</td>
      <td>${(totAvail.moong_dal || 0).toFixed(2)}</td>
      <td>${(totAvail.tur_dal || 0).toFixed(2)}</td>
      <td>${(totAvail.masoor_dal || 0).toFixed(2)}</td>
      <td>${(totAvail.matki || 0).toFixed(2)}</td>
      <td>${(totAvail.moong || 0).toFixed(2)}</td>
      <td>${(totAvail.chavali || 0).toFixed(2)}</td>
      <td>${(totAvail.chana || 0).toFixed(2)}</td>
      <td>${(totAvail.vatana || 0).toFixed(2)}</td>
      <td>${(totAvail.cumin || 0).toFixed(3)}</td>
      <td>${(totAvail.mustard || 0).toFixed(3)}</td>
      <td>${(totAvail.turmeric || 0).toFixed(3)}</td>
      <td>${(totAvail.chilli || 0).toFixed(3)}</td>
      <td>${(totAvail.oil || 0).toFixed(3)}</td>
      <td>${(totAvail.salt || 0).toFixed(3)}</td>
      <td>${(totAvail.masala || 0).toFixed(3)}</td>
      <td>${(totAvail.soyavadi || 0).toFixed(2)}</td>
      <td></td>
    `;
    tableBody.appendChild(trTot);

    // Daily Rows 10 to 40
    const records = this.getActiveRecords();
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${yearMonth}-${String(day).padStart(2, '0')}`;
      const rec = records[dateStr] || this.calculateEmptyDay(dateStr);
      const isHoliday = rec.isHoliday || rec.children === 0;
      const q = rec.quantities || {};

      const tr = document.createElement('tr');
      if (isHoliday) tr.style.background = '#fef2f2';

      tr.innerHTML = `
        <td>${day}</td>
        <td>${rec.dayName}</td>
        <td>${isHoliday ? '' : this.getDisplayMenuName(rec)}</td>
        <td>${rec.children}</td>
        <td>${rec.plates}</td>
        <td>${isHoliday ? '0' : (q.rice || 0).toFixed(2)}</td>
        <td>${q.moong_dal ? q.moong_dal.toFixed(2) : ''}</td>
        <td>${q.tur_dal ? q.tur_dal.toFixed(2) : ''}</td>
        <td>${q.masoor_dal ? q.masoor_dal.toFixed(2) : ''}</td>
        <td>${q.matki ? q.matki.toFixed(2) : ''}</td>
        <td>${q.moong ? q.moong.toFixed(2) : ''}</td>
        <td>${q.chavali ? q.chavali.toFixed(2) : ''}</td>
        <td>${q.chana ? q.chana.toFixed(2) : ''}</td>
        <td>${q.vatana ? q.vatana.toFixed(2) : ''}</td>
        <td>${q.cumin ? (q.cumin * 1000).toFixed(2) : ''}</td>
        <td>${q.mustard ? (q.mustard * 1000).toFixed(2) : ''}</td>
        <td>${q.turmeric ? (q.turmeric * 1000).toFixed(2) : ''}</td>
        <td>${q.chilli ? (q.chilli * 1000).toFixed(2) : ''}</td>
        <td>${q.oil ? (q.oil * 1000).toFixed(1) : ''}</td>
        <td>${q.salt ? (q.salt * 1000).toFixed(2) : ''}</td>
        <td>${q.masala ? (q.masala * 1000).toFixed(2) : ''}</td>
        <td>${q.soyavadi ? q.soyavadi.toFixed(2) : ''}</td>
        <td>${isHoliday ? '' : rec.fuelCost}</td>
      `;
      tableBody.appendChild(tr);
    }

    // Row 41: Consumed Row
    const trCon = document.createElement('tr');
    trCon.style.background = '#f1f5f9';
    trCon.style.fontWeight = '800';
    trCon.innerHTML = `
      <td colspan="4" style="text-align: left;">एकूण वापरलेले धान्य/किराणा :-</td>
      <td>${summary.totalPlates}</td>
      <td>${(con.rice || 0).toFixed(2)}</td>
      <td>${(con.moong_dal || 0).toFixed(2)}</td>
      <td>${(con.tur_dal || 0).toFixed(2)}</td>
      <td>${(con.masoor_dal || 0).toFixed(2)}</td>
      <td>${(con.matki || 0).toFixed(2)}</td>
      <td>${(con.moong || 0).toFixed(2)}</td>
      <td>${(con.chavali || 0).toFixed(2)}</td>
      <td>${(con.chana || 0).toFixed(2)}</td>
      <td>${(con.vatana || 0).toFixed(2)}</td>
      <td>${((con.cumin || 0) * 1000).toFixed(2)}</td>
      <td>${((con.mustard || 0) * 1000).toFixed(2)}</td>
      <td>${((con.turmeric || 0) * 1000).toFixed(2)}</td>
      <td>${((con.chilli || 0) * 1000).toFixed(2)}</td>
      <td>${((con.oil || 0) * 1000).toFixed(1)}</td>
      <td>${((con.salt || 0) * 1000).toFixed(2)}</td>
      <td>${((con.masala || 0) * 1000).toFixed(2)}</td>
      <td>${(con.soyavadi || 0).toFixed(2)}</td>
      <td>${summary.totalFuel}</td>
    `;
    tableBody.appendChild(trCon);

    // Row 42: Closing Balance Row
    const trClo = document.createElement('tr');
    trClo.style.background = '#fef08a';
    trClo.style.fontWeight = '800';
    trClo.innerHTML = `
      <td colspan="4" style="text-align: left;">शिल्लक धान्य/किराणा :-</td>
      <td></td>
      <td>${(clo.rice || 0).toFixed(2)}</td>
      <td>${(clo.moong_dal || 0).toFixed(2)}</td>
      <td>${(clo.tur_dal || 0).toFixed(2)}</td>
      <td>${(clo.masoor_dal || 0).toFixed(2)}</td>
      <td>${(clo.matki || 0).toFixed(2)}</td>
      <td>${(clo.moong || 0).toFixed(2)}</td>
      <td>${(clo.chavali || 0).toFixed(2)}</td>
      <td>${(clo.chana || 0).toFixed(2)}</td>
      <td>${(clo.vatana || 0).toFixed(2)}</td>
      <td>${((clo.cumin || 0) * 1000).toFixed(2)}</td>
      <td>${((clo.mustard || 0) * 1000).toFixed(2)}</td>
      <td>${((clo.turmeric || 0) * 1000).toFixed(2)}</td>
      <td>${((clo.chilli || 0) * 1000).toFixed(2)}</td>
      <td>${((clo.oil || 0) * 1000).toFixed(1)}</td>
      <td>${((clo.salt || 0) * 1000).toFixed(2)}</td>
      <td>${((clo.masala || 0) * 1000).toFixed(2)}</td>
      <td>${(clo.soyavadi || 0).toFixed(2)}</td>
      <td></td>
    `;
    tableBody.appendChild(trClo);

    // Footer stats
    document.getElementById('exFooterPlates').textContent = summary.totalPlates;
    document.getElementById('exFooterWorkingDays').textContent = summary.workingDays;
    document.getElementById('exFooterPat').textContent = this.getActivePat();
    const signCentre = document.getElementById('exSignCentre');
    if (signCentre) signCentre.textContent = this.data.settings.centre;
  },

  printMonthlyReport() {
    this.switchTab('monthly');
    this.setPrintPageOrientation('landscape', 'A4', '6mm 10mm 6mm 10mm');
    document.body.classList.remove('print-portrait', 'print-formb', 'print-yearly', 'print-register', 'print-taste');
    document.body.classList.add('print-monthly', 'print-landscape');
    setTimeout(() => {
      window.print();
    }, 150);
  },

  // =========================================================================
  // TAB 4: FORM B (प्रपत्र ब)
  // =========================================================================

  onFormBMonthChange() {
    this.renderFormB();
  },

  renderFormB() {
    const picker = document.getElementById('formbMonthPicker');
    if (!picker) return;
    const yearMonth = picker.value;

    const [yearStr, monthStr] = yearMonth.split('-');
    const year = parseInt(yearStr);
    const month = parseInt(monthStr);

    const monthNamesMarathi = [
      '', 'जानेवारी', 'फेब्रुवारी', 'मार्च', 'एप्रिल', 'मे', 'जून',
      'जुलै', 'ऑगस्ट', 'सप्टेंबर', 'ऑक्टोबर', 'नोव्हेंबर', 'डिसेंबर'
    ];

    const isUpper = this.activeSection === 'upper';
    const secName = this.getActiveSectionName();

    // Update section toggle buttons and badges
    const btnFbP = document.getElementById('fbTogglePrimary');
    const btnFbU = document.getElementById('fbToggleUpper');
    if (btnFbP && btnFbU) {
      btnFbP.classList.toggle('active', !isUpper);
      btnFbU.classList.toggle('active', isUpper);
    }
    const fbSecBadge = document.getElementById('fbSectionBadge');
    if (fbSecBadge) fbSecBadge.textContent = secName;
    const fbTitleSection = document.getElementById('fbTitleSection');
    if (fbTitleSection) fbTitleSection.textContent = isUpper ? '(इ. 6 ते 8)' : '(इ. 1 ते 5)';

    const pat = this.getActivePat();
    const fuelRate = this.getActiveFuelRate();

    document.getElementById('fbSchoolName').textContent = this.data.settings.schoolName;
    document.getElementById('fbCentre').textContent = this.data.settings.centre;
    document.getElementById('fbTaluka').textContent = this.data.settings.taluka;
    document.getElementById('fbDistrict').textContent = this.data.settings.district;
    document.getElementById('fbMonthYear').textContent = `${monthNamesMarathi[month]} ${year}`;
    document.getElementById('fbPat').textContent = pat;

    const summary = this.computeMonthlyStock(yearMonth, this.activeSection);
    document.getElementById('fbTotalPlates').textContent = summary.totalPlates;
    document.getElementById('fbWorkingDays').textContent = summary.workingDays;
    document.getElementById('fbMealDays').textContent = summary.workingDays;

    document.getElementById('fbFootPlates').textContent = summary.totalPlates;
    document.getElementById('fbCalcPlates').textContent = summary.totalPlates;
    document.getElementById('fbFuelRate').textContent = fuelRate;

    const fuelAmt = Math.round(summary.totalPlates * fuelRate);
    document.getElementById('fbFuelTotal').textContent = fuelAmt;

    const cookRate = this.data.settings.cookHonorarium || 2500;
    const cookCount = this.data.settings.cookCount || 1;
    const cookAmt = cookRate * cookCount;
    document.getElementById('fbCookHonorarium').textContent = cookAmt;
    const fbCookRateEl = document.getElementById('fbCookRate');
    if (fbCookRateEl) fbCookRateEl.textContent = cookRate;
    document.getElementById('fbCookCount').textContent = cookCount;

    // Check receipts for this month to populate receipt date and bill no for active section
    const activeReceipts = this.getActiveReceipts();
    const receiptsInMonth = (activeReceipts || []).filter(r => r.date && r.date.startsWith(yearMonth));
    const receiptDateEl = document.getElementById('fbReceiptDate');
    if (receiptDateEl) {
      if (receiptsInMonth.length > 0) {
        const str = receiptsInMonth.map(r => {
          const [yr, mo, dy] = r.date.split('-');
          const dmy = `${dy}/${mo}/${yr}`;
          return r.billNo ? `${dmy} (${r.billNo})` : dmy;
        }).join(', ');
        receiptDateEl.textContent = str;
      } else {
        receiptDateEl.textContent = 'निरंक / —';
      }
    }

    document.getElementById('fbReportDate').textContent = this.formatDateEnglish(new Date());
    document.getElementById('fbSignSchool').textContent = this.data.settings.schoolName;
    document.getElementById('fbSignCentre2').textContent = this.data.settings.centre;

    const tableBody = document.getElementById('formbTableBody');
    if (!tableBody) return;
    tableBody.innerHTML = '';

    const fbItems = Object.keys(this.data.ingredients).map(key => {
      const ing = this.data.ingredients[key];
      return {
        name: ing.name,
        key: key,
        rate: this.getIngredientRate(key, this.activeSection),
        unit: ing.unit,
        category: ing.category
      };
    });

    const customDemands = this.getActiveCustomDemands();

    fbItems.forEach((item, idx) => {
      const opQty = summary.opening[item.key] || 0;
      const recQty = summary.received[item.key] || 0;
      const totQty = summary.totalAvailable[item.key] || 0;
      const conQty = summary.consumed[item.key] || 0;
      const cloQty = summary.closing[item.key] || 0;

      const dec = item.rate < 0.001 ? 3 : 2;
      const dec4 = item.rate < 0.001 ? 4 : 2;

      const defaultDemand = +(item.rate * pat * 20).toFixed(dec);
      const demandVal = (customDemands && customDemands[yearMonth] && customDemands[yearMonth][item.key] !== undefined)
        ? customDemands[yearMonth][item.key]
        : defaultDemand;

      const remarkVal = (this.data.formBRemarks && this.data.formBRemarks[yearMonth] && this.data.formBRemarks[yearMonth][item.key])
        ? this.data.formBRemarks[yearMonth][item.key]
        : '';

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="text-center font-weight-bold">${idx + 1}</td>
        <td><strong>${item.name}</strong></td>
        <td class="text-right fb-cell-op">${opQty.toFixed(dec)}</td>
        <td class="text-right fb-cell-rec">${recQty.toFixed(dec)}</td>
        <td class="text-right fb-cell-tot">${totQty.toFixed(dec)}</td>
        <td class="text-right fb-cell-con"><strong>${conQty.toFixed(dec4)}</strong></td>
        <td class="text-right fb-cell-clo"><strong>${cloQty.toFixed(dec)}</strong></td>
        <td class="text-right fb-cell-demand font-weight-bold" style="background: #faf5ff;">
          <input type="number" 
                 step="${item.rate < 0.001 ? '0.001' : '0.01'}" 
                 min="0" 
                 class="form-control form-control-sm fb-input-demand" 
                 value="${demandVal}" 
                 data-key="${item.key}"
                 oninput="app.onFormBDemandChange('${yearMonth}', '${item.key}', this.value)"
                 title="मागणी संपादित करा">
          <span class="print-val">${demandVal}</span>
        </td>
        <td class="text-center fb-cell-shera">
          <input type="text" 
                 class="form-control form-control-sm fb-input-shera" 
                 value="${remarkVal}" 
                 placeholder="शेरा..."
                 data-key="${item.key}"
                 oninput="app.onFormBRemarkChange('${yearMonth}', '${item.key}', this.value)"
                 title="शेरा संपादित करा">
          <span class="print-val">${remarkVal}</span>
        </td>
      `;
      tableBody.appendChild(tr);
    });

    const dmgBox = document.getElementById('fbDamagedNoteBox');
    const damagedKeys = Object.keys(summary.damaged || {}).filter(k => summary.damaged[k] > 0);
    if (dmgBox) {
      if (damagedKeys.length > 0) {
        const details = damagedKeys.map(k => `${this.data.ingredients[k]?.name || k}: ${summary.damaged[k]} kg`).join(', ');
        dmgBox.innerHTML = `<strong>⚠️ खराब / नासाडी धान्य नोंद:</strong> या महिन्यात खराब / मुदत संपलेले धान्य (<strong>${details}</strong>) एकूण वापर / शिजवलेल्या धान्यात समाविष्ट करून साठ्याचा ताळेबंद पूर्ण केला आहे.`;
        dmgBox.style.display = 'block';
      } else {
        dmgBox.style.display = 'none';
      }
    }
  },

  /**
   * Handle real-time demand editing in Form B
   */
  onFormBDemandChange(yearMonth, key, val) {
    const isUpper = this.activeSection === 'upper';
    if (isUpper) {
      if (!this.data.customDemandsUpper) this.data.customDemandsUpper = {};
      if (!this.data.customDemandsUpper[yearMonth]) this.data.customDemandsUpper[yearMonth] = {};
      const parsedVal = val === '' ? 0 : parseFloat(val);
      this.data.customDemandsUpper[yearMonth][key] = isNaN(parsedVal) ? 0 : parsedVal;
    } else {
      if (!this.data.customDemands) this.data.customDemands = {};
      if (!this.data.customDemands[yearMonth]) this.data.customDemands[yearMonth] = {};
      const parsedVal = val === '' ? 0 : parseFloat(val);
      this.data.customDemands[yearMonth][key] = isNaN(parsedVal) ? 0 : parsedVal;
    }
    this.saveState();

    // Update corresponding print value in real time
    const input = document.querySelector(`.fb-input-demand[data-key="${key}"]`);
    if (input && input.parentElement) {
      const span = input.parentElement.querySelector('.print-val');
      if (span) span.textContent = isNaN(parsedVal) ? '0' : parsedVal;
    }
  },

  /**
   * Handle real-time remark editing in Form B
   */
  onFormBRemarkChange(yearMonth, key, val) {
    if (!this.data.formBRemarks) this.data.formBRemarks = {};
    if (!this.data.formBRemarks[yearMonth]) this.data.formBRemarks[yearMonth] = {};
    this.data.formBRemarks[yearMonth][key] = val;
    this.saveState();

    // Update corresponding print value in real time
    const input = document.querySelector(`.fb-input-shera[data-key="${key}"]`);
    if (input && input.parentElement) {
      const span = input.parentElement.querySelector('.print-val');
      if (span) span.textContent = val;
    }
  },

  /**
   * Reset Form B demands to 20-day default rule
   */
  resetFormBDemandToDefault() {
    const picker = document.getElementById('formbMonthPicker');
    if (!picker || !picker.value) return;
    const yearMonth = picker.value;
    const isUpper = this.activeSection === 'upper';
    if (isUpper) {
      if (this.data.customDemandsUpper && this.data.customDemandsUpper[yearMonth]) {
        delete this.data.customDemandsUpper[yearMonth];
        this.saveState();
      }
    } else {
      if (this.data.customDemands && this.data.customDemands[yearMonth]) {
        delete this.data.customDemands[yearMonth];
        this.saveState();
      }
    }
    this.renderFormB();
    this.showToast('✅ पुढील महिन्याची मागणी 20 दिवसांच्या नियमानुसार पूर्ववत केली!', 'success');
  },

  printFormB() {
    const printContainer = document.getElementById('printSlipContainer');
    if (printContainer) printContainer.innerHTML = '';
    this.switchTab('formb');
    this.setPrintPageOrientation('portrait', 'A4');
    document.body.classList.remove('print-landscape', 'print-monthly', 'print-yearly', 'print-register', 'print-legal', 'print-slip');
    document.body.classList.add('print-formb', 'print-portrait');
    setTimeout(() => {
      window.print();
    }, 150);
  },

  // =========================================================================
  // TAB 4.5: YEARLY REPORT (1 APRIL TO 31 MARCH)
  // =========================================================================

  onYearlyYearChange() {
    const yearSelect = document.getElementById('yearlyYearSelect');
    const finYear = yearSelect ? yearSelect.value : '2024-2025';
    const [startYear] = finYear.split('-');

    // Synchronize monthly pickers to first active month
    const defaultYm = `${startYear}-04`;
    const picker = document.getElementById('monthlyExcelPicker');
    if (picker) picker.value = defaultYm;
    const regPicker = document.getElementById('registerMonthSelect');
    if (regPicker) regPicker.value = defaultYm;
    const fbPicker = document.getElementById('formbMonthPicker');
    if (fbPicker) fbPicker.value = defaultYm;
    const expPicker = document.getElementById('exportMonthSelect');
    if (expPicker) expPicker.value = defaultYm;

    this.renderYearlyReport();
    this.renderMonthlyExcelSheet();
  },

  openMonthlyExcelFor(yearMonth) {
    const picker = document.getElementById('monthlyExcelPicker');
    if (picker) picker.value = yearMonth;
    const regPicker = document.getElementById('registerMonthSelect');
    if (regPicker) regPicker.value = yearMonth;
    const fbPicker = document.getElementById('formbMonthPicker');
    if (fbPicker) fbPicker.value = yearMonth;
    const expPicker = document.getElementById('exportMonthSelect');
    if (expPicker) expPicker.value = yearMonth;

    this.switchTab('monthly');
    this.renderMonthlyExcelSheet();

    const [y, m] = yearMonth.split('-');
    const monthNames = ['', 'जानेवारी', 'फेब्रुवारी', 'मार्च', 'एप्रिल', 'मे', 'जून', 'जुलै', 'ऑगस्ट', 'सप्टेंबर', 'ऑक्टोबर', 'नोव्हेंबर', 'डिसेंबर'];
    this.showToast(`📊 ${monthNames[parseInt(m)]} ${y} चा मासिक अहवाल उघडला आहे.`, 'info');
  },

  /**
   * Compute 12-month data for Financial/Academic Year (1 April to 31 March)
   * @param {string} finYear - e.g. '2024-2025' or '2019-2020'
   * @param {string} section - 'primary' | 'upper' | 'combined'
   */
  computeYearlyData(finYear, section = this.activeSection) {
    const parts = (finYear || '2024-2025').split('-');
    const startYear = parseInt(parts[0]) || 2024;
    const endYear = parseInt(parts[1]) || (startYear + 1);

    // 12 months sequence: Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec, Jan, Feb, Mar
    const monthConfigs = [
      { num: '04', name: 'एप्रिल', year: startYear },
      { num: '05', name: 'मे', year: startYear },
      { num: '06', name: 'जून', year: startYear },
      { num: '07', name: 'जुलै', year: startYear },
      { num: '08', name: 'ऑगस्ट', year: startYear },
      { num: '09', name: 'सप्टेंबर', year: startYear },
      { num: '10', name: 'ऑक्टोबर', year: startYear },
      { num: '11', name: 'नोव्हेंबर', year: startYear },
      { num: '12', name: 'डिसेंबर', year: startYear },
      { num: '01', name: 'जानेवारी', year: endYear },
      { num: '02', name: 'फेब्रुवारी', year: endYear },
      { num: '03', name: 'मार्च', year: endYear }
    ];

    const monthlySummaries = [];
    const workingDays = [];
    const beneficiaries = [];
    const fuelSubsidy = [];
    const cookHonorarium = [];

    monthConfigs.forEach(m => {
      const yearMonth = `${m.year}-${m.num}`;
      const summary = this.computeMonthlyStock(yearMonth, section);
      monthlySummaries.push(summary);

      workingDays.push(summary.workingDays || 0);
      beneficiaries.push(summary.totalPlates || 0);
      fuelSubsidy.push(summary.totalFuel || 0);
      
      const cookTotal = summary.workingDays > 0 ? ((this.data.settings.cookHonorarium || 2500) * (this.data.settings.cookCount || 1)) : 0;
      cookHonorarium.push(cookTotal);
    });

    const totalWorkingDays = workingDays.reduce((a, b) => a + b, 0);
    const totalBeneficiaries = beneficiaries.reduce((a, b) => a + b, 0);
    const totalFuelSubsidy = +fuelSubsidy.reduce((a, b) => a + b, 0).toFixed(2);
    const totalCookHonorarium = cookHonorarium.reduce((a, b) => a + b, 0);

    // Prepare matrix per ingredient
    // Initial stock is taken from first month opening (April)
    const ingredientMatrix = {};

    Object.keys(this.data.ingredients).forEach(key => {
      const ing = this.data.ingredients[key];
      const initialOpening = monthlySummaries[0]?.opening[key] || 0;
      
      const monthsData = [];
      let annualRec = 0;
      let annualCon = 0;

      monthlySummaries.forEach((ms) => {
        const rec = ms.received[key] || 0;
        const con = ms.consumed[key] || 0;
        const clo = ms.closing[key] || 0;

        annualRec += rec;
        annualCon += con;

        monthsData.push({
          received: rec,
          consumed: con,
          closing: clo
        });
      });

      const finalClosing = monthlySummaries[11]?.closing[key] !== undefined ? monthlySummaries[11].closing[key] : (initialOpening + annualRec - annualCon);

      ingredientMatrix[key] = {
        id: key,
        name: ing.name,
        unit: ing.unit,
        category: ing.category,
        rate: this.getIngredientRate(key, section),
        opening: initialOpening,
        months: monthsData,
        annualReceived: +annualRec.toFixed(3),
        annualConsumed: +annualCon.toFixed(4),
        finalClosing: +finalClosing.toFixed(3)
      };
    });

    return {
      finYear,
      startYear,
      endYear,
      monthConfigs,
      workingDays,
      beneficiaries,
      fuelSubsidy,
      cookHonorarium,
      totalWorkingDays,
      totalBeneficiaries,
      totalFuelSubsidy,
      totalCookHonorarium,
      totalExpenses: +(totalFuelSubsidy + totalCookHonorarium).toFixed(2),
      ingredientMatrix
    };
  },

  renderYearlyReport() {
    const yearSelect = document.getElementById('yearlyYearSelect');
    const finYear = yearSelect ? yearSelect.value : '2024-2025';

    // Update section toggle buttons and badge
    const btnYrP = document.getElementById('yrTogglePrimary');
    const btnYrU = document.getElementById('yrToggleUpper');
    if (btnYrP && btnYrU) {
      btnYrP.classList.toggle('active', this.activeSection === 'primary');
      btnYrU.classList.toggle('active', this.activeSection === 'upper');
    }
    const yrSecBadge = document.getElementById('yrSectionBadge');
    if (yrSecBadge) yrSecBadge.textContent = this.getActiveSectionName();

    const data = this.computeYearlyData(finYear, this.activeSection);

    // Update Header metadata
    const yrYearTitle = document.getElementById('yrYearTitle');
    if (yrYearTitle) yrYearTitle.textContent = `सन ${data.startYear}-${String(data.endYear).slice(-2)}`;

    const yrTaluka = document.getElementById('yrTaluka');
    if (yrTaluka) yrTaluka.textContent = this.data.settings.taluka;

    const yrDistrict = document.getElementById('yrDistrict');
    if (yrDistrict) yrDistrict.textContent = this.data.settings.district;

    const yrSchoolName = document.getElementById('yrSchoolName');
    if (yrSchoolName) yrSchoolName.textContent = this.data.settings.schoolName;

    const yrCentre = document.getElementById('yrCentre');
    if (yrCentre) yrCentre.textContent = this.data.settings.centre;

    const yrUdise = document.getElementById('yrUdise');
    if (yrUdise) yrUdise.textContent = this.data.settings.udise;

    const yrCurrentDate = document.getElementById('yrCurrentDate');
    if (yrCurrentDate) {
      const today = new Date();
      yrCurrentDate.textContent = this.formatDateEnglish(today, true);
    }

    const yrSignTaluka = document.getElementById('yrSignTaluka');
    if (yrSignTaluka) yrSignTaluka.textContent = this.data.settings.taluka;

    // Render Dynamic Table Header with Clickable Month Links
    const tableEl = document.getElementById('yearlyReportTable');
    if (tableEl) {
      let thead = tableEl.querySelector('thead');
      if (thead) {
        let monthHeadersHtml = '';
        data.monthConfigs.forEach(m => {
          const ym = `${m.year}-${m.num}`;
          const shortYr = String(m.year).slice(-2);
          monthHeadersHtml += `
            <th colspan="3" class="month-header" style="cursor: pointer; user-select: none;" title="क्लिक करा: ${m.name} चा मासिक अहवाल उघडा" onclick="app.openMonthlyExcelFor('${ym}')">
              🔗 ${m.name} '${shortYr}
            </th>
          `;
        });

        let subHeadersHtml = '';
        for (let i = 0; i < 12; i++) {
          subHeadersHtml += `<th>प्राप्त</th><th>शिज.</th><th>शिल्लक</th>`;
        }

        thead.innerHTML = `
          <tr>
            <th rowspan="2" class="sticky-col" style="width: 32px;">अ.<br>क्र.</th>
            <th rowspan="2" class="sticky-col-2" style="min-width: 140px;">वस्तूचे नांव</th>
            <th rowspan="2" style="min-width: 75px; background: #fef9c3; color: #854d0e;">मागील<br>शिल्लक<br>(1 एप्रिल)</th>
            ${monthHeadersHtml}
            <th colspan="3" class="total-header">वार्षिक एकूण (Yearly Total)</th>
          </tr>
          <tr>
            ${subHeadersHtml}
            <th style="background: #fef08a;">एकूण प्राप्त</th>
            <th style="background: #fef08a;">एकूण शिज.</th>
            <th style="background: #fef08a;">अखेर शिल्लक</th>
          </tr>
        `;
      }
    }

    const tableBody = document.getElementById('yearlyReportTableBody');
    if (!tableBody) return;
    tableBody.innerHTML = '';

    // Row 1: Beneficiaries Count
    const trBen = document.createElement('tr');
    trBen.className = 'summary-row';
    let benCols = `<td class="sticky-col">-</td><td class="sticky-col-2"><strong>उपस्थित लाभार्थी संख्या</strong></td><td>-</td>`;
    data.beneficiaries.forEach(b => {
      benCols += `<td colspan="3" class="text-center"><strong>${b || '0'}</strong></td>`;
    });
    benCols += `<td colspan="3" class="text-center" style="background: #fef08a; font-weight:800; font-size: 0.88rem;">${data.totalBeneficiaries}</td>`;
    trBen.innerHTML = benCols;
    tableBody.appendChild(trBen);

    // Row 2: Working Days
    const trDays = document.createElement('tr');
    trDays.className = 'summary-row';
    let daysCols = `<td class="sticky-col">-</td><td class="sticky-col-2"><strong>कामाचे दिवस</strong></td><td>-</td>`;
    data.workingDays.forEach(d => {
      daysCols += `<td colspan="3" class="text-center"><strong>${d || '0'}</strong></td>`;
    });
    daysCols += `<td colspan="3" class="text-center" style="background: #fef08a; font-weight:800; font-size: 0.88rem;">${data.totalWorkingDays}</td>`;
    trDays.innerHTML = daysCols;
    tableBody.appendChild(trDays);

    // Ingredient Rows
    let srNo = 1;
    Object.keys(data.ingredientMatrix).forEach(key => {
      const item = data.ingredientMatrix[key];
      const tr = document.createElement('tr');

      const isSpice = item.category === 'spice';
      const decDigits = isSpice ? 3 : 2;

      let rowHtml = `
        <td class="sticky-col text-center">${srNo++}</td>
        <td class="sticky-col-2">${item.name}</td>
        <td class="text-right" style="background: #fef9c3; font-weight:600;">${item.opening.toFixed(decDigits)}</td>
      `;

      item.months.forEach(m => {
        const recText = m.received > 0 ? m.received.toFixed(decDigits) : '-';
        const conText = m.consumed > 0 ? m.consumed.toFixed(isSpice ? 3 : 2) : '-';
        const cloText = m.closing.toFixed(decDigits);

        rowHtml += `
          <td class="text-right">${recText}</td>
          <td class="text-right" style="font-weight:600; color: #1e40af;">${conText}</td>
          <td class="text-right">${cloText}</td>
        `;
      });

      // Annual Totals
      rowHtml += `
        <td class="text-right" style="background: #fef08a; font-weight:700;">${item.annualReceived > 0 ? item.annualReceived.toFixed(decDigits) : '-'}</td>
        <td class="text-right" style="background: #fef08a; font-weight:700; color:#1e40af;">${item.annualConsumed.toFixed(isSpice ? 3 : 2)}</td>
        <td class="text-right" style="background: #fef08a; font-weight:800;">${item.finalClosing.toFixed(decDigits)}</td>
      `;

      tr.innerHTML = rowHtml;
      tableBody.appendChild(tr);
    });

    // Financial Rows
    // 1. Fuel Subsidy Row
    const trFuel = document.createElement('tr');
    trFuel.className = 'financial-row';
    let fuelCols = `<td class="sticky-col">₹</td><td class="sticky-col-2"><strong>इंधन व भाजीपाला खर्च रु.</strong></td><td>-</td>`;
    data.fuelSubsidy.forEach(f => {
      fuelCols += `<td colspan="3" class="text-right"><strong>${f > 0 ? '₹' + f.toFixed(2) : '-'}</strong></td>`;
    });
    fuelCols += `<td colspan="3" class="text-right" style="background: #a7f3d0; font-weight:800; font-size:0.86rem;">₹${data.totalFuelSubsidy.toFixed(2)}</td>`;
    trFuel.innerHTML = fuelCols;
    tableBody.appendChild(trFuel);

    // 2. Cook Honorarium Row
    const trCook = document.createElement('tr');
    trCook.className = 'financial-row';
    let cookCols = `<td class="sticky-col">₹</td><td class="sticky-col-2"><strong>स्वयंपाकी मानधन रु.</strong></td><td>-</td>`;
    data.cookHonorarium.forEach(c => {
      cookCols += `<td colspan="3" class="text-right"><strong>${c > 0 ? '₹' + c : '-'}</strong></td>`;
    });
    cookCols += `<td colspan="3" class="text-right" style="background: #a7f3d0; font-weight:800; font-size:0.86rem;">₹${data.totalCookHonorarium}</td>`;
    trCook.innerHTML = cookCols;
    tableBody.appendChild(trCook);

    // 3. Total Financial Expenses Row
    const trTotExp = document.createElement('tr');
    trTotExp.className = 'financial-row';
    let totExpCols = `<td class="sticky-col">₹</td><td class="sticky-col-2"><strong>एकूण खर्च रु. (Total Exp)</strong></td><td>-</td>`;
    data.fuelSubsidy.forEach((f, idx) => {
      const sum = +(f + data.cookHonorarium[idx]).toFixed(2);
      totExpCols += `<td colspan="3" class="text-right" style="font-weight:800;">${sum > 0 ? '₹' + sum.toFixed(2) : '-'}</td>`;
    });
    totExpCols += `<td colspan="3" class="text-right" style="background: #6ee7b7; font-weight:900; font-size:0.92rem; color: #064e3b;">₹${data.totalExpenses.toFixed(2)}</td>`;
    trTotExp.innerHTML = totExpCols;
    tableBody.appendChild(trTotExp);
  },

  printYearlyReport() {
    this.switchTab('yearly');
    this.setPrintPageOrientation('landscape', 'legal');
    document.body.classList.remove('print-portrait', 'print-formb', 'print-monthly', 'print-register');
    document.body.classList.add('print-yearly', 'print-landscape', 'print-legal');
    setTimeout(() => {
      window.print();
    }, 150);
  },

  setPrintPageOrientation(orientation, paperSize = 'A4', customMargin = null) {
    let style = document.getElementById('dynamicPrintPageStyle');
    if (!style) {
      style = document.createElement('style');
      style.id = 'dynamicPrintPageStyle';
      document.head.appendChild(style);
    }
    const margin = customMargin || ((paperSize.toLowerCase() === 'legal')
      ? '4mm 6mm 4mm 6mm'
      : (orientation === 'portrait' ? '8mm 10mm 8mm 10mm' : '6mm 10mm 6mm 10mm'));
    style.innerHTML = `@media print { @page { size: ${paperSize} ${orientation}; margin: ${margin}; } }`;
  },

  exportYearlyExcel() {
    const yearSelect = document.getElementById('yearlyYearSelect');
    const finYear = yearSelect ? yearSelect.value : '2024-2025';
    excelEngine.generateYearlyExcel(finYear);
  },

  // =========================================================================
  // TAB: TASTE REGISTER (पोषण आहार चव नोंदवही)
  // =========================================================================

  onTasteTabOpen() {
    this.populateTasteMonthSelect();
    const sel = document.getElementById('tasteMonthSelect');
    const monthKey = sel ? sel.value : (new Date().toISOString().substring(0, 7));
    this.renderTasteRegister(monthKey);
  },

  populateTasteMonthSelect() {
    const sel = document.getElementById('tasteMonthSelect');
    if (!sel) return;

    const currentVal = sel.value;
    const months = new Set();

    if (this.data.records) {
      Object.keys(this.data.records).forEach(d => {
        if (d && d.length >= 7) months.add(d.substring(0, 7));
      });
    }

    if (this.data.tasteRecords) {
      Object.keys(this.data.tasteRecords).forEach(d => {
        if (d && d.length >= 7) months.add(d.substring(0, 7));
      });
    }

    const curMonth = new Date().toISOString().substring(0, 7);
    months.add(curMonth);

    const sortedMonths = Array.from(months).sort().reverse();

    sel.innerHTML = '';
    sortedMonths.forEach(m => {
      const opt = document.createElement('option');
      opt.value = m;
      opt.textContent = this.formatMonthDisplay(m);
      sel.appendChild(opt);
    });

    if (currentVal && sortedMonths.includes(currentVal)) {
      sel.value = currentVal;
    } else {
      sel.value = sortedMonths[0];
    }
  },

  onTasteMonthChange() {
    const sel = document.getElementById('tasteMonthSelect');
    const monthKey = sel ? sel.value : (new Date().toISOString().substring(0, 7));
    this.renderTasteRegister(monthKey);
  },

  refreshTasteRegister() {
    this.populateTasteMonthSelect();
    this.onTasteMonthChange();
    this.showToast('चव नोंदवही रीफ्रेश झाली.', 'info');
  },

  formatMonthDisplay(ym) {
    if (!ym || ym.length < 7) return ym;
    const parts = ym.split('-');
    const year = parts[0];
    const month = parseInt(parts[1], 10);
    const names = [
      "", "जानेवारी", "फेब्रुवारी", "मार्च", "एप्रिल", "मे", "जून",
      "जुलै", "ऑगस्ट", "सप्टेंबर", "ऑक्टोबर", "नोव्हेंबर", "डिसेंबर"
    ];
    return `${names[month] || parts[1]} ${year}`;
  },

  renderTasteRegister(monthKey) {
    if (!monthKey) {
      const sel = document.getElementById('tasteMonthSelect');
      monthKey = sel ? sel.value : (new Date().toISOString().substring(0, 7));
    }

    const set = this.data.settings || {};
    const nameEl = document.getElementById('tasteSchoolName');
    const udiseEl = document.getElementById('tasteSchoolUdise');
    const kendraEl = document.getElementById('tasteSchoolKendra');
    const talukaEl = document.getElementById('tasteSchoolTaluka');
    const distEl = document.getElementById('tasteSchoolDist');
    const monthTextEl = document.getElementById('tasteRegisterMonthText');
    const signSchoolEl = document.getElementById('tasteSignSchoolName');

    // Update section toggle buttons and badge
    const btnTasteP = document.getElementById('tasteTogglePrimary');
    const btnTasteU = document.getElementById('tasteToggleUpper');
    if (btnTasteP && btnTasteU) {
      btnTasteP.classList.toggle('active', this.activeSection === 'primary');
      btnTasteU.classList.toggle('active', this.activeSection === 'upper');
    }
    const tasteSecBadge = document.getElementById('tasteSectionBadge');
    if (tasteSecBadge) tasteSecBadge.textContent = this.getActiveSectionName();

    if (nameEl) nameEl.textContent = set.schoolName || 'शाळेचे नाव';
    if (udiseEl) udiseEl.textContent = set.udise || '—';
    if (kendraEl) kendraEl.textContent = set.kendra || '—';
    if (talukaEl) talukaEl.textContent = set.taluka || '—';
    if (distEl) distEl.textContent = set.district || '—';
    if (monthTextEl) monthTextEl.textContent = this.formatMonthDisplay(monthKey);
    if (signSchoolEl) signSchoolEl.textContent = set.schoolName || 'शाळेचे नाव';

    const tableBody = document.getElementById('tasteRegisterTableBody');
    if (!tableBody) return;
    tableBody.innerHTML = '';

    const parts = monthKey.split('-');
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const daysInMonth = new Date(year, month, 0).getDate();

    let workingDaysCount = 0;
    let serialNum = 1;

    const defaultTesters = [
      { name: set.headmaster || 'मुख्याध्यापक', role: 'मुख्याध्यापक' },
      { name: 'श्री. पी. आर. देशमुख', role: 'सहशिक्षक' },
      { name: 'सौ. एस. एम. कांबळे', role: 'माता पालक गट प्रतिनिधी' },
      { name: 'श्री. ए. के. शिंदे', role: 'SMC अध्यक्ष' },
      { name: 'श्री. डी. बी. पवार', role: 'SMC सदस्य' }
    ];

    const standardShortRemarks = ["उत्तम", "चविष्ट", "उत्तम", "चांगली", "चविष्ट"];

    const escapeStr = (s) => {
      if (!s) return '';
      return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    };

    const records = this.getActiveRecords();
    const tasteRecords = this.getActiveTasteRecords();

    for (let d = 1; d <= daysInMonth; d++) {
      const dayPad = String(d).padStart(2, '0');
      const dateStr = `${monthKey}-${dayPad}`;
      const dayOfWeek = new Date(dateStr + "T12:00:00").getDay();
      const dayName = this.getDayNameMarathi(dateStr);

      const rec = records ? records[dateStr] : null;
      const isSunday = (dayOfWeek === 0);

      // 1. रविवार सुट्टी (Sunday)
      if (isSunday) {
        const tr = document.createElement('tr');
        tr.className = 'holiday-row sunday-row';
        tr.innerHTML = `
          <td class="text-center">${serialNum++}</td>
          <td class="text-center" style="white-space: nowrap;"><strong>${dayPad}/${parts[1]}</strong> <span class="text-muted" style="font-size:0.85em;">(${this.getDayShortMarathi(dateStr)})</span></td>
          <td class="text-center text-muted">—</td>
          <td class="text-center text-muted">—</td>
          <td class="text-center text-muted">—</td>
          <td class="text-center text-muted">—</td>
          <td class="text-center"><span class="badge bg-danger text-white" style="font-size:0.72rem; padding: 1px 4px;">रविवार सुट्टी</span></td>
          <td class="text-center text-muted">—</td>
          <td class="text-center no-print text-muted">—</td>
        `;
        tableBody.appendChild(tr);
        continue;
      }

      // 2. घोषित शासकीय सुट्टी किंवा 0 लाभार्थी
      if (rec && (rec.isHoliday || rec.children === 0)) {
        const hReason = (rec.remarks && rec.remarks.trim()) ? rec.remarks.trim() : 'सुट्टी';
        const tr = document.createElement('tr');
        tr.className = 'holiday-row';
        tr.innerHTML = `
          <td class="text-center">${serialNum++}</td>
          <td class="text-center" style="white-space: nowrap;"><strong>${dayPad}/${parts[1]}</strong> <span class="text-muted" style="font-size:0.85em;">(${this.getDayShortMarathi(dateStr)})</span></td>
          <td class="text-center text-muted">—</td>
          <td class="text-center text-muted">—</td>
          <td class="text-center text-muted">—</td>
          <td class="text-center text-muted">—</td>
          <td class="text-center"><span class="badge bg-warning text-dark" style="font-size:0.72rem; padding: 1px 4px;">${escapeStr(hReason)}</span></td>
          <td class="text-center text-muted">—</td>
          <td class="text-center no-print text-muted">—</td>
        `;
        tableBody.appendChild(tr);
        continue;
      }

      // 3. ज्या दिवशी पोषण आहार भरला आहे (Meal served in daily records)
      const isMealServed = rec && !rec.isHoliday && Number(rec.children || 0) > 0;
      let taste = (tasteRecords && tasteRecords[dateStr]) ? tasteRecords[dateStr] : null;

      // ज्या दिवशी पोषण आहार भरला नाही, त्या दिवशीचा चव रजिस्टर पूर्णपणे कोरा (BLANK) ठेवणे
      if (!isMealServed) {
        const tr = document.createElement('tr');
        tr.className = 'empty-meal-row';
        tr.innerHTML = `
          <td class="text-center">${serialNum++}</td>
          <td class="text-center" style="white-space: nowrap;"><strong>${dayPad}/${parts[1]}</strong> <span class="text-muted" style="font-size:0.85em;">(${this.getDayShortMarathi(dateStr)})</span></td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="text-center no-print">
            <button type="button" class="btn btn-sm btn-outline-secondary" onclick="app.openTasteModal('${dateStr}')" title="नोंदवा">✏️ नोंदवा</button>
          </td>
        `;
        tableBody.appendChild(tr);
        continue;
      }

      workingDaysCount++;
      let menuName = this.getDisplayMenuName(rec);

      // फक्त ज्या दिवशी दैनिक मध्ये नोंद आहे तिथेच चव ऑटो ने भरणे
      if (!taste) {
        const remarkIdx = (d - 1) % standardShortRemarks.length;
        taste = {
          date: dateStr,
          time: '12:00 PM',
          menuName: menuName,
          testerName: set.headmaster || 'मुख्याध्यापक',
          testerRole: 'मुख्याध्यापक',
          quality: 'उत्कृष्ट',
          tasteRemark: standardShortRemarks[remarkIdx],
          isAuto: true
        };
      } else {
        if (!taste.menuName || taste.menuName === 'सुट्टी' || taste.isAuto) {
          taste.menuName = menuName;
        }
      }

      const qualityClass = (taste.quality === 'उत्कृष्ट') ? 'excellent' : ((taste.quality === 'उत्तम') ? 'good' : 'satisfactory');

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="text-center"><strong>${serialNum++}</strong></td>
        <td class="text-center" style="white-space: nowrap;">
          <strong>${dayPad}/${parts[1]}</strong> <span class="text-muted" style="font-size:0.85em;">(${this.getDayShortMarathi(dateStr)})</span>
        </td>
        <td>
          <strong class="text-primary">${escapeStr(taste.menuName || menuName)}</strong>
        </td>
        <td class="text-center" style="white-space: nowrap;">${escapeStr(taste.time || '12:00 PM')}</td>
        <td>
          <strong>${escapeStr(taste.testerName || set.headmaster || 'मुख्याध्यापक')}</strong>
        </td>
        <td class="text-center">
          <span class="taste-badge-quality ${qualityClass}">${escapeStr(taste.quality || 'उत्कृष्ट')}</span>
        </td>
        <td class="text-center">
          <strong>${escapeStr(taste.tasteRemark || 'उत्तम')}</strong>
        </td>
        <td class="text-center" style="vertical-align: middle;">
          <div style="min-height: 12px; border-bottom: 0.75pt dashed #475569; width: 85%; margin: 2px auto;"></div>
        </td>
        <td class="text-center no-print">
          <button type="button" class="btn btn-sm btn-outline-primary" onclick="app.openTasteModal('${dateStr}')" title="बदला / संपादित करा">
            ✏️ नोंदवा
          </button>
        </td>
      `;
      tableBody.appendChild(tr);
    }

    const statsBadge = document.getElementById('tasteMonthStatsBadge');
    if (statsBadge) {
      statsBadge.innerHTML = `📅 <strong>कामाचे दिवस:</strong> ${workingDaysCount} | <strong>नोंदवही पूर्ण:</strong> ${workingDaysCount > 0 ? '100%' : '0%'}`;
    }
  },

  openTasteModal(dateStr) {
    const modal = document.getElementById('tasteModal');
    if (!modal) return;

    const dateInput = document.getElementById('tasteFormDate');
    const timeInput = document.getElementById('tasteFormTime');
    const menuInput = document.getElementById('tasteFormMenu');
    const testerSelect = document.getElementById('tasteFormTesterSelect');
    const roleInput = document.getElementById('tasteFormTesterRole');
    const nameInput = document.getElementById('tasteFormTesterName');
    const remarkSelect = document.getElementById('tasteFormRemarkSelect');
    const qualitySelect = document.getElementById('tasteFormQuality');
    const remarkText = document.getElementById('tasteFormRemark');

    let targetDate = dateStr;
    if (!targetDate) {
      const entryDateEl = document.getElementById('entryDate');
      targetDate = entryDateEl ? entryDateEl.value : (new Date().toISOString().substring(0, 10));
    }

    if (dateInput) dateInput.value = targetDate;
    if (timeInput) timeInput.value = '12:00 PM';

    const rec = this.data.records ? this.data.records[targetDate] : null;
    const defMenu = rec ? this.getDisplayMenuName(rec) : this.getDefaultMenuForDay(targetDate);
    if (menuInput) menuInput.value = defMenu;

    const set = this.data.settings || {};
    const existing = this.data.tasteRecords ? this.data.tasteRecords[targetDate] : null;

    if (existing) {
      if (timeInput && existing.time) timeInput.value = existing.time;
      if (menuInput && existing.menuName) menuInput.value = existing.menuName;
      if (roleInput && existing.testerRole) roleInput.value = existing.testerRole;
      if (nameInput && existing.testerName) nameInput.value = existing.testerName;
      if (qualitySelect && existing.quality) qualitySelect.value = existing.quality;
      if (remarkText && existing.tasteRemark) remarkText.value = existing.tasteRemark;

      if (testerSelect) {
        if (existing.testerRole === 'मुख्याध्यापक') testerSelect.value = 'headmaster';
        else if (existing.testerRole === 'सहशिक्षक') testerSelect.value = 'assistantTeacher';
        else if (existing.testerRole === 'SMC अध्यक्ष') testerSelect.value = 'president';
        else if (existing.testerRole === 'स्वयंपाकी') testerSelect.value = 'cook';
        else testerSelect.value = 'manual';
      }

      if (remarkSelect) {
        const rem = existing.tasteRemark || '';
        if (rem.includes('चांगली')) remarkSelect.value = 'चांगली';
        else if (rem.includes('उत्तम')) remarkSelect.value = 'उत्तम';
        else if (rem.includes('चविष्ट')) remarkSelect.value = 'चविष्ट';
        else if (rem.includes('आळणी')) remarkSelect.value = 'आळणी';
        else remarkSelect.value = 'manual';
      }
    } else {
      // By default: Mukhyadhyapak!
      if (testerSelect) testerSelect.value = 'headmaster';
      if (roleInput) roleInput.value = 'मुख्याध्यापक';
      if (nameInput) nameInput.value = set.headmaster || 'मुख्याध्यापक';
      if (qualitySelect) qualitySelect.value = 'उत्कृष्ट';
      if (remarkSelect) remarkSelect.value = 'उत्तम';
      if (remarkText) remarkText.value = 'उत्तम: आहार ताजा, स्वच्छ आणि अत्यंत उत्तम प्रकारे शिजलेला आहे.';
    }

    modal.style.display = 'flex';
  },

  closeTasteModal() {
    const modal = document.getElementById('tasteModal');
    if (modal) modal.style.display = 'none';
  },

  onTasteFormDateChange() {
    const dateInput = document.getElementById('tasteFormDate');
    if (!dateInput || !dateInput.value) return;
    const dt = dateInput.value;

    const menuInput = document.getElementById('tasteFormMenu');
    const rec = this.data.records ? this.data.records[dt] : null;
    const defMenu = rec ? this.getDisplayMenuName(rec) : this.getDefaultMenuForDay(dt);
    if (menuInput) menuInput.value = defMenu;

    const existing = this.data.tasteRecords ? this.data.tasteRecords[dt] : null;
    if (existing) {
      const timeInput = document.getElementById('tasteFormTime');
      const testerSelect = document.getElementById('tasteFormTesterSelect');
      const roleInput = document.getElementById('tasteFormTesterRole');
      const nameInput = document.getElementById('tasteFormTesterName');
      const qualitySelect = document.getElementById('tasteFormQuality');
      const remarkSelect = document.getElementById('tasteFormRemarkSelect');
      const remarkText = document.getElementById('tasteFormRemark');

      if (timeInput && existing.time) timeInput.value = existing.time;
      if (roleInput && existing.testerRole) roleInput.value = existing.testerRole;
      if (nameInput && existing.testerName) nameInput.value = existing.testerName;
      if (qualitySelect && existing.quality) qualitySelect.value = existing.quality;
      if (remarkText && existing.tasteRemark) remarkText.value = existing.tasteRemark;

      if (testerSelect) {
        if (existing.testerRole === 'मुख्याध्यापक') testerSelect.value = 'headmaster';
        else if (existing.testerRole === 'सहशिक्षक') testerSelect.value = 'assistantTeacher';
        else if (existing.testerRole === 'SMC अध्यक्ष') testerSelect.value = 'president';
        else if (existing.testerRole === 'स्वयंपाकी') testerSelect.value = 'cook';
        else testerSelect.value = 'manual';
      }

      if (remarkSelect) {
        const rem = existing.tasteRemark || '';
        if (rem.includes('चांगली')) remarkSelect.value = 'चांगली';
        else if (rem.includes('उत्तम')) remarkSelect.value = 'उत्तम';
        else if (rem.includes('चविष्ट')) remarkSelect.value = 'चविष्ट';
        else if (rem.includes('आळणी')) remarkSelect.value = 'आळणी';
        else remarkSelect.value = 'manual';
      }
    }
  },

  onTasteTesterSelectChange() {
    const sel = document.getElementById('tasteFormTesterSelect');
    const nameInput = document.getElementById('tasteFormTesterName');
    const roleInput = document.getElementById('tasteFormTesterRole');
    if (!sel || !nameInput) return;

    const set = this.data.settings || {};
    const val = sel.value;

    if (val === 'headmaster') {
      nameInput.value = set.headmaster || 'मुख्याध्यापक';
      if (roleInput) roleInput.value = 'मुख्याध्यापक';
      nameInput.readOnly = false;
    } else if (val === 'assistantTeacher') {
      nameInput.value = set.assistantTeacher || 'सहशिक्षक';
      if (roleInput) roleInput.value = 'सहशिक्षक';
      nameInput.readOnly = false;
    } else if (val === 'president') {
      nameInput.value = set.president || 'SMC अध्यक्ष';
      if (roleInput) roleInput.value = 'SMC अध्यक्ष';
      nameInput.readOnly = false;
    } else if (val === 'cook') {
      nameInput.value = set.cookName || 'सौ. स्वयंपाकी / मदतनीस';
      if (roleInput) roleInput.value = 'स्वयंपाकी';
      nameInput.readOnly = false;
    } else if (val === 'manual') {
      nameInput.value = '';
      if (roleInput) roleInput.value = 'इतर';
      nameInput.readOnly = false;
      nameInput.placeholder = 'येथे नवीन नाव टाका...';
      nameInput.focus();
    }
  },

  onTasteRemarkSelectChange() {
    const sel = document.getElementById('tasteFormRemarkSelect');
    const remarkText = document.getElementById('tasteFormRemark');
    const qualitySelect = document.getElementById('tasteFormQuality');
    if (!sel || !remarkText) return;

    const val = sel.value;
    if (val === 'चांगली') {
      remarkText.value = 'चांगली: अन्नाचा दर्जा चांगला असून चव समाधानकारक आहे.';
      if (qualitySelect) qualitySelect.value = 'चांगला';
    } else if (val === 'उत्तम') {
      remarkText.value = 'उत्तम: आहार ताजा, स्वच्छ आणि अत्यंत उत्तम प्रकारे शिजलेला आहे.';
      if (qualitySelect) qualitySelect.value = 'उत्तम';
    } else if (val === 'चविष्ट') {
      remarkText.value = 'चविष्ट: आहार अत्यंत चविष्ट असून सर्व मसाले व साहित्य व्यवस्थित शिजले आहे.';
      if (qualitySelect) qualitySelect.value = 'उत्कृष्ट';
    } else if (val === 'आळणी') {
      remarkText.value = 'आळणी: मिठाचे प्रमाण थोडे कमी असून आहार आळणी झाला आहे, पुढील वेळी काळजी घ्यावी.';
      if (qualitySelect) qualitySelect.value = 'समाधानकारक';
    } else if (val === 'manual') {
      remarkText.value = '';
      remarkText.placeholder = 'येथे मॅन्युअली चव अभिप्राय / शेरा लिहा...';
      remarkText.focus();
    }
  },

  setQuickRemark(text) {
    const remarkText = document.getElementById('tasteFormRemark');
    const remarkSelect = document.getElementById('tasteFormRemarkSelect');
    if (remarkText) {
      remarkText.value = text;
      remarkText.focus();
    }
    if (remarkSelect) {
      if (text.includes('चांगली')) remarkSelect.value = 'चांगली';
      else if (text.includes('उत्तम')) remarkSelect.value = 'उत्तम';
      else if (text.includes('चविष्ट')) remarkSelect.value = 'चविष्ट';
      else if (text.includes('आळणी')) remarkSelect.value = 'आळणी';
      else remarkSelect.value = 'manual';
    }
  },

  saveTasteEntryFromForm() {
    const dateInput = document.getElementById('tasteFormDate');
    const timeInput = document.getElementById('tasteFormTime');
    const menuInput = document.getElementById('tasteFormMenu');
    const roleInput = document.getElementById('tasteFormTesterRole');
    const nameInput = document.getElementById('tasteFormTesterName');
    const qualitySelect = document.getElementById('tasteFormQuality');
    const remarkText = document.getElementById('tasteFormRemark');

    if (!dateInput || !dateInput.value) {
      alert('कृपया दिनांक निवडा.');
      return;
    }

    const dt = dateInput.value;
    const testerName = nameInput ? nameInput.value.trim() : '';
    if (!testerName) {
      alert('कृपया चव घेणाऱ्याचे नाव भरा.');
      if (nameInput) nameInput.focus();
      return;
    }

    const remark = remarkText ? remarkText.value.trim() : '';
    if (!remark) {
      alert('कृपया चव अभिप्राय (शेरा) लिहा.');
      if (remarkText) remarkText.focus();
      return;
    }

    const tasteRecords = this.getActiveTasteRecords();

    tasteRecords[dt] = {
      date: dt,
      time: timeInput ? timeInput.value.trim() : '12:00 PM',
      menuName: menuInput ? menuInput.value.trim() : 'मासिक आहार',
      testerRole: roleInput ? roleInput.value.trim() : 'मुख्याध्यापक',
      testerName: testerName,
      quality: qualitySelect ? qualitySelect.value : 'उत्कृष्ट',
      tasteRemark: remark
    };

    this.saveState();
    this.closeTasteModal();

    const monthKey = dt.substring(0, 7);
    const sel = document.getElementById('tasteMonthSelect');
    if (sel) sel.value = monthKey;

    this.renderTasteRegister(monthKey);
    this.showToast(`✅ ${dt} ची चव तपासणी नोंद जतन झाली!`, 'success');
  },

  autoFillMonthTasteRecords() {
    const sel = document.getElementById('tasteMonthSelect');
    const monthKey = sel ? sel.value : (new Date().toISOString().substring(0, 7));

    const set = this.data.settings || {};
    const parts = monthKey.split('-');
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const daysInMonth = new Date(year, month, 0).getDate();

    const defaultTesters = [
      { name: set.headmaster || 'मुख्याध्यापक', role: 'मुख्याध्यापक' },
      { name: 'श्री. पी. आर. देशमुख', role: 'सहशिक्षक' },
      { name: 'सौ. एस. एम. कांबळे', role: 'माता पालक गट प्रतिनिधी' },
      { name: 'श्री. ए. के. शिंदे', role: 'SMC अध्यक्ष' },
      { name: 'श्री. डी. बी. पवार', role: 'SMC सदस्य' }
    ];

    const standardShortRemarks = ["उत्तम", "चविष्ट", "उत्तम", "चांगली", "चविष्ट"];

    const records = this.getActiveRecords();
    const tasteRecords = this.getActiveTasteRecords();
    let addedCount = 0;

    for (let d = 1; d <= daysInMonth; d++) {
      const dayPad = String(d).padStart(2, '0');
      const dateStr = `${monthKey}-${dayPad}`;
      const dayOfWeek = new Date(dateStr + "T12:00:00").getDay();

      const rec = records ? records[dateStr] : null;
      const isMealServed = rec && !rec.isHoliday && Number(rec.children || 0) > 0;

      // रविवारी किंवा ज्या दिवशी आहार भरला नाही, त्या दिवशीची चव नोंद काढून टाका (कोरा ठेवा)
      if (dayOfWeek === 0 || !isMealServed) {
        if (tasteRecords && tasteRecords[dateStr]) {
          delete tasteRecords[dateStr];
        }
        continue;
      }

      const menuName = this.getDisplayMenuName(rec);
      if (menuName === 'सुट्टी') {
        if (tasteRecords && tasteRecords[dateStr]) {
          delete tasteRecords[dateStr];
        }
        continue;
      }

      const remarkIdx = (d - 1) % standardShortRemarks.length;
      const existing = tasteRecords[dateStr];

      tasteRecords[dateStr] = {
        date: dateStr,
        time: (existing && existing.time) ? existing.time : '12:00 PM',
        menuName: menuName,
        testerName: (existing && existing.testerName) ? existing.testerName : (set.headmaster || 'मुख्याध्यापक'),
        testerRole: (existing && existing.testerRole) ? existing.testerRole : 'मुख्याध्यापक',
        quality: (existing && existing.quality) ? existing.quality : 'उत्कृष्ट',
        tasteRemark: (existing && existing.tasteRemark) ? existing.tasteRemark : standardShortRemarks[remarkIdx],
        isAuto: !existing || existing.isAuto
      };
      addedCount++;
    }

    this.saveState();
    this.renderTasteRegister(monthKey);
    this.showToast(`🎉 दैनिक नोंद असलेल्या ${addedCount} दिवसांसाठी चव नोंदवही स्वयंचलित भरली (इतर दिवस कोरे ठेवले)!`, 'success');
  },

  printTasteRegister() {
    const printContainer = document.getElementById('printSlipContainer');
    if (printContainer) printContainer.innerHTML = '';
    this.switchTab('taste');
    this.setPrintPageOrientation('portrait', 'A4', '8mm 10mm 8mm 10mm');
    document.body.classList.remove('print-landscape', 'print-monthly', 'print-yearly', 'print-register', 'print-legal', 'print-slip', 'print-formb');
    document.body.classList.add('print-taste', 'print-portrait');
    setTimeout(() => {
      window.print();
    }, 150);
  },

  exportTasteRegisterExcel() {
    const sel = document.getElementById('tasteMonthSelect');
    const monthKey = sel ? sel.value : (new Date().toISOString().substring(0, 7));

    const parts = monthKey.split('-');
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const daysInMonth = new Date(year, month, 0).getDate();

    const headers = [
      "अ. क्र.", "दिनांक", "वार", "तयार केलेला आहार (मेन्यू)", 
      "चव घेतल्याची वेळ", "चव घेणाऱ्याचे नाव", "पद", 
      "आहाराचा दर्जा", "चव अभिप्राय (शेरा)", "स्वाक्षरी"
    ];

    const rows = [];
    let serialNum = 1;
    const records = this.getActiveRecords();
    const tasteRecords = this.getActiveTasteRecords();

    for (let d = 1; d <= daysInMonth; d++) {
      const dayPad = String(d).padStart(2, '0');
      const dateStr = `${monthKey}-${dayPad}`;
      const dayOfWeek = new Date(dateStr + "T12:00:00").getDay();
      const dayName = this.getDayNameMarathi(dateStr);

      if (dayOfWeek === 0) {
        rows.push([
          serialNum++,
          `${dayPad}/${parts[1]}/${year}`,
          dayName,
          "—",
          "—",
          "—",
          "—",
          "—",
          "रविवार सुट्टी",
          "—"
        ]);
        continue;
      }

      const rec = records ? records[dateStr] : null;
      if (rec && (rec.isHoliday || rec.children === 0)) {
        const hReason = (rec.remarks && rec.remarks.trim()) ? rec.remarks.trim() : 'सुट्टी';
        rows.push([
          serialNum++,
          `${dayPad}/${parts[1]}/${year}`,
          dayName,
          "—",
          "—",
          "—",
          "—",
          "—",
          hReason,
          "—"
        ]);
        continue;
      }

      const isMealServed = rec && !rec.isHoliday && Number(rec.children || 0) > 0;
      let taste = (tasteRecords && tasteRecords[dateStr]) ? tasteRecords[dateStr] : null;

      // ज्या दिवशी पोषण आहार भरला नाही, त्या दिवशी सर्व चव रकाने कोरे (BLANK) ठेवणे
      if (!isMealServed) {
        rows.push([
          serialNum++,
          `${dayPad}/${parts[1]}/${year}`,
          dayName,
          "",
          "",
          "",
          "",
          "",
          "",
          ""
        ]);
        continue;
      }

      const menuName = this.getDisplayMenuName(rec);
      if (!taste) {
        taste = {
          time: '12:00 PM',
          menuName: menuName,
          testerName: this.data.settings.headmaster || 'मुख्याध्यापक',
          testerRole: 'मुख्याध्यापक',
          quality: 'उत्कृष्ट',
          tasteRemark: 'उत्तम'
        };
      }

      rows.push([
        serialNum++,
        `${dayPad}/${parts[1]}/${year}`,
        dayName,
        taste.menuName || menuName,
        taste.time || '12:00 PM',
        taste.testerName || '',
        taste.testerRole || '',
        taste.quality || 'उत्कृष्ट',
        taste.tasteRemark || 'उत्तम',
        ""
      ]);
    }

    if (typeof XLSX !== 'undefined') {
      const wb = XLSX.utils.book_new();
      const wsData = [
        ["महाराष्ट्र शासन — शालेय शिक्षण व क्रीडा विभाग"],
        [this.data.settings.schoolName || 'शाळेचे नाव'],
        [`प्रधानमंत्री पोषण शक्ती निर्माण योजना (PM POSHAN) — दैनिक भोजन चव तपासणी नोंदवही (${this.formatMonthDisplay(monthKey)})`],
        [],
        headers,
        ...rows
      ];
      const ws = XLSX.utils.aoa_to_sheet(wsData);
      XLSX.utils.book_append_sheet(wb, ws, "चव नोंदवही");
      XLSX.writeFile(wb, `MDM_Taste_Register_${monthKey}.xlsx`);
    } else {
      let csvContent = "\uFEFF";
      csvContent += `"${this.data.settings.schoolName || 'शाळेचे नाव'}"\n`;
      csvContent += `"प्रधानमंत्री पोषण शक्ती निर्माण योजना (PM POSHAN) — दैनिक भोजन चव तपासणी नोंदवही (${this.formatMonthDisplay(monthKey)})"\n\n`;
      csvContent += headers.map(h => `"${h}"`).join(',') + '\n';
      rows.forEach(r => {
        csvContent += r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',') + '\n';
      });
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `MDM_Taste_Register_${monthKey}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  },

  // =========================================================================
  // TAB 5: STOCK MANAGEMENT
  // =========================================================================

  setStockFilter(filter) {
    this.stockViewFilter = filter;
    this.renderStockView();
  },

  renderStockView() {
    const grid = document.getElementById('stockCardsGrid');
    if (!grid) return;
    grid.innerHTML = '';

    const filter = this.stockViewFilter || this.activeSection; // 'primary', 'upper', or 'combined'
    const btnStockP = document.getElementById('stockTogglePrimary');
    const btnStockU = document.getElementById('stockToggleUpper');
    const btnStockC = document.getElementById('stockToggleCombined');
    if (btnStockP) btnStockP.classList.toggle('active', filter === 'primary');
    if (btnStockU) btnStockU.classList.toggle('active', filter === 'upper');
    if (btnStockC) btnStockC.classList.toggle('active', filter === 'combined');

    const stockSecBadge = document.getElementById('stockSectionBadge');
    if (stockSecBadge) {
      stockSecBadge.textContent = filter === 'combined' ? '📦 एकत्रित साठा (१ ते ८)' : (filter === 'upper' ? '🎓 इ. ६ ते ८ साठा' : '🎒 इ. १ ते ५ साठा');
    }

    const todayStr = new Date().toISOString().substring(0, 10);
    const balances = this.computeStockForDate(todayStr, filter);
    const pat = filter === 'combined' ? (this.getActivePat('primary') + this.getActivePat('upper')) : this.getActivePat(filter);

    Object.keys(this.data.ingredients).forEach(key => {
      const ing = this.data.ingredients[key];
      const bal = balances[key] || 0;
      const isNegative = bal < 0;
      const rate = filter === 'combined' ? (this.getIngredientRate(key, 'primary') + this.getIngredientRate(key, 'upper')) / 2 : this.getIngredientRate(key, filter);
      const isLow = !isNegative && bal < (rate * pat * 3); // less than 3 days

      const card = document.createElement('div');
      card.className = `stock-card ${isNegative ? 'negative-stock' : (isLow ? 'warning-stock' : '')}`;
      card.innerHTML = `
        <div class="stock-card-name">${ing.name}</div>
        <div class="stock-card-rate">प्रमाण: ${rate.toFixed(ing.category === 'spice' ? 5 : 3)} ${ing.unit}/विद्यार्थी</div>
        <div class="stock-card-balance">${bal.toFixed(ing.category === 'spice' ? 3 : 2)} kg</div>
        <div class="stock-metrics">
          <span>${isNegative ? '⚠️ ऋण / वजा शिल्लक साठा' : `दैनिक गरज: ~${(rate * pat).toFixed(3)} kg`}</span>
        </div>
      `;
      grid.appendChild(card);
    });

    // Render stock receipts table
    const tableBody = document.getElementById('stockReceiptsTableBody');
    const badge = document.getElementById('receiptCountBadge');
    if (!tableBody) return;
    tableBody.innerHTML = '';

    const receipts = this.getActiveReceipts(filter);
    if (badge) badge.textContent = `${receipts.length} नोंदी`;

    if (receipts.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="5" class="text-center p-3 text-muted">कोणतीही नवीन धान्य पावती नोंदवलेली नाही. 'नवीन धान्य प्राप्त नोंद' बटण वापरून नोंद करा.</td></tr>`;
      return;
    }

    receipts.forEach((r, idx) => {
      const itemsList = Object.keys(r.items || {})
        .filter(k => !isNaN(parseFloat(r.items[k])) && parseFloat(r.items[k]) !== 0)
        .map(k => `${this.data.ingredients[k]?.name || k}: ${r.items[k]} kg`)
        .join(', ');

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${r.date}</strong></td>
        <td>${r.billNo || '—'}</td>
        <td>${itemsList}</td>
        <td>${r.recordedBy || 'मुख्याध्यापक'}</td>
        <td class="text-center no-print">
          <button class="btn btn-sm btn-outline-danger" onclick="app.deleteStockReceipt(${idx})">🗑️ हटवा</button>
        </td>
      `;
      tableBody.appendChild(tr);
    });

    // Render damaged stock table
    const dmgTableBody = document.getElementById('damagedStockTableBody');
    const dmgBadge = document.getElementById('damagedCountBadge');
    if (dmgTableBody) {
      dmgTableBody.innerHTML = '';
      const dmgs = this.getActiveDamaged(filter);
      if (dmgBadge) dmgBadge.textContent = `${dmgs.length} नोंदी`;

      if (dmgs.length === 0) {
        dmgTableBody.innerHTML = `<tr><td colspan="5" class="text-center p-3 text-muted">कोणतीही खराब/मुदत संपलेल्या धान्याची नोंद नाही. आवश्यकता असल्यास '⚠️ खराब / नासाडी धान्य नोंद' बटण वापरा.</td></tr>`;
      } else {
        dmgs.forEach((d, idx) => {
          const itemsList = Object.keys(d.items || {})
            .filter(k => parseFloat(d.items[k]) > 0)
            .map(k => `${this.data.ingredients[k]?.name || k}: ${d.items[k]} kg`)
            .join(', ');

          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td><strong>${d.date}</strong></td>
            <td><span class="badge badge-warning" style="font-size: 0.82rem;">${d.reason}</span></td>
            <td><strong>${itemsList}</strong></td>
            <td>${d.recordedBy || 'मुख्याध्यापक'}</td>
            <td class="text-center no-print">
              <button class="btn btn-sm btn-outline-danger" onclick="app.deleteDamagedStock(${idx})">🗑️ हटवा</button>
            </td>
          `;
          dmgTableBody.appendChild(tr);
        });
      }
    }
  },

  openAddDamagedStockModal() {
    const modal = document.getElementById('addDamagedStockModal');
    const dateInput = document.getElementById('damagedStockDate');
    const reasonInput = document.getElementById('damagedStockReason');
    const grid = document.getElementById('damagedStockInputsGrid');
    if (!modal || !grid) return;

    const currentFbMonth = document.getElementById('formbMonthPicker')?.value || document.getElementById('monthlyExcelPicker')?.value;
    const todayStr = new Date().toISOString().substring(0, 10);
    if (dateInput) {
      dateInput.value = (currentFbMonth && todayStr.startsWith(currentFbMonth)) ? todayStr : (currentFbMonth ? `${currentFbMonth}-15` : todayStr);
    }
    if (reasonInput) reasonInput.value = '';

    grid.innerHTML = '';
    Object.keys(this.data.ingredients).forEach(key => {
      const ing = this.data.ingredients[key];
      const div = document.createElement('div');
      div.className = 'form-group';
      div.innerHTML = `
        <label class="form-label font-sm" style="font-weight: 600;">${ing.name} (${ing.unit})</label>
        <input type="number" step="${ing.category === 'spice' ? '0.001' : '0.01'}" min="0" class="form-control damaged-item-input" data-key="${key}" placeholder="0.00">
      `;
      grid.appendChild(div);
    });

    modal.style.display = 'flex';
  },

  closeAddDamagedStockModal() {
    const modal = document.getElementById('addDamagedStockModal');
    if (modal) modal.style.display = 'none';
  },

  saveDamagedStock() {
    const dateInput = document.getElementById('damagedStockDate');
    const reasonInput = document.getElementById('damagedStockReason');
    if (!dateInput || !dateInput.value) {
      alert('कृपया दिनांक निवडा.');
      return;
    }

    const items = {};
    document.querySelectorAll('.damaged-item-input').forEach(inp => {
      const key = inp.dataset.key;
      const val = parseFloat(inp.value) || 0;
      if (val > 0) items[key] = val;
    });

    if (Object.keys(items).length === 0) {
      alert('कृपया किमान एका खराब धान्याचे प्रमाण (कि.ग्रॅ.) भरा.');
      return;
    }

    if (!this.data.damagedStock) this.data.damagedStock = [];

    this.data.damagedStock.push({
      id: 'dmg_' + Date.now(),
      date: dateInput.value,
      reason: reasonInput ? (reasonInput.value.trim() || 'खराब / मुदत संपलेले धान्य') : 'खराब धान्य',
      items: items,
      recordedBy: this.data.settings.headmaster || 'मुख्याध्यापक',
      createdAt: new Date().toISOString()
    });

    this.saveState();
    this.closeAddDamagedStockModal();
    this.refreshAllViews();
    this.showToast('✅ खराब / मुदत संपलेले धान्य नोंदवले गेले व संबंधित महिन्यातील वापरात आपोआप जोडले गेले!', 'success');
  },

  deleteDamagedStock(idx) {
    if (confirm('तुम्हाला खात्री आहे का? ही खराब धान्याची नोंद हटवायची आहे?')) {
      if (this.data.damagedStock && this.data.damagedStock[idx]) {
        this.data.damagedStock.splice(idx, 1);
        this.saveState();
        this.refreshAllViews();
        this.showToast('खराब धान्याची नोंद हटवण्यात आली.', 'warning');
      }
    }
  },

  openAddStockModal() {
    const modal = document.getElementById('addStockModal');
    const dateInput = document.getElementById('stockReceiptDate');
    const grid = document.getElementById('stockInputsGrid');
    if (!modal || !grid) return;

    if (dateInput) dateInput.value = new Date().toISOString().substring(0, 10);

    grid.innerHTML = '';
    Object.keys(this.data.ingredients).forEach(key => {
      const ing = this.data.ingredients[key];
      const div = document.createElement('div');
      div.className = 'form-group';
      div.innerHTML = `
        <label class="form-label font-sm">${ing.name} (${ing.unit})</label>
        <input type="number" step="0.001" class="form-control stock-item-input" data-key="${key}" placeholder="0.00 (ऋण - नोंद शक्य)">
      `;
      grid.appendChild(div);
    });

    modal.style.display = 'flex';
  },

  closeAddStockModal() {
    const modal = document.getElementById('addStockModal');
    if (modal) modal.style.display = 'none';
  },

  saveStockReceipt() {
    const dateInput = document.getElementById('stockReceiptDate');
    const billInput = document.getElementById('stockReceiptBillNo');
    if (!dateInput || !dateInput.value) return;

    const items = {};
    document.querySelectorAll('.stock-item-input').forEach(inp => {
      const key = inp.dataset.key;
      const val = parseFloat(inp.value);
      if (!isNaN(val) && val !== 0) items[key] = val;
    });

    if (Object.keys(items).length === 0) {
      this.showToast('कृपया किमान एका धान्याचे प्रमाण भरा.', 'warning');
      return;
    }

    this.data.stockReceipts.push({
      date: dateInput.value,
      billNo: billInput ? billInput.value.trim() : '',
      items: items,
      recordedBy: this.data.settings.headmaster,
      createdAt: new Date().toISOString()
    });

    this.saveState();
    this.closeAddStockModal();
    this.showToast('✅ धान्य प्राप्त नोंद यशस्वीरित्या जतन झाली!', 'success');
    this.renderStockView();
  },

  deleteStockReceipt(idx) {
    if (confirm('ही धान्य पावती नोंद हटवायची आहे का?')) {
      this.data.stockReceipts.splice(idx, 1);
      this.saveState();
      this.showToast('पावती नोंद हटवण्यात आली.', 'warning');
      this.renderStockView();
    }
  },

  /**
   * Open Modal to Edit Old / Opening Stock (मागील शिल्लक)
   */
  openEditOldStockModal() {
    const modal = document.getElementById('editOldStockModal');
    const grid = document.getElementById('oldStockInputsGrid');
    if (!modal || !grid) return;

    grid.innerHTML = '';
    Object.keys(this.data.ingredients).forEach(key => {
      const ing = this.data.ingredients[key];
      const curVal = this.data.initialStock[key] !== undefined ? this.data.initialStock[key] : 0;
      const div = document.createElement('div');
      div.className = 'form-group';
      div.innerHTML = `
        <label class="form-label font-sm" style="font-weight: 600;">${ing.name} (${ing.unit})</label>
        <input type="number" step="0.001" class="form-control old-stock-modal-input" data-key="${key}" value="${curVal}" placeholder="0.00 (ऋण - नोंद शक्य)">
      `;
      grid.appendChild(div);
    });

    modal.style.display = 'flex';
  },

  closeEditOldStockModal() {
    const modal = document.getElementById('editOldStockModal');
    if (modal) modal.style.display = 'none';
  },

  saveOldStockFromModal() {
    document.querySelectorAll('.old-stock-modal-input').forEach(inp => {
      const key = inp.dataset.key;
      const val = parseFloat(inp.value);
      if (key && !isNaN(val)) {
        this.data.initialStock[key] = val;
      }
    });

    this.saveState();
    this.closeEditOldStockModal();
    this.refreshAllViews();
    this.showToast('✅ मागील शिल्लक धान्य साठा (Old Stock) यशस्वीरित्या जतन झाला!', 'success');
  },

  renderOldStockInSettings() {
    const grid = document.getElementById('oldStockSettingsGrid');
    if (!grid) return;
    grid.innerHTML = '';

    Object.keys(this.data.ingredients).forEach(key => {
      const ing = this.data.ingredients[key];
      const curVal = this.data.initialStock[key] !== undefined ? this.data.initialStock[key] : 0;
      const div = document.createElement('div');
      div.className = 'form-group';
      div.innerHTML = `
        <label class="form-label font-sm" style="font-weight: 600;">${ing.name} (${ing.unit})</label>
        <input type="number" step="0.001" class="form-control old-stock-settings-input" data-key="${key}" value="${curVal}" placeholder="0.00 (ऋण - नोंद शक्य)" oninput="app.onOldStockSettingChange('${key}')">
      `;
      grid.appendChild(div);
    });
  },

  saveOldStockFromSettings() {
    document.querySelectorAll('.old-stock-settings-input').forEach(inp => {
      const key = inp.dataset.key;
      const val = parseFloat(inp.value);
      if (key && !isNaN(val)) {
        this.data.initialStock[key] = val;
      }
    });

    this.saveState();
    this.refreshAllViews();
    this.showToast('✅ सेटिंग्जमधून मागील शिल्लक साठा सर्व पानांवर यशस्वीरित्या जतन झाला!', 'success');
  },

  // =========================================================================
  // TAB 6: EXCEL IMPORT & EXPORT
  // =========================================================================

  exportExcelCurrentMonth() {
    const monthPicker = document.getElementById('monthlyExcelPicker') || document.getElementById('registerMonthSelect') || document.getElementById('formbMonthPicker');
    const yearMonth = monthPicker ? monthPicker.value : new Date().toISOString().substring(0, 7);
    excelEngine.exportOfficialExcel(yearMonth, this.data);
  },

  exportFormBExcel() {
    const picker = document.getElementById('formbMonthPicker');
    const yearMonth = (picker && picker.value) ? picker.value : (document.getElementById('monthlyExcelPicker')?.value || new Date().toISOString().substring(0, 7));
    excelEngine.generateFormBExcel(yearMonth, this.data);
  },

  handleExcelFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const progressBox = document.getElementById('importProgressBox');
    if (progressBox) progressBox.style.display = 'block';

    excelEngine.importExcelFile(file, (err, res) => {
      if (progressBox) progressBox.style.display = 'none';

      if (err) {
        alert('Excel फाईल वाचताना त्रुटी आली: ' + err.message);
        return;
      }

      // Merge imported records
      Object.assign(this.data.records, res.records);
      this.saveState();

      this.showToast(`🎉 Sheet '${res.sheetName}' मधून ${res.importedCount} दैनंदिन नोंदी यशस्वीरित्या आयात झाल्या!`, 'success');
      
      // Update month pickers to imported month
      const regMonth = document.getElementById('registerMonthSelect');
      if (regMonth) regMonth.value = res.yearMonth;
      const exMonth = document.getElementById('monthlyExcelPicker');
      if (exMonth) exMonth.value = res.yearMonth;

      this.renderCurrentTab();
    });
  },

  exportJsonBackup() {
    const jsonStr = JSON.stringify(this.data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MDM_Backup_${this.data.settings.schoolName.replace(/\s+/g, '_')}_${new Date().toISOString().substring(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    this.showToast('डेटा बॅकअप फाईल सेव्ह झाली.', 'success');
  },

  handleJsonRestore(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        if (parsed.settings && parsed.records) {
          this.data = parsed;
          this.saveState();
          this.showToast('✅ बॅकअप फाईल यशस्वीरित्या रिस्टोअर झाली!', 'success');
          this.init();
        } else {
          alert('अवैध बॅकअप फाईल फॉरमॅट.');
        }
      } catch (err) {
        alert('JSON फाईल वाचताना त्रुटी: ' + err.message);
      }
    };
    reader.readAsText(file);
  },

  /**
   * Clear all daily records and receipts to start fresh from 0 data
   * (Keeps school settings intact)
   */
  clearAllDataAndStartZero() {
    const isConfirmed = confirm(
      "⚠️ खात्री करा (Clear All Records to Zero Data):\n\nतुम्हाला सर्व जुन्या दैनिक नोंदी आणि पावत्या क्लिअर करून 'शून्य (0) डेटा' पासून नव्याने सुरुवात करायची आहे का?\n\n(शाळेचे नाव व सेटिंग्ज सुरक्षित राहतील, फक्त दैनंदिन नोंदी 0 होतील.)"
    );
    if (!isConfirmed) return;

    const pwd = prompt("🔐 सुरक्षितता पडताळणी: डेटा क्लिअर करण्यासाठी पासवर्ड टाका (Enter Password):");
    if (pwd !== "Ican@123") {
      alert("❌ चुकीचा पासवर्ड! डेटा क्लिअर करणे रद्द करण्यात आले आहे.");
      return;
    }

    this.data.records = {};
    this.data.stockReceipts = [];
    this.data.initialSampleLoaded = true;

    this.saveState();
    this.refreshAllViews();
    this.switchTab('daily');
    this.showToast('✨ सर्व जुना डेटा क्लिअर झाला! आता तुम्ही 0 नोंदीपासून नव्याने सुरुवात करू शकता.', 'success');
  },

  /**
   * Full Factory Reset (All data, opening stock, settings reset to blank)
   */
  /**
   * Factory Reset: Clears records and stock to 0, but ALWAYS PRESERVES saved school & officer details
   */
  confirmFactoryReset() {
    const isConfirmed = confirm(
      "🚨 फॅक्टरी रीसेट (Reset Records & Stock to Zero):\n\nतुम्ही सर्व दैनिक नोंदी आणि साठा 0 (Zero) करून नव्याने सुरुवात करू इच्छिता का?\n\n(टीप: शाळेचे नाव व अधिकाऱ्यांचे सेव्ह केलेले सर्व तपशील 100% सुरक्षित राहतील, ते रीसेट होणार नाहीत.)"
    );
    if (!isConfirmed) return;

    const pwd = prompt("🔐 सुरक्षितता पडताळणी: फॅक्टरी रीसेट करण्यासाठी पासवर्ड टाका (Enter Password):");
    if (pwd !== "Ican@123") {
      alert("❌ चुकीचा पासवर्ड! फॅक्टरी रीसेट रद्द करण्यात आले आहे.");
      return;
    }

    // Strictly preserve saved school settings, officers details, and ingredient rules
    const preservedSettings = Object.assign({}, this.data.settings);
    const preservedIngredients = Object.assign({}, this.data.ingredients);
    const preservedMenus = Array.isArray(this.data.menus) ? JSON.parse(JSON.stringify(this.data.menus)) : this.data.menus;

    this.data.records = {};
    this.data.stockReceipts = [];
    this.data.initialSampleLoaded = true;
    Object.keys(this.data.initialStock).forEach(k => {
      this.data.initialStock[k] = 0.0;
    });

    this.data.settings = preservedSettings;
    this.data.ingredients = preservedIngredients;
    this.data.menus = preservedMenus;

    this.saveState();
    this.refreshAllViews();
    this.switchTab('daily');
    this.showToast('✨ दैनिक नोंदी व साठा 0 झाला. शाळेचे नाव व तपशील सुरक्षित ठेवण्यात आले आहेत!', 'success');
  },

  confirmResetAllData() {
    this.clearAllDataAndStartZero();
  },

  // =========================================================================
  // TAB 7: SETTINGS & RULES
  // =========================================================================

  onSchoolLevelChange(level) {
    if (!this.data.settings) this.data.settings = {};
    this.data.settings.schoolLevel = level;
    if (level === 'primary') {
      this.switchSection('primary');
    } else if (level === 'upper') {
      this.switchSection('upper');
    }
    this.saveState();
    this.updateHeaderMeta();
    this.showToast(`शाळा स्तर सेट केला: ${level === 'both' ? 'दोन्ही (१ ते ५ व ६ ते ८)' : (level === 'upper' ? 'फक्त ६ ते ८' : 'फक्त १ ते ५')}`, 'info');
  },

  renderSettingsView() {
    document.getElementById('setSchoolName').value = this.data.settings.schoolName || '';
    document.getElementById('setUdise').value = this.data.settings.udise || '';
    document.getElementById('setCentre').value = this.data.settings.centre || '';
    document.getElementById('setTaluka').value = this.data.settings.taluka || '';
    document.getElementById('setDistrict').value = this.data.settings.district || '';
    
    // Dual Pat & Fuel Rates
    const setPatPrimary = document.getElementById('setPatPrimary');
    const patP = this.data.settings.patPrimary !== undefined ? this.data.settings.patPrimary : (this.data.settings.pat || 9);
    if (setPatPrimary) setPatPrimary.value = patP;

    const setPatUpper = document.getElementById('setPatUpper');
    const patU = this.data.settings.patUpper !== undefined ? this.data.settings.patUpper : 15;
    if (setPatUpper) setPatUpper.value = patU;

    const setPat = document.getElementById('setPat');
    if (setPat) setPat.value = this.activeSection === 'upper' ? patU : patP;

    document.getElementById('setHeadmaster').value = this.data.settings.headmaster || '';
    document.getElementById('setPresident').value = this.data.settings.president || '';
    const setAsst = document.getElementById('setAssistantTeacher');
    if (setAsst) setAsst.value = this.data.settings.assistantTeacher || '';
    const setCook = document.getElementById('setCookName');
    if (setCook) setCook.value = this.data.settings.cookName || '';

    const setFuelPrimary = document.getElementById('setFuelRatePrimary');
    const fuelP = this.data.settings.fuelRatePrimary !== undefined ? this.data.settings.fuelRatePrimary : (this.data.settings.fuelRate || 1.51);
    if (setFuelPrimary) setFuelPrimary.value = fuelP;

    const setFuelUpper = document.getElementById('setFuelRateUpper');
    const fuelU = this.data.settings.fuelRateUpper !== undefined ? this.data.settings.fuelRateUpper : 2.17;
    if (setFuelUpper) setFuelUpper.value = fuelU;

    const setFuel = document.getElementById('setFuelRate');
    if (setFuel) setFuel.value = this.activeSection === 'upper' ? fuelU : fuelP;

    document.getElementById('setCookHonorarium').value = this.data.settings.cookHonorarium || 2500;
    document.getElementById('setCookCount').value = this.data.settings.cookCount || 1;

    // School level radios
    const schoolLevel = this.data.settings.schoolLevel || 'both';
    const rBoth = document.getElementById('levelBoth');
    const rPri = document.getElementById('levelPrimary');
    const rUpp = document.getElementById('levelUpper');
    if (rBoth && schoolLevel === 'both') rBoth.checked = true;
    if (rPri && schoolLevel === 'primary') rPri.checked = true;
    if (rUpp && schoolLevel === 'upper') rUpp.checked = true;

    // Render Ingredient Rules Table with Editable Names and Dual Rates (1-5 and 6-8)
    const tableBody = document.getElementById('ingredientRulesTableBody');
    if (tableBody) {
      tableBody.innerHTML = '';
      Object.keys(this.data.ingredients).forEach(key => {
        const ing = this.data.ingredients[key];
        const tr = document.createElement('tr');
        const isCore = ['rice', 'tur_dal', 'moong_dal', 'masoor_dal', 'matki', 'chana', 'soyavadi', 'vatana', 'mustard', 'cumin', 'turmeric', 'chilli', 'masala', 'oil', 'salt'].includes(key);
        const rateP = ing.ratePrimary !== undefined ? ing.ratePrimary : ing.defaultRate;
        const rateU = ing.rateUpper !== undefined ? ing.rateUpper : +(rateP * 1.5).toFixed(5);

        tr.innerHTML = `
          <td><code>${ing.id}</code></td>
          <td>
            <input type="text" class="form-control form-control-sm rule-name-input" data-key="${key}" value="${ing.name}" style="font-weight: 600;" oninput="app.onIngredientRuleChange('${key}')" onchange="app.onIngredientRuleChange('${key}')">
          </td>
          <td>
            <input type="number" step="0.00001" class="form-control form-control-sm rule-rate-p-input" data-key="${key}" value="${rateP}" oninput="app.onIngredientRuleChange('${key}')" onchange="app.onIngredientRuleChange('${key}')" title="इ. १ ते ५ प्रमाण (kg)">
          </td>
          <td>
            <input type="number" step="0.00001" class="form-control form-control-sm rule-rate-u-input" data-key="${key}" value="${rateU}" oninput="app.onIngredientRuleChange('${key}')" onchange="app.onIngredientRuleChange('${key}')" title="इ. ६ ते ८ प्रमाण (kg)">
          </td>
          <td>${ing.unit}</td>
          <td><span class="badge badge-info">${ing.category === 'spice' ? 'सर्व दिवस' : (ing.category === 'grain' ? 'मुख्य धान्य' : (ing.category === 'pulse' ? 'कडधान्य/डाळ' : 'पूरक'))}</span></td>
          <td class="text-center">
            ${!isCore || ing.isCustom ? `
              <button type="button" class="btn btn-sm btn-outline-danger" onclick="app.deleteCustomIngredient('${key}')" title="हटवा">🗑️</button>
            ` : `<span class="text-muted font-xs">—</span>`}
          </td>
        `;
        tableBody.appendChild(tr);
      });
    }

    // Render Editable Menus in Settings
    this.renderMenusInSettings();

    // Render Opening / Old Stock inputs in Settings
    this.renderOldStockInSettings();
  },

  /**
   * Real-time reactive sync when ingredient rule (rate / name) is updated in Settings
   */
  onIngredientRuleChange(key) {
    const nameInput = document.querySelector(`.rule-name-input[data-key="${key}"]`);
    const ratePInput = document.querySelector(`.rule-rate-p-input[data-key="${key}"]`);
    const rateUInput = document.querySelector(`.rule-rate-u-input[data-key="${key}"]`);
    
    if (this.data.ingredients && this.data.ingredients[key]) {
      if (nameInput && nameInput.value.trim()) {
        this.data.ingredients[key].name = nameInput.value.trim();
      }
      if (ratePInput) {
        const valP = parseFloat(ratePInput.value);
        if (!isNaN(valP) && valP >= 0) {
          this.data.ingredients[key].ratePrimary = valP;
          this.data.ingredients[key].defaultRate = valP;
        }
      }
      if (rateUInput) {
        const valU = parseFloat(rateUInput.value);
        if (!isNaN(valU) && valU >= 0) {
          this.data.ingredients[key].rateUpper = valU;
        }
      }
    }

    this.saveState();
    
    // 1. Instantly update Daily Entry menu dropdown, checkboxes, and calculation
    this.populateMenuDropdown();
    this.renderManualGrainsCheckboxes();
    this.onInputsChanged();

    // 2. Instantly update other tabs
    this.renderDailyRegister();
    this.renderMonthlyExcelSheet();
    this.renderFormB();
    this.renderStockView();
    this.renderYearlyReport();

    // 3. Update pulse labels in menus settings table
    const pulses = Object.keys(this.data.ingredients).filter(k => this.data.ingredients[k].category === 'pulse');
    document.querySelectorAll('.menu-edit-pulse').forEach(sel => {
      const currentSel = sel.value;
      let pulseOptionsHtml = '';
      pulses.forEach(pk => {
        const ing = this.data.ingredients[pk];
        const isSel = (currentSel === pk) ? 'selected' : '';
        pulseOptionsHtml += `<option value="${pk}" ${isSel}>${ing.name} (${ing.defaultRate} kg)</option>`;
      });
      sel.innerHTML = pulseOptionsHtml;
    });
  },

  /**
   * Real-time reactive sync when old stock is changed in Settings
   */
  onOldStockSettingChange(key) {
    const input = document.querySelector(`.old-stock-settings-input[data-key="${key}"]`);
    if (input && this.data.initialStock) {
      const val = parseFloat(input.value);
      if (!isNaN(val)) {
        this.data.initialStock[key] = val;
        this.saveState();
        this.renderStockView();
        this.renderDailyRegister();
        this.renderMonthlyExcelSheet();
        this.renderFormB();
        this.renderYearlyReport();
      }
    }
  },

  /**
   * Auto-save school profile, officer metadata & fuel rate on input
   */
  autoSaveSchoolSettings() {
    const sName = document.getElementById('setSchoolName');
    const uDise = document.getElementById('setUdise');
    const sCentre = document.getElementById('setCentre');
    const sTaluka = document.getElementById('setTaluka');
    const sDist = document.getElementById('setDistrict');
    const sPatPrimary = document.getElementById('setPatPrimary');
    const sPatUpper = document.getElementById('setPatUpper');
    const sPat = document.getElementById('setPat');
    const sHead = document.getElementById('setHeadmaster');
    const sPres = document.getElementById('setPresident');
    const sAsst = document.getElementById('setAssistantTeacher');
    const sCook = document.getElementById('setCookName');
    const sFuelPrimary = document.getElementById('setFuelRatePrimary');
    const sFuelUpper = document.getElementById('setFuelRateUpper');
    const sFuel = document.getElementById('setFuelRate');
    const sCookH = document.getElementById('setCookHonorarium');
    const sCookC = document.getElementById('setCookCount');

    if (sName) this.data.settings.schoolName = sName.value.trim();
    if (uDise) {
      const cleanU = uDise.value.trim();
      this.data.settings.udise = cleanU;
      if (cleanU.length === 11) {
        localStorage.setItem(this.ACTIVE_UDISE_STORAGE_KEY, cleanU);
      }
    }
    if (sCentre) this.data.settings.centre = sCentre.value.trim();
    if (sTaluka) this.data.settings.taluka = sTaluka.value.trim();
    if (sDist) this.data.settings.district = sDist.value.trim();
    if (sPatPrimary) {
      const val = parseInt(sPatPrimary.value) || 0;
      this.data.settings.patPrimary = val;
      if (this.activeSection === 'primary') this.data.settings.pat = val;
    }
    if (sPatUpper) {
      const val = parseInt(sPatUpper.value) || 0;
      this.data.settings.patUpper = val;
      if (this.activeSection === 'upper') this.data.settings.pat = val;
    }
    if (sPat && !sPatPrimary) {
      this.data.settings.pat = parseInt(sPat.value) || 9;
    }
    if (sHead) this.data.settings.headmaster = sHead.value.trim();
    if (sPres) this.data.settings.president = sPres.value.trim();
    if (sAsst) this.data.settings.assistantTeacher = sAsst.value.trim();
    if (sCook) this.data.settings.cookName = sCook.value.trim();
    if (sFuelPrimary) {
      const val = parseFloat(sFuelPrimary.value) || 1.51;
      this.data.settings.fuelRatePrimary = val;
      if (this.activeSection === 'primary') this.data.settings.fuelRate = val;
    }
    if (sFuelUpper) {
      const val = parseFloat(sFuelUpper.value) || 2.17;
      this.data.settings.fuelRateUpper = val;
      if (this.activeSection === 'upper') this.data.settings.fuelRate = val;
    }
    if (sFuel && !sFuelPrimary) {
      this.data.settings.fuelRate = parseFloat(sFuel.value) || 1.51;
    }
    if (sCookH) this.data.settings.cookHonorarium = parseInt(sCookH.value) || 2500;
    if (sCookC) this.data.settings.cookCount = parseInt(sCookC.value) || 1;

    this.saveState();
    this.updateHeaderMeta();
    this.renderQuickAttendanceChips();
    this.onInputsChanged();
    this.renderDailyRegister();
    this.renderMonthlyExcelSheet();
    this.renderFormB();
    this.renderYearlyReport();
  },

  openAddIngredientModal() {
    const modal = document.getElementById('addIngredientModal');
    if (modal) {
      modal.style.display = 'flex';
      const nameInput = document.getElementById('newIngName');
      if (nameInput) {
        nameInput.value = '';
        nameInput.focus();
      }
    }
  },

  closeAddIngredientModal() {
    const modal = document.getElementById('addIngredientModal');
    if (modal) modal.style.display = 'none';
  },

  saveNewIngredient() {
    const nameInput = document.getElementById('newIngName');
    const catSelect = document.getElementById('newIngCategory');
    const unitSelect = document.getElementById('newIngUnit');
    const rateInput = document.getElementById('newIngRate');
    const opStockInput = document.getElementById('newIngOpeningStock');

    if (!nameInput || !nameInput.value.trim()) {
      alert('कृपया धान्याचे किंवा घटकाचे नांव भरा.');
      return;
    }

    const name = nameInput.value.trim();
    const category = catSelect ? catSelect.value : 'pulse';
    const unit = unitSelect ? unitSelect.value : 'kg';
    const rate = parseFloat(rateInput ? rateInput.value : 0.02) || 0.02;
    const openingStock = parseFloat(opStockInput ? opStockInput.value : 0) || 0;

    // Generate unique slug / key
    const rawKey = 'ing_' + Date.now().toString(36);

    if (!this.data.ingredients) this.data.ingredients = {};
    if (!this.data.initialStock) this.data.initialStock = {};

    this.data.ingredients[rawKey] = {
      id: rawKey,
      name: name,
      defaultRate: rate,
      unit: unit,
      category: category,
      isCustom: true
    };

    this.data.initialStock[rawKey] = openingStock;

    this.saveState();
    this.closeAddIngredientModal();
    this.refreshAllViews();
    this.showToast(`✅ नवीन धान्य/घटक '${name}' यशस्वीरित्या जोडला गेला!`, 'success');
  },

  deleteCustomIngredient(key) {
    const ing = this.data.ingredients[key];
    if (!ing) return;

    if (confirm(`'${ing.name}' हा घटक खरोखर यादीतून हटवायचा आहे का?`)) {
      delete this.data.ingredients[key];
      delete this.data.initialStock[key];

      // Remove from custom demands or form b remarks if any
      if (this.data.customDemands) {
        Object.keys(this.data.customDemands).forEach(ym => {
          if (this.data.customDemands[ym]) delete this.data.customDemands[ym][key];
        });
      }

      this.saveState();
      this.refreshAllViews();
      this.showToast(`'${ing.name}' घटक हटवण्यात आला.`, 'warning');
    }
  },

  renderMenusInSettings() {
    const tableBody = document.getElementById('menusTableBody');
    if (!tableBody) return;
    tableBody.innerHTML = '';

    const pulses = Object.keys(this.data.ingredients).filter(k => this.data.ingredients[k].category === 'pulse');

    const dayOptions = [
      { code: 2, name: 'सोमवार' },
      { code: 3, name: 'मंगळवार' },
      { code: 4, name: 'बुधवार' },
      { code: 5, name: 'गुरुवार' },
      { code: 6, name: 'शुक्रवार' },
      { code: 7, name: 'शनिवार' },
      { code: 0, name: 'विशेष मेन्यू' }
    ];

    this.data.menus.forEach((m, idx) => {
      const isSystemHoliday = m.id === 'holiday';
      const tr = document.createElement('tr');
      
      let dayOptionsHtml = '';
      dayOptions.forEach(d => {
        const isSel = (m.dayCode === d.code) ? 'selected' : '';
        dayOptionsHtml += `<option value="${d.code}" ${isSel}>${d.name}</option>`;
      });

      const isNil = (!m.pulseKey || m.pulseKey === 'nil' || m.pulseKey === 'none');
      let pulseOptionsHtml = `<option value="nil" ${isNil ? 'selected' : ''}>— निरंक / nil (फक्त तांदूळ / डाळ नाही) —</option>`;
      pulses.forEach(pk => {
        const ing = this.data.ingredients[pk];
        const isSel = (!isNil && m.pulseKey === pk) ? 'selected' : '';
        pulseOptionsHtml += `<option value="${pk}" ${isSel}>${ing.name} (${ing.defaultRate} kg)</option>`;
      });

      tr.innerHTML = `
        <td>
          ${isSystemHoliday ? '<strong>रविवार</strong>' : `
            <select class="form-select form-select-sm menu-edit-day" data-index="${idx}" onchange="app.saveMenusFromSettings()">
              ${dayOptionsHtml}
            </select>
          `}
        </td>
        <td>
          <input type="text" class="form-control form-control-sm menu-edit-name" data-index="${idx}" value="${m.name}" ${isSystemHoliday ? 'readonly' : ''} oninput="app.saveMenusFromSettings()">
        </td>
        <td>
          ${isSystemHoliday ? '<span class="badge badge-secondary">— (सुट्टी)</span>' : `
            <select class="form-select form-select-sm menu-edit-pulse" data-index="${idx}" onchange="app.saveMenusFromSettings()">
              ${pulseOptionsHtml}
            </select>
          `}
        </td>
        <td class="text-center">
          ${isSystemHoliday ? '' : `
            <button type="button" class="btn btn-sm btn-outline-danger" onclick="app.deleteMenuInSettings(${idx})" title="हटवा">🗑️</button>
          `}
        </td>
      `;
      tableBody.appendChild(tr);
    });
  },

  addNewMenuRowInSettings() {
    const name = prompt('नवीन मेन्यूचे नांव टाका (उदा. गोड भात, नॉन व्हेज, सोयावडी पुलाव, मूगडाळ खिचडी):');
    if (!name || !name.trim()) return;

    const trimmed = name.trim();
    const dayChoice = prompt('हा मेन्यू कोणत्या वारासाठी आहे?\n(2=सोमवार, 3=मंगळवार, 4=बुधवार, 5=गुरुवार, 6=शुक्रवार, 7=शनिवार, 0=विशेष मेन्यू):', '0');
    const dayCode = parseInt(dayChoice) || 0;
    const dayNames = { 2: "सोमवार", 3: "मंगळवार", 4: "बुधवार", 5: "गुरुवार", 6: "शुक्रवार", 7: "शनिवार", 0: "विशेष मेन्यू" };

    if (dayCode > 1) {
      // Reassign any previous menu on this weekday to special
      this.data.menus.forEach(m => {
        if (m.dayCode === dayCode) {
          m.dayCode = 0;
          m.dayName = "विशेष मेन्यू";
        }
      });
    }

    let defaultPulse = 'nil';
    if (trimmed.includes('पुलाव') || trimmed.includes('सोया')) {
      defaultPulse = 'soyavadi';
    } else if (trimmed.includes('मटकी')) {
      defaultPulse = 'matki';
    } else if (trimmed.includes('मूग')) {
      defaultPulse = 'moong_dal';
    } else if (trimmed.includes('तूर') || trimmed.includes('वरण')) {
      defaultPulse = 'tur_dal';
    } else if (trimmed.includes('मसूर')) {
      defaultPulse = 'masoor_dal';
    } else if (trimmed.includes('चवळी')) {
      defaultPulse = 'chavali';
    } else if (trimmed.includes('हरभरा')) {
      defaultPulse = 'chana';
    } else if (trimmed.includes('वाटाणा')) {
      defaultPulse = 'vatana';
    } else if (trimmed.includes('गोड') || trimmed.includes('नॉन') || trimmed.includes('अंडी')) {
      defaultPulse = 'nil';
    }

    this.data.menus.push({
      id: `menu_${Date.now()}`,
      name: trimmed,
      pulseKey: defaultPulse,
      dayCode: dayCode,
      dayName: dayNames[dayCode] || "विशेष मेन्यू"
    });

    this.saveState();
    this.populateMenuDropdown();
    this.renderMenusInSettings();
    this.renderDailyRegister();
    this.renderMonthlyExcelSheet();
    this.showToast(`✅ '${trimmed}' मेन्यू जोडला गेला!`, 'success');
  },

  deleteMenuInSettings(idx) {
    const m = this.data.menus[idx];
    if (!m) return;
    if (confirm(`'${m.name}' मेन्यू खरोखर हटवायचा आहे का?`)) {
      this.data.menus.splice(idx, 1);
      this.saveState();
      this.populateMenuDropdown();
      this.renderMenusInSettings();
      this.renderDailyRegister();
      this.renderMonthlyExcelSheet();
      this.showToast('मेन्यू हटवण्यात आला.', 'warning');
    }
  },

  saveMenusFromSettings() {
    const dayNames = {
      2: "सोमवार",
      3: "मंगळवार",
      4: "बुधवार",
      5: "गुरुवार",
      6: "शुक्रवार",
      7: "शनिवार",
      0: "विशेष मेन्यू",
      1: "रविवार"
    };

    const oldMenus = JSON.parse(JSON.stringify(this.data.menus));

    document.querySelectorAll('.menu-edit-name').forEach(inp => {
      const idx = parseInt(inp.dataset.index);
      if (!isNaN(idx) && this.data.menus[idx]) {
        const val = inp.value.trim();
        if (val) this.data.menus[idx].name = val;
      }
    });

    document.querySelectorAll('.menu-edit-pulse').forEach(sel => {
      const idx = parseInt(sel.dataset.index);
      if (!isNaN(idx) && this.data.menus[idx]) {
        this.data.menus[idx].pulseKey = sel.value;
      }
    });

    document.querySelectorAll('.menu-edit-day').forEach(sel => {
      const idx = parseInt(sel.dataset.index);
      if (!isNaN(idx) && this.data.menus[idx]) {
        const dCode = parseInt(sel.value);
        this.data.menus[idx].dayCode = isNaN(dCode) ? 0 : dCode;
        this.data.menus[idx].dayName = dayNames[this.data.menus[idx].dayCode] || "विशेष मेन्यू";
      }
    });

    // Also sync existing records that used the old name for this menu!
    this.data.menus.forEach((m, idx) => {
      const old = oldMenus[idx];
      if (old && old.name && m.name && old.name !== m.name) {
        if (this.data.records) {
          Object.keys(this.data.records).forEach(dateStr => {
            const rec = this.data.records[dateStr];
            if (rec && rec.menuName === old.name) {
              rec.menuName = m.name;
            }
          });
        }
      }
    });

    this.saveState();
    this.populateMenuDropdown();
    this.renderManualGrainsCheckboxes();
    this.onInputsChanged();
    this.renderDailyRegister();
    this.renderMonthlyExcelSheet();
  },

  saveIngredientRulesFromSettings() {
    // Save ingredient names
    document.querySelectorAll('.rule-name-input').forEach(inp => {
      const key = inp.dataset.key;
      const name = inp.value.trim();
      if (key && name && this.data.ingredients[key]) {
        this.data.ingredients[key].name = name;
      }
    });

    // Save ingredient rates (Dual 1-5 and 6-8)
    document.querySelectorAll('.rule-rate-p-input').forEach(inp => {
      const key = inp.dataset.key;
      const rate = parseFloat(inp.value);
      if (key && !isNaN(rate) && this.data.ingredients[key]) {
        this.data.ingredients[key].ratePrimary = rate;
        this.data.ingredients[key].defaultRate = rate;
      }
    });

    document.querySelectorAll('.rule-rate-u-input').forEach(inp => {
      const key = inp.dataset.key;
      const rate = parseFloat(inp.value);
      if (key && !isNaN(rate) && this.data.ingredients[key]) {
        this.data.ingredients[key].rateUpper = rate;
      }
    });

    // Fallback for single rate input if present
    document.querySelectorAll('.rule-rate-input').forEach(inp => {
      const key = inp.dataset.key;
      const rate = parseFloat(inp.value);
      if (key && !isNaN(rate) && this.data.ingredients[key]) {
        this.data.ingredients[key].defaultRate = rate;
      }
    });

    this.saveState();
    this.refreshAllViews();
    this.showToast('✅ घटक नावे व १ ते ५ आणि ६ ते ८ चे दर यशस्वीरित्या जतन झाले!', 'success');
  },

  saveSettingsFromUI() {
    this.autoSaveSchoolSettings();

    // Save ingredient names
    document.querySelectorAll('.rule-name-input').forEach(inp => {
      const key = inp.dataset.key;
      const name = inp.value.trim();
      if (key && name && this.data.ingredients[key]) {
        this.data.ingredients[key].name = name;
      }
    });

    // Save dual rates
    document.querySelectorAll('.rule-rate-p-input').forEach(inp => {
      const key = inp.dataset.key;
      const rate = parseFloat(inp.value);
      if (key && !isNaN(rate) && this.data.ingredients[key]) {
        this.data.ingredients[key].ratePrimary = rate;
        this.data.ingredients[key].defaultRate = rate;
      }
    });

    document.querySelectorAll('.rule-rate-u-input').forEach(inp => {
      const key = inp.dataset.key;
      const rate = parseFloat(inp.value);
      if (key && !isNaN(rate) && this.data.ingredients[key]) {
        this.data.ingredients[key].rateUpper = rate;
      }
    });

    document.querySelectorAll('.rule-rate-input').forEach(inp => {
      const key = inp.dataset.key;
      const rate = parseFloat(inp.value);
      if (key && !isNaN(rate) && this.data.ingredients[key]) {
        this.data.ingredients[key].defaultRate = rate;
      }
    });

    // Also save old stock if changed in settings
    document.querySelectorAll('.old-stock-settings-input').forEach(inp => {
      const key = inp.dataset.key;
      const val = parseFloat(inp.value);
      if (key && !isNaN(val)) {
        this.data.initialStock[key] = val;
      }
    });

    this.saveState();
    this.refreshAllViews();
    this.showToast('✅ सर्व सेटिंग्ज, नियम व मागील साठा सर्व पानांवर यशस्वीरित्या अपडेट झाले!', 'success');
  },

  // =========================================================================
  // TOAST NOTIFICATIONS
  // =========================================================================

  showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 250);
    }, 3500);
  },

  // =========================================================================
  // CLOUD SYNC UI CONTROLLERS
  // =========================================================================

  openCloudSyncModal() {
    try {
      const modal = document.getElementById('cloudSyncModal');
      if (!modal) {
        console.error("cloudSyncModal element not found!");
        return;
      }
      modal.style.display = 'flex';
      modal.style.zIndex = '1000008';
      
      const codeInput = document.getElementById('cloudSchoolCode');
      const pinInput = document.getElementById('cloudSecretPin');
      const fbInput = document.getElementById('cloudFirebaseUrl');
      
      const currentUdise = (typeof this.getActiveUdise === 'function') ? this.getActiveUdise() : (this.data && this.data.settings ? this.data.settings.udise : '27240801201');
      if (codeInput) {
        codeInput.value = (typeof cloudSync !== 'undefined' && cloudSync.config && cloudSync.config.schoolCode)
          ? cloudSync.config.schoolCode : (currentUdise || '27240801201');
      }
      if (pinInput) {
        pinInput.value = (typeof cloudSync !== 'undefined' && cloudSync.config && cloudSync.config.secretPin)
          ? cloudSync.config.secretPin : 'Ican@123';
      }
      if (fbInput) {
        fbInput.value = (typeof cloudSync !== 'undefined' && cloudSync.config && cloudSync.config.firebaseUrl)
          ? cloudSync.config.firebaseUrl : '';
      }
      
      if (typeof cloudSync !== 'undefined' && typeof cloudSync.updateUIStatus === 'function') {
        cloudSync.updateUIStatus();
      }
    } catch (e) {
      console.error("Error opening cloud sync modal:", e);
      const modal = document.getElementById('cloudSyncModal');
      if (modal) {
        modal.style.display = 'flex';
        modal.style.zIndex = '1000008';
      }
    }
  },

  closeCloudSyncModal() {
    const modal = document.getElementById('cloudSyncModal');
    if (modal) modal.style.display = 'none';
  },

  async saveCloudSyncSettings() {
    const code = document.getElementById('cloudSchoolCode') ? document.getElementById('cloudSchoolCode').value.trim() : '';
    const pin = document.getElementById('cloudSecretPin') ? document.getElementById('cloudSecretPin').value.trim() : '';
    const fbUrl = document.getElementById('cloudFirebaseUrl') ? document.getElementById('cloudFirebaseUrl').value.trim() : '';
    
    if (!fbUrl) {
      alert('⚠️ कृपया प्रथम Google Firebase Realtime Database ची URL प्रविष्ट करा!\n\nउदा. https://your-project-default-rtdb.firebaseio.com/');
      const fbInput = document.getElementById('cloudFirebaseUrl');
      if (fbInput) fbInput.focus();
      return;
    }

    if (typeof cloudSync !== 'undefined') {
      const ok = await cloudSync.setupCloudSync(code, pin, fbUrl);
      if (ok) this.closeCloudSyncModal();
    }
  },

  async syncCloudNow() {
    if (typeof cloudSync === 'undefined') return;
    const urlInput = document.getElementById('cloudFirebaseUrl');
    const codeInput = document.getElementById('cloudSchoolCode');
    const pinInput = document.getElementById('cloudSecretPin');
    
    const url = (urlInput ? urlInput.value.trim() : '') || (cloudSync.config ? cloudSync.config.firebaseUrl : '');
    if (!url) {
      alert('⚠️ कृपया प्रथम Google Firebase Realtime Database ची URL प्रविष्ट करा!\n\nउदा. https://your-project-default-rtdb.firebaseio.com/');
      if (urlInput) urlInput.focus();
      return;
    }
    
    // Auto-save settings if user entered new URL
    if (urlInput && urlInput.value.trim()) {
      cloudSync.config.firebaseUrl = cloudSync.normalizeFirebaseUrl(urlInput.value.trim());
      if (codeInput && codeInput.value.trim()) cloudSync.config.schoolCode = codeInput.value.trim();
      if (pinInput && pinInput.value.trim()) cloudSync.config.secretPin = pinInput.value.trim();
      cloudSync.config.enabled = true;
      cloudSync.saveConfig();
    }
    
    const btn = document.getElementById('btnCloudSyncNow');
    const origText = btn ? btn.innerHTML : '';
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<span>⏳ डेटा पाठवत आहे...</span>';
    }
    
    try {
      await cloudSync.pushToCloud(false);
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = origText;
      }
    }
  },

  async pullCloudNow() {
    if (typeof cloudSync === 'undefined') return;
    const urlInput = document.getElementById('cloudFirebaseUrl');
    const codeInput = document.getElementById('cloudSchoolCode');
    const pinInput = document.getElementById('cloudSecretPin');
    
    const url = (urlInput ? urlInput.value.trim() : '') || (cloudSync.config ? cloudSync.config.firebaseUrl : '');
    if (!url) {
      alert('⚠️ कृपया प्रथम Google Firebase Realtime Database ची URL प्रविष्ट करा!\n\nउदा. https://your-project-default-rtdb.firebaseio.com/');
      if (urlInput) urlInput.focus();
      return;
    }
    
    // Auto-save settings if user entered new URL
    if (urlInput && urlInput.value.trim()) {
      cloudSync.config.firebaseUrl = cloudSync.normalizeFirebaseUrl(urlInput.value.trim());
      if (codeInput && codeInput.value.trim()) cloudSync.config.schoolCode = codeInput.value.trim();
      if (pinInput && pinInput.value.trim()) cloudSync.config.secretPin = pinInput.value.trim();
      cloudSync.config.enabled = true;
      cloudSync.saveConfig();
    }
    
    const btn = document.getElementById('btnCloudPullNow') || (typeof event !== 'undefined' && event && event.target ? event.target.closest('button') : null);
    const origText = btn ? btn.innerHTML : '';
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<span>⏳ डेटा आणत आहे...</span>';
    }
    
    try {
      await cloudSync.pullFromCloud(false);
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = origText;
      }
    }
  },

  async testFirebaseConnection() {
    if (typeof cloudSync === 'undefined') return;
    const urlInput = document.getElementById('cloudFirebaseUrl');
    const codeInput = document.getElementById('cloudSchoolCode');
    const url = (urlInput ? urlInput.value.trim() : '') || (cloudSync.config ? cloudSync.config.firebaseUrl : '');
    const code = (codeInput ? codeInput.value.trim() : '') || (cloudSync.config ? cloudSync.config.schoolCode : '');
    
    if (!url) {
      alert('⚠️ कृपया प्रथम Google Firebase Realtime Database ची URL प्रविष्ट करा!\n\nउदा. https://your-project-default-rtdb.firebaseio.com/');
      if (urlInput) urlInput.focus();
      return;
    }

    const btn = document.getElementById('btnTestFirebase') || (typeof event !== 'undefined' && event && event.target ? event.target.closest('button') : null);
    const origText = btn ? btn.innerHTML : '';
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<span>⏳ तपासत आहे...</span>';
    }

    try {
      await cloudSync.testFirebaseConnection(url, code);
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = origText;
      }
    }
  },

  shareFullDataViaWhatsApp() {
    this.openCloudSyncModal();
    this.showToast('ℹ️ सर्व उपकरणांवर डेटा सिंक करण्यासाठी कृपया Google Firebase क्लाऊड सिंक वापरा.', 'info');
  },

  shareTodayEntryViaWhatsApp(dateStr) {
    const targetDate = dateStr || (document.getElementById('entryDate') ? document.getElementById('entryDate').value : new Date().toISOString().split('T')[0]);
    const rec = (this.data && this.data.records) ? this.data.records[targetDate] : null;
    if (!rec) {
      this.showToast('या दिनांकाची कोणतीही नोंद आढळली नाही.', 'warning');
      return;
    }

    const schoolName = (this.data.settings && this.data.settings.schoolName) || 'शाळा';
    const udise = this.getActiveUdise();
    const [yr, mo, dy] = targetDate.split('-');
    const stdGrp = (rec.standardGroup === '6-8') ? 'इयत्ता 6 ते 8 (उच्च प्राथमिक)' : 'इयत्ता 1 ते 5 (प्राथमिक)';

    let msg = `🍲 *शालेय पोषण आहार (PM POSHAN) दैनिक अहवाल*\n`;
    msg += `🏫 *शाळा:* ${schoolName}\n`;
    msg += `🆔 *UDISE:* ${udise}\n`;
    msg += `📅 *दिनांक:* ${dy}/${mo}/${yr}\n`;
    msg += `🎓 *गट:* ${stdGrp}\n`;
    msg += `👥 *लाभार्थी विद्यार्थी:* ${rec.children || 0}\n`;
    msg += `🍛 *मेन्यू:* ${rec.menuName || '-'}\n`;
    if (rec.riceKg) msg += `🍚 *तांदूळ वापर:* ${rec.riceKg} कि.ग्रॅ.\n`;
    if (rec.fuelCost) msg += `💰 *इंधन खर्च:* ₹${rec.fuelCost}\n`;
    msg += `\n_सादरकर्ता: मुख्याध्यापक / MDM प्रभारी_`;

    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;
    if (typeof window !== 'undefined') {
      window.open(waUrl, '_blank');
    }
  }

};

// Initialize Application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  app.init();
});
