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
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure table names (lowercase)
            modelBuilder.Entity<Category>().ToTable("categories");
            modelBuilder.Entity<Product>().ToTable("products");
            modelBuilder.Entity<Order>().ToTable("orders");
            modelBuilder.Entity<OrderItem>().ToTable("order_items");
            
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
            modelBuilder.Entity<Order>().HasQueryFilter(o => !o.IsDeleted);
            modelBuilder.Entity<OrderItem>().HasQueryFilter(oi => !oi.IsDeleted);

            // Configure self-referencing relationship for Category (parent-child)
            modelBuilder.Entity<Category>()
                .HasOne(c => c.Parent)
                .WithMany(c => c.Children)
                .HasForeignKey(c => c.ParentId)
                .OnDelete(DeleteBehavior.Restrict)
                .IsRequired(false);

            // Configure product relationships
            modelBuilder.Entity<Product>()
                .HasOne(p => p.Category)
                .WithMany(c => c.Products)
                .HasForeignKey(p => p.CategoryId);

            // Configure Order relationships
            modelBuilder.Entity<Order>()
                .HasOne(o => o.User)
                .WithMany()
                .HasForeignKey(o => o.UserId);

            modelBuilder.Entity<OrderItem>()
                .HasOne(oi => oi.Order)
                .WithMany(o => o.OrderItems)
                .HasForeignKey(oi => oi.OrderId);

            modelBuilder.Entity<OrderItem>()
                .HasOne(oi => oi.Product)
                .WithMany()
                .HasForeignKey(oi => oi.ProductId);

            // Use fixed DateTime for seed data
            var seedTime = new DateTime(2023, 1, 1, 0, 0, 0, DateTimeKind.Utc);
            
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
                PasswordHash = "AQAAAAIAAYagAAAAEE0jo/HFHDTvK8/Rnf7jUS8iCb4W0I9cDQc1XAkFZLHlJwLYU/BHdNhsQtE/gdS7xA==", // Password: Admin123!
                SecurityStamp = securityStamp,
                ConcurrencyStamp = concurrencyStamp,
                FirstName = "Admin",
                LastName = "User",
                ImageUrl = "/images/default-profile.jpg",
                CreatedAt = seedTime,
                IsDeleted = false
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