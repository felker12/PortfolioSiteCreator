
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
        private static string GetStylesheetLink() =>
    "<link rel=\"stylesheet\" href=\"styles.css\">";

        private string HTMLifyPage(PageInfo pageInfo)
        {
            string body = string.Empty;
            foreach (var paragraph in pageInfo.Paragraphs)
            {
                body += $"        <p>{paragraph.Text}</p>\n";
            }


            //remove spaces from the header
            string header = pageInfo.Header.Text.Replace(" ", string.Empty);
            string displayHeader = pageInfo.Header.Text;

            string output = @$"<!DOCTYPE html>
<html lang=""en"">
    <head>
        <meta charset=""UTF-8"">
        <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
        <title>{header}</title>
        {GetStylesheetLink()}
    </head>
    <body>
        <nav>
            <a href=""index.html"">Home</a>
        </nav>
        <main>
            <h1>{displayHeader}</h1>
            <div class=""content"">
{body}
            </div>
        </main>
    </body>
</html>";

            //add the page to the dictionary and return the output
            Pages.Add(pageInfo, output);
            return output;
        }

        private string CreateHomePage(List<PageInfo> pageInfos)
        {
            string nav = string.Empty;
            foreach (var pageInfo in pageInfos)
            {
                string header = pageInfo.Header.Text.Replace(" ", string.Empty);
                nav += $"        <a href=\"{header}.html\" class=\"nav-card\">{pageInfo.Header.Text}</a>\n";
            }

            PageInfo homePageInfo = new(new ParagraphInfo("Index", null), [new ParagraphInfo(string.Empty, null)]);
            PageInfos.Add(homePageInfo);

            string output = @$"<!DOCTYPE html>
<html lang=""en"">
    <head>
        <meta charset=""UTF-8"">
        <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
        <title>Home</title>
        {GetStylesheetLink()}
    </head>
    <body>
        <main>
            <h1>Welcome</h1>
            <div class=""nav-grid"">
{nav}
            </div>
        </main>
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

        public static string GetStylesheet() => @"
*, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

body {
    font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    font-size: 16px;
    line-height: 1.7;
    color: #1a1a1a;
    background-color: #f9f9f9;
}

nav {
    padding: 16px 32px;
    background: #ffffff;
    border-bottom: 1px solid #e5e5e5;
}

nav a {
    text-decoration: none;
    color: #4a6cf7;
    font-weight: 500;
    font-size: 14px;
}

nav a:hover {
    text-decoration: underline;
}

main {
    max-width: 780px;
    margin: 48px auto;
    padding: 0 24px;
}

h1 {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 24px;
    color: #111;
    border-bottom: 2px solid #e5e5e5;
    padding-bottom: 12px;
}

.content p {
    margin-bottom: 16px;
    color: #333;
}

.nav-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 16px;
    margin-top: 24px;
}

.nav-card {
    display: block;
    padding: 20px 24px;
    background: #ffffff;
    border: 1px solid #e5e5e5;
    border-radius: 8px;
    text-decoration: none;
    color: #1a1a1a;
    font-weight: 500;
    transition: border-color 0.2s, box-shadow 0.2s;
}

.nav-card:hover {
    border-color: #4a6cf7;
    box-shadow: 0 2px 12px rgba(74, 108, 247, 0.1);
}
";
    }
}
