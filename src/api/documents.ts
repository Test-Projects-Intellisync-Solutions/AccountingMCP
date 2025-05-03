import { Router } from 'express';
import multer from 'multer';
import pdfParse from 'pdf-parse';
import Tesseract from 'tesseract.js';
import Papa from 'papaparse';
import xlsx from 'xlsx';
import fs from 'fs';
import path from 'path';

const router = Router();
const upload = multer({ dest: 'uploads/' });

// POST /api/documents/upload
router.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const filePath = req.file.path;
  const mimeType = req.file.mimetype;
  let parsedContent = null;

  try {
    if (mimeType === 'application/pdf') {
      // PDF parsing
      const dataBuffer = fs.readFileSync(filePath);
      const pdfData = await pdfParse(dataBuffer);
      parsedContent = { text: pdfData.text };
    } else if (mimeType.startsWith('image/')) {
      // Image OCR
      const image = fs.readFileSync(filePath);
      const { data: { text } } = await Tesseract.recognize(image, 'eng');
      parsedContent = { text };
    } else if (mimeType === 'text/csv' || req.file.originalname.endsWith('.csv')) {
      // CSV parsing
      const csvData = fs.readFileSync(filePath, 'utf8');
      const parsed = Papa.parse(csvData, { header: true });
      parsedContent = { data: parsed.data };
    } else if (
      mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      mimeType === 'application/vnd.ms-excel' ||
      req.file.originalname.endsWith('.xlsx') ||
      req.file.originalname.endsWith('.xls')
    ) {
      // XLSX parsing
      const workbook = xlsx.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = xlsx.utils.sheet_to_json(worksheet);
      parsedContent = { data };
    } else {
      return res.status(415).json({ error: 'Unsupported file type' });
    }

        // Pass parsedContent to agent pipeline
    const { runPipeline } = await import('../agents/pipeline');
    const pipelineResult = await runPipeline({
      file: req.file.originalname,
      format: mimeType,
      content: parsedContent,
    });

    res.json({ pipelineResult });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to parse document' });
  } finally {
    fs.unlinkSync(filePath); // Clean up uploaded file
  }
});

export default router;
