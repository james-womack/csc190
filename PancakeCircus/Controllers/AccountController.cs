using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using IdentityModel.Client;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using PancakeCircus.Models.SQL;

// For more information on enabling MVC for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace PancakeCircus.Controllers
{
    [Route("[controller]")]
    public class AccountController : Controller
    {
        private readonly UserManager<User> _users;
        private readonly SignInManager<User> _signIn;
        private readonly ILogger _logger;
        public AccountController(UserManager<User> userManager, SignInManager<User> signInManager, ILoggerFactory loggerFactory)
        {
            _logger = loggerFactory.CreateLogger(typeof(AccountController));
            _users = userManager;
            _signIn = signInManager;
        }

        [HttpGet]
        [AllowAnonymous]
        // GET: /<controller>/
        public IActionResult Index()
        {
            return View();
        }

        [HttpGet("Login")]
        [AllowAnonymous]
        public IActionResult Login()
        {
            return View();
        }

        [HttpGet("Register")]
        [AllowAnonymous]
        public IActionResult Register()
        {
            return View();
        }

        [HttpPost("register")]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Register(RegisterRequest model)
        {
            if (ModelState.IsValid)
            {
                var user = new User()
                {
                    Email = model.Email,
                    FirstName = model.FirstName,
                    LastName = model.LastName,
                    UserName = model.Email
                };
                var result = await _users.CreateAsync(user, model.Password);
                if (result.Succeeded)
                {
                    await _signIn.SignInAsync(user, false);
                    _logger.LogInformation(3, "User created");
                    return RedirectToAction("Index", "Home");
                }
            }

            return View(model);
        }

        [HttpPost("Logout")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Logout()
        {
            await _signIn.SignOutAsync();
            return RedirectToAction(nameof(HomeController.Index), "Home");
        }

        public async Task<IActionResult> Login(LoginRequest model)
        {
            if (ModelState.IsValid)
            {
                var result = await _signIn.PasswordSignInAsync(model.Email, model.Password, model.RememberMe, false);
                if (result.Succeeded)
                {
                    _logger.LogInformation(1, "User signed in");
                    return RedirectToAction("Index", "Home");
                }
                if (result.IsLockedOut)
                {
                    _logger.LogWarning("User is locked out");
                    return View(model);
                }
                else
                {
                    ModelState.AddModelError("", "Invalid Login Attempt");
                    return View(model);
                }
            }

            return View(model);
        }

        [HttpPost("TokenLogin")]
        public async Task<IActionResult> TokenLogin([FromBody]LoginRequest model)
        {
            if (ModelState.IsValid)
            {
                var disco = await DiscoveryClient.GetAsync("http://localhost:5000");
                var tokenClient = new TokenClient(disco.TokenEndpoint, "ro.client", "holly can't loca");
                var tokenResponse = await tokenClient.RequestResourceOwnerPasswordAsync(model.Email, model.Password,
                    "api");

                if (tokenResponse.IsError)
                {
                    _logger.LogError(tokenResponse.Error);
                    return BadRequest("Invalid User/Pass");
                }

                return Json(tokenResponse.Json);
            }

            return BadRequest("Invalid model");
        }
    }

    public class LoginRequest
    {
        [Required]
        public string Email { get; set; }
        [Required]
        public string Password { get; set; }
        public bool RememberMe { get; set; } = true;
    }

    public class RegisterRequest
    {
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Password { get; set; }
    }
}
