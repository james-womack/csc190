﻿using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using PancakeCircus.Models;
using PancakeCircus.Models.AccountViewModels;
using PancakeCircus.Services;

namespace PancakeCircus.Controllers
{
  [Authorize]
  public class AccountController : Controller
  {
    private readonly IEmailSender _emailSender;
    private readonly string _externalCookieScheme;
    private readonly ILogger _logger;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly ISmsSender _smsSender;
    private readonly UserManager<ApplicationUser> _userManager;

    public AccountController(
      UserManager<ApplicationUser> userManager,
      SignInManager<ApplicationUser> signInManager,
      IOptions<IdentityCookieOptions> identityCookieOptions,
      IEmailSender emailSender,
      ISmsSender smsSender,
      ILoggerFactory loggerFactory)
    {
      _userManager = userManager;
      _signInManager = signInManager;
      _externalCookieScheme = identityCookieOptions.Value.ExternalCookieAuthenticationScheme;
      _emailSender = emailSender;
      _smsSender = smsSender;
      _logger = loggerFactory.CreateLogger<AccountController>();
    }

    //
    // POST: /Account/Login
    [HttpPost]
    [AllowAnonymous]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Login(LoginViewModel model, string returnUrl = null)
    {
      ViewData["ReturnUrl"] = returnUrl;
      if (ModelState.IsValid)
      {
        // This doesn't count login failures towards account lockout
        // To enable password failures to trigger account lockout, set lockoutOnFailure: true
        var result = await _signInManager.PasswordSignInAsync(model.Email, model.Password, model.RememberMe,
          false);
        if (result.Succeeded)
        {
          _logger.LogInformation(1, "User logged in.");
          return RedirectToLocal(returnUrl);
        }
        if (result.RequiresTwoFactor)
          return RedirectToAction(nameof(SendCode), new {ReturnUrl = returnUrl, model.RememberMe});
        if (result.IsLockedOut)
        {
          _logger.LogWarning(2, "User account locked out.");
          return View("Lockout");
        }
        ModelState.AddModelError(string.Empty, "Invalid login attempt.");
        return View(model);
      }

      // If we got this far, something failed, redisplay form
      return View(model);
    }

    //
    // POST: /Account/Register
    [HttpPost]
    [AllowAnonymous]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Register(RegisterViewModel model, string returnUrl = null)
    {
      ViewData["ReturnUrl"] = returnUrl;
      if (ModelState.IsValid)
      {
        var user = new ApplicationUser {UserName = model.Email, Email = model.Email};
        var result = await _userManager.CreateAsync(user, model.Password);
        if (result.Succeeded)
        {
          // For more information on how to enable account confirmation and password reset please visit https://go.microsoft.com/fwlink/?LinkID=532713
          // Send an email with this link
          //var code = await _userManager.GenerateEmailConfirmationTokenAsync(user);
          //var callbackUrl = Url.Action(nameof(ConfirmEmail), "Account", new { userId = user.Id, code = code }, protocol: HttpContext.Request.Scheme);
          //await _emailSender.SendEmailAsync(model.Email, "Confirm your account",
          //    $"Please confirm your account by clicking this link: <a href='{callbackUrl}'>link</a>");
          await _signInManager.SignInAsync(user, false);
          _logger.LogInformation(3, "User created a new account with password.");
          return RedirectToLocal(returnUrl);
        }
        AddErrors(result);
      }

      // If we got this far, something failed, redisplay form
      return View(model);
    }

    //
    // POST: /Account/Logout
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Logout()
    {
      await _signInManager.SignOutAsync();
      _logger.LogInformation(4, "User logged out.");
      return RedirectToAction(nameof(HomeController.Index), "Home");
    }

    //
    // POST: /Account/ExternalLogin
    [HttpPost]
    [AllowAnonymous]
    [ValidateAntiForgeryToken]
    public IActionResult ExternalLogin(string provider, string returnUrl = null)
    {
      // Request a redirect to the external login provider.
      var redirectUrl = Url.Action("Index", "Home", new {ReturnUrl = returnUrl});
      var properties = _signInManager.ConfigureExternalAuthenticationProperties(provider, redirectUrl);
      return Challenge(properties, provider);
    }

