namespace PortfolioSiteCreator.Server
{
    public struct ParagraphInfo(string text, string? styleId)
    {
        public string Text { get; set; } = text;
        public string? StyleId { get; set; } = styleId;

        public readonly override string ToString()
        {
            return $"StyleId: {StyleId}, Text: {Text}";
        }
    }

    public struct PageInfo
    {
        public ParagraphInfo Header { get; set; }
        public List<ParagraphInfo> Paragraphs { get; set; }

        public PageInfo()
        {
            Header = new ParagraphInfo(string.Empty, null);
            Paragraphs = [];
        }

        public PageInfo(ParagraphInfo header, List<ParagraphInfo> paragraphs)
        {
            Header = header;
            Paragraphs = paragraphs;
        }

        public readonly override string ToString()
        {
            string paragraphsText = Paragraphs is not null ? string.Join(Environment.NewLine, Paragraphs.Select(p => p.ToString())) : "No paragraphs";
            return $"Header: {Header}\nParagraphs: {paragraphsText}";
        }
    }
}
