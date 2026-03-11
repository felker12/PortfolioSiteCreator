using PortfolioSiteCreator.Server;

namespace TestProject
{
    internal class Program
    {
        static void Main(string[] _)
        {
            Console.WriteLine("Hello, World!");

            Stream stream = File.OpenRead(@"C:\\Users\\kanth\\Documents\\TestProgrammingProjects\\Asp.net Core\\PortfolioSiteCreator\\TestProject\\Documents\\SoftwareEngineer - AI Focused.docx");

            WordHandler.OrganizeWordDocument(stream);


        }
    }
}
