namespace Websolute.BOM.Oven.Web;

public class AppConfig: Websolute.BOM.Oven.Core.AppConfig
{
    public interface IGatewayBase
    {
        string? Host { get; set; }
    }
    public GatewayConfig? Gateway { get; set; }
    public class GatewayConfig
    {
    }
}
