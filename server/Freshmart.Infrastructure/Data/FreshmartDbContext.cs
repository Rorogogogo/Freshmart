using Freshmart.Infrastructure.Data.DbEntities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;

namespace Freshmart.Infrastructure.Data
{
    public class FreshmartDbContext : IdentityDbContext<ApplicationUser, IdentityRole<Guid>, Guid>
    {
        public FreshmartDbContext(DbContextOptions<FreshmartDbContext> options) 
            : base(options)
        {
        }

        public DbSet<Product> Products { get; set; }
        public DbSet<Category> Categories { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure table names to be lowercase as per PostgreSQL convention
            modelBuilder.Entity<Product>().ToTable("products");
            modelBuilder.Entity<Category>().ToTable("categories");
            
            // Configure Identity tables with PostgreSQL naming convention
            modelBuilder.Entity<ApplicationUser>().ToTable("users");
            modelBuilder.Entity<IdentityRole<Guid>>().ToTable("roles");
            modelBuilder.Entity<IdentityUserRole<Guid>>().ToTable("user_roles");
            modelBuilder.Entity<IdentityUserClaim<Guid>>().ToTable("user_claims");
            modelBuilder.Entity<IdentityUserLogin<Guid>>().ToTable("user_logins");
            modelBuilder.Entity<IdentityUserToken<Guid>>().ToTable("user_tokens");
            modelBuilder.Entity<IdentityRoleClaim<Guid>>().ToTable("role_claims");

            // Configure soft delete global query filter
            modelBuilder.Entity<Product>().HasQueryFilter(p => !p.IsDeleted);
            modelBuilder.Entity<Category>().HasQueryFilter(c => !c.IsDeleted);

            // Configure relationships
            modelBuilder.Entity<Product>()
                .HasOne(p => p.Category)
                .WithMany(c => c.Products)
                .HasForeignKey(p => p.CategoryId);

            // Use fixed DateTime for seed data
            var seedTime = new DateTime(2023, 1, 1, 0, 0, 0, DateTimeKind.Utc);
            
            // Seed some initial data with fixed GUIDs
            var fruitsId = Guid.Parse("c9d4c053-49b6-410c-bc78-2d54a9991870");
            var vegetablesId = Guid.Parse("c9d4c053-49b6-410c-bc78-2d54a9991871");
            var dairyId = Guid.Parse("c9d4c053-49b6-410c-bc78-2d54a9991872");

            modelBuilder.Entity<Category>().HasData(
                new Category { 
                    Id = fruitsId, 
                    Name = "Fruits", 
                    Description = "Fresh fruits", 
                    ImageUrl = "/images/categories/fruits.jpg",
                    CreatedAt = seedTime,
                    IsDeleted = false
                },
                new Category { 
                    Id = vegetablesId, 
                    Name = "Vegetables", 
                    Description = "Fresh vegetables", 
                    ImageUrl = "/images/categories/vegetables.jpg",
                    CreatedAt = seedTime,
                    IsDeleted = false
                },
                new Category { 
                    Id = dairyId, 
                    Name = "Dairy", 
                    Description = "Dairy products", 
                    ImageUrl = "/images/categories/dairy.jpg",
                    CreatedAt = seedTime,
                    IsDeleted = false
                }
            );

            // Seed default admin user
            var adminId = Guid.Parse("c9d4c053-49b6-410c-bc78-2d54a9991873");
            var adminRoleId = Guid.Parse("c9d4c053-49b6-410c-bc78-2d54a9991874");
            var concurrencyStamp = "c9d4c053-49b6-410c-bc78-2d54a9991875";
            var securityStamp = "c9d4c053-49b6-410c-bc78-2d54a9991876";

            // Add admin role
            modelBuilder.Entity<IdentityRole<Guid>>().HasData(
                new IdentityRole<Guid>
                {
                    Id = adminRoleId,
                    Name = "Admin",
                    NormalizedName = "ADMIN",
                    ConcurrencyStamp = concurrencyStamp
                }
            );

            // Add admin user with fixed password hash
            var adminUser = new ApplicationUser
            {
                Id = adminId,
                UserName = "admin@freshmart.com",
                NormalizedUserName = "ADMIN@FRESHMART.COM",
                Email = "admin@freshmart.com",
                NormalizedEmail = "ADMIN@FRESHMART.COM",
                EmailConfirmed = true,
                FirstName = "Admin",
                LastName = "User",
                ImageUrl = "/images/default-profile.jpg",
                CreatedAt = seedTime,
                IsDeleted = false,
                SecurityStamp = securityStamp,
                // Pre-computed hash for 'Admin123!'
                PasswordHash = "AQAAAAIAAYagAAAAEH8K562A1KbQYmrHj9PZ3VsosoF+OKRZWkF3rJihV+LsDn0bPLLnOIaEcCAwyBdUvw=="
            };

            modelBuilder.Entity<ApplicationUser>().HasData(adminUser);

            // Assign admin role to admin user
            modelBuilder.Entity<IdentityUserRole<Guid>>().HasData(
                new IdentityUserRole<Guid>
                {
                    RoleId = adminRoleId,
                    UserId = adminId
                }
            );
        }
    }
} 