using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Wordprocessing;
using System.Diagnostics;

namespace PortfolioSiteCreator.Server
{
    public static class WordHandler
    {
        public static IEnumerable<Paragraph>? GetParagraphs(Stream stream)
        {
            using WordprocessingDocument wordDocument = WordprocessingDocument.Open(stream, false);

            MainDocumentPart? mainPart = wordDocument.MainDocumentPart;

            if (mainPart == null || mainPart.Document == null || mainPart.Document.Body == null)
            {
                return null;
            }

            // Extract text from paragraphs
            return mainPart.Document.Body.Elements<Paragraph>();
        }

        public static string ReadWordDocument(string filePath)
        {
            using FileStream fs = new(filePath, FileMode.Open, FileAccess.Read);
            return ReadWordDocument(fs);
        }

        public static string ReadWordDocument(Stream stream)
        {
            // Extract text from paragraphs
            var paragraphs = GetParagraphs(stream);

            if(paragraphs is null)
                return string.Empty;

            return string.Join(Environment.NewLine, paragraphs.Select(p => p.InnerText));
        }

        public static string ProcessWordDocument(Stream stream)
        {
            // Extract text from paragraphs
            string output = string.Empty;
            var paragraphs = GetParagraphs(stream);

            if (paragraphs is null)
                return output;

            foreach (var paragraph in paragraphs)
            {
                output += paragraph.InnerText + Environment.NewLine;

                //add an extra blank line if it's a regular paragraph
                var styleId = paragraph.ParagraphProperties?.ParagraphStyleId?.Val?.Value;

                //TODO: For debugging: print the style ID of each paragraph
                Debug.WriteLine($"Style: {styleId}"); // e.g. "Heading1", "Normal"

                // If the style is "Normal", add an extra blank line
                if (styleId is not null && styleId.Equals("Normal"))
                {
                    output += Environment.NewLine;
                }
            }

            return output;
        }

        public static void OrganizeWordDocument(Stream stream)
        {
            var paragraphs = GetParagraphs(stream);

            if (paragraphs is null)
                return;

            List<PageInfo> pages = OrganizeParagraphsIntoPages(paragraphs);

            //TODO
            int count = 1;
            foreach (var page in pages)
            {
                Debug.WriteLine($"Page {count}: {page}");
                count++;
            }

        }

        //helper method to extract text and style information from a paragraph and return it as a ParagraphInfo object
        private static ParagraphInfo GetPageInfo(Paragraph paragraph)
        {
            string text = paragraph.InnerText;
            string ?styleId = paragraph.ParagraphProperties?.ParagraphStyleId?.Val?.Value;

            return new(text, styleId);
        }

        //extract text from paragraphs
        //organize text into ParagraphInfo based on headings
        //create PageInfo objects based on the organized ParagraphInfo
        //for example, if a heading is "About Me", then all subsequent paragraphs until the next heading would be grouped under that heading in a PageInfo object
        //return the organized PageInfo objects
        private static List<PageInfo> OrganizeParagraphsIntoPages(IEnumerable<Paragraph> paragraphs)
        {
            List<PageInfo> pages = [];
            PageInfo page = new(); 
            ParagraphInfo paragraphInfo;
            bool previousStyleIsHeading = false;


            foreach (var paragraph in paragraphs)
            {
                if (previousStyleIsHeading is true)
                {
                    pages.Add(page);
                    previousStyleIsHeading = false;
                }

                paragraphInfo = GetPageInfo(paragraph);

                if (paragraphInfo.StyleId is not null && paragraphInfo.StyleId.Contains("Heading"))
                {
                    previousStyleIsHeading = true;

                    //create a new page with the header
                    page = new PageInfo(paragraphInfo, []);
                }
                else
                {
                    //add the paragraph to the current page's paragraphs
                    page.Paragraphs.Add(paragraphInfo);
                }
            }

            return pages;
        }
    }
}
