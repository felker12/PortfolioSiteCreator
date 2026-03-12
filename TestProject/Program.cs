using PortfolioSiteCreator.Server;
using System.Diagnostics;

namespace TestProject
{
    internal class Program
    {
        static void Main(string[] _)
        {
            Console.WriteLine("Hello, World!");

            using Stream stream = File.OpenRead(@"C:\\Users\\kanth\\Documents\\TestProgrammingProjects\\Asp.net Core\\PortfolioSiteCreator\\TestProject\\Documents\\SoftwareEngineer - AI Focused.docx");

            string path = WordHandler.CreateWebsiteFromWordDocument(stream);

            Console.WriteLine("Path: ");
            Console.WriteLine(path);

            // Use shell execution so the OS handles opening the folder
            if (Directory.Exists(path))
            {
                var psi = new ProcessStartInfo
                {
                    FileName = path,
                    UseShellExecute = true
                };
                Process.Start(psi);
            }

            // Or explicitly launch Explorer
            // Process.Start("explorer.exe", path);
        }
    }
}
