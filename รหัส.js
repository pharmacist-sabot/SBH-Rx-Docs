// --- CONFIGURATION ---
// ให้ใส่ ID ของ Google Sheet ของคุณที่นี่ (หาได้จาก URL ของชีต)
const SHEET_ID = "1SSToSFoh7FylYosmAEyOdRK3YdJ6Atl04OvJbckduXs"; 
// ให้ใส่ชื่อชีตที่เก็บข้อมูล
const SHEET_NAME = "Documents"; 

// ฟังก์ชันหลักที่ทำงานเมื่อมีการเรียก URL ของ Web App
function doGet(e) {
  return HtmlService.createTemplateFromFile('index')
    .evaluate()
    .setTitle("ระบบดาวน์โหลดเอกสาร กลุ่มงานเภสัชกรรมฯ รพ.สระโบสถ์")
    .addMetaTag('viewport', 'width=device-width, initial-scale=1.0') 
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// ฟังก์ชันสำหรับ include ไฟล์ CSS และ JS เข้าไปใน HTML หลัก
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

// ฟังก์ชันที่ถูกเรียกจาก JavaScript ฝั่ง Client เพื่อดึงข้อมูลจาก Google Sheet
function getDocuments() {
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
    // ดึงข้อมูลตั้งแต่แถวที่ 2 คอลัมน์ที่ 1 ไปจนสุดข้อมูล
    const data = sheet.getRange(2, 1, sheet.getLastRow() - 1, 2).getValues();
    
    // แปลง array 2 มิติเป็น array ของ object เพื่อง่ายต่อการใช้งาน
    const documents = data.map(row => {
      // ตรวจสอบว่าแถวนั้นมีข้อมูลหรือไม่
      if (row[0] && row[1]) {
        return {
          name: row[0],
          link: row[1]
        };
      }
      return null;
    }).filter(doc => doc !== null); // กรองแถวที่ว่างออก
    
    return documents;
  } catch (e) {
    // ส่งข้อความ error กลับไปถ้าเกิดปัญหา
    return { error: e.message };
  }
}