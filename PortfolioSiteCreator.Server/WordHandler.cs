using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Wordprocessing;
using Microsoft.AspNetCore.Html;
using System.Diagnostics;
using System.Text;

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
                //Debug.WriteLine($"Style: {styleId}"); // e.g. "Heading1", "Normal"

                // If the style is "Normal", add an extra blank line
                if (styleId is not null && styleId.Equals("Normal"))
                {
                    output += Environment.NewLine;
                }
            }

            return output;
        }

        //Testing method to organize the paragraphs into pages based on headings and print the results to the console
        public static void OrganizeWordDocument(Stream stream)
        {
            var pages = GetPageInfo(stream);
            PageCreator creator = new(pages);
            string directory = Environment.CurrentDirectory;
            string savePath = @"wwwroot\CreatedSites\";
            string folderpath = Path.Combine(directory, savePath);

            //if we are calling this method from the test location use the test save path, otherwise use the server save path
            if (directory.Contains("PortfolioSiteCreator.Server") is false)
            {
                savePath = @"Output";
                // Navigate up 3 levels from bin\Debug\net10.0, then into the target path
                folderpath = Path.GetFullPath(Path.Combine(directory, @"..\..\..\", savePath));
                Debug.WriteLine("Folder path:" + folderpath);
            }

            string uniqueFolderName = $"Site_{Guid.NewGuid().ToString("N")[..10]}"; // e.g. "Site_3f2504e0"
            string fullPath = Path.Combine(folderpath, uniqueFolderName);

            if (!Directory.Exists(fullPath))
            {
                Directory.CreateDirectory(fullPath);
            }

            string fileName;
            foreach (var site in creator.Pages)
            {
                fileName = site.Key.Header.Text.Replace(" ", string.Empty) + ".html"; // e.g. "AboutMe.html"
                //save the HTML string to a file in the created folder
                string filePath = Path.Combine(fullPath, fileName);

                //Write the content to the file
                File.WriteAllText(filePath, site.Value, Encoding.UTF8);

                //Debug.WriteLine($"{fileName} {filePath}");
                //Debug.WriteLine("site key:" + site.Key.Header.Text.ToString());
            }

            Debug.WriteLine(uniqueFolderName);
            Console.WriteLine("folder name: " + uniqueFolderName + "\n");
        }

        //main method to extract text and style information from a Word document and organize it into PageInfo objects based on headings
        public static List<PageInfo> GetPageInfo(Stream stream)
        {
            var paragraphs = GetParagraphs(stream);

            if (paragraphs is null)
                return [];

            return OrganizeParagraphsIntoPages(paragraphs);
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
