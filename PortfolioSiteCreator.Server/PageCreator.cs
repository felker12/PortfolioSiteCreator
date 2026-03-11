
using DocumentFormat.OpenXml.Bibliography;

namespace PortfolioSiteCreator.Server
{
    public class PageCreator
    {
        public List<PageInfo> PageInfos { get; private set; } = [];
        public List<string> CreatedPagesString { get; private set; } = [];
        public Dictionary<PageInfo, string> Pages { get; private set; } = [];

        public PageCreator(List<PageInfo> pageInfos)
        {
            PageInfos = pageInfos;

            foreach (var pageInfo in PageInfos)
            {
                CreatedPagesString.Add(HTMLifyPage(pageInfo));
            }

            CreatedPagesString.Add(CreateHomePage(PageInfos));




        }

        private string HTMLifyPage(PageInfo pageInfo)
        {
            string body = string.Empty;
            foreach (var paragraph in pageInfo.Paragraphs)
            {
                body += $"<p>{paragraph.Text}</p>\n";
            }

            //remove spaces from the header
            string header = pageInfo.Header.Text.Replace(" ", string.Empty);

            string output =  @$"
                <!DOCTYPE html>
                <html>
                    <head>
                        <title>{header}</title>
                    </head>

                    <body>
                        <div>
                            {body}
                        </div>
                    </body>

                </html>";

            //add the page to the dictionary and return the output
            Pages.Add(pageInfo, output);
            return output;
        }

        private string CreateHomePage(List<PageInfo> pageInfos)
        {
            string body = string.Empty;
            //remove spaces from the header
            string header;

            foreach (var pageInfo in pageInfos)
            {
                header = pageInfo.Header.Text.Replace(" ", string.Empty);
                body += $"<p>{header}</p>\n";
            }

            PageInfo homePageInfo = new(new ParagraphInfo("Home", null), [new ParagraphInfo(string.Empty, null)]);
            PageInfos.Add(homePageInfo);

            string output = @$"
                <!DOCTYPE html>
                <html>
                    <head>
                        <title>Home</title>
                    </head>

                    <body>
                        <div>
                            {body}
                        </div>
                    </body>

                </html>";

            //add the page to the dictionary and return the output
            Pages.Add(homePageInfo, output);
            return output;
        }

        //TODO: For debugging return the HTML output of the PageCreator
        public string GetHTML()
        {
            return CreatedPagesString.Aggregate((a, b) => a + b);
        }
    }
}
