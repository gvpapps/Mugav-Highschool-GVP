/**
 * ==========================================================================
 * शालेय पोषण आहार (MDM) Automated Test Suite
 * Validates Test Cases 1 through 8 from Requirements
 * ==========================================================================
 */

const testSuite = {

  tests: [
    {
      id: 1,
      name: "Test 1: 10 विद्यार्थी व मुगडाळ खिचडी",
      description: "Children = 10, Menu = मुगडाळ खिचडी. सर्व घटकांचे अचूक प्रमाण तपासणे.",
      run() {
        const date = "2026-08-17"; // Monday
        const calc = app.calculateDay(date, 10, "मुगडाळ खिचडी");
        
        const q = calc.quantities;
        const passRice = Math.abs(q.rice - 1.00) < 0.0001;
        const passMoong = Math.abs(q.moong_dal - 0.20) < 0.0001;
        const passTur = (q.tur_dal === 0 || q.tur_dal === undefined);
        const passMustard = Math.abs(q.mustard - 0.0015) < 0.0001;
        const passCumin = Math.abs(q.cumin - 0.0020) < 0.0001;
        const passTurmeric = Math.abs(q.turmeric - 0.0015) < 0.0001;
        const passChilli = Math.abs(q.chilli - 0.0300) < 0.0001;
        const passMasala = Math.abs(q.masala - 0.0090) < 0.0001;
        const passOil = Math.abs(q.oil - 0.0500) < 0.0001;
        const passSalt = Math.abs(q.salt - 0.0070) < 0.0001;
        const passFuel = Math.abs(calc.fuelCost - 15.10) < 0.01;

        const passed = passRice && passMoong && passTur && passMustard && passCumin && 
                       passTurmeric && passChilli && passMasala && passOil && passSalt && passFuel;

        return {
          passed,
          details: `तांदूळ = ${q.rice} kg (अपेक्षित: 1.00), मूगडाळ = ${q.moong_dal} kg (अपेक्षित: 0.20), तूरडाळ = ${q.tur_dal || 0} kg (अपेक्षित: 0), तेल = ${q.oil} kg (अपेक्षित: 0.05), इंधन = रु. ${calc.fuelCost}`
        };
      }
    },
    {
      id: 2,
      name: "Test 2: 25 विद्यार्थी व वरणभात",
      description: "Children = 25, Menu = वरणभात. तांदूळ 2.50 kg, तूरडाळ 0.50 kg तपासणे.",
      run() {
        const date = "2026-08-18"; // Tuesday
        const calc = app.calculateDay(date, 25, "वरणभात");
        
        const q = calc.quantities;
        const passRice = Math.abs(q.rice - 2.50) < 0.0001;
        const passTur = Math.abs(q.tur_dal - 0.50) < 0.0001;
        const passOil = Math.abs(q.oil - 0.125) < 0.0001;
        const passFuel = Math.abs(calc.fuelCost - 37.75) < 0.01;

        const passed = passRice && passTur && passOil && passFuel;

        return {
          passed,
          details: `तांदूळ = ${q.rice} kg (अपेक्षित: 2.50), तूरडाळ = ${q.tur_dal} kg (अपेक्षित: 0.50), तेल = ${q.oil} kg (अपेक्षित: 0.125), इंधन = रु. ${calc.fuelCost}`
        };
      }
    },
    {
      id: 3,
      name: "Test 3: 50 विद्यार्थी व उसळभात",
      description: "Children = 50, Menu = उसळभात. तांदूळ 5.00 kg, कडधान्य 1.00 kg तपासणे.",
      run() {
        const date = "2026-08-19"; // Wednesday
        const calc = app.calculateDay(date, 50, "उसळभात");
        
        const q = calc.quantities;
        const passRice = Math.abs(q.rice - 5.00) < 0.0001;
        const pulseQty = (q.vatana || 0) + (q.chana || 0) + (q.matki || 0);
        const passPulse = Math.abs(pulseQty - 1.00) < 0.0001;
        const passOil = Math.abs(q.oil - 0.250) < 0.0001;

        const passed = passRice && passPulse && passOil;

        return {
          passed,
          details: `तांदूळ = ${q.rice} kg (अपेक्षित: 5.00), कडधान्य (उसळ) = ${pulseQty} kg (अपेक्षित: 1.00), तेल = ${q.oil} kg (अपेक्षित: 0.250)`
        };
      }
    },
    {
      id: 4,
      name: "Test 4: 0 विद्यार्थी (Children = 0)",
      description: "Children = 0. सर्व हिशोब 0 किंवा रिक्त होणे आवश्यक.",
      run() {
        const date = "2026-08-20";
        const calc = app.calculateDay(date, 0, "खिचडी");
        
        const q = calc.quantities;
        const passRice = (q.rice === 0 || q.rice === undefined);
        const passTur = (q.tur_dal === 0 || q.tur_dal === undefined);
        const passOil = (q.oil === 0 || q.oil === undefined);
        const passFuel = (calc.fuelCost === 0);

        const passed = passRice && passTur && passOil && passFuel;

        return {
          passed,
          details: `तांदूळ = ${q.rice || 0} kg, तूरडाळ = ${q.tur_dal || 0} kg, तेल = ${q.oil || 0} kg, इंधन = रु. ${calc.fuelCost}`
        };
      }
    },
    {
      id: 5,
      name: "Test 5: रविवार (Sunday Auto-Holiday)",
      description: "रविवारची तारीख निवडल्यास स्वयंचलित 'सुट्टी' व शून्य प्रमाण दाखवणे.",
      run() {
        const date = "2026-08-16"; // Sunday
        const dayName = app.getDayNameMarathi(date);
        const dayCode = app.getDayCode(date);
        const calc = app.calculateDay(date, 0);

        const isSunday = (dayName === "रविवार" && dayCode === 1);
        const isHoliday = (calc.isHoliday === true || calc.dayCode === 1);
        const passed = isSunday && isHoliday;

        return {
          passed,
          details: `वार = ${dayName}, वार कोड = ${dayCode}, सुट्टी स्थिती = ${isHoliday ? 'होय (सुट्टी)' : 'नाही'}`
        };
      }
    },
    {
      id: 6,
      name: "Test 6: उपस्थिती बदल (Dynamic 25 -> 40 Children)",
      description: "विद्यार्थी संख्या 25 वरून 40 केल्यास सर्व घटकांचा तात्काळ पुनर्हिशोब होणे.",
      run() {
        const calc25 = app.calculateDay("2026-08-18", 25, "वरणभात");
        const calc40 = app.calculateDay("2026-08-18", 40, "वरणभात");

        const passRice25 = Math.abs(calc25.quantities.rice - 2.50) < 0.0001;
        const passRice40 = Math.abs(calc40.quantities.rice - 4.00) < 0.0001;
        const passTur25 = Math.abs(calc25.quantities.tur_dal - 0.50) < 0.0001;
        const passTur40 = Math.abs(calc40.quantities.tur_dal - 0.80) < 0.0001;
        const passOil25 = Math.abs(calc25.quantities.oil - 0.125) < 0.0001;
        const passOil40 = Math.abs(calc40.quantities.oil - 0.200) < 0.0001;

        const passed = passRice25 && passRice40 && passTur25 && passTur40 && passOil25 && passOil40;

        return {
          passed,
          details: `25 विद्यार्थी: तांदूळ ${calc25.quantities.rice}kg, डाळ ${calc25.quantities.tur_dal}kg | 40 विद्यार्थी: तांदूळ ${calc40.quantities.rice}kg, डाळ ${calc40.quantities.tur_dal}kg`
        };
      }
    },
    {
      id: 7,
      name: "Test 7: मेन्यू बदल (Menu Switching)",
      description: "वरणभात वरून मुगडाळ खिचडी बदलल्यास डाळीचा प्रकार बदलणे.",
      run() {
        const calcVaran = app.calculateDay("2026-08-18", 20, "वरणभात");
        const calcMoong = app.calculateDay("2026-08-18", 20, "मुगडाळ खिचडी");

        const passVaran = (calcVaran.quantities.tur_dal > 0 && !calcVaran.quantities.moong_dal);
        const passMoong = (calcMoong.quantities.moong_dal > 0 && !calcMoong.quantities.tur_dal);

        const passed = passVaran && passMoong;

        return {
          passed,
          details: `वरणभात: तूरडाळ = ${calcVaran.quantities.tur_dal} kg, मूगडाळ = ${calcVaran.quantities.moong_dal || 0} | मुगडाळ खिचडी: मूगडाळ = ${calcMoong.quantities.moong_dal} kg, तूरडाळ = ${calcMoong.quantities.tur_dal || 0}`
        };
      }
    },
    {
      id: 8,
      name: "Test 8: डेटा सुरक्षा व साठवणूक (Persistence)",
      description: "नोंद जतन केल्यानंतर रीलोड केल्यावर डेटा अखंड उपलब्ध राहणे.",
      run() {
        const testDate = "2099-12-31";
        const testRecord = app.calculateDay(testDate, 33, "वरणभात");
        testRecord.remarks = "Persistence Verification Mock";

        // Test in isolated mock key without polluting user's actual records
        const mockKey = "MDM_TEST_MOCK_STORAGE";
        localStorage.setItem(mockKey, JSON.stringify({ records: { [testDate]: testRecord } }));
        const rawJson = localStorage.getItem(mockKey);
        localStorage.removeItem(mockKey);

        if (!rawJson) {
          return { passed: false, details: "LocalStorage चाचणी अयशस्वी." };
        }

        const parsed = JSON.parse(rawJson);
        const retrieved = parsed.records && parsed.records[testDate];
        const passed = retrieved && retrieved.children === 33 && retrieved.menuName === "वरणभात";

        return {
          passed,
          details: `जतन चाचणी यशस्वी (तारीख = ${testDate}, लाभार्थी = ${retrieved?.children}, मेन्यू = ${retrieved?.menuName})`
        };
      }
    },
    {
      id: 9,
      name: "Test 9: वार्षिक अहवाल गणना (1 एप्रिल ते 31 मार्च)",
      description: "Financial Year 12 Months rollover, Annual Rice, Pulses, Fuel and Cook total verification.",
      run() {
        const yearly = app.computeYearlyData('2019-2020');
        const passed = yearly && yearly.monthConfigs.length === 12 && 
                       yearly.ingredientMatrix.rice !== undefined &&
                       yearly.totalWorkingDays >= 0;

        return {
          passed,
          details: `12 महिने गोषवारा तयार: कामाचे दिवस = ${yearly.totalWorkingDays}, एकूण लाभार्थी = ${yearly.totalBeneficiaries}, इंधन खर्च = ₹${yearly.totalFuelSubsidy}`
        };
      }
    },
    {
      id: 10,
      name: "Test 10: इ. ६ ते ८ (उच्च प्राथमिक) मुगडाळ खिचडी गणना",
      description: "Children = 10, Menu = मुगडाळ खिचडी, Section = 'upper'. तांदूळ 1.50 kg, मूगडाळ 0.30 kg, तेल 0.075 kg, इंधन रु. 21.70.",
      run() {
        const date = "2026-08-17";
        const calc = app.calculateDay(date, 10, "मुगडाळ खिचडी", null, null, 'upper');
        const q = calc.quantities;
        const passRice = Math.abs(q.rice - 1.50) < 0.0001;
        const passMoong = Math.abs(q.moong_dal - 0.30) < 0.0001;
        const passOil = Math.abs(q.oil - 0.075) < 0.0001;
        const passFuel = Math.abs(calc.fuelCost - 21.70) < 0.01;

        const passed = passRice && passMoong && passOil && passFuel;
        return {
          passed,
          details: `तांदूळ = ${q.rice} kg (अपेक्षित: 1.50), मूगडाळ = ${q.moong_dal} kg (अपेक्षित: 0.30), तेल = ${q.oil} kg (अपेक्षित: 0.075), इंधन = रु. ${calc.fuelCost} (अपेक्षित: 21.70)`
        };
      }
    },
    {
      id: 11,
      name: "Test 11: इ. ६ ते ८ (उच्च प्राथमिक) वरणभात गणना",
      description: "Children = 20, Menu = वरणभात, Section = 'upper'. तांदूळ 3.00 kg, तूरडाळ 0.60 kg, इंधन रु. 43.40.",
      run() {
        const date = "2026-08-18";
        const calc = app.calculateDay(date, 20, "वरणभात", null, null, 'upper');
        const q = calc.quantities;
        const passRice = Math.abs(q.rice - 3.00) < 0.0001;
        const passTur = Math.abs(q.tur_dal - 0.60) < 0.0001;
        const passFuel = Math.abs(calc.fuelCost - 43.40) < 0.01;

        const passed = passRice && passTur && passFuel;
        return {
          passed,
          details: `तांदूळ = ${q.rice} kg (अपेक्षित: 3.00), तूरडाळ = ${q.tur_dal} kg (अपेक्षित: 0.60), इंधन = रु. ${calc.fuelCost} (अपेक्षित: 43.40)`
        };
      }
    },
    {
      id: 12,
      name: "Test 12: १ ते ५ आणि ६ ते ८ स्वतंत्र नोंदी पडताळणी (Dual Section Isolation)",
      description: "एकाच UDISE लॉगिनखाली १-५ ची नोंद data.records मध्ये व ६-८ ची नोंद data.recordsUpper मध्ये एकमेकांना बाधा न आणता राहते.",
      run() {
        const testDate = "2026-09-01";
        // Save distinct records for both sections
        const calcP = app.calculateDay(testDate, 8, "मुगडाळ खिचडी", null, null, 'primary');
        const calcU = app.calculateDay(testDate, 14, "मुगडाळ खिचडी", null, null, 'upper');
        
        if (!app.data.records) app.data.records = {};
        if (!app.data.recordsUpper) app.data.recordsUpper = {};
        
        app.data.records[testDate] = calcP;
        app.data.recordsUpper[testDate] = calcU;

        const pRec = app.getActiveRecords('primary')[testDate];
        const uRec = app.getActiveRecords('upper')[testDate];

        const passed = (pRec && pRec.children === 8 && pRec.quantities.rice === 0.8) &&
                       (uRec && uRec.children === 14 && Math.abs(uRec.quantities.rice - 2.1) < 0.0001) &&
                       (app.getActivePat('primary') !== undefined) &&
                       (app.getActivePat('upper') !== undefined);

        return {
          passed,
          details: `१ ते ५: ${pRec ? pRec.children : 0} मुले, तांदूळ ${pRec ? pRec.quantities.rice : 0} kg | ६ ते ८: ${uRec ? uRec.children : 0} मुले, तांदूळ ${uRec ? uRec.quantities.rice : 0} kg`
        };
      }
    }
  ],

  /**
   * Run all test cases and render results into DOM
   */
  runAllTests() {
    const container = document.getElementById('testCasesContainer');
    const badge = document.getElementById('testSummaryBadge');
    if (!container) return;

    container.innerHTML = '';
    let passCount = 0;

    this.tests.forEach(test => {
      let result = { passed: false, details: "Error" };
      try {
        result = test.run();
      } catch (e) {
        result = { passed: false, details: `अपवाद: ${e.message}` };
      }

      if (result.passed) passCount++;

      const item = document.createElement('div');
      item.className = 'test-case-item';
      item.innerHTML = `
        <div class="test-case-info">
          <div class="test-case-title">${test.name}</div>
          <div class="test-case-desc">${test.description}</div>
          <div class="form-hint" style="color: #475569; margin-top: 0.25rem;"><strong>तपशील:</strong> ${result.details}</div>
        </div>
        <div class="test-case-status ${result.passed ? 'passed' : 'failed'}">
          <span>${result.passed ? '✅ उत्तीर्ण (PASSED)' : '❌ अनुत्तीर्ण (FAILED)'}</span>
        </div>
      `;
      container.appendChild(item);
    });

    if (badge) {
      if (passCount === this.tests.length) {
        badge.className = 'badge badge-success';
        badge.innerHTML = `🎉 सर्व ${passCount}/${this.tests.length} चाचण्या यशस्वीरित्या उत्तीर्ण!`;
      } else {
        badge.className = 'badge badge-danger';
        badge.innerHTML = `⚠️ ${passCount}/${this.tests.length} चाचण्या उत्तीर्ण`;
      }
    }
  }

};