    //
    // POST: /Account/ExternalLoginConfirmation
    [HttpPost]
    [AllowAnonymous]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> ExternalLoginConfirmation(ExternalLoginConfirmationViewModel model,
      string returnUrl = null)
    {
      if (ModelState.IsValid)
      {
        // Get the information about the user from the external login provider
        var info = await _signInManager.GetExternalLoginInfoAsync();
        if (info == null)
          return View("ExternalLoginFailure");
        var user = new ApplicationUser {UserName = model.Email, Email = model.Email};
        var result = await _userManager.CreateAsync(user);
        if (result.Succeeded)
        {
          result = await _userManager.AddLoginAsync(user, info);
          if (result.Succeeded)
          {
            await _signInManager.SignInAsync(user, false);
            _logger.LogInformation(6, "User created an account using {Name} provider.", info.LoginProvider);
            return RedirectToLocal(returnUrl);
          }
        }
        AddErrors(result);
      }

      ViewData["ReturnUrl"] = returnUrl;
      return View(model);
    }

    //
    // POST: /Account/ForgotPassword
    [HttpPost]
    [AllowAnonymous]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> ForgotPassword(ForgotPasswordViewModel model)
    {
      if (ModelState.IsValid)
      {
        var user = await _userManager.FindByEmailAsync(model.Email);
        if (user == null || !await _userManager.IsEmailConfirmedAsync(user))
          return View("ForgotPasswordConfirmation");

        // For more information on how to enable account confirmation and password reset please visit https://go.microsoft.com/fwlink/?LinkID=532713
        // Send an email with this link
        //var code = await _userManager.GeneratePasswordResetTokenAsync(user);
        //var callbackUrl = Url.Action(nameof(ResetPassword), "Account", new { userId = user.Id, code = code }, protocol: HttpContext.Request.Scheme);
        //await _emailSender.SendEmailAsync(model.Email, "Reset Password",
        //   $"Please reset your password by clicking here: <a href='{callbackUrl}'>link</a>");
        //return View("ForgotPasswordConfirmation");
      }

      // If we got this far, something failed, redisplay form
      return View(model);
    }

    //
    // POST: /Account/ResetPassword
    [HttpPost]
    [AllowAnonymous]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> ResetPassword(ResetPasswordViewModel model)
    {
      if (!ModelState.IsValid)
        return View(model);
      var user = await _userManager.FindByEmailAsync(model.Email);
      if (user == null)
        return RedirectToAction("Index", "Home");
      var result = await _userManager.ResetPasswordAsync(user, model.Code, model.Password);
      if (result.Succeeded)
        return RedirectToAction("Index", "Home");
      AddErrors(result);
      return View();
    }

    //
    // POST: /Account/SendCode
    [HttpPost]
    [AllowAnonymous]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> SendCode(SendCodeViewModel model)
    {
      if (!ModelState.IsValid)
        return View();

      var user = await _signInManager.GetTwoFactorAuthenticationUserAsync();
      if (user == null)
        return View("Error");

      // Generate the token and send it
      var code = await _userManager.GenerateTwoFactorTokenAsync(user, model.SelectedProvider);
      if (string.IsNullOrWhiteSpace(code))
        return View("Error");

      var message = "Your security code is: " + code;
      if (model.SelectedProvider == "Email")
        await _emailSender.SendEmailAsync(await _userManager.GetEmailAsync(user), "Security Code", message);
      else if (model.SelectedProvider == "Phone")
        await _smsSender.SendSmsAsync(await _userManager.GetPhoneNumberAsync(user), message);

      return RedirectToAction(nameof(VerifyCode),
        new {Provider = model.SelectedProvider, model.ReturnUrl, model.RememberMe});
    }

    //
    // POST: /Account/VerifyCode
    [HttpPost]
    [AllowAnonymous]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> VerifyCode(VerifyCodeViewModel model)
    {
      if (!ModelState.IsValid)
        return View(model);

      // The following code protects for brute force attacks against the two factor codes.
      // If a user enters incorrect codes for a specified amount of time then the user account
      // will be locked out for a specified amount of time.
      var result = await _signInManager.TwoFactorSignInAsync(model.Provider, model.Code, model.RememberMe,
        model.RememberBrowser);
      if (result.Succeeded)
        return RedirectToLocal(model.ReturnUrl);
      if (result.IsLockedOut)
      {
        _logger.LogWarning(7, "User account locked out.");
        return View("Lockout");
      }
      ModelState.AddModelError(string.Empty, "Invalid code.");
      return View(model);
    }

    #region Helpers

    private void AddErrors(IdentityResult result)
    {
      foreach (var error in result.Errors)
        ModelState.AddModelError(string.Empty, error.Description);
    }

    private IActionResult RedirectToLocal(string returnUrl)
    {
      if (Url.IsLocalUrl(returnUrl))
        return Redirect(returnUrl);
      return RedirectToAction(nameof(HomeController.Index), "Home");
    }

    #endregion
  }
}
