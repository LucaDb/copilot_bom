#See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 5000

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["src/oven/nuget.config", "."]
COPY ["src/oven/oven.csproj", "."]
RUN dotnet restore "./oven.csproj"
COPY src/oven .

RUN dotnet build "oven.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "oven.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
COPY wait-for-it.sh .
RUN chmod u+x *.sh
ENV ASPNETCORE_URLS http://+:5000
ENTRYPOINT ["dotnet", "Websolute.BOM.Oven.Web.dll"]
