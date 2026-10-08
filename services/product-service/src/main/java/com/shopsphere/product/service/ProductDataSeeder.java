package com.shopsphere.product.service;

import com.shopsphere.product.entity.Brand;
import com.shopsphere.product.entity.Category;
import com.shopsphere.product.entity.Product;
import com.shopsphere.product.repository.BrandRepository;
import com.shopsphere.product.repository.CategoryRepository;
import com.shopsphere.product.repository.ProductRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProductDataSeeder {

    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;
    private final ProductRepository productRepository;

    @PostConstruct
    @Transactional
    public void seedData() {
        if (productRepository.count() > 0) {
            return;
        }
        log.info("Seeding initial categories, brands, and products...");

        // Categories
        Category electronics = categoryRepository.save(Category.builder()
                .name("Electronics & Gadgets")
                .slug("electronics")
                .description("Smartphones, audio, laptops and high-performance computing devices")
                .icon("laptop")
                .imageUrl("https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&q=80")
                .build());

        Category fashion = categoryRepository.save(Category.builder()
                .name("Fashion & Apparel")
                .slug("fashion")
                .description("Trendy clothing, activewear, premium shoes and modern accessories")
                .icon("shirt")
                .imageUrl("https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&q=80")
                .build());

        Category home = categoryRepository.save(Category.builder()
                .name("Home & Living")
                .slug("home-living")
                .description("Minimalist furniture, smart home devices, kitchenware and decor")
                .icon("home")
                .imageUrl("https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&q=80")
                .build());

        Category audio = categoryRepository.save(Category.builder()
                .name("Audio & Sound")
                .slug("audio")
                .description("Noise-cancelling headphones, wireless earbuds and studio speakers")
                .icon("headphones")
                .imageUrl("https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80")
                .build());

        Category gaming = categoryRepository.save(Category.builder()
                .name("Gaming Gear")
                .slug("gaming")
                .description("Consoles, mechanical keyboards, ergonomic chairs and VR headsets")
                .icon("gamepad")
                .imageUrl("https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=600&q=80")
                .build());

        // Brands
        brandRepository.save(Brand.builder().name("Apple").slug("apple").description("Designed in California").build());
        brandRepository.save(Brand.builder().name("Sony").slug("sony").description("Be Moved").build());
        brandRepository.save(Brand.builder().name("Nike").slug("nike").description("Just Do It").build());
        brandRepository.save(Brand.builder().name("Bose").slug("bose").description("Better Sound Through Research").build());
        brandRepository.save(Brand.builder().name("Samsung").slug("samsung").description("Inspire the World").build());

        // Products
        productRepository.save(Product.builder()
                .sku("SKU-APPL-MBP-16")
                .name("MacBook Pro 16\" M3 Max")
                .slug("macbook-pro-16-m3-max")
                .description("Liquid Retina XDR display, 36GB Unified Memory, 1TB SSD storage, 22-hour battery life and space black aluminum unibody.")
                .price(new BigDecimal("3499.00"))
                .discountPrice(new BigDecimal("3299.00"))
                .categoryId(electronics.getId())
                .categoryName(electronics.getName())
                .brand("Apple")
                .images(List.of(
                        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80",
                        "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&q=80"
                ))
                .stock(45)
                .rating(4.9)
                .reviewCount(128)
                .status("ACTIVE")
                .featured(true)
                .build());

        productRepository.save(Product.builder()
                .sku("SKU-SNY-WH1000XM5")
                .name("Sony WH-1000XM5 Wireless Headphones")
                .slug("sony-wh-1000xm5-wireless-headphones")
                .description("Industry-leading active noise canceling with two processors and 8 microphones. Crystal clear hands-free calling and up to 30h battery life.")
                .price(new BigDecimal("399.99"))
                .discountPrice(new BigDecimal("348.00"))
                .categoryId(audio.getId())
                .categoryName(audio.getName())
                .brand("Sony")
                .images(List.of(
                        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
                        "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80"
                ))
                .stock(80)
                .rating(4.8)
                .reviewCount(254)
                .status("ACTIVE")
                .featured(true)
                .build());

        productRepository.save(Product.builder()
                .sku("SKU-NIKE-AF1-07")
                .name("Nike Air Force 1 '07 Pro")
                .slug("nike-air-force-1-07-pro")
                .description("The radiance lives on in the Nike Air Force 1 '07, the basketball icon that puts a fresh spin on what you know best.")
                .price(new BigDecimal("130.00"))
                .discountPrice(new BigDecimal("115.00"))
                .categoryId(fashion.getId())
                .categoryName(fashion.getName())
                .brand("Nike")
                .images(List.of(
                        "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80",
                        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80"
                ))
                .stock(120)
                .rating(4.7)
                .reviewCount(95)
                .status("ACTIVE")
                .featured(true)
                .build());

        productRepository.save(Product.builder()
                .sku("SKU-BOSE-QC-ULTRA")
                .name("Bose QuietComfort Ultra Earbuds")
                .slug("bose-quietcomfort-ultra-earbuds")
                .description("Spatialized audio for more immersive listening that makes your music feel realer than ever before. World-class active noise cancellation.")
                .price(new BigDecimal("299.00"))
                .discountPrice(new BigDecimal("279.00"))
                .categoryId(audio.getId())
                .categoryName(audio.getName())
                .brand("Bose")
                .images(List.of(
                        "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80"
                ))
                .stock(65)
                .rating(4.6)
                .reviewCount(64)
                .status("ACTIVE")
                .featured(false)
                .build());

        productRepository.save(Product.builder()
                .sku("SKU-SAMS-S24-ULTRA")
                .name("Samsung Galaxy S24 Ultra Titanium")
                .slug("samsung-galaxy-s24-ultra-titanium")
                .description("Galaxy AI is here. 200MP camera with Quad Tele System, Titanium exterior shield, 6.8\" Dynamic AMOLED 2X 120Hz display and built-in S Pen.")
                .price(new BigDecimal("1299.99"))
                .discountPrice(new BigDecimal("1199.00"))
                .categoryId(electronics.getId())
                .categoryName(electronics.getName())
                .brand("Samsung")
                .images(List.of(
                        "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&q=80"
                ))
                .stock(50)
                .rating(4.8)
                .reviewCount(180)
                .status("ACTIVE")
                .featured(true)
                .build());

        productRepository.save(Product.builder()
                .sku("SKU-CHAIR-ERGO-X")
                .name("ErgoPulse Pro Herman-Style Desk Chair")
                .slug("ergopulse-pro-desk-chair")
                .description("Ergonomic high-back breathable mesh chair with 4D armrests, dynamic lumbar support, tilt limiter and aluminum wheelbase.")
                .price(new BigDecimal("599.00"))
                .discountPrice(new BigDecimal("499.00"))
                .categoryId(home.getId())
                .categoryName(home.getName())
                .brand("ShopSphere Living")
                .images(List.of(
                        "https://images.unsplash.com/photo-1580481077197-2a54b391789c?w=800&q=80"
                ))
                .stock(30)
                .rating(4.9)
                .reviewCount(42)
                .status("ACTIVE")
                .featured(false)
                .build());

        log.info("Product catalog seed completed successfully!");
    }
}
