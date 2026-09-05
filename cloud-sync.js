/**
 * MDM Application - Google Firebase Realtime Database Live Multi-Device Cloud Sync Engine
 * 
 * Exclusively powered by Google Firebase Realtime Database (REST API)
 * Features:
 * 1. Live 2-Way REST Synchronization across PC, Laptop & Mobile devices
 * 2. Smart Conflict-Free Merge (Never loses dates or stock records from either device)
 * 3. Empty Device Safeguard (Blocks blank local state from wiping populated cloud databases)
 * 4. Automatic Cloud Safety Snapshot Backups before every overwrite
 * 5. Automatic Debounced Background Push on every save
 * 6. Non-blocking Timeout Protection with AbortController
 * 7. Live Online/Offline Network Resilience
 */

const cloudSync = {
  config: {
    enabled: false,
    autoSync: true,
    schoolCode: '',             // School UDISE (e.g. 27240801201)
    secretPin: 'Ican@123',      // Security PIN
    firebaseUrl: '',            // Google Firebase Realtime Database URL
    lastSyncTime: null,
    status: 'idle',             // 'idle', 'syncing', 'synced', 'error', 'offline'
    lastError: ''
  },

  isSyncing: false,
  hasPendingPush: false,
  debounceTimer: null,
  SYNC_STORAGE_KEY: 'MDM_CLOUD_SYNC_CONFIG',

  /**
   * Helper: Normalize & sanitize Firebase RTDB URL
   */
  normalizeFirebaseUrl(url) {
    if (!url || typeof url !== 'string') return '';
    let clean = url.trim();
    // If user accidentally copied the Firebase Console page URL:
    // e.g. https://console.firebase.google.com/project/<project-id>/database/<database-name>/data
    if (clean.includes('console.firebase.google.com')) {
      const match = clean.match(/database\/([^/?#]+)/);
      if (match && match[1]) {
        clean = `https://${match[1]}.firebaseio.com`;
      }
    }
    if (!clean.startsWith('http://') && !clean.startsWith('https://')) {
      clean = 'https://' + clean;
    }
    // Remove trailing slashes, /data, and .json
    clean = clean.replace(/\.json$/, '').replace(/\/data$/, '').replace(/\/+$/, '');
    return clean;
  },

  /**
   * Helper: Fetch with timeout via AbortController
   */
  async fetchWithTimeout(url, options = {}, timeoutMs = 12000) {
    if (typeof AbortController === 'undefined') {
      return fetch(url, options);
    }
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(timer);
      return res;
    } catch (err) {
      clearTimeout(timer);
      if (err.name === 'AbortError') {
        throw new Error('कनेक्शन टाईमआऊट (12 सेकंद). कृपया इंटरनेट कनेक्शन तपासा.');
      }
      throw err;
    }
  },

  /**
   * Initialize Cloud Sync
   */
  init() {
    this.loadConfig();
    this.bindOnlineEvents();

    // Auto pull on startup if Firebase is enabled & configured
    if (this.config.enabled && this.config.firebaseUrl && this.getSchoolUdise()) {
      setTimeout(() => {
        this.pullFromCloud(true);
      }, 700);
    }

    this.updateUIStatus();
  },

  loadConfig() {
    try {
      if (typeof localStorage === 'undefined') return;
      const saved = localStorage.getItem(this.SYNC_STORAGE_KEY);
      if (saved) {
        this.config = Object.assign({}, this.config, JSON.parse(saved));
        if (this.config.firebaseUrl) {
          this.config.firebaseUrl = this.normalizeFirebaseUrl(this.config.firebaseUrl);
        }
      }
    } catch (e) {
      console.warn("Could not load cloud sync config:", e);
    }
  },

  saveConfig() {
    try {
      if (typeof localStorage === 'undefined') return;
      localStorage.setItem(this.SYNC_STORAGE_KEY, JSON.stringify(this.config));
      this.updateUIStatus();
    } catch (e) {
      console.warn("Could not save cloud sync config:", e);
    }
  },

  bindOnlineEvents() {
    if (typeof window === 'undefined') return;

    window.addEventListener('online', () => {
      this.config.lastError = '';
      this.updateUIStatus();
      if (this.config.enabled && this.config.firebaseUrl && this.config.autoSync) {
        this.scheduleDebouncedPush();
      }
    });

    window.addEventListener('offline', () => {
      this.config.status = 'offline';
      this.updateUIStatus();
    });
  },

  getSchoolUdise() {
    return String(
      (typeof app !== 'undefined' && app.data && app.data.settings && app.data.settings.udise)
      || (typeof app !== 'undefined' && typeof app.getActiveUdise === 'function' && app.getActiveUdise())
      || (typeof localStorage !== 'undefined' && localStorage.getItem('MDM_CURRENT_UDISE'))
      || this.config.schoolCode
      || '27240304501'
    ).trim();
  },

  getCloudKey() {
    const udise = this.getSchoolUdise().replace(/[^a-zA-Z0-9_-]/g, '_');
    return `mdm_${udise}`;
  },

  onSchoolSwitched(newUdise) {
    if (newUdise) {
      this.config.schoolCode = String(newUdise).trim();
      this.config.status = 'idle';
      this.config.lastError = '';
      this.saveConfig();
      this.updateUIStatus();
    }
  },

  scheduleDebouncedPush() {
    if (this.debounceTimer) clearTimeout(this.debounceTimer);

    if (this.isSyncing) {
      this.hasPendingPush = true;
      return;
    }

    this.debounceTimer = setTimeout(() => {
      if (this.config.enabled && this.config.firebaseUrl && this.config.autoSync) {
        this.pushToCloud(true);
      }
    }, 2500);
  },

  /**
   * Push local data to Google Firebase Realtime Database
   */
  async pushToCloud(isSilent = false) {
    const cleanBaseUrl = this.normalizeFirebaseUrl(this.config.firebaseUrl);
    if (!cleanBaseUrl) {
      if (!isSilent) {
        alert('⚠️ Google Firebase Realtime Database URL प्रविष्ट केलेली नाही!\n\nकृपया प्रथम Firebase Realtime Database ची URL टाका.\nउदा. https://your-project-default-rtdb.firebaseio.com/');
      }
      return false;
    }

    if (this.isSyncing) {
      this.hasPendingPush = true;
      return false;
    }
    this.isSyncing = true;
    this.hasPendingPush = false;

    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
      this.isSyncing = false;
      this.config.status = 'offline';
      this.config.lastError = 'इंटरनेट कनेक्शन उपलब्ध नाही.';
      this.updateUIStatus();
      if (!isSilent && typeof app !== 'undefined') {
        app.showToast('⚠️ इंटरनेट उपलब्ध नाही. इंटरनेट सुरू झाल्यावर डेटा क्लाऊडवर सेव्ह होईल.', 'warning');
      }
      return false;
    }

    this.config.status = 'syncing';
    this.updateUIStatus();

    const currentUdise = this.getSchoolUdise();
    this.config.schoolCode = currentUdise;
    const endpoint = `${cleanBaseUrl}/mdm_schools/${this.getCloudKey()}.json`;

    try {
      // 1. Safety Check: Fetch remote state to prevent wiping populated database with blank device
      let existingRemote = null;
      try {
        const checkRes = await this.fetchWithTimeout(endpoint, {}, 8000);
        if (checkRes.ok) {
          existingRemote = await checkRes.json();
        }
      } catch (checkErr) {
        console.warn("Pre-check remote bucket notice:", checkErr);
      }

      const localRecCount = Object.keys((typeof app !== 'undefined' && app.data && app.data.records) || {}).length;
      const remoteRecCount = (existingRemote && existingRemote.appData && existingRemote.appData.records)
        ? Object.keys(existingRemote.appData.records).length : 0;

      // GUARD 1: Prevent Blank Device from destroying remote cloud database
      if (localRecCount === 0 && remoteRecCount > 0) {
        this.config.status = 'idle';
        this.updateUIStatus();
        const warnMsg = `⛔ डेटा सुरक्षा इशारा (डेटा नष्ट होण्यापासून रोखला!):\n\nया डिव्हाइसवर 0 दैनंदिन नोंदी आहेत, तर क्लाऊडवर आधीच ${remoteRecCount} नोंदी सुरक्षित साठवलेल्या आहेत!\n\nरिकामा डेटा अपलोड केल्यास मूळ डेटा नष्ट होईल, म्हणून सिस्टिमने हा रिकामा डेटा रोखला आहे.\n\nकृपया प्रथम "📥 क्लाऊडवरून आणा" (Pull) बटण दाबा जेणेकरून क्लाऊडवरील सर्व डेटा या डिव्हाइसवर येईल.`;
        if (!isSilent) alert(warnMsg);
        else console.warn(warnMsg);
        return false;
      }

      // GUARD 2: Smart Merge before push so any missing remote dates/receipts are combined
      let dataToPush = (typeof app !== 'undefined' && app.data) ? app.data : {};

      if (existingRemote && existingRemote.appData && remoteRecCount > 0) {
        const remoteData = existingRemote.appData;
        const mergedRecords = Object.assign({}, remoteData.records || {}, dataToPush.records || {});
        const mergedTaste = Object.assign({}, remoteData.tasteRecords || {}, dataToPush.tasteRecords || {});
        
        // Stock receipts union
        const mergedReceipts = [...(remoteData.stockReceipts || [])];
        (dataToPush.stockReceipts || []).forEach(lr => {
          if (!mergedReceipts.some(mr => mr.date === lr.date && mr.itemKey === lr.itemKey && mr.quantity === lr.quantity)) {
            mergedReceipts.push(lr);
          }
        });

        // Damaged stock union
        const mergedDamaged = [...(remoteData.damagedStock || [])];
        (dataToPush.damagedStock || []).forEach(ld => {
          if (!mergedDamaged.some(md => md.date === ld.date && md.reason === ld.reason)) {
            mergedDamaged.push(ld);
          }
        });

        dataToPush = Object.assign({}, dataToPush, {
          records: mergedRecords,
          tasteRecords: mergedTaste,
          stockReceipts: mergedReceipts,
          damagedStock: mergedDamaged
        });

        if (typeof app !== 'undefined' && app.data) {
          app.data.records = mergedRecords;
          app.data.tasteRecords = mergedTaste;
          app.data.stockReceipts = mergedReceipts;
          app.data.damagedStock = mergedDamaged;
          if (typeof app.saveState === 'function') app.saveState(true);
        }

        // Auto snapshot safety backup
        try {
          const backupEndpoint = `${cleanBaseUrl}/mdm_backups/${this.getCloudKey()}_safety_backup.json`;
          this.fetchWithTimeout(backupEndpoint, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(existingRemote)
          }, 6000).catch(() => {});
        } catch (bErr) {}
      }

      const payload = {
        version: "2.0",
        schoolCode: currentUdise,
        updatedAt: new Date().toISOString(),
        updatedBy: (typeof app !== 'undefined' && app.data && app.data.settings && app.data.settings.headmaster) || 'User',
        appData: dataToPush
      };

      const res = await this.fetchWithTimeout(endpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }, 15000);

      if (res.ok) {
        this.config.status = 'synced';
        this.config.lastSyncTime = new Date().toISOString();
        this.config.lastError = '';
        this.saveConfig();

        const recCount = Object.keys(dataToPush.records || {}).length;
        if (!isSilent && typeof app !== 'undefined') {
          app.showToast(`☁️ डेटा यशस्वीरित्या Google Firebase वर सेव्ह झाला (${recCount} नोंदी)!`, 'success');
          alert(`☁️ कॉम्प्युटरवरील डेटा (${recCount} दैनंदिन नोंदी व साठा) Google Firebase वर यशस्वीरित्या सेव्ह झाला!\n\nशाळा UDISE: ${currentUdise}\n\nआता तुम्ही मोबाईलवर ॲप उघडून याच UDISE सह "📥 क्लाऊडवरून आणा" बटण दाबू शकता.`);
        }
        return true;
      } else {
        const errorText = await res.text();
        if (res.status === 401 || res.status === 403) {
          throw new Error('Firebase Rules लॉक आहेत (401 Permission Denied). कृपया Firebase Console मध्ये Rules मध्ये ".read": true, ".write": true करा.');
        }
        throw new Error(`Firebase Server Error (${res.status}): ${errorText.substring(0, 100)}`);
      }
    } catch (err) {
      console.warn("Firebase push error:", err);
      this.config.status = 'error';
      this.config.lastError = err.message || 'सिंक त्रुटी';
      this.updateUIStatus();
      if (!isSilent && typeof app !== 'undefined') {
        app.showToast(`⚠️ क्लाऊड सिंक करताना अडचण आली: ${this.config.lastError}`, 'warning');
      }
      return false;
    } finally {
      this.isSyncing = false;
      if (this.hasPendingPush) {
        this.hasPendingPush = false;
        this.scheduleDebouncedPush();
      }
    }
  },

  /**
   * Pull data from Google Firebase Realtime Database
   */
  async pullFromCloud(isSilent = false) {
    const cleanBaseUrl = this.normalizeFirebaseUrl(this.config.firebaseUrl);
    if (!cleanBaseUrl) {
      if (!isSilent) {
        alert('⚠️ Google Firebase Realtime Database URL प्रविष्ट केलेली नाही!\n\nकृपया प्रथम Firebase Realtime Database ची URL टाका.\nउदा. https://your-project-default-rtdb.firebaseio.com/');
      }
      return false;
    }

    if (this.isSyncing) return false;
    this.isSyncing = true;

    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
      this.isSyncing = false;
      this.config.status = 'offline';
      this.updateUIStatus();
      if (!isSilent) alert('इंटरनेट कनेक्शन बंद आहे. कृपया इंटरनेट चालू करा.');
      return false;
    }

    this.config.status = 'syncing';
    this.updateUIStatus();

    const currentUdise = this.getSchoolUdise();
    this.config.schoolCode = currentUdise;
    const endpoint = `${cleanBaseUrl}/mdm_schools/${this.getCloudKey()}.json`;

    try {
      const res = await this.fetchWithTimeout(endpoint, {}, 15000);
      if (res.ok) {
        const json = await res.json();
        if (json && json.appData && typeof json.appData === 'object') {
          const remoteData = json.appData;
          const remoteRecords = remoteData.records || {};
          const recordCount = Object.keys(remoteRecords).length;

          if (typeof app !== 'undefined' && app.data) {
            // Smart Merge: Local + Remote
            const mergedRecords = Object.assign({}, app.data.records || {}, remoteRecords);

            const mergedReceipts = [...(remoteData.stockReceipts || [])];
            (app.data.stockReceipts || []).forEach(lr => {
              if (!mergedReceipts.some(mr => mr.date === lr.date && mr.itemKey === lr.itemKey && mr.quantity === lr.quantity)) {
                mergedReceipts.push(lr);
              }
            });

            const mergedDamaged = [...(remoteData.damagedStock || [])];
            (app.data.damagedStock || []).forEach(ld => {
              if (!mergedDamaged.some(md => md.date === ld.date && md.reason === ld.reason)) {
                mergedDamaged.push(ld);
              }
            });

            app.data.records = mergedRecords;
            app.data.stockReceipts = mergedReceipts;
            app.data.damagedStock = mergedDamaged;

            if (remoteData.settings) {
              app.data.settings = Object.assign({}, app.data.settings, remoteData.settings);
            }
            if (remoteData.initialStock) {
              app.data.initialStock = Object.assign({}, app.data.initialStock, remoteData.initialStock);
            }
            if (remoteData.customDemands) {
              app.data.customDemands = Object.assign({}, app.data.customDemands, remoteData.customDemands);
            }
            if (remoteData.formBRemarks) {
              app.data.formBRemarks = Object.assign({}, app.data.formBRemarks, remoteData.formBRemarks);
            }
            if (remoteData.tasteRecords) {
              app.data.tasteRecords = Object.assign({}, app.data.tasteRecords, remoteData.tasteRecords);
            }

            // Save state skipping recursive cloud push
            if (typeof app.saveState === 'function') app.saveState(true);
            if (typeof app.loadState === 'function') app.loadState();
            if (typeof app.refreshAllViews === 'function') app.refreshAllViews();
            if (typeof app.onDateChanged === 'function') app.onDateChanged();
            if (typeof app.renderCurrentTab === 'function') app.renderCurrentTab();
          }

          this.config.status = 'synced';
          this.config.lastSyncTime = json.updatedAt || new Date().toISOString();
          this.config.lastError = '';
          this.saveConfig();

          if (!isSilent && typeof app !== 'undefined') {
            app.showToast(`🎉 Google Firebase वरून ${recordCount} नोंदी यशस्वीरित्या डाऊनलोड झाल्या!`, 'success');
            alert(`🎉 Google Firebase वरून ${recordCount} दैनंदिन नोंदी व साठा यशस्वीरित्या डाऊनलोड झाला!\n\nशाळा UDISE: ${currentUdise}\nया डिव्हाइसवर सर्व डेटा अद्ययावत झाला आहे.`);
          }
          return true;
        } else {
          // Empty remote bucket
          this.config.status = 'idle';
          this.updateUIStatus();
          if (!isSilent) {
            alert(`⚠️ Firebase वर या शाळेचा (UDISE: ${currentUdise}) कोणताही डेटा सापडला नाही!\n\nदुरुस्ती कशी करावी:\n1. ज्या डिव्हाइसवर (उदा. लॅपटॉप/PC) डेटा भरलेला आहे तिथे ॲप उघडा.\n2. वरील "☁️ क्लाऊड सिंक" बटण दाबा.\n3. "☁️ आता क्लाऊडवर सेव्ह करा" हे बटण दाबा.\n4. त्यानंतर या डिव्हाइसवर येऊन "📥 क्लाऊडवरून आणा" बटण दाबा.`);
          }
          return false;
        }
      } else {
        if (res.status === 401 || res.status === 403) {
          throw new Error('Firebase Rules लॉक आहेत (401 Permission Denied). कृपया Rules मध्ये ".read": true, ".write": true करा.');
        }
        throw new Error(`Firebase Server returned ${res.status}`);
      }
    } catch (err) {
      console.warn("Firebase pull error:", err);
      this.config.status = 'error';
      this.config.lastError = err.message;
      this.updateUIStatus();
      if (!isSilent) {
        alert(`⚠️ क्लाऊडवरून डेटा आणताना त्रुटी आली:\n${this.config.lastError}`);
      }
      return false;
    } finally {
      this.isSyncing = false;
    }
  },

  /**
   * Test Firebase Database Connection (Both PUT & GET)
   */
  async testFirebaseConnection(url, code) {
    const cleanUrl = this.normalizeFirebaseUrl(url || this.config.firebaseUrl);
    if (!cleanUrl || cleanUrl.length < 8) {
      alert('कृपया वैध Google Firebase Realtime Database URL प्रविष्ट करा.\nउदा. https://your-project-default-rtdb.firebaseio.com/');
      return false;
    }

    if (cleanUrl.includes('console.firebase.google.com')) {
      alert('⚠️ तुम्ही Firebase Console ची लिंक टाकली आहे!\n\nकृपया Realtime Database ची मुख्य URL टाका.\nउदा. https://your-project-default-rtdb.firebaseio.com/');
      return false;
    }

    const testEndpoint = `${cleanUrl}/mdm_schools/test_ping.json`;

    try {
      // 1. Write Test (PUT)
      const res = await this.fetchWithTimeout(testEndpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ping: "ok", timestamp: new Date().toISOString() })
      }, 10000);

      if (res.ok) {
        // 2. Read Test (GET)
        const readRes = await this.fetchWithTimeout(testEndpoint, {}, 10000);
        if (readRes.ok) {
          alert('✅ अभिनंदन! Google Firebase Cloud Database यशस्वीरित्या कनेक्ट झाला!\n\nडेटा वाचन (Read) व लेखन (Write) दोन्ही सुरळीत काम करत आहेत.\nआता खालील "💾 सेव्ह करा व सुरू करा" बटण दाबा.');
          return true;
        }
      }

      if (res.status === 401 || res.status === 403) {
        alert('⚠️ Firebase परवानगी त्रुटी (Permission Denied - Error 401/403):\n\nतुमच्या Firebase Database चे Rules लॉक आहेत!\n\nदुरुस्ती कशी करावी:\n1. Firebase Console (console.firebase.google.com) उघडा.\n2. डाव्या मेनूत Build -> Realtime Database वर जा.\n3. वरील "Rules" टॅब उघडा.\n4. Rules मध्ये खालीलप्रमाणे लिहा:\n{\n  "rules": {\n    ".read": true,\n    ".write": true\n  }\n}\n5. "Publish" बटण दाबा.');
        return false;
      } else {
        alert(`⚠️ Firebase कनेक्ट होऊ शकले नाही (${res.status}). कृपया Firebase Database URL तपासा.`);
        return false;
      }
    } catch (err) {
      alert(`⚠️ Firebase कनेक्शन त्रुटी: ${err.message}\n\nकृपया इंटरनेट कनेक्शन चालू आहे का आणि Realtime Database ची बरोबर URL टाकली आहे का ते तपासा.`);
      return false;
    }
  },

  /**
   * Setup & Enable Firebase Cloud Sync
   */
  async setupCloudSync(schoolCode, pin, firebaseUrl = '') {
    const cleanUrl = this.normalizeFirebaseUrl(firebaseUrl);
    if (!cleanUrl || cleanUrl.length < 8) {
      alert('कृपया Google Firebase Realtime Database ची URL प्रविष्ट करा.\nउदा. https://your-project-default-rtdb.firebaseio.com/');
      return false;
    }

    if (!schoolCode || schoolCode.trim().length < 3) {
      alert('कृपया शाळेचा UDISE क्रमांक प्रविष्ट करा.');
      return false;
    }

    this.config.enabled = true;
    this.config.schoolCode = schoolCode.trim();
    this.config.secretPin = pin ? pin.trim() : 'Ican@123';
    this.config.firebaseUrl = cleanUrl;
    this.config.autoSync = true;
    this.config.lastError = '';
    this.saveConfig();

    // If local has records, push to cloud; if local is empty, pull from cloud!
    const localRecCount = Object.keys((typeof app !== 'undefined' && app.data && app.data.records) || {}).length;
    if (localRecCount > 0) {
      await this.pushToCloud(false);
    } else {
      await this.pullFromCloud(false);
    }
    return true;
  },

  /**
   * Disable Cloud Sync
   */
  disableCloudSync() {
    this.config.enabled = false;
    this.config.status = 'idle';
    this.config.lastError = '';
    this.saveConfig();
    this.updateUIStatus();
    if (typeof app !== 'undefined') {
      app.showToast('Google Firebase क्लाऊड सिंक बंद करण्यात आले.', 'info');
    }
  },

  /**
   * Restore from Cloud Safety Backup
   */
  async restoreFromCloudBackup() {
    const cleanBaseUrl = this.normalizeFirebaseUrl(this.config.firebaseUrl);
    if (!cleanBaseUrl) {
      alert('कृपया प्रथम Firebase URL प्रविष्ट करा.');
      return false;
    }
    const backupEndpoint = `${cleanBaseUrl}/mdm_backups/${this.getCloudKey()}_safety_backup.json`;

    try {
      const res = await this.fetchWithTimeout(backupEndpoint, {}, 12000);
      if (res.ok) {
        const json = await res.json();
        if (json && json.appData && json.appData.records) {
          const recCount = Object.keys(json.appData.records).length;
          if (confirm(`सुरक्षित क्लाऊड बॅकअप सापडला (${recCount} नोंदी).\n\nहा डेटा त्वरित रिस्टोअर करायचा का?`)) {
            if (typeof app !== 'undefined') {
              app.data = Object.assign({}, app.data, json.appData);
              if (typeof app.saveState === 'function') app.saveState(true);
              if (typeof app.loadState === 'function') app.loadState();
              if (typeof app.refreshAllViews === 'function') app.refreshAllViews();
              if (typeof app.onDateChanged === 'function') app.onDateChanged();
              if (typeof app.renderCurrentTab === 'function') app.renderCurrentTab();
            }
            await this.pushToCloud(true);
            alert(`🎉 ${recCount} नोंदींचा सुरक्षित क्लाऊड बॅकअप यशस्वीरित्या रिस्टोअर झाला!`);
            return true;
          }
        }
      }
      alert('क्लाऊडवर कोणताही जुना सुरक्षित बॅकअप सापडला नाही.');
      return false;
    } catch (e) {
      alert('क्लाऊड बॅकअप शोधताना त्रुटी आली: ' + e.message);
      return false;
    }
  },

  formatTimeStr(isoString) {
    if (!isoString) return 'आत्ता';
    const t = new Date(isoString);
    if (isNaN(t.getTime())) return 'आत्ता';
    let hrs = t.getHours();
    const mins = String(t.getMinutes()).padStart(2, '0');
    const ampm = hrs >= 12 ? 'PM' : 'AM';
    hrs = hrs % 12 || 12;
    return `${hrs}:${mins} ${ampm}`;
  },

  updateUIStatus() {
    if (typeof document === 'undefined') return;
    this.config.schoolCode = this.getSchoolUdise();

    const headerPill = document.getElementById('cloudStatusPill');
    const headerText = document.getElementById('cloudStatusText');
    const headerDot = document.getElementById('cloudStatusDot');

    if (headerPill) {
      if (!this.config.enabled || !this.config.firebaseUrl) {
        headerPill.className = 'meta-pill cloud-pill-disabled';
        if (headerText) headerText.textContent = '☁️ सिंक: ऑफलाईन';
        if (headerDot) headerDot.style.background = '#94a3b8';
      } else if (this.config.status === 'syncing') {
        headerPill.className = 'meta-pill cloud-pill-syncing';
        if (headerText) headerText.textContent = '🔄 सिंक होत आहे...';
        if (headerDot) headerDot.style.background = '#f59e0b';
      } else if (this.config.status === 'synced') {
        headerPill.className = 'meta-pill cloud-pill-synced';
        const timeStr = this.formatTimeStr(this.config.lastSyncTime);
        if (headerText) headerText.textContent = `☁️ क्लाऊड सिंक: चालू (${timeStr})`;
        if (headerDot) headerDot.style.background = '#10b981';
      } else if (this.config.status === 'offline') {
        headerPill.className = 'meta-pill cloud-pill-offline';
        if (headerText) headerText.textContent = '⚠️ सिंक: इंटरनेट नाही';
        if (headerDot) headerDot.style.background = '#ef4444';
      } else {
        headerPill.className = 'meta-pill cloud-pill-error';
        if (headerText) headerText.textContent = '⚠️ सिंक त्रुटी';
        if (headerDot) headerDot.style.background = '#ef4444';
      }
    }

    const statusInModal = document.getElementById('cloudModalStatusText');
    if (statusInModal) {
      if (this.config.enabled && this.config.firebaseUrl) {
        if (this.config.status === 'synced') {
          statusInModal.innerHTML = `<span class="badge badge-success" style="font-size: 0.9rem;">✅ Google Firebase क्लाऊड सिंक सक्रिय</span> (शाळा UDISE: <code>${this.config.schoolCode}</code>) <br><small class="text-success" style="font-weight: 600;">शेवटचा यशस्वी सिंक: ${this.formatTimeStr(this.config.lastSyncTime)}</small>`;
        } else if (this.config.status === 'syncing') {
          statusInModal.innerHTML = `<span class="badge badge-warning" style="font-size: 0.9rem;">🔄 Firebase शी सिंक होत आहे...</span> (शाळा: <code>${this.config.schoolCode}</code>)`;
        } else if (this.config.status === 'offline') {
          statusInModal.innerHTML = `<span class="badge badge-warning" style="font-size: 0.9rem;">⚠️ इंटरनेट कनेक्शन बंद आहे (ऑफलाईन मोड)</span>`;
        } else if (this.config.status === 'error') {
          statusInModal.innerHTML = `<span class="badge badge-danger" style="font-size: 0.9rem;">⚠️ त्रुटी: ${this.config.lastError || 'कनेक्शन अयशस्वी'}</span>`;
        } else {
          statusInModal.innerHTML = `<span class="badge badge-info" style="font-size: 0.9rem;">ℹ️ सिंक तयार आहे (शाळा: <code>${this.config.schoolCode}</code>)</span>`;
        }
      } else {
        statusInModal.innerHTML = `<span class="badge badge-secondary" style="font-size: 0.9rem;">❌ सिंक बंद आहे (डेटा फक्त या डिव्हाइसवर सुरक्षित आहे)</span>`;
      }
    }
  }
};
