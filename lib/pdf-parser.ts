export async function extractTextFromFile(file: File): Promise<string> {
  const fileType = file.type;
  const fileName = file.name.toLowerCase();
  
  console.log('File info:', {
    name: file.name,
    type: fileType,
    size: file.size,
    lastModified: new Date(file.lastModified)
  });

  try {
    if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
      return await extractFromPDFWithFallback(file);
    } else if (
      fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      fileName.endsWith('.docx')
    ) {
      return await extractFromDOCX(file);
    } else if (fileType === 'text/plain' || fileName.endsWith('.txt')) {
      return await file.text();
    } else {
      throw new Error('Unsupported file type. Please upload PDF, DOCX, or TXT files.');
    }
  } catch (error) {
    console.error('File extraction error:', error);
    
    // If it's a PDF and extraction failed, suggest alternatives
    if (fileName.endsWith('.pdf')) {
      throw new Error(`PDF extraction failed: ${error instanceof Error ? error.message : 'Unknown error'}. 

Possible solutions:
1. Try a different PDF file
2. Ensure the PDF contains selectable text (not just images)
3. Try converting the PDF to DOCX format
4. Check if the PDF is password protected
5. Try uploading as a .txt file with the CV content copied`);
    }
    
    throw error;
  }
}

async function extractFromPDFWithFallback(file: File): Promise<string> {
  console.log('=== PDF EXTRACTION DEBUG START ===');
  console.log('File details:', {
    name: file.name,
    size: file.size,
    type: file.type,
    lastModified: new Date(file.lastModified).toISOString()
  });

  try {
    // Try ultra-simple method first
    console.log('Attempting ultra-simple PDF extraction method...');
    return await extractFromPDFUltraSimple(file);
  } catch (ultraSimpleError) {
    console.warn('Ultra-simple PDF extraction failed:', ultraSimpleError);
    
    try {
      // Try primary PDF extraction method
      console.log('Attempting primary PDF extraction method...');
      return await extractFromPDF(file);
    } catch (primaryError) {
      console.warn('Primary PDF extraction failed:', primaryError);
      
      try {
        // Fallback method: try with different PDF.js options
        console.log('Attempting fallback PDF extraction method...');
        return await extractFromPDFLegacy(file);
      } catch (fallbackError) {
        console.error('All PDF extraction methods failed');
        console.error('Ultra-simple error:', ultraSimpleError);
        console.error('Primary error:', primaryError);
        console.error('Fallback error:', fallbackError);
        
        // If all methods fail, provide comprehensive error message
        const ultraMsg = ultraSimpleError instanceof Error ? ultraSimpleError.message : 'Unknown error';
        const primaryMsg = primaryError instanceof Error ? primaryError.message : 'Unknown error';
        const fallbackMsg = fallbackError instanceof Error ? fallbackError.message : 'Unknown error';
        
        throw new Error(`PDF extraction failed with all methods:

Ultra-simple: ${ultraMsg}
Primary: ${primaryMsg}  
Fallback: ${fallbackMsg}

This PDF may be:
- Image-based (scanned document)
- Password protected
- Corrupted or invalid
- Using unsupported PDF features

Please try:
1. A different PDF file
2. Converting to DOCX format
3. Copying the text to a .txt file
4. Using a PDF with selectable text`);
      }
    }
  } finally {
    console.log('=== PDF EXTRACTION DEBUG END ===');
  }
}

async function extractFromPDFUltraSimple(file: File): Promise<string> {
  try {
    console.log('Ultra-simple method: Starting for', file.name);
    
    const pdfjsLib = await import('pdfjs-dist');
    console.log('Ultra-simple method: PDF.js loaded, version:', pdfjsLib.version);
    
    // Minimal worker setup
    if (typeof window !== 'undefined') {
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;
    }
    
    const arrayBuffer = await file.arrayBuffer();
    console.log('Ultra-simple method: Array buffer created, size:', arrayBuffer.byteLength);
    
    // Ultra-minimal PDF options
    const loadingTask = pdfjsLib.getDocument({
      data: arrayBuffer
    });
    
    console.log('Ultra-simple method: Loading PDF...');
    const pdf = await loadingTask.promise;
    console.log('Ultra-simple method: PDF loaded, pages:', pdf.numPages);
    
    // Extract from first page only
    const page = await pdf.getPage(1);
    console.log('Ultra-simple method: Got first page');
    
    const textContent = await page.getTextContent();
    console.log('Ultra-simple method: Got text content, items:', textContent.items?.length);
    
    if (!textContent || !textContent.items) {
      throw new Error('No text content found');
    }
    
    const text = textContent.items
      .map((item: any) => item.str || '')
      .join(' ')
      .trim();
    
    console.log('Ultra-simple method: Extracted text length:', text.length);
    
    if (text.length === 0) {
      throw new Error('No text extracted from first page');
    }
    
    return text;
    
  } catch (error) {
    console.error('Ultra-simple method failed:', error);
    throw error;
  }
}

