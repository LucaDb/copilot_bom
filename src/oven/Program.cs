using Carter;
using Microsoft.AspNetCore.Http.Json;
using Websolute.BOM.Oven.Extensions.Bowl;

Websolute.BOM.Oven.Core.App.Program.CreateRunBuilder<Websolute.BOM.Oven.Web.AppConfig>(
    Websolute.BOM.Oven.Web.Program.ParseArgs(args),
    Websolute.BOM.Oven.Web.Program.preModulesSetupBuilder,
    Websolute.BOM.Oven.Web.Program.postModulesSetupBuilder,
    Websolute.BOM.Oven.Web.Program.preModulesSetupApplication,
    Websolute.BOM.Oven.Web.Program.postModulesSetupApplication
    );

namespace Websolute.BOM.Oven.Web
{
    public partial class Program : ICarterModule
    {
        /// <summary>
        /// env variable                cli arg
        /// ------------------------------------------------------------------
        /// ASPNETCORE_ENVIRONMENT      --environment=Development
        /// ASPNETCORE_CONTENTROOT      --contentRoot=C:\Projects\Websolute.BOM.Oven.Core.App\src\oven\web
        /// ASPNETCORE_APPLICATIONNAME  --applicationName=ws.bom.oven.web
        /// </summary>
        /// <param name="args"></param>
        /// <returns></returns>
        internal static string[] ParseArgs(string[] args)
        {
            // content root path
            var _path = "--contentRoot=";
            for (var i = 0; i < args.Length; i++)
                if (args[i].StartsWith(_path))
                    args[i] = $"{_path}{Path.GetFullPath(Directory.GetCurrentDirectory())}";
            return args;
        }

        internal static readonly Action<WebApplicationBuilder> preModulesSetupBuilder = (builder) => _preAdd(builder);
        internal static readonly Action<WebApplicationBuilder> postModulesSetupBuilder = (builder) => _postAdd(builder);
        internal static readonly Action<WebApplication> preModulesSetupApplication = (app) => { _preUse(app); };
        internal static readonly Action<WebApplication> postModulesSetupApplication = (app) => { _postUse(app); };

        internal static void _preAdd(WebApplicationBuilder builder)
        {
        }
        internal static void _postAdd(WebApplicationBuilder builder)
        {
            builder.Services.AddResponseCompression();
            Websolute.BOM.Oven.Extensions.Api.Options? apiOpt = Websolute.BOM.Oven.Extensions.Base.Extension.Option<Websolute.BOM.Oven.Extensions.Api.Options>.Value;
            builder.Services.Configure<JsonOptions>(_ =>
            {
                var opt = apiOpt?.Serialization?.ToJsonSerializerSettings();
                if (opt != null)
                {

                    _.SerializerOptions.AllowTrailingCommas = opt.AllowTrailingCommas;
                    foreach (var converter in opt.Converters)
                        _.SerializerOptions.Converters.Add(converter);
                    _.SerializerOptions.DefaultIgnoreCondition = opt.DefaultIgnoreCondition;
                    _.SerializerOptions.PropertyNameCaseInsensitive = opt.PropertyNameCaseInsensitive;
                    _.SerializerOptions.PropertyNamingPolicy = opt.PropertyNamingPolicy;
                    _.SerializerOptions.WriteIndented = opt.WriteIndented;
                }
            });
        }
        internal static void _preUse(WebApplication app)
        {
        }

        internal static void _postUse(WebApplication app)
        {
            app.UseResponseCompression();

            //lifetime events                        
            app.Lifetime.ApplicationStarted.Register(async () => await app.Services.GetRequiredService<IBowl>().OnStart());
            app.Lifetime.ApplicationStopping.Register(async () => await app.Services.GetRequiredService<IBowl>().OnStop());
        }

        public void AddRoutes(IEndpointRouteBuilder app)
        {
            app.MapGet("/", () => string.Empty);
        }
    }
}
