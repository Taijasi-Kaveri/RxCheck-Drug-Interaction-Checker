using Microsoft.AspNetCore.Mvc;
using System.Text;
using System.Text.Json;

namespace RxCheck.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DrugInteractionController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly HttpClient _httpClient;

        public DrugInteractionController(IConfiguration configuration, IHttpClientFactory httpClientFactory)
        {
            _configuration = configuration;
            _httpClient = httpClientFactory.CreateClient();
        }

        [HttpPost("check")]
        public async Task<IActionResult> Check([FromBody] DrugInteractionRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.DrugOne) ||
                string.IsNullOrWhiteSpace(request.DrugTwo))
            {
                return BadRequest("Both drug names are required.");
            }

            var apiKey = _configuration["GeminiApiKey"] ?? Environment.GetEnvironmentVariable("GeminiApiKey");
var url = $"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key={apiKey}";
            var prompt = $@"You are a medical information assistant. 
A patient is asking about taking {request.DrugOne} and {request.DrugTwo} together.
Respond in this exact JSON format with no extra text:
{{
  ""severity"": ""Low or Moderate or High or Critical"",
  ""summary"": ""Plain English explanation of the interaction"",
  ""symptoms"": [""symptom1"", ""symptom2"", ""symptom3""],
  ""recommendation"": ""What the patient should do""
}}";

            var requestBody = new
            {
                contents = new[]
                {
                    new
                    {
                        parts = new[]
                        {
                            new { text = prompt }
                        }
                    }
                }
            };

            var json = JsonSerializer.Serialize(requestBody);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync(url, content);
            var responseString = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                return StatusCode(500, $"Gemini API error: {responseString}");
            }

            using var doc = JsonDocument.Parse(responseString);
            var text = doc.RootElement
                .GetProperty("candidates")[0]
                .GetProperty("content")
                .GetProperty("parts")[0]
                .GetProperty("text")
                .GetString();

            var result = JsonSerializer.Deserialize<DrugInteractionResponse>(text!,
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

            return Ok(result);
        }
    }

    public class DrugInteractionRequest
    {
        public string DrugOne { get; set; } = string.Empty;
        public string DrugTwo { get; set; } = string.Empty;
    }

    public class DrugInteractionResponse
    {
        public string Severity { get; set; } = string.Empty;
        public string Summary { get; set; } = string.Empty;
        public List<string> Symptoms { get; set; } = new();
        public string Recommendation { get; set; } = string.Empty;
    }
}