async function extractFromPDFLegacy(file: File): Promise<string> {
  try {
    console.log('Using legacy PDF extraction method for:', file.name);
    
    const pdfjsLib = await import('pdfjs-dist');
    
    // Simplified worker configuration
    if (typeof window !== 'undefined') {
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://mozilla.github.io/pdf.js/build/pdf.worker.js';
    }
    
    const arrayBuffer = await file.arrayBuffer();
    
    // Simplified PDF loading options
    const loadingTask = pdfjsLib.getDocument({
      data: arrayBuffer,
      verbosity: 0,
      stopAtErrors: true,
    });
    
    const pdf = await Promise.race([
      loadingTask.promise,
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Legacy PDF loading timeout')), 20000)
      )
    ]) as any;
    
    let fullText = '';
    const maxPages = Math.min(pdf.numPages, 10); // Even more conservative
    
    for (let i = 1; i <= maxPages; i++) {
      try {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        
        if (textContent && textContent.items) {
          const pageText = textContent.items
            .map((item: any) => item.str || '')
            .join(' ')
            .trim();
          
          if (pageText) {
            fullText += pageText + ' ';
          }
        }
      } catch (pageError) {
        console.warn(`Legacy method: Error on page ${i}:`, pageError);
      }
    }
    
    if (pdf && typeof pdf.destroy === 'function') {
      pdf.destroy();
    }
    
    if (fullText.trim().length === 0) {
      throw new Error('No text extracted with legacy method');
    }
    
    console.log('Legacy extraction successful, text length:', fullText.length);
    return fullText.trim();
    
  } catch (error) {
    console.error('Legacy PDF extraction error:', error);
    throw new Error(`Legacy extraction failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

async function extractFromPDF(file: File): Promise<string> {
  let loadingTask: any = null;
  
  try {
    console.log('Starting PDF extraction for:', file.name, 'Size:', file.size);
    
    // Dynamic import with error handling
    const pdfjsLib = await import('pdfjs-dist');
    console.log('PDF.js loaded, version:', pdfjsLib.version);
    
    // Configure worker with multiple fallback strategies
    if (typeof window !== 'undefined') {
      try {
        // Try multiple CDN sources for the worker
        const workerUrls = [
          `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`,
          `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`,
          'https://mozilla.github.io/pdf.js/build/pdf.worker.js'
        ];
        
        pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrls[0];
        console.log('Worker configured:', workerUrls[0]);
      } catch (workerError) {
        console.warn('Worker configuration failed:', workerError);
      }
    }
    
    // Convert file to array buffer with validation
    const arrayBuffer = await file.arrayBuffer();
    console.log('Array buffer size:', arrayBuffer.byteLength);
    
    if (arrayBuffer.byteLength === 0) {
      throw new Error('PDF file is empty');
    }
    
    if (arrayBuffer.byteLength < 100) {
      throw new Error('PDF file appears to be corrupted (too small)');
    }
    
    // Check PDF header
    const header = new Uint8Array(arrayBuffer.slice(0, 5));
    const headerString = Array.from(header).map(b => String.fromCharCode(b)).join('');
    if (!headerString.startsWith('%PDF')) {
      throw new Error('File is not a valid PDF (invalid header)');
    }
    
    // Load PDF document with comprehensive options
    loadingTask = pdfjsLib.getDocument({
      data: arrayBuffer,
      verbosity: 0,
      password: '', // Try empty password first
      stopAtErrors: false, // Continue processing even with errors
      maxImageSize: 1024 * 1024, // 1MB max per image
      isEvalSupported: false, // Security
      cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/cmaps/`,
      cMapPacked: true,
      standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/standard_fonts/`,
    });
    
    console.log('Loading PDF document...');
    const pdf = await Promise.race([
      loadingTask.promise,
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('PDF loading timeout after 45 seconds')), 45000)
      )
    ]) as any;
    
    console.log('PDF loaded successfully. Pages:', pdf.numPages);
    
    if (pdf.numPages === 0) {
      throw new Error('PDF has no pages');
    }
    
    let fullText = '';
    let processedPages = 0;
    const maxPages = Math.min(pdf.numPages, 25); // Reduced for better performance
    
    // Process pages with better error handling
    for (let i = 1; i <= maxPages; i++) {
      try {
        console.log(`Processing page ${i}/${maxPages}`);
        
        const page = await Promise.race([
          pdf.getPage(i),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error(`Page ${i} timeout`)), 10000)
          )
        ]) as any;
        
        const textContent = await Promise.race([
          page.getTextContent({
            disableCombineTextItems: false,
            includeMarkedContent: false
          }),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error(`Text extraction timeout for page ${i}`)), 15000)
          )
        ]) as any;
        
        if (textContent && textContent.items && Array.isArray(textContent.items)) {
          const pageText = textContent.items
            .filter((item: any) => item && typeof item.str === 'string' && item.str.trim())
            .map((item: any) => item.str.trim())
            .join(' ')
            .replace(/\s+/g, ' ') // Normalize whitespace
            .trim();
          
          if (pageText && pageText.length > 0) {
            fullText += pageText + '\n';
            processedPages++;
          }
        }
        
        // Clean up page resources
        if (page && typeof page.cleanup === 'function') {
          page.cleanup();
        }
        
      } catch (pageError) {
        console.warn(`Error processing page ${i}:`, pageError);
        // Continue with other pages - don't fail entire extraction
      }
    }
    
    console.log(`Successfully processed ${processedPages}/${maxPages} pages`);
    console.log('Total extracted text length:', fullText.length);
    
    // Clean up the PDF document
    if (pdf && typeof pdf.destroy === 'function') {
      pdf.destroy();
    }
    
    if (fullText.trim().length === 0) {
      throw new Error('No readable text found in PDF. This could be an image-based PDF or the content may be protected.');
    }
    
    if (fullText.trim().length < 20) {
      throw new Error('PDF contains very little text. Please ensure it\'s a text-based resume/CV.');
    }
    
    return fullText.trim();
    
  } catch (error) {
    console.error('PDF parsing error:', error);
    
    // Clean up loading task if it exists
    if (loadingTask && typeof loadingTask.destroy === 'function') {
      try {
        loadingTask.destroy();
      } catch (cleanupError) {
        console.warn('Error cleaning up PDF loading task:', cleanupError);
      }
    }
    
    // Provide specific error messages based on error type
    if (error instanceof Error) {
      const message = error.message.toLowerCase();
      
      if (message.includes('password') || message.includes('encrypted')) {
        throw new Error('PDF is password protected. Please provide an unprotected PDF file.');
      } else if (message.includes('invalid pdf') || message.includes('invalid header')) {
        throw new Error('Invalid PDF format. Please ensure the file is a valid PDF document.');
      } else if (message.includes('timeout')) {
        throw new Error('PDF processing timed out. The file may be too large or complex. Try a smaller PDF.');
      } else if (message.includes('worker') || message.includes('script')) {
        throw new Error('PDF processing engine failed. Please refresh the page and try again.');
      } else if (message.includes('network') || message.includes('fetch')) {
        throw new Error('Network error loading PDF processing libraries. Please check your internet connection.');
      } else if (message.includes('memory') || message.includes('out of memory')) {
        throw new Error('PDF file is too large to process. Please try a smaller file.');
      } else if (message.includes('no readable text') || message.includes('image-based')) {
        throw new Error('PDF appears to be image-based. Please use a PDF with selectable text or convert it to a text-based format.');
      } else {
        throw new Error(`PDF parsing failed: ${error.message}`);
      }
    }
    
    throw new Error('Failed to parse PDF file. Please ensure it\'s a valid, text-based PDF document.');
  }
}

async function extractFromDOCX(file: File): Promise<string> {
  try {
    const mammoth = (await import('mammoth')).default;
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  } catch (error) {
    console.error('Error parsing DOCX:', error);
    throw new Error('Failed to parse DOCX file');
  }
}