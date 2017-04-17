using System.ComponentModel.DataAnnotations;

namespace PancakeCircus.Models.AccountViewModels
{
  public class ForgotPasswordViewModel
  {
    [Required]
    [EmailAddress]
    public string Email { get; set; }
  }
}