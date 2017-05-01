using System.Threading.Tasks;

namespace PancakeCircus.Services
{
  public interface ISmsSender
  {
    Task SendSmsAsync(string number, string message);
  }
}
