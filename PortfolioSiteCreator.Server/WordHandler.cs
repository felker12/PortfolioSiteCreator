using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Wordprocessing;
using System.Diagnostics;

namespace PortfolioSiteCreator.Server
{
    public static class WordHandler
    {
        public static string ReadWordDocument(string filePath)
        {
            using FileStream fs = new(filePath, FileMode.Open, FileAccess.Read);
            using WordprocessingDocument wordDocument = WordprocessingDocument.Open(fs, false); // false for read-only
                                                                                                // Get the main document part
            MainDocumentPart? mainPart = wordDocument.MainDocumentPart;

            if (mainPart == null || mainPart.Document == null || mainPart.Document.Body == null)
            {
                return string.Empty;
            }

            // Extract text from paragraphs
            var paragraphs = mainPart.Document.Body.Elements<Paragraph>();
            return string.Join(Environment.NewLine, paragraphs.Select(p => p.InnerText));
        }

        public static string ReadWordDocument(Stream stream)
        {
            using WordprocessingDocument wordDocument = WordprocessingDocument.Open(stream, false);

            MainDocumentPart? mainPart = wordDocument.MainDocumentPart;

            if (mainPart == null || mainPart.Document == null || mainPart.Document.Body == null)
            {
                return string.Empty;
            }

            // Extract text from paragraphs
            var paragraphs = mainPart.Document.Body.Elements<Paragraph>();
            return string.Join(Environment.NewLine, paragraphs.Select(p => p.InnerText));
        }

        public static string ProcessWordDocument(Stream stream)
        {
            using WordprocessingDocument wordDocument = WordprocessingDocument.Open(stream, false);

            MainDocumentPart? mainPart = wordDocument.MainDocumentPart;

            if (mainPart == null || mainPart.Document == null || mainPart.Document.Body == null)
            {
                return string.Empty;
            }

            // Extract text from paragraphs
            string output = string.Empty;

            //for testing
            foreach (var element in mainPart.Document.Body.Elements())
            {
                if(element is Paragraph para)
                {
                    var styleId = para.ParagraphProperties?.ParagraphStyleId?.Val?.Value;
                    Debug.WriteLine($"Style: {styleId}"); // e.g. "Heading1", "Normal"
                }
            }

            foreach (var paragraph in mainPart.Document.Body.Elements<Paragraph>())
            {
                output += paragraph.InnerText + Environment.NewLine;

                //add an extra blank line if it's a regular paragraph
                var styleId = paragraph.ParagraphProperties?.ParagraphStyleId?.Val?.Value;
                if(styleId is not null && styleId.Equals("Normal"))
                {
                    output += Environment.NewLine;
                }
            }

            return output;
        }
    }
}
