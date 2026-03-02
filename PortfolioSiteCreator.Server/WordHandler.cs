using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Wordprocessing;
using System.IO;
using System.Linq;

namespace PortfolioSiteCreator.Server
{
    public class WordHandler
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
            string fullText = string.Join(Environment.NewLine, paragraphs.Select(p => p.InnerText));

            return fullText;
        }
    }
}
