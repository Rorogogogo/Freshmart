using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Configuration;
using System;
using System.IO;

namespace Freshmart.Infrastructure.Data
{
    public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<FreshmartDbContext>
    {
        public FreshmartDbContext CreateDbContext(string[] args)
        {
            var configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", optional: false)
                .Build();

            var builder = new DbContextOptionsBuilder<FreshmartDbContext>();
            var connectionString = configuration.GetConnectionString("DefaultConnection");

            builder.UseNpgsql(connectionString)
                  .ConfigureWarnings(warnings => 
                      warnings.Ignore(RelationalEventId.PendingModelChangesWarning));

            return new FreshmartDbContext(builder.Options);
        }
    }
} 