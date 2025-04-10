// Questionnaire structure extracted from the PDF
const questionnaireData = {
  title: "แบบประเมินภาวะกลืนลำบาก ของสถาบัน M",
  sections: {
    emotional: {
      code: "E",
      name: "ด้านอารมณ์และความรู้สึก (Emotional)",
      questions: [
        { id: "E2", text: "ข้าพเจ้ารู้สึกอับอายกับปัญหาภาวะการกลืนของข้าพเจ้า" },
        { id: "E3", text: "ผู้อื่นรู้สึกรําคาญกับปัญหาการรับประทานอาหารของข้าพเจ้า" },
        { id: "E4", text: "ข้าพเจ้ารู้สึกไม่สบอารมณ์กับภาวะการกลืนลําบากของตัวข้าพเจ้าเอง" },
        { id: "E5", text: "ข้าพเจ้าเลือกที่จะไม่ออกนอกบ้าน เนื่องจากปัญหาภาวะการกลืนลําบากของข้าพเจ้าเอง" },
        { id: "E6", text: "ข้าพเจ้ารู้สึกด้อยคุณค่าในตนเอง เนื่องจากปัญหาภาวะการกลืน" },
        { id: "E7", text: "ข้าพเจ้าไม่รู้สึกอับอายกับปัญหาภาวะการกลืนของข้าพเจ้า" } // Positive question, needs score reversal
      ]
    },
    functional: {
      code: "F",
      name: "ด้านการทําหน้าที่ (Functional)",
      questions: [
        { id: "F1", text: "ข้าพเจ้าไม่สามารถรักษาสุขภาพและโภชนาการที่ดีได้ เนื่องจากปัญหาภาวะการกลืน" },
        { id: "F2", text: "ข้าพเจ้ารู้สึกสบายใจที่จะไปรับประทานอาหารนอกบ้านกับเพื่อน เพื่อนบ้าน และญาติ" }, // Positive question, needs score reversal
        { id: "F3", text: "ปัญหาการกลืนของข้าพเจ้า ได้จํากัดการใช้ชีวิตทางสังคมและชีวิตส่วนตัว" },
        { id: "F4", text: "ข้าพเจ้ารู้สึกเหมือนถูกกีดกันออกจากสังคม/กลุ่ม เพราะปัญหาด้านพฤติกรรมการรับประทานอาหาร" },
        { id: "F5", text: "ภาวะการกลืนลําบากทําให้ข้าพเจ้าสูญเสียรายได้" }
      ]
    },
    physical: {
      code: "P",
      name: "ด้านร่างกาย (Physical)",
      questions: [
        { id: "P1", text: "ข้าพเจ้าไม่สามารถคงนํ้าหนักตัวไว้ได้ เนื่องจากปัญหาภาวะการกลืน" },
        { id: "P2", text: "ข้าพเจ้ามีปัญหาในการเคี้ยวอาหารเนื่องจากภาวะการกลืนลําบาก" },
        { id: "P3", text: "ผู้คนมักถามข้าพเจ้าว่า \"ทําไมคุณถึงทานสิ่งนี้ไม่ได้ล่ะ\"" },
        { id: "P4", text: "ข้าพเจ้ารู้สึกราวกับว่ากําลังกลืนอาหารคําใหญ่มาก" },
        { id: "P5", text: "ข้าพเจ้าต้องจํากัดปริมาณอาหารที่จะรับประทาน เนื่องจากภาวะการกลืนลําบาก" },
        { id: "P6", text: "การกลืนเป็นสิ่งที่ต้องใช้ความพยายามอย่างมาก" },
        { id: "P7", text: "ภาวะการกลืนลําบากทําให้ข้าพเจ้าต้องใช้เวลาในการทานอาหารมากขึ้น" },
        { id: "P8", text: "ข้าพเจ้ามีอาการไอ เมื่อพยายามจะดื่มนํ้าหรือของเหลว" }
      ]
    },
    global: {
      code: "G",
      name: "คะแนนโดยรวม (Global)",
      questions: [
        { id: "G", text: "โดยรวมแล้ว ภาวะการกลืนลําบากส่งผลกระทบต่อคุณภาพชีวิตประจําวันของข้าพเจ้า" }
      ]
    }
  },
  responseOptions: [
    { value: 1, text: "เห็นด้วยอย่างยิ่ง" },
    { value: 2, text: "เห็นด้วย" },
    { value: 3, text: "ไม่มีความเห็น" },
    { value: 4, text: "ไม่เห็นด้วย" },
    { value: 5, text: "ไม่เห็นด้วยอย่างยิ่ง" }
  ],
  scoringSystem: {
    reverseScoring: ["E7", "F2"], // Questions that need score reversal
    calculations: {
      emotional: {
        formula: "(E2 + E3 + E4 + E5 + E6 + E7_reversed) / 6",
        standardized: "emotional_avg * 20"
      },
      functional: {
        formula: "(F1 + F2_reversed + F3 + F4 + F5) / 5",
        standardized: "functional_avg * 20"
      },
      physical: {
        formula: "(P1 + P2 + P3 + P4 + P5 + P6 + P7 + P8) / 8",
        standardized: "physical_avg * 20"
      },
      global: {
        formula: "G",
        standardized: "global_score * 20"
      },
      composite: {
        formula: "(E2 + E3 + E4 + E5 + E6 + E7_reversed + F1 + F2_reversed + F3 + F4 + F5 + P1 + P2 + P3 + P4 + P5 + P6 + P7 + P8) / 19",
        standardized: "composite_avg * 20"
      }
    },
    interpretation: [
      { range: [20, 40], level: "มีผลกระทบรุนแรงมาก (Severely impacted)" },
      { range: [41, 60], level: "มีผลกระทบรุนแรง (Moderately to severely impacted)" },
      { range: [61, 80], level: "มีผลกระทบปานกลาง (Mildly to moderately impacted)" },
      { range: [81, 100], level: "มีผลกระทบน้อย (Minimally impacted)" }
    ],
    clinicalIssues: [
      "การไอ/ สําลักบ่อยครั้ง",
      "นํ้าหนักลดผิดปกติ",
      "อาการเจ็บขณะกลืน",
      "อื่นๆ (ระบุ)"
    ]
  }
};
