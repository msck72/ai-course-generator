import React, { useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';
import { Download, Loader2, Check } from 'lucide-react';

export default function PDFExportButton({ targetId, lessonTitle }) {
    const [isExporting, setIsExporting] = useState(false);
    const [isDone, setIsDone] = useState(false);

    const handleExport = async () => {
        const element = document.getElementById(targetId);
        if (!element) {
            console.error(`Target element #${targetId} not found.`);
            return;
        }

        try {
            setIsExporting(true);
            setIsDone(false);
            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#0f172a',
                ignoreElements: (node) => {
                    return (
                        node.tagName === 'IFRAME' || node.classList?.contains('no-pdf')
                    );
                },
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = 210;
            const pdfHeight = 297;
            const margin = 10;
            const contentWidth = pdfWidth - margin * 2;
            const contentHeight = (canvas.height * contentWidth) / canvas.width;

            let heightLeft = contentHeight;
            let position = margin;

            pdf.addImage(imgData, 'PNG', margin, position, contentWidth, contentHeight);
            heightLeft -= (pdfHeight - margin * 2);

            while (heightLeft > 0) {
                position = heightLeft - contentHeight + margin;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', margin, position, contentWidth, contentHeight);
                heightLeft -= (pdfHeight - margin * 2);
            }

            const cleanFileName = (lessonTitle || 'Lesson').replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 40);
            pdf.save(`${cleanFileName}.pdf`);
            setIsDone(true);
            setTimeout(() => setIsDone(false), 3000);
        } catch (err) {
            console.error('PDF export failed: ', err);
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <button
            onClick={handleExport}
            disabled={isExporting}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 transition-all cursor-pointer disabled:opacity-50"
            title="Download this lesson as a PDF document"
        >
            {isExporting ? (
                <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                    <span>Generating PDF...</span>
                </>
            ) : isDone ? (
                <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Downloaded!</span>
                </>
            ) : (
                <>
                    <Download className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Download PDF</span>
                </>
            )}
        </button>
    );
}
