'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useInterview } from '@/context/InterviewContext';
import Header from '@/components/Header';

export default function UploadPage() {
  const router = useRouter();
  const { 
    resumeText: contextResumeText,
    setResumeText: setContextResumeText,
    resumeFileName: contextResumeFileName,
    setResumeFileName: setContextResumeFileName,
    jobTitle: contextJobTitle,
    setJobTitle: setContextJobTitle, 
    jobInfo: contextJobInfo,
    setJobInfo, 
    companyName: contextCompanyName,
    setCompanyName: setContextCompanyName, 
    additionalInfo: contextAdditionalInfo,
    setAdditionalInfo 
  } = useInterview();
  
  const [formData, setFormData] = useState({
    companyName: '',
    jobTitle: '',
    additionalInfo: '',
    jobDescription: '',
  });
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState<string>('');
  const [resumeFileName, setResumeFileName] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const [isParsingPdf, setIsParsingPdf] = useState(false);

  // Initialize form data from context on mount
  useEffect(() => {
    if (contextCompanyName || contextJobTitle || contextJobInfo || contextAdditionalInfo) {
      setFormData({
        companyName: contextCompanyName,
        jobTitle: contextJobTitle,
        additionalInfo: contextAdditionalInfo,
        jobDescription: contextJobInfo,
      });
    }
    if (contextResumeText) {
      setResumeText(contextResumeText);
      setResumeFileName(contextResumeFileName);
      // Note: We can't restore the actual File object, but we show that resume was uploaded
    }
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        setResumeFile(file);
        setResumeFileName(file.name);
        setContextResumeFileName(file.name);
        parsePdfToText(file);
      } else {
        alert('Please upload a PDF file');
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setResumeFile(files[0]);
      setResumeFileName(files[0].name);
      setContextResumeFileName(files[0].name);
      parsePdfToText(files[0]);
    }
  };

  const parsePdfToText = async (file: File) => {
    setIsParsingPdf(true);
    try {
      // Dynamically import PDF.js to avoid SSR issues
      const pdfjsLib = await import('pdfjs-dist');
      
      // Set worker to use jsdelivr CDN (more reliable than unpkg)
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
      
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ 
        data: arrayBuffer,
        useWorkerFetch: false,
        isEvalSupported: false,
      }).promise;
      let fullText = '';

      // Extract text from all pages
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        fullText += pageText + '\n';
      }

      setResumeText(fullText.trim());
      setContextResumeText(fullText.trim());
      console.log('Parsed resume text:', fullText.trim());
    } catch (error) {
      console.error('Error parsing PDF:', error);
      alert(`Failed to parse PDF: ${error instanceof Error ? error.message : 'Unknown error'}. Please try another file.`);
    } finally {
      setIsParsingPdf(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Save to context immediately as user types
    switch (name) {
      case 'companyName':
        setContextCompanyName(value);
        break;
      case 'jobTitle':
        setContextJobTitle(value);
        break;
      case 'jobDescription':
        setJobInfo(value);
        break;
      case 'additionalInfo':
        setAdditionalInfo(value);
        break;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation - accept either current file or existing resume text from context
    if (!resumeFile && !resumeText) {
      alert('Please upload your resume');
      return;
    }
    if (!formData.companyName || !formData.jobTitle || !formData.jobDescription) {
      alert('Please fill in all required fields');
      return;
    }

    // Save data to context
    setContextResumeText(resumeText);
    setContextJobTitle(formData.jobTitle);
    setJobInfo(formData.jobDescription);
    setContextCompanyName(formData.companyName);
    
    // Save additional info
    setAdditionalInfo(formData.additionalInfo);
    
    console.log('Form data saved to context:', { 
      resumeText,
      jobTitle: formData.jobTitle,
      jobInfo: formData.jobDescription,
      companyName: formData.companyName,
      additionalInfo: formData.additionalInfo
    });
    
    // Navigate to topics selection page
    router.push('/topics');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] pt-24 sm:pt-28 md:pt-32">
      <Header />

      {/* Top Leaves Decoration with Title */}
      <section className="flex justify-between items-center w-full relative mb-8 md:mb-0">
        <img 
          src="/leavesLeft.svg"
          alt="Decorative leaves"
          className="h-auto w-[10%] md:w-[15%]"
        />
        <div className="absolute left-1/2 transform -translate-x-1/2 text-center px-4">
          <h1 className="text-2xl md:text-4xl font-bold text-white">
            Upload Your Resume
          </h1>
        </div>
        <img 
          src="/leavesRight.svg"
          alt="Decorative leaves"
          className="h-auto w-[10%] md:w-[15%]"
        />
      </section>

      <div className="container mx-auto max-w-5xl py-6 md:py-12 px-4">

        <form onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {/* Left Column - Resume Upload */}
          <div className="flex flex-col">
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Resume <span className="text-red-500">*</span>
            </label>
            <div
              className={`flex-1 border-2 border-dashed rounded-lg p-6 text-center transition-all flex flex-col justify-center ${
                isDragging
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                  : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="mb-4">
                <img
                  src="/raccoonUpload.svg"
                  alt="Upload"
                  className="mx-auto h-32 w-32 md:h-48 md:w-48"
                />
              </div>
              <p className="text-lg md:text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
                Drop Files Here
              </p>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                or click to browse
              </p>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
                id="resume-upload"
              />
              <label
                htmlFor="resume-upload"
                className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg cursor-pointer transition-colors"
              >
                Choose File
              </label>
              {isParsingPdf && (
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded">
                  <p className="text-blue-700 dark:text-blue-300 font-medium">
                    📄 Parsing PDF...
                  </p>
                </div>
              )}
              {resumeFile && !isParsingPdf && (
                <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded">
                  <p className="text-green-700 dark:text-green-300 font-medium">
                    ✓ {resumeFile.name}
                  </p>
                  <p className="text-green-600 dark:text-green-400 text-sm mt-1">
                    Parsed {resumeText.length} characters
                  </p>
                </div>
              )}
              {!resumeFile && resumeText && !isParsingPdf && (
                <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded">
                  <p className="text-green-700 dark:text-green-300 font-medium">
                    ✓ {resumeFileName || 'Resume Previously Uploaded'}
                  </p>
                  <p className="text-green-600 dark:text-green-400 text-sm mt-1">
                    {resumeText.length} characters stored
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Job Details Form */}
          <div className="flex flex-col space-y-4">
            {/* Company Name */}
            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Company Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="e.g., Google, Microsoft, etc."
              />
            </div>

            {/* Job Title */}
            <div>
              <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Job Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="jobTitle"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="e.g., Software Engineer, Product Manager, etc."
              />
            </div>

            {/* Job Description */}
            <div className="space-y-0">
              <label htmlFor="jobDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Job Description<span className="text-red-500">*</span>
              </label>
              <textarea
                id="jobDescription"
                name="jobDescription"
                value={formData.jobDescription}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                placeholder="Paste the job description here..."
              />
            </div>

            {/* Additional Info */}
            <div className="space-y-0">
              <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Additional Info<span className="text-red-500">*</span>
              </label>
              <textarea
                id="additionalInfo"
                name="additionalInfo"
                value={formData.additionalInfo}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                placeholder="Any additional information (e.g., experience level, location, etc.)..."
              />
            </div>

            {/* Bottom Row - Go Back Button and Submit Button */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <button
                type="button"
                onClick={() => router.push('/')}
                className="w-full sm:w-auto bg-white hover:bg-gray-200 text-gray-900 text-base md:text-lg font-semibold px-8 md:px-12 py-3 md:py-4 rounded-[32px] transition-colors duration-200"
              >
                Go Back
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white text-base md:text-lg font-semibold px-8 md:px-12 py-3 md:py-4 rounded-[32px] transition-colors duration-200"
              >
                Continue
              </button>
            </div>
          </div>
          </div>
        </form>
      </div>

      {/* Bottom Leaves Decoration */}
      <section className="flex justify-between w-full mt-8 md:mt-12">
        <img 
          src="/leavesLeft.svg"
          alt="Decorative leaves"
          className="h-auto w-[25%] md:w-[40%]"
        />
        <img 
          src="/leavesRight.svg"
          alt="Decorative leaves"
          className="h-auto w-[25%] md:w-[40%]"
        />
      </section>
    </div>
  );
}
