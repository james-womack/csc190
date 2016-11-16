﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace PancakeCircus.Controllers
{
    [Route("[controller]")]
    public class HomeController : Controller
    {
        [HttpGet]
        [HttpGet("/")]
        public IActionResult Index()
        {
            return View();
        }

        [HttpGet("Edit")]
        public IActionResult Edit()
        {
            //ViewData["Message"] = "Your application description page.";

            return View();
        }

        [HttpGet("Error")]
        public IActionResult Error()
        {
            return View();
        }
    }
}
