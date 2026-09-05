/**
 * ==========================================================================
 * शालेय पोषण आहार (MDM) Excel Engine
 * SheetJS Integration for High-Fidelity Import & Export
 * Supports A4 Printable Page Setup, Margins, and Matching Color Theme
 * ==========================================================================
 */

const excelEngine = {

  /**
   * Helper: Apply comprehensive cell styling, borders, colors and alignments
   */
  applyWorksheetStyles(ws, config) {
    if (!ws || !ws['!ref']) return;
    const range = XLSX.utils.decode_range(ws['!ref']);

    // Theme Color Palette
    const colors = {
      primaryHeader: "1E3A8A",    // Deep Royal Blue
      subHeader: "2563EB",        // Blue Accent
      textWhite: "FFFFFF",        // White
      textDark: "0F172A",         // Slate Dark
      rateYellow: "FEF08A",       // Highlight Yellow
      rateText: "854D0E",         // Dark Amber
      openCream: "FEF9C3",        // Cream Yellow for Opening Stock
      recGreen: "D1FAE5",         // Mint Green for Received Stock
      recText: "065F46",          // Dark Green
      availBlue: "E0F2FE",        // Light Sky Blue for Total Available
      holidayPink: "FEE2E2",      // Soft Pink for Holidays
      holidayText: "991B1B",      // Deep Red
      borderLight: "CBD5E1",      // Slate 300
      borderDark: "64748B"        // Slate 500
    };

    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
        let cell = ws[cellRef];
        if (!cell) {
          cell = { t: 's', v: '' };
          ws[cellRef] = cell;
        }

        // Base cell style
        const isNumeric = typeof cell.v === 'number';
        const cellStyle = {
          font: { name: 'Arial', sz: 9, color: { rgb: colors.textDark } },
          alignment: {
            vertical: 'center',
            horizontal: (isNumeric && C >= 4) ? 'right' : 'center',
            wrapText: true
          },
          border: {
            top: { style: 'thin', color: { rgb: colors.borderLight } },
            bottom: { style: 'thin', color: { rgb: colors.borderLight } },
            left: { style: 'thin', color: { rgb: colors.borderLight } },
            right: { style: 'thin', color: { rgb: colors.borderLight } }
          }
        };

        // Custom styling logic per sheet type
        if (config.type === 'monthly_matrix') {
          // Row 0: Main Title
          if (R === 0) {
            cellStyle.fill = { fgColor: { rgb: colors.primaryHeader } };
            cellStyle.font = { name: 'Arial', sz: 12, bold: true, color: { rgb: colors.textWhite } };
            cellStyle.alignment = { vertical: 'center', horizontal: 'center' };
          }
          // Row 1: School Metadata
          else if (R === 1) {
            cellStyle.fill = { fgColor: { rgb: "F1F5F9" } };
            cellStyle.font = { name: 'Arial', sz: 9, bold: true, color: { rgb: colors.textDark } };
          }
          // Row 2 & 3: Headers
          else if (R === 2 || R === 3) {
            cellStyle.fill = { fgColor: { rgb: colors.primaryHeader } };
            cellStyle.font = { name: 'Arial', sz: 9, bold: true, color: { rgb: colors.textWhite } };
            cellStyle.alignment = { vertical: 'center', horizontal: 'center', wrapText: true };
          }
          // Row 4: Rates (प्रमाण)
          else if (R === 4) {
            cellStyle.fill = { fgColor: { rgb: colors.rateYellow } };
            cellStyle.font = { name: 'Arial', sz: 9, bold: true, color: { rgb: colors.rateText } };
          }
          // Row 5: Column Index
          else if (R === 5) {
            cellStyle.fill = { fgColor: { rgb: "E2E8F0" } };
            cellStyle.font = { name: 'Arial', sz: 8, bold: true, color: { rgb: "475569" } };
          }
          // Row 6: मागील शिल्लक (Opening Stock)
          else if (R === 6) {
            cellStyle.fill = { fgColor: { rgb: colors.openCream } };
            cellStyle.font = { name: 'Arial', sz: 9, bold: true, color: { rgb: colors.rateText } };
          }
          // Row 7: प्राप्त धान्य (Received Stock)
          else if (R === 7) {
            cellStyle.fill = { fgColor: { rgb: colors.recGreen } };
            cellStyle.font = { name: 'Arial', sz: 9, bold: true, color: { rgb: colors.recText } };
          }
          // Row 8: एकूण प्राप्त धान्य (Total Available)
          else if (R === 8) {
            cellStyle.fill = { fgColor: { rgb: colors.availBlue } };
            cellStyle.font = { name: 'Arial', sz: 9, bold: true, color: { rgb: "0369A1" } };
          }
          // Daily Rows: Holiday highlighting
          else if (R >= 9 && R < 9 + config.daysInMonth) {
            if (config.holidayRows && config.holidayRows.includes(R)) {
              cellStyle.fill = { fgColor: { rgb: colors.holidayPink } };
              cellStyle.font = { name: 'Arial', sz: 9, color: { rgb: colors.holidayText } };
            }
          }
          // Total Consumed Row
          else if (R === 9 + config.daysInMonth) {
            cellStyle.fill = { fgColor: { rgb: "F1F5F9" } };
            cellStyle.font = { name: 'Arial', sz: 9, bold: true, color: { rgb: "1E40AF" } };
          }
          // Closing Stock Row
          else if (R === 10 + config.daysInMonth) {
            cellStyle.fill = { fgColor: { rgb: colors.rateYellow } };
            cellStyle.font = { name: 'Arial', sz: 9, bold: true, color: { rgb: colors.rateText } };
          }
        } 
        else if (config.type === 'form_b') {
          if (R === 0 || R === 1) {
            cellStyle.fill = { fgColor: { rgb: colors.primaryHeader } };
            cellStyle.font = { name: 'Arial', sz: 11, bold: true, color: { rgb: colors.textWhite } };
          } else if (R >= 2 && R <= 6) {
            cellStyle.fill = { fgColor: { rgb: "F8FAFC" } };
            cellStyle.font = { name: 'Arial', sz: 9, bold: (C === 2 || C === 5) };
          } else if (R === 8 || R === 9) {
            cellStyle.fill = { fgColor: { rgb: colors.primaryHeader } };
            cellStyle.font = { name: 'Arial', sz: 9, bold: true, color: { rgb: colors.textWhite } };
          } else if (R >= 10 && R < 10 + 15) {
            if (C === 6) { // Closing balance
              cellStyle.fill = { fgColor: { rgb: colors.rateYellow } };
              cellStyle.font = { name: 'Arial', sz: 9, bold: true, color: { rgb: colors.rateText } };
            }
          }
        }
        else if (config.type === 'yearly_matrix') {
          if (R <= 2) {
            cellStyle.fill = { fgColor: { rgb: colors.primaryHeader } };
            cellStyle.font = { name: 'Arial', sz: R === 0 ? 11 : 9, bold: true, color: { rgb: colors.textWhite } };
          } else if (R === 3) {
            cellStyle.fill = { fgColor: { rgb: "F1F5F9" } };
            cellStyle.font = { name: 'Arial', sz: 9, bold: true };
          } else if (R === 4) { // Month Headers
            if (C >= 2 && C < 38) {
              cellStyle.fill = { fgColor: { rgb: "DBEAFE" } };
              cellStyle.font = { name: 'Arial', sz: 8.5, bold: true, color: { rgb: "1E40AF" } };
            } else if (C >= 38) {
              cellStyle.fill = { fgColor: { rgb: colors.rateYellow } };
              cellStyle.font = { name: 'Arial', sz: 8.5, bold: true, color: { rgb: colors.rateText } };
            }
          } else if (R === 5 || R === 6) { // Beneficiaries & Days
            cellStyle.fill = { fgColor: { rgb: "F8FAFC" } };
            cellStyle.font = { name: 'Arial', sz: 9, bold: true };
          } else if (R === 7) { // Sub-headers
            cellStyle.fill = { fgColor: { rgb: "E2E8F0" } };
            cellStyle.font = { name: 'Arial', sz: 8, bold: true };
          } else if (R >= 8 && R < 8 + 15) {
            if (C === 1) { // Opening
              cellStyle.fill = { fgColor: { rgb: colors.openCream } };
            } else if (C === 40) { // Final Closing
              cellStyle.fill = { fgColor: { rgb: colors.rateYellow } };
              cellStyle.font = { name: 'Arial', sz: 9, bold: true, color: { rgb: colors.rateText } };
            }
          } else if (R >= 8 + 15) { // Financial rows
            cellStyle.fill = { fgColor: { rgb: colors.recGreen } };
            cellStyle.font = { name: 'Arial', sz: 9, bold: true, color: { rgb: colors.recText } };
          }
        }

        cell.s = cellStyle;
      }
    }
  },

  /**
   * Build Worksheet for Monthly Matrix (A4 Landscape)
   * @param {string} yearMonth - Format 'YYYY-MM'
   * @param {Object} appData - Full application state
   * @param {string} section - 'primary' | 'upper'
   */
  generateMonthlyMatrixSheetData(yearMonth, appData, section = 'primary') {
    const isUpper = section === 'upper';
    const [yearStr, monthStr] = yearMonth.split('-');
    const year = parseInt(yearStr);
    const month = parseInt(monthStr); // 1-12
    const daysInMonth = new Date(year, month, 0).getDate();

    const acadStartYear = (month >= 4) ? year : (year - 1);
    const acadEndYear = acadStartYear + 1;

    const monthNamesMarathi = [
      '', 'जानेवारी', 'फेब्रुवारी', 'मार्च', 'एप्रिल', 'मे', 'जून',
      'जुलै', 'ऑगस्ट', 'सप्टेंबर', 'ऑक्टोबर', 'नोव्हेंबर', 'डिसेंबर'
    ];
    const monthName = monthNamesMarathi[month] + ' ' + year;

    const wsData = [];
    const holidayRows = [];

    // Row 1: Title
    wsData.push([`शालेय पोषण आहार सन ${acadStartYear}-${acadEndYear} ${isUpper ? 'इ. 6 वी ते 8 वी' : 'इ. 1 ली ते 5 वी'}`]);

    // Row 2: School Metadata
    wsData.push([
      `शाळेचे नांव : ${appData.settings.schoolName}`, '', '', '', '', '', '', '', '',
      `केंद्र : ${appData.settings.centre}`, '', '', '', '',
      `तालुका : ${appData.settings.taluka}`, '', '',
      `जिल्हा : ${appData.settings.district}`, '', '',
      `महिना : ${monthName}`
    ]);

    // Row 3: Main Headers
    wsData.push([
      "दिनांक", "वार", "वार कोड", "आजचा आहार", "लाभार्थी ↓", "ताटांची संख्या", "तांदूळ",
      "मुगडाळ", "तूरडाळ", "मसूरडाळ", "मटकी", "मूग", "चवळी", "हरभरा", "वाटाणा",
      "जिरे", "मोहरी", "हळद", "मिरची पावडर", "सोयाबीन तेल", "मीठ", "कांदा-लसून मसाला", "सोयावडी", "इंधन खर्च", "शेरा"
    ]);

    // Row 4: Sub Headers
    wsData.push([
      "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", ""
    ]);

    // Row 5: Rates (प्रमाण)
    const getRate = (k) => {
      if (typeof app !== 'undefined' && app.getIngredientRate) {
        return app.getIngredientRate(k, section);
      }
      const ing = (appData.ingredients || {})[k];
      if (!ing) return 0;
      return isUpper ? (ing.rateUpper || +(ing.defaultRate * 1.5).toFixed(5)) : (ing.ratePrimary || ing.defaultRate);
    };

    const fuelRate = (typeof app !== 'undefined' && app.getActiveFuelRate) 
      ? app.getActiveFuelRate(section) 
      : (isUpper ? (appData.settings.fuelRateUpper || 2.17) : (appData.settings.fuelRatePrimary || appData.settings.fuelRate || 1.51));

    wsData.push([
      "", "", "", "", "प्रमाण", "",
      getRate('rice'),
      getRate('moong_dal'),
      getRate('tur_dal'),
      getRate('masoor_dal'),
      getRate('matki'),
      getRate('moong'),
      getRate('chavali'),
      getRate('chana'),
      getRate('vatana'),
      getRate('cumin'),
      getRate('mustard'),
      getRate('turmeric'),
      getRate('chilli'),
      getRate('oil'),
      getRate('salt'),
      getRate('masala'),
      getRate('soyavadi'),
      fuelRate, ""
    ]);

    // Row 6: Column Numbers (1 ते 25)
    wsData.push([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25
    ]);

    // Row 7: मागील शिल्लक धान्य/किराणा (Opening Stock)
    const stockSummary = (typeof app !== 'undefined' && app.computeMonthlyStock)
      ? app.computeMonthlyStock(yearMonth, section)
      : { opening: {}, received: {}, totalAvailable: {}, consumed: {}, closing: {}, totalPlates: 0, workingDays: 0, totalFuel: 0 };

    const op = stockSummary.opening || {};
    const rc = stockSummary.received || {};
    const totAvail = stockSummary.totalAvailable || {};
    const consumed = stockSummary.consumed || {};
    const closing = stockSummary.closing || {};

    wsData.push([
      "", "मागील शिल्लक धान्य/किराणा :-", "", "", "", "",
      op.rice || 0, op.moong_dal || 0, op.tur_dal || 0, op.masoor_dal || 0, op.matki || 0, op.moong || 0, op.chavali || 0,
      op.chana || 0, op.vatana || 0,
      op.cumin || 0, op.mustard || 0, op.turmeric || 0, op.chilli || 0,
      op.oil || 0, op.salt || 0, op.masala || 0, op.soyavadi || 0, "", ""
    ]);

    // Row 8: प्राप्त धान्य/किराणा (Received Stock)
    wsData.push([
      "", "प्राप्त धान्य/किराणा :-", "", "", "", "",
      rc.rice || 0, rc.moong_dal || 0, rc.tur_dal || 0, rc.masoor_dal || 0, rc.matki || 0, rc.moong || 0, rc.chavali || 0,
      rc.chana || 0, rc.vatana || 0,
      rc.cumin || 0, rc.mustard || 0, rc.turmeric || 0, rc.chilli || 0,
      rc.oil || 0, rc.salt || 0, rc.masala || 0, rc.soyavadi || 0, "", ""
    ]);

    // Row 9: Total Available
    wsData.push([
      "", "एकूण प्राप्त धान्य/किराणा :-", "", "", "", "",
      totAvail.rice || 0, totAvail.moong_dal || 0, totAvail.tur_dal || 0, totAvail.masoor_dal || 0, totAvail.matki || 0, totAvail.moong || 0, totAvail.chavali || 0,
      totAvail.chana || 0, totAvail.vatana || 0,
      totAvail.cumin || 0, totAvail.mustard || 0, totAvail.turmeric || 0, totAvail.chilli || 0,
      totAvail.oil || 0, totAvail.salt || 0, totAvail.masala || 0, totAvail.soyavadi || 0, "", ""
    ]);

    // Daily Rows 10 to 40
    const records = (typeof app !== 'undefined' && app.getActiveRecords)
      ? app.getActiveRecords(section)
      : (isUpper ? (appData.recordsUpper || {}) : (appData.records || {}));

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${yearMonth}-${String(day).padStart(2, '0')}`;
      const rec = records[dateStr] || (typeof app !== 'undefined' ? app.calculateEmptyDay(dateStr) : { dayName: '', dayCode: '', children: 0, plates: 0 });
      const isHoliday = rec.isHoliday || rec.children === 0;
      const q = rec.quantities || {};

      if (isHoliday) {
        holidayRows.push(9 + day - 1);
      }

      wsData.push([
        day,
        rec.dayName,
        rec.dayCode,
        isHoliday ? '' : (typeof app !== 'undefined' ? app.getDisplayMenuName(rec) : (rec.menuName || '')),
        rec.children,
        rec.plates,
        isHoliday ? 0 : (q.rice || 0),
        q.moong_dal || '',
        q.tur_dal || '',
        q.masoor_dal || '',
        q.matki || '',
        q.moong || '',
        q.chavali || '',
        q.chana || '',
        q.vatana || '',
        q.cumin || '',
        q.mustard || '',
        q.turmeric || '',
        q.chilli || '',
        q.oil || '',
        q.salt || '',
        q.masala || '',
        q.soyavadi || '',
        isHoliday ? '' : rec.fuelCost,
        rec.remarks || ''
      ]);
    }

    // Consumed Row
    wsData.push([
      "एकूण वापरलेले धान्य/किराणा :-", "", "", "", "", stockSummary.totalPlates,
      consumed.rice || 0, consumed.moong_dal || 0, consumed.tur_dal || 0, consumed.masoor_dal || 0, consumed.matki || 0, consumed.moong || 0, consumed.chavali || 0,
      consumed.chana || 0, consumed.vatana || 0,
      consumed.cumin || 0, consumed.mustard || 0, consumed.turmeric || 0, consumed.chilli || 0,
      consumed.oil || 0, consumed.salt || 0, consumed.masala || 0, consumed.soyavadi || 0,
      stockSummary.totalFuel || 0, ""
    ]);

    // Closing Stock Row
    wsData.push([
      "शिल्लक धान्य/किराणा :-", "", "", "", "", "",
      closing.rice || 0, closing.moong_dal || 0, closing.tur_dal || 0, closing.masoor_dal || 0, closing.matki || 0, closing.moong || 0, closing.chavali || 0,
      closing.chana || 0, closing.vatana || 0,
      closing.cumin || 0, closing.mustard || 0, closing.turmeric || 0, closing.chilli || 0,
      closing.oil || 0, closing.salt || 0, closing.masala || 0, closing.soyavadi || 0, "", ""
    ]);

    const pat = (typeof app !== 'undefined' && app.getActivePat)
      ? app.getActivePat(section)
      : (isUpper ? (appData.settings.patUpper || 15) : (appData.settings.patPrimary || appData.settings.pat || 9));

    // Footer Rows: Summary Stats & Signatures
    wsData.push([]);
    wsData.push([
      "", "महिन्यातील ताटांची संख्या", "", "", stockSummary.totalPlates, "", "",
      "शालेय कामकाजाचे दिवस", "", "", "", "", "", "", stockSummary.workingDays,
      "", "पट", "", pat, "सचिव", "", "अध्यक्ष", ""
    ]);
    wsData.push([
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
      "शाळा व्यवस्थापन समिती", "", "", ""
    ]);

    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Apply column widths for A4 fit
    ws['!cols'] = [
      { wch: 6 },  // A: दिनांक
      { wch: 9 },  // B: वार
      { wch: 6 },  // C: वार कोड
      { wch: 16 }, // D: आजचा आहार
      { wch: 8 },  // E: लाभार्थी
      { wch: 8 },  // F: ताटांची संख्या
      { wch: 8 },  // G: तांदूळ
      { wch: 7 },  // H: मुगडाळ
      { wch: 7 },  // I: तूरडाळ
      { wch: 7 },  // J: मसूरडाळ
      { wch: 7 },  // K: मटकी
      { wch: 7 },  // L: मूग
      { wch: 7 },  // M: चवळी
      { wch: 7 },  // N: हरभरा
      { wch: 7 },  // O: वाटाणा
      { wch: 7 },  // P: जिरे
      { wch: 7 },  // Q: मोहरी
      { wch: 7 },  // R: हळद
      { wch: 8 },  // S: मिरची पावडर
      { wch: 8 },  // T: सोयाबीन तेल
      { wch: 7 },  // U: मीठ
      { wch: 8 },  // V: कांदा-लसून मसाला
      { wch: 7 },  // W: सोयावडी
      { wch: 9 },  // X: इंधन खर्च
      { wch: 12 }  // Y: शेरा
    ];

    // Page Setup: A4 Landscape & Fit to Page
    ws['!pageSetup'] = {
      orientation: 'landscape',
      paperSize: 9, // A4
      fitToWidth: 1,
      fitToHeight: 0,
      scale: 100
    };
    ws['!margins'] = { left: 0.25, right: 0.25, top: 0.35, bottom: 0.35, header: 0.15, footer: 0.15 };

    // Merges for Matrix
    ws['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 22 } }, // Title
      { s: { r: 1, c: 0 }, e: { r: 1, c: 8 } },  // School
      { s: { r: 1, c: 9 }, e: { r: 1, c: 13 } }, // Centre
      { s: { r: 1, c: 14 }, e: { r: 1, c: 16 } }, // Taluka
      { s: { r: 1, c: 17 }, e: { r: 1, c: 19 } }, // District
      { s: { r: 1, c: 20 }, e: { r: 1, c: 22 } }, // Month
      { s: { r: 2, c: 0 }, e: { r: 3, c: 0 } },  // Date
      { s: { r: 2, c: 1 }, e: { r: 3, c: 1 } },  // Day
      { s: { r: 2, c: 2 }, e: { r: 3, c: 2 } },  // DayCode
      { s: { r: 2, c: 3 }, e: { r: 3, c: 3 } },  // Menu
      { s: { r: 2, c: 4 }, e: { r: 3, c: 4 } },  // Beneficiaries
      { s: { r: 2, c: 5 }, e: { r: 3, c: 5 } },  // Plates
      { s: { r: 2, c: 6 }, e: { r: 3, c: 6 } },  // Rice
      { s: { r: 2, c: 7 }, e: { r: 3, c: 7 } },  // Tur
      { s: { r: 2, c: 8 }, e: { r: 3, c: 8 } },  // Moong
      { s: { r: 2, c: 9 }, e: { r: 3, c: 9 } },  // Masoor
      { s: { r: 2, c: 10 }, e: { r: 3, c: 10 } }, // Matki
      { s: { r: 2, c: 11 }, e: { r: 3, c: 11 } }, // Chana
      { s: { r: 2, c: 12 }, e: { r: 3, c: 12 } }, // Soyavadi
      { s: { r: 2, c: 13 }, e: { r: 3, c: 13 } }, // Vatana
      { s: { r: 2, c: 14 }, e: { r: 2, c: 18 } }, // Masale group header
      { s: { r: 2, c: 19 }, e: { r: 3, c: 19 } }, // Oil
      { s: { r: 2, c: 20 }, e: { r: 3, c: 20 } }, // Salt
      { s: { r: 2, c: 21 }, e: { r: 3, c: 21 } }, // Fuel
      { s: { r: 2, c: 22 }, e: { r: 3, c: 22 } }, // Remarks
      { s: { r: 4, c: 0 }, e: { r: 4, c: 5 } },  // Rate label
      { s: { r: 6, c: 1 }, e: { r: 6, c: 5 } },  // Opening label
      { s: { r: 7, c: 1 }, e: { r: 7, c: 5 } },  // Rec label
      { s: { r: 8, c: 1 }, e: { r: 8, c: 5 } },  // Avail label
      { s: { r: 9 + daysInMonth, c: 0 }, e: { r: 9 + daysInMonth, c: 4 } }, // Consumed label
      { s: { r: 10 + daysInMonth, c: 0 }, e: { r: 10 + daysInMonth, c: 5 } } // Closing label
    ];

    this.applyWorksheetStyles(ws, { type: 'monthly_matrix', daysInMonth, holidayRows });
    return ws;
  },

  /**
   * Build Worksheet for Form B (A4 Portrait)
   * @param {string} yearMonth - Format 'YYYY-MM'
   * @param {Object} appData - Full application state
   * @param {string} section - 'primary' | 'upper'
   */
  generateFormBSheetData(yearMonth, appData, section = 'primary') {
    const isUpper = section === 'upper';
    const [yearStr, monthStr] = yearMonth.split('-');
    const year = parseInt(yearStr);
    const month = parseInt(monthStr);

    const monthNamesMarathi = [
      '', 'जानेवारी', 'फेब्रुवारी', 'मार्च', 'एप्रिल', 'मे', 'जून',
      'जुलै', 'ऑगस्ट', 'सप्टेंबर', 'ऑक्टोबर', 'नोव्हेंबर', 'डिसेंबर'
    ];
    const monthName = monthNamesMarathi[month] + ' ' + year;

    const stockSummary = (typeof app !== 'undefined' && app.computeMonthlyStock)
      ? app.computeMonthlyStock(yearMonth, section)
      : { opening: {}, received: {}, totalAvailable: {}, consumed: {}, closing: {}, totalPlates: 0, workingDays: 0 };

    const op = stockSummary.opening || {};
    const rc = stockSummary.received || {};
    const totAvail = stockSummary.totalAvailable || {};
    const consumed = stockSummary.consumed || {};
    const closing = stockSummary.closing || {};

    const pat = (typeof app !== 'undefined' && app.getActivePat)
      ? app.getActivePat(section)
      : (isUpper ? (appData.settings.patUpper || 15) : (appData.settings.patPrimary || appData.settings.pat || 9));

    const fuelRate = (typeof app !== 'undefined' && app.getActiveFuelRate)
      ? app.getActiveFuelRate(section)
      : (isUpper ? 2.17 : 1.51);

    const fbData = [];
    fbData.push([`शालेय पोषण आहार योजना - प्रपत्र ब (${isUpper ? 'इ. 6 ते 8' : 'इ. 1 ते 5'})`]);
    fbData.push(["शाळेने केंद्रप्रमुखांना दरमहा 1 तारखेपर्यंत द्यायचा अहवाल (2 प्रतीत)"]);
    fbData.push([`शाळेचे नांव : ${appData.settings.schoolName}, केंद्र :${appData.settings.centre}. ता.${appData.settings.taluka} जि. ${appData.settings.district}`]);
    fbData.push(["", "", "पटसंख्या", "", "", pat]);
    fbData.push(["", "", "महिन्यातील एकूण उपस्थित विद्यार्थी", "", "", "", "", "", stockSummary.totalPlates]);
    fbData.push(["", "", "तांदूळ प्राप्त दिनांक व पावती क्रमांक", "", "", "एकूण कार्यदिवस", "", "", stockSummary.workingDays]);
    fbData.push(["महिना :", monthName, "", "", "", "अन्न शिजवून दिलेले दिवस", "", "", stockSummary.workingDays]);
    fbData.push([]);
    fbData.push([
      "अ.क्र.", "वस्तूचे नांव", "मागील शिल्लक (कि.ग्रॅ.)", "चालू महिन्यात प्राप्त (कि.ग्रॅ.)",
      "एकूण प्राप्त (3+4) (कि.ग्रॅ.)", "अन्न शिजवण्यासाठी वापरलेल्या वस्तू (कि.ग्रॅ.)",
      "शिल्लक वस्तू (5-6) (कि.ग्रॅ.)", "पुढील महिन्यासाठी मागणी (कि.ग्रॅ.)", "शेरा"
    ]);
    fbData.push([1, 2, 3, 4, 5, 6, 7, 8, 9]);

    const fbItems = [
      { name: "तांदूळ", key: "rice", rate: 0.10 },
      { name: "तूरडाळ", key: "tur_dal", rate: 0.02 },
      { name: "मूगडाळ", key: "moong_dal", rate: 0.02 },
      { name: "मसूरडाळ", key: "masoor_dal", rate: 0.02 },
      { name: "मटकी", key: "matki", rate: 0.02 },
      { name: "हरभरा", key: "chana", rate: 0.02 },
      { name: "सोयावडी", key: "soyavadi", rate: 0.02 },
      { name: "वाटाणा", key: "vatana", rate: 0.02 },
      { name: "मोहरी", key: "mustard", rate: 0.00015 },
      { name: "जिरे", key: "cumin", rate: 0.00020 },
      { name: "हळद", key: "turmeric", rate: 0.00015 },
      { name: "मसाला", key: "masala", rate: 0.00090 },
      { name: "मिरची पावडर", key: "chilli", rate: 0.00300 },
      { name: "सोयाबीन तेल", key: "oil", rate: 0.00500 },
      { name: "मीठ", key: "salt", rate: 0.00070 }
    ];

    const customDemands = (typeof app !== 'undefined' && app.getActiveCustomDemands)
      ? app.getActiveCustomDemands(section)
      : (isUpper ? (appData.customDemandsUpper || {}) : (appData.customDemands || {}));

    fbItems.forEach((item, idx) => {
      const openQty = op[item.key] || 0;
      const recQty = rc[item.key] || 0;
      const totQty = totAvail[item.key] || 0;
      const usedQty = consumed[item.key] || 0;
      const balQty = closing[item.key] || 0;
      const itemRate = (typeof app !== 'undefined' && app.getIngredientRate)
        ? app.getIngredientRate(item.key, section)
        : (isUpper ? +(item.rate * 1.5).toFixed(5) : item.rate);

      const defaultDemand = +(itemRate * pat * 20).toFixed(3);
      const nextDemand = (customDemands && customDemands[yearMonth] && customDemands[yearMonth][item.key] !== undefined)
        ? customDemands[yearMonth][item.key]
        : defaultDemand;

      const customRemark = (appData.formBRemarks && appData.formBRemarks[yearMonth] && appData.formBRemarks[yearMonth][item.key])
        ? appData.formBRemarks[yearMonth][item.key]
        : "";

      const itemName = (appData.ingredients && appData.ingredients[item.key]) ? appData.ingredients[item.key].name : item.name;

      fbData.push([
        idx + 1, itemName, openQty, recQty, totQty, usedQty, balQty, nextDemand, customRemark
      ]);
    });

    fbData.push([]);
    fbData.push(["* मागणी नोंदवताना शाळेकडे वीस दिवसांचा साठा शिल्लक राहील याची दक्षता घेऊन मागणी नोंदवावी."]);
    fbData.push([`1) महिन्यातील एकूण ताटांची संख्या : ${stockSummary.totalPlates}`]);
    const fuelGrant = Math.round(stockSummary.totalPlates * fuelRate);
    fbData.push([`2) इंधन व भाजीपाल्यासाठी खर्च केलेले अनुदान रु. =${fuelGrant}/- (ताटांची संख्या ${stockSummary.totalPlates} X दर ${fuelRate}/-)`]);
    const cookRate = appData.settings.cookHonorarium || 2500;
    const cookAmt = cookRate * (appData.settings.cookCount || 1);
    fbData.push([`3) स्वयंपाकी तथा मदतनीस मानधन रु. =${cookAmt}/- (रु. ${cookRate} X संख्या: ${appData.settings.cookCount || 1})`]);
    fbData.push(["प्रमाणित करण्यात येते की, वर नमूद केलेली माहिती दैनंदिन नोंदवहीवरून घेतलेली आहे. ती तपासली आहे व बरोबर आहे."]);
    fbData.push([]);
    fbData.push([
      `दिनांक : `, ``, `मुख्याध्यापक/सचिव`, ``, ``, ``, `केंद्रप्रमुख`
    ]);
    fbData.push([
      ``, ``, `शाळा व्यवस्थापन समिती ${appData.settings.schoolName}`, ``, ``, ``, `केंद्र : ${appData.settings.centre}`
    ]);

    const ws = XLSX.utils.aoa_to_sheet(fbData);
    ws['!cols'] = [
      { wch: 6 },  // अ.क्र.
      { wch: 18 }, // वस्तूचे नांव
      { wch: 16 }, // मागील शिल्लक
      { wch: 18 }, // प्राप्त
      { wch: 18 }, // एकूण प्राप्त
      { wch: 22 }, // वापरलेली वस्तू
      { wch: 16 }, // शिल्लक
      { wch: 20 }, // मागणी
      { wch: 14 }  // शेरा
    ];

    ws['!pageSetup'] = {
      orientation: 'portrait',
      paperSize: 9, // A4
      fitToWidth: 1,
      fitToHeight: 1,
      scale: 100
    };
    ws['!margins'] = { left: 0.35, right: 0.35, top: 0.4, bottom: 0.4, header: 0.2, footer: 0.2 };

    ws['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 8 } },
      { s: { r: 1, c: 0 }, e: { r: 1, c: 8 } },
      { s: { r: 2, c: 0 }, e: { r: 2, c: 8 } }
    ];

    this.applyWorksheetStyles(ws, { type: 'form_b' });
    return ws;
  },

  /**
   * Export official multi-sheet Excel file (.xlsx) matching the school's exact structure
   * Supports 1-5, 6-8, or both sections in the same workbook
   * @param {string} yearMonth - Format 'YYYY-MM'
   * @param {Object} appData - Full application state from app.js
   * @param {string} targetSection - 'primary' | 'upper' | 'both'
   */
  exportOfficialExcel(yearMonth, appData, targetSection) {
    if (typeof XLSX === 'undefined') {
      alert('Excel लायब्ररी लोड झालेली नाही. कृपया इंटरनेट किंवा स्थानिक फाईल तपासा.');
      return;
    }

    const wb = XLSX.utils.book_new();
    const sec = targetSection || (typeof app !== 'undefined' ? (app.activeSection || 'primary') : 'primary');
    const isBoth = (sec === 'both') || (!targetSection && (appData.settings.schoolLevel === 'both' || !appData.settings.schoolLevel));

    if (isBoth) {
      // 1 to 5 Sheets
      const ws1 = this.generateMonthlyMatrixSheetData(yearMonth, appData, 'primary');
      XLSX.utils.book_append_sheet(wb, ws1, "1 to 5");

      // 6 to 8 Sheets
      const wsUpper = this.generateMonthlyMatrixSheetData(yearMonth, appData, 'upper');
      XLSX.utils.book_append_sheet(wb, wsUpper, "6 to 8");

      // Form B 1 to 5
      const wsFb1 = this.generateFormBSheetData(yearMonth, appData, 'primary');
      XLSX.utils.book_append_sheet(wb, wsFb1, "प्रपत्र ब (इ. 1 ते 5)");

      // Form B 6 to 8
      const wsFbUpper = this.generateFormBSheetData(yearMonth, appData, 'upper');
      XLSX.utils.book_append_sheet(wb, wsFbUpper, "प्रपत्र ब (इ. 6 ते 8)");
    } else if (sec === 'upper') {
      const wsUpper = this.generateMonthlyMatrixSheetData(yearMonth, appData, 'upper');
      XLSX.utils.book_append_sheet(wb, wsUpper, "6 to 8");

      const wsFbUpper = this.generateFormBSheetData(yearMonth, appData, 'upper');
      XLSX.utils.book_append_sheet(wb, wsFbUpper, "प्रपत्र ब (इ. 6 ते 8)");
    } else {
      const ws1 = this.generateMonthlyMatrixSheetData(yearMonth, appData, 'primary');
      XLSX.utils.book_append_sheet(wb, ws1, "1 to 5");

      const wsFb1 = this.generateFormBSheetData(yearMonth, appData, 'primary');
      XLSX.utils.book_append_sheet(wb, wsFb1, "प्रपत्र ब (इ. 1 ते 5)");
    }

    // Rules Master Sheet
    const rulesData = [
      ["शालेय पोषण आहार घटक व मेन्यू प्रमाण नियम"],
      ["घटक आयडी", "मराठी नाव", "वर्गवारी", "प्रमाण इ. 1 ते 5", "प्रमाण इ. 6 ते 8", "एकक"]
    ];

    Object.keys(appData.ingredients || {}).forEach(k => {
      const ing = appData.ingredients[k];
      const rP = (typeof app !== 'undefined' && app.getIngredientRate) ? app.getIngredientRate(k, 'primary') : (ing.ratePrimary || ing.defaultRate);
      const rU = (typeof app !== 'undefined' && app.getIngredientRate) ? app.getIngredientRate(k, 'upper') : (ing.rateUpper || +(rP * 1.5).toFixed(5));
      rulesData.push([
        k,
        ing.name,
        ing.category === 'grain' ? 'धान्य' : (ing.category === 'pulse' ? 'डाळ/कडधान्य' : (ing.category === 'spice' ? 'मसाला' : (ing.category === 'oil' ? 'तेल' : 'मीठ'))),
        rP,
        rU,
        ing.unit
      ]);
    });

    const ws3 = XLSX.utils.aoa_to_sheet(rulesData);
    ws3['!cols'] = [{ wch: 18 }, { wch: 20 }, { wch: 16 }, { wch: 18 }, { wch: 18 }, { wch: 10 }];
    ws3['!pageSetup'] = { orientation: 'portrait', paperSize: 9 };
    XLSX.utils.book_append_sheet(wb, ws3, "मेन्यू व प्रमाण नियम");

    // Write file and trigger download
    const fileName = `MDM_Report_${appData.settings.schoolName.replace(/\s+/g, '_')}_${yearMonth}.xlsx`;
    XLSX.writeFile(wb, fileName);
    if (typeof app !== 'undefined' && app.showToast) {
      app.showToast(`✅ A4 फॉरमॅट Excel फाईल डाऊनलोड झाली: ${fileName}`, 'success');
    }
  },

  /**
   * Export dedicated standalone Form B Excel file (.xlsx)
   * @param {string} yearMonth - Format 'YYYY-MM'
   * @param {Object} appData - Full application state from app.js
   */
  generateFormBExcel(yearMonth, appData) {
    if (typeof XLSX === 'undefined') {
      alert('Excel लायब्ररी लोड झालेली नाही. कृपया इंटरनेट किंवा स्थानिक फाईल तपासा.');
      return;
    }

    const [yearStr, monthStr] = yearMonth.split('-');
    const year = parseInt(yearStr);
    const month = parseInt(monthStr);

    const monthNamesMarathi = [
      '', 'जानेवारी', 'फेब्रुवारी', 'मार्च', 'एप्रिल', 'मे', 'जून',
      'जुलै', 'ऑगस्ट', 'सप्टेंबर', 'ऑक्टोबर', 'नोव्हेंबर', 'डिसेंबर'
    ];
    const monthName = monthNamesMarathi[month] + ' ' + year;

    const wb = XLSX.utils.book_new();
    const stockSummary = app.computeMonthlyStock(yearMonth);
    const op = stockSummary.opening || {};
    const rc = stockSummary.received || {};
    const totAvail = stockSummary.totalAvailable || {};
    const consumed = stockSummary.consumed || {};
    const closing = stockSummary.closing || {};

    const receiptsInMonth = (appData.stockReceipts || []).filter(r => r.date && r.date.startsWith(yearMonth));
    let receiptText = 'निरंक / —';
    if (receiptsInMonth.length > 0) {
      receiptText = receiptsInMonth.map(r => {
        const [yr, mo, dy] = r.date.split('-');
        return r.billNo ? `${dy}/${mo}/${yr} (${r.billNo})` : `${dy}/${mo}/${yr}`;
      }).join(', ');
    }

    const fbData = [];
    fbData.push(["शालेय पोषण आहार योजना - प्रपत्र ब (इ. 1 ते 5)"]);
    fbData.push(["शाळेने केंद्रप्रमुखांना दरमहा 1 तारखेपर्यंत द्यायचा अहवाल (2 प्रतीत)"]);
    fbData.push([`शाळेचे नांव : ${appData.settings.schoolName}, केंद्र : ${appData.settings.centre}, ता. ${appData.settings.taluka}, जि. ${appData.settings.district}`]);
    fbData.push([]);
    fbData.push([
      `महिना व वर्ष: ${monthName}`, ``, 
      `पटसंख्या: ${appData.settings.pat}`, ``, 
      `उपस्थित विद्यार्थी (ताटे): ${stockSummary.totalPlates}`, ``, 
      `एकूण कार्यदिवस: ${stockSummary.workingDays}`, ``, 
      `अन्न शिजवून दिलेले दिवस: ${stockSummary.workingDays}`
    ]);
    fbData.push([`धान्य प्राप्त दिनांक व पावती क्र.: ${receiptText}`]);
    fbData.push([]);
    fbData.push([
      "अ.क्र.", "वस्तूचे नांव", "मागील शिल्लक (कि.ग्रॅ.)", "चालू महिन्यात प्राप्त (कि.ग्रॅ.)",
      "एकूण प्राप्त (3+4) (कि.ग्रॅ.)", "अन्न शिजवण्यासाठी वापरलेल्या वस्तू (कि.ग्रॅ.)",
      "शिल्लक वस्तू (5-6) (कि.ग्रॅ.)", "पुढील महिन्यासाठी मागणी (कि.ग्रॅ.)", "शेरा"
    ]);
    fbData.push([1, 2, 3, 4, 5, 6, 7, 8, 9]);

    const fbItems = Object.keys(appData.ingredients || {}).map(key => {
      const ing = appData.ingredients[key];
      return {
        name: ing.name,
        key: key,
        rate: ing.defaultRate,
        unit: ing.unit,
        category: ing.category
      };
    });

    fbItems.forEach((item, idx) => {
      const openQty = op[item.key] || 0;
      const recQty = rc[item.key] || 0;
      const totQty = totAvail[item.key] || 0;
      const usedQty = consumed[item.key] || 0;
      const balQty = closing[item.key] || 0;
      const defaultDemand = +(item.rate * appData.settings.pat * 20).toFixed(3);
      const nextDemand = (appData.customDemands && appData.customDemands[yearMonth] && appData.customDemands[yearMonth][item.key] !== undefined)
        ? appData.customDemands[yearMonth][item.key]
        : defaultDemand;

      const customRemark = (appData.formBRemarks && appData.formBRemarks[yearMonth] && appData.formBRemarks[yearMonth][item.key])
        ? appData.formBRemarks[yearMonth][item.key]
        : "";

      const customName = (appData.ingredients && appData.ingredients[item.key]) ? appData.ingredients[item.key].name : item.name;

      fbData.push([
        idx + 1, customName, openQty, recQty, totQty, usedQty, balQty, nextDemand, customRemark
      ]);
    });

    fbData.push([]);
    fbData.push(["* मागणी नोंदवताना शाळेकडे वीस दिवसांचा साठा शिल्लक राहील याची दक्षता घेऊन मागणी नोंदवावी."]);
    const damagedKeys = Object.keys(stockSummary.damaged || {}).filter(k => stockSummary.damaged[k] > 0);
    if (damagedKeys.length > 0) {
      const dmgDetails = damagedKeys.map(k => `${(appData.ingredients && appData.ingredients[k]) ? appData.ingredients[k].name : k}: ${stockSummary.damaged[k]} kg`).join(', ');
      fbData.push([`* नोंद: या महिन्यात खराब/नासाडी झालेले धान्य (${dmgDetails}) वापर/शिजवलेल्या धान्यात समाविष्ट केले आहे.`]);
    }
    fbData.push([`1) महिन्यातील एकूण ताटांची संख्या : ${stockSummary.totalPlates}`]);
    const fuelGrant = Math.round(stockSummary.totalPlates * (appData.settings.fuelRate || 1.51));
    fbData.push([`2) इंधन व भाजीपाल्यासाठी खर्च केलेले अनुदान रु. =${fuelGrant}/- (ताटांची संख्या ${stockSummary.totalPlates} X दर ${appData.settings.fuelRate}/-) (शासनस्तरावरून निश्चित केल्यानुसार)`]);
    const cookRate = appData.settings.cookHonorarium || 2500;
    const cookAmt = cookRate * (appData.settings.cookCount || 1);
    fbData.push([`3) स्वयंपाकी तथा मदतनीस मानधन रु. =${cookAmt}/- (रु. ${cookRate} X नेमलेले स्वयंपाकी संख्या: ${appData.settings.cookCount || 1})`]);
    fbData.push(["प्रमाणित करण्यात येते की, वर नमूद केलेली माहिती दैनंदिन नोंदवहीवरून घेतलेली आहे. ती तपासली आहे व बरोबर आहे."]);
    fbData.push([]);
    const dNow = new Date();
    const todayStr = String(dNow.getDate()).padStart(2, '0') + '/' + String(dNow.getMonth() + 1).padStart(2, '0') + '/' + dNow.getFullYear();
    fbData.push([
      `दिनांक : ${todayStr}`, ``, ``, `मुख्याध्यापक / सचिव`, ``, ``, ``, `केंद्रप्रमुख`
    ]);
    fbData.push([
      ``, ``, ``, `शाळा व्यवस्थापन समिती ${appData.settings.schoolName}`, ``, ``, ``, `केंद्र : ${appData.settings.centre}`
    ]);

    const ws = XLSX.utils.aoa_to_sheet(fbData);
    ws['!cols'] = [
      { wch: 6 },  // अ.क्र.
      { wch: 18 }, // वस्तूचे नांव
      { wch: 16 }, // मागील शिल्लक
      { wch: 18 }, // प्राप्त
      { wch: 18 }, // एकूण प्राप्त
      { wch: 22 }, // वापरलेली वस्तू
      { wch: 16 }, // शिल्लक
      { wch: 20 }, // मागणी
      { wch: 16 }  // शेरा
    ];

    ws['!pageSetup'] = {
      orientation: 'portrait',
      paperSize: 9, // A4
      fitToWidth: 1,
      fitToHeight: 1,
      scale: 100
    };
    ws['!margins'] = { left: 0.35, right: 0.35, top: 0.4, bottom: 0.4, header: 0.2, footer: 0.2 };

    ws['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 8 } },
      { s: { r: 1, c: 0 }, e: { r: 1, c: 8 } },
      { s: { r: 2, c: 0 }, e: { r: 2, c: 8 } },
      { s: { r: 5, c: 0 }, e: { r: 5, c: 8 } }
    ];

    this.applyWorksheetStyles(ws, { type: 'form_b' });
    XLSX.utils.book_append_sheet(wb, ws, "प्रपत्र ब");

    const filename = `MDM_Form_B_${monthNamesMarathi[month]}_${year}_${appData.settings.schoolName.replace(/\s+/g, '_')}.xlsx`;
    XLSX.writeFile(wb, filename);
    app.showToast(`✅ प्रपत्र ब Excel फाईल '${filename}' डाऊनलोड झाली!`, 'success');
  },

  /**
   * Export Annual Utilization Certificate & Yearly Register (1 April to 31 March)
   * Matching '2016-17' sheet format with A4 Printable Setup & Color Theme
   * @param {string} finYear - Format 'YYYY-YYYY' (e.g. '2024-2025')
   */
  generateYearlyExcel(finYear) {
    if (typeof XLSX === 'undefined') {
      alert('Excel लायब्ररी लोड झालेली नाही.');
      return;
    }

    const data = app.computeYearlyData(finYear);
    const settings = app.data.settings;

    const wb = XLSX.utils.book_new();
    const wsData = [];

    // Row 1: Title
    wsData.push([`शालेय पोषण आहार योजना (सन ${data.startYear}-${String(data.endYear).slice(-2)})`]);

    // Row 2: Panchayat Samiti & District
    wsData.push([`पंचायत समिती: ${settings.taluka}, जि. ${settings.district}`]);

    // Row 3: Main Certificate Header
    wsData.push([`तांदूळ व धान्यादी मालाचे उपयोगिता प्रमाणपत्र (माहे 1 एप्रिल ${data.startYear} ते 31 मार्च ${data.endYear})`]);

    // Row 4: School Metadata
    wsData.push([
      `शाळेचे नांव : ${settings.schoolName}`, '', '', '', '', '', '', '', '',
      `केंद्र : ${settings.centre}`, '', '', '', '',
      `U-DISE : ${settings.udise}`, '', '',
      `इ. 1 ते 5`
    ]);

    // Row 5: Month Header Row
    const monthNames = ['एप्रिल', 'मे', 'जून', 'जुलै', 'ऑगस्ट', 'सप्टेंबर', 'ऑक्टोबर', 'नोव्हेंबर', 'डिसेंबर', 'जानेवारी', 'फेब्रुवारी', 'मार्च'];
    const row5 = ['महिना व वर्ष', 'मागील शिल्लक'];
    monthNames.forEach((mn, i) => {
      const yr = i < 9 ? String(data.startYear).slice(-2) : String(data.endYear).slice(-2);
      row5.push(`${mn} ${yr}`, '', '');
    });
    row5.push('एकूण (Yearly Total)', '', '');
    wsData.push(row5);

    // Row 6: Beneficiaries Row
    const row6 = ['उपस्थित लाभार्थी', ''];
    data.beneficiaries.forEach(b => {
      row6.push(b || 0, '', '');
    });
    row6.push(data.totalBeneficiaries, '', '');
    wsData.push(row6);

    // Row 7: Working Days Row
    const row7 = ['कामाचे दिवस', ''];
    data.workingDays.forEach(d => {
      row7.push(d || 0, '', '');
    });
    row7.push(data.totalWorkingDays, '', '');
    wsData.push(row7);

    // Row 8: Sub-Headers (प्राप्त / शिजविलेला / शिल्लक)
    const row8 = ['वस्तूचे नांव', `मागील शिल्लक 1 एप्रिल`];
    for (let m = 0; m < 12; m++) {
      row8.push('प्राप्त', 'शिजविलेला', 'शिल्लक');
    }
    row8.push('एकूण प्राप्त', 'एकूण शिजविलेला', 'अखेर शिल्लक 31 मार्च');
    wsData.push(row8);

    // Ingredient Rows
    Object.keys(data.ingredientMatrix).forEach(key => {
      const item = data.ingredientMatrix[key];
      const isSpice = item.category === 'spice';
      const dec = isSpice ? 3 : 2;

      const row = [item.name, item.opening];

      item.months.forEach(m => {
        row.push(
          m.received > 0 ? +m.received.toFixed(dec) : 0,
          m.consumed > 0 ? +m.consumed.toFixed(dec) : 0,
          +m.closing.toFixed(dec)
        );
      });

      // Annual Total Columns
      row.push(
        +item.annualReceived.toFixed(dec),
        +item.annualConsumed.toFixed(dec),
        +item.finalClosing.toFixed(dec)
      );

      wsData.push(row);
    });

    // Row: Fuel Subsidy
    const rowFuel = ['इंधन व भाजीपाला खर्च (रु.)', ''];
    data.fuelSubsidy.forEach(f => {
      rowFuel.push(+f.toFixed(2), '', '');
    });
    rowFuel.push(+data.totalFuelSubsidy.toFixed(2), '', '');
    wsData.push(rowFuel);

    // Row: Cook Honorarium
    const rowCook = ['स्वयंपाकी मानधन (रु.)', ''];
    data.cookHonorarium.forEach(c => {
      rowCook.push(c || 0, '', '');
    });
    rowCook.push(data.totalCookHonorarium, '', '');
    wsData.push(rowCook);

    // Row: Total Expense
    const rowTot = ['एकूण खर्च (रु.)', ''];
    data.fuelSubsidy.forEach((f, idx) => {
      const sum = +(f + data.cookHonorarium[idx]).toFixed(2);
      rowTot.push(sum, '', '');
    });
    rowTot.push(+data.totalExpenses.toFixed(2), '', '');
    wsData.push(rowTot);

    // Blank row & Signatures
    wsData.push([]);
    wsData.push([
      `मुख्याध्यापक / सचिव : ${settings.headmaster || ''}`, '', '', '', '', '', '', '', '', '',
      `अध्यक्ष : ${settings.president || ''}`, '', '', '', '', '', '', '', '', '',
      `केंद्रप्रमुख / गटशिक्षणाधिकारी`
    ]);

    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Column widths
    ws['!cols'] = [
      { wch: 18 }, // Item Name
      { wch: 12 }  // Opening Balance
    ];
    for (let c = 0; c < 39; c++) {
      ws['!cols'].push({ wch: 9 });
    }

    // Page Setup: A4 Landscape & Fit to Page
    ws['!pageSetup'] = {
      orientation: 'landscape',
      paperSize: 9, // A4
      fitToWidth: 1,
      fitToHeight: 0,
      scale: 100
    };
    ws['!margins'] = { left: 0.2, right: 0.2, top: 0.3, bottom: 0.3, header: 0.1, footer: 0.1 };

    // Merges for 12 months & title
    const merges = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 40 } },
      { s: { r: 1, c: 0 }, e: { r: 1, c: 40 } },
      { s: { r: 2, c: 0 }, e: { r: 2, c: 40 } },
      { s: { r: 3, c: 0 }, e: { r: 3, c: 8 } },
      { s: { r: 3, c: 9 }, e: { r: 3, c: 13 } },
      { s: { r: 3, c: 14 }, e: { r: 3, c: 16 } }
    ];

    // Month group merges (Row 4, 5, 6)
    for (let m = 0; m < 12; m++) {
      const colStart = 2 + (m * 3);
      merges.push({ s: { r: 4, c: colStart }, e: { r: 4, c: colStart + 2 } });
      merges.push({ s: { r: 5, c: colStart }, e: { r: 5, c: colStart + 2 } });
      merges.push({ s: { r: 6, c: colStart }, e: { r: 6, c: colStart + 2 } });
    }
    // Annual total group merges
    merges.push({ s: { r: 4, c: 38 }, e: { r: 4, c: 40 } });
    merges.push({ s: { r: 5, c: 38 }, e: { r: 5, c: 40 } });
    merges.push({ s: { r: 6, c: 38 }, e: { r: 6, c: 40 } });

    ws['!merges'] = merges;

    this.applyWorksheetStyles(ws, { type: 'yearly_matrix' });
    XLSX.utils.book_append_sheet(wb, ws, `सन ${data.startYear}-${String(data.endYear).slice(-2)}`);

    const filename = `MDM_Yearly_Report_${data.startYear}-${data.endYear}_${settings.schoolName.replace(/\s+/g, '_')}.xlsx`;
    XLSX.writeFile(wb, filename);
    app.showToast(`✅ A4 फॉरमॅट वार्षिक अहवाल Excel फाईल '${filename}' डाऊनलोड झाली!`, 'success');
  },

  /**
   * Parse uploaded Excel file and import records
   * @param {File} file
   * @param {Function} callback
   */
  importExcelFile(file, callback) {
    if (typeof XLSX === 'undefined') {
      alert('Excel लायब्ररी लोड झालेली नाही.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        let sheetName = workbook.SheetNames.find(s => s.includes('1 to 5') || s.includes('Sheet1') || s.includes('2018') || s.includes('2019'));
        if (!sheetName) {
          sheetName = workbook.SheetNames[0];
        }

        const ws = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });

        const importedRecords = {};
        let importedCount = 0;

        // Try extracting year-month from header or filename
        let defaultYearMonth = new Date().toISOString().substring(0, 7);

        // Search for Month in header rows (Row 0 to 5)
        for (let r = 0; r < Math.min(6, rows.length); r++) {
          const rowStr = (rows[r] || []).join(" ");
          if (rowStr.includes("Desember") || rowStr.includes("डिसेंबर")) {
            defaultYearMonth = "2019-12";
          } else if (rowStr.includes("नोव्हेंबर")) {
            defaultYearMonth = "2019-11";
          } else if (rowStr.includes("ऑक्टोबर")) {
            defaultYearMonth = "2019-10";
          }
        }

        // Iterate rows looking for numeric day in Col 0 (or Col 1)
        for (let r = 5; r < rows.length; r++) {
          const row = rows[r];
          if (!row || row.length === 0) continue;

          const dayVal = parseInt(row[0]);
          if (!isNaN(dayVal) && dayVal >= 1 && dayVal <= 31) {
            const dayCode = parseInt(row[2]) || 0;
            const menuName = String(row[3] || "").trim();
            const children = parseInt(row[4]) || 0;
            const plates = parseInt(row[5]) || children;
            const remarks = String(row[22] || "").trim();

            const dateStr = `${defaultYearMonth}-${String(dayVal).padStart(2, '0')}`;
            const calculated = app.calculateDay(dateStr, children, menuName || undefined, plates);
            calculated.remarks = remarks;

            importedRecords[dateStr] = calculated;
            importedCount++;
          }
        }

        callback(null, {
          sheetName,
          importedCount,
          yearMonth: defaultYearMonth,
          records: importedRecords
        });

      } catch (err) {
        console.error('Error importing Excel:', err);
        callback(err);
      }
    };

    reader.readAsArrayBuffer(file);
  }

};
