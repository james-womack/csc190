using System.Threading.Tasks;

namespace PancakeCircus.Services
{
  public interface IEmailSender
  {
    Task SendEmailAsync(string email, string subject, string message);
  }
}