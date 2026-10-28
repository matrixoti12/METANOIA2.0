/**
 * ═══════════════════════════════════════════════════════════════════════════
 * METANOIA 2026 // GOOGLE APPS SCRIPT BACKEND (MÁXIMA PRIVACIDAD)
 * Separa los datos en 2 Pestañas independientes:
 * 
 * 1. Pestaña "Participantes":
 *    - Columna A: Nombre
 *    - Columna B: Puntaje Total
 * 
 * 2. Pestaña "Oraciones Incógnitas":
 *    - Columna A: Oración Incógnita (100% Anónima, sin nombres ni relaciones)
 * ═══════════════════════════════════════════════════════════════════════════
 */

function setupSheets(ss) {
  // Si se ejecuta manualmente desde el botón "Run", obtiene la hoja activa automáticamente
  if (!ss) {
    ss = SpreadsheetApp.getActiveSpreadsheet();
  }

  // 1. Pestaña de Participantes
  var sheetParticipantes = ss.getSheetByName("Participantes");
  if (!sheetParticipantes) {
    sheetParticipantes = ss.getSheets()[0];
    sheetParticipantes.setName("Participantes");
  }
  
  if (sheetParticipantes.getLastRow() === 0) {
    sheetParticipantes.appendRow(["Nombre", "Puntaje Total"]);
    var headerPart = sheetParticipantes.getRange(1, 1, 1, 2);
    headerPart.setBackground("#581c87"); // Púrpura Metanoia
    headerPart.setFontColor("#ffffff");
    headerPart.setFontWeight("bold");
    headerPart.setFontFamily("Outfit");
    headerPart.setHorizontalAlignment("center");
    sheetParticipantes.setFrozenRows(1);
    sheetParticipantes.setColumnWidth(1, 260); // Ancho para Nombre
    sheetParticipantes.setColumnWidth(2, 160); // Ancho para Puntaje Total
  }
  
  // 2. Pestaña de Oraciones Incógnitas (completamente separada)
  var sheetOraciones = ss.getSheetByName("Oraciones Incógnitas");
  if (!sheetOraciones) {
    sheetOraciones = ss.insertSheet("Oraciones Incógnitas");
  }
  
  if (sheetOraciones.getLastRow() === 0) {
    sheetOraciones.appendRow(["Oración Incógnita (100% Confidencial)"]);
    var headerOrac = sheetOraciones.getRange(1, 1, 1, 1);
    headerOrac.setBackground("#581c87"); // Púrpura Metanoia
    headerOrac.setFontColor("#ffffff");
    headerOrac.setFontWeight("bold");
    headerOrac.setFontFamily("Outfit");
    headerOrac.setHorizontalAlignment("center");
    sheetOraciones.setFrozenRows(1);
    sheetOraciones.setColumnWidth(1, 600); // Ancho amplio para leer la oración
  }
  
  return {
    participantes: sheetParticipantes,
    oraciones: sheetOraciones
  };
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);
  
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheets = setupSheets(ss);
    
    var data = {};
    if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = e.parameter || {};
      }
    } else if (e && e.parameter) {
      data = e.parameter;
    }
    
    var nombre = (data.nombre || "").trim();
    var puntajeTotal = Number(data.puntajeTotal || 0);
    var oracion = (data.oracionIncognita || data.oracion || data.peticion || "").trim();
    
    // -------------------------------------------------------------
    // PASO 1: Guardar o actualizar Participante y su Puntaje Total
    // -------------------------------------------------------------
    if (nombre !== "") {
      var lastRow = sheets.participantes.getLastRow();
      var foundRow = -1;
      
      if (lastRow > 1) {
        var names = sheets.participantes.getRange(2, 1, lastRow - 1, 1).getValues();
        for (var i = 0; i < names.length; i++) {
          if (names[i][0] && names[i][0].toString().toLowerCase() === nombre.toLowerCase()) {
            foundRow = i + 2;
            break;
          }
        }
      }
      
      if (foundRow > 1) {
        // Si ya existe la persona, actualizamos su puntaje si mejoró su récord
        var currentScore = Number(sheets.participantes.getRange(foundRow, 2).getValue() || 0);
        if (puntajeTotal >= currentScore) {
          sheets.participantes.getRange(foundRow, 2).setValue(puntajeTotal);
        }
      } else {
        // Si es un nuevo participante, lo agregamos a la pestaña Participantes
        sheets.participantes.appendRow([nombre, puntajeTotal]);
        var newPartRow = sheets.participantes.getLastRow();
        sheets.participantes.getRange(newPartRow, 2).setHorizontalAlignment("center").setFontWeight("bold");
      }
    }
    
    // -------------------------------------------------------------
    // PASO 2: Guardar la Oración Incógnita de forma 100% aislada
    // (Sin nombres, sin identificadores, en su propia pestaña)
    // -------------------------------------------------------------
    var oracionValida = oracion !== "" && 
                         oracion !== "(Sin oración registrada)" && 
                         oracion !== "(Sin petición registrada)";
                         
    if (oracionValida && !data.isScoreUpdate) {
      sheets.oraciones.appendRow([oracion]);
      var newOracRow = sheets.oraciones.getLastRow();
      sheets.oraciones.getRange(newOracRow, 1).setWrap(true);
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Participante y oración guardados de forma segura y separada."
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
    
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: "ok",
    app: "Metanoia 2026 - API de Participantes y Oraciones Incógnitas Separadas"
  })).setMimeType(ContentService.MimeType.JSON);
}
