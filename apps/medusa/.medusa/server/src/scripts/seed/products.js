"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedProducts = void 0;
const utils_1 = require("@medusajs/utils");
const buildBaseProductData = ({ sales_channels, sku, prices: { usd, cad }, }) => ({
    options: [
        {
            title: 'Grind',
            values: ['Whole Bean', 'Ground'],
        },
        {
            title: 'Size',
            values: ['16oz'],
        },
    ],
    sales_channels: sales_channels.map(({ id }) => ({
        id,
    })),
    variants: [
        {
            title: 'Whole Bean',
            sku: `${sku}-WHOLE-BEAN`,
            options: {
                Grind: 'Whole Bean',
                Size: '16oz',
            },
            manage_inventory: false,
            prices: [
                {
                    amount: cad,
                    currency_code: 'cad',
                },
                {
                    amount: usd,
                    currency_code: 'usd',
                },
            ],
        },
        {
            title: 'Ground',
            sku: `${sku}-GROUND`,
            options: {
                Grind: 'Ground',
                Size: '16oz',
            },
            manage_inventory: false,
            prices: [
                {
                    amount: cad,
                    currency_code: 'cad',
                },
                {
                    amount: usd,
                    currency_code: 'usd',
                },
            ],
        },
    ],
});
const seedProducts = ({ collections, tags, sales_channels, categories, shipping_profile_id, }) => [
    {
        title: 'Barrio Blend - Medium Roast',
        description: 'Dive into the rich tapestry of flavors with our Barrio Blend, a masterful medium-dark roast that harmonizes a symphony of taste. Each sip reveals layers of complexity, with a gentle sweetness that dances on the palate, making it an exquisite choice for those who cherish a well-rounded coffee experience.',
        handle: 'barrio-blend-medium-roast',
        status: utils_1.ProductStatus.PUBLISHED,
        category_ids: categories.filter(({ name }) => name === 'Blends').map(({ id }) => id),
        tag_ids: tags.filter((t) => ['Best Seller', 'Latin America', 'Africa'].includes(t.value)).map((t) => t.id),
        thumbnail: 'https://lambdacurrysites.s3.us-east-1.amazonaws.com/barrio/Barrio-Blend.jpg',
        collection_id: collections.find(({ title }) => title === 'Medium Roasts')?.id,
        shipping_profile_id,
        images: [
            {
                url: 'https://lambdacurrysites.s3.us-east-1.amazonaws.com/barrio/Barrio-Blend.jpg',
            },
        ],
        ...buildBaseProductData({
            sales_channels,
            sku: 'BARRIO-BLEND',
            prices: {
                usd: 18.0,
                cad: 24.0,
            },
        }),
    },
    {
        title: 'Midnight Dark - Dark Roast',
        description: 'Awaken your senses with the Midnight Dark blend, a bold and luxurious dark roast that captivates with its deep, intense flavors. This coffee is a testament to meticulous roasting, offering a velvety texture and a lingering sweetness that envelops the palate, perfect for those who savor a robust and full-bodied cup.',
        handle: 'midnight-dark-roast',
        status: utils_1.ProductStatus.PUBLISHED,
        collection_id: collections.find(({ title }) => title === 'Dark Roasts')?.id,
        category_ids: categories.filter(({ name }) => name === 'Blends').map(({ id }) => id),
        tag_ids: tags.filter((t) => ['Brazil'].includes(t.value)).map((t) => t.id),
        thumbnail: 'https://lambdacurrysites.s3.us-east-1.amazonaws.com/barrio/Midnight-Dark-Roast.jpg',
        shipping_profile_id,
        images: [
            {
                url: 'https://lambdacurrysites.s3.us-east-1.amazonaws.com/barrio/Midnight-Dark-Roast.jpg',
            },
        ],
        ...buildBaseProductData({
            sales_channels,
            sku: 'MIDNIGHT-DARK',
            prices: {
                usd: 20.0,
                cad: 27.0,
            },
        }),
    },
    {
        title: 'Sunrise Single-Origin - Light Roast',
        description: 'Embrace the dawn with our Sunrise Single-Origin, a light roast that celebrates the unique terroir of its beans. This coffee is a vibrant expression of bright, floral notes and a subtle sweetness, offering a refreshing and invigorating experience that is ideal for starting your day or enjoying a serene afternoon.',
        handle: 'sunrise-single-origin-light-roast',
        status: utils_1.ProductStatus.PUBLISHED,
        collection_id: collections.find(({ title }) => title === 'Light Roasts')?.id,
        category_ids: categories.filter(({ name }) => name === 'Single Origin').map(({ id }) => id),
        tag_ids: tags.filter((t) => ['Best Seller', 'Ethiopia'].includes(t.value)).map((t) => t.id),
        thumbnail: 'https://lambdacurrysites.s3.us-east-1.amazonaws.com/barrio/Sunrise-Single.jpg',
        shipping_profile_id,
        images: [
            {
                url: 'https://lambdacurrysites.s3.us-east-1.amazonaws.com/barrio/Sunrise-Single.jpg',
            },
        ],
        ...buildBaseProductData({
            sales_channels,
            sku: 'SUNRISE-SINGLE',
            prices: {
                usd: 22.0,
                cad: 29.0,
            },
        }),
    },
    {
        title: 'Barrio Decaf - Medium Roast',
        description: 'Uncover the smooth elegance of our Barrio Decaf, a medium roast crafted for those who desire the rich essence of coffee without the caffeine. This blend is a delicate balance of flavors, with a hint of sweetness that provides a satisfying and delightful experience, any time of the day or night.',
        handle: 'barrio-decaf-medium-roast',
        collection_id: collections.find(({ title }) => title === 'Medium Roasts')?.id,
        category_ids: categories.filter(({ name }) => name === 'Blends').map(({ id }) => id),
        status: utils_1.ProductStatus.PUBLISHED,
        tag_ids: tags.filter((t) => ['Colombia'].includes(t.value)).map((t) => t.id),
        thumbnail: 'https://lambdacurrysites.s3.us-east-1.amazonaws.com/barrio/Barrio-Decaf.jpg',
        shipping_profile_id,
        images: [
            {
                url: 'https://lambdacurrysites.s3.us-east-1.amazonaws.com/barrio/Barrio-Decaf.jpg',
            },
        ],
        ...buildBaseProductData({
            sales_channels,
            sku: 'BARRIO-DECAF',
            prices: {
                usd: 20.0,
                cad: 27.0,
            },
        }),
    },
    {
        title: 'Coconut Mocha Delight - Medium Roast',
        description: 'Escape to a tropical paradise with our Coconut Mocha Delight, a medium roast that marries the rich, robust flavors of coffee with the exotic allure of coconut and a whisper of chocolate. This enchanting blend is a journey of taste, perfect for those seeking a unique and indulgent coffee experience.',
        handle: 'coconut-mocha-delight-medium-roast',
        collection_id: collections.find(({ title }) => title === 'Medium Roasts')?.id,
        category_ids: categories.filter(({ name }) => name === 'Blends').map(({ id }) => id),
        status: utils_1.ProductStatus.PUBLISHED,
        tag_ids: tags.filter((t) => ['Colombia'].includes(t.value)).map((t) => t.id),
        thumbnail: 'https://lambdacurrysites.s3.us-east-1.amazonaws.com/barrio/Coconut-Mocha.jpg',
        shipping_profile_id,
        images: [
            {
                url: 'https://lambdacurrysites.s3.us-east-1.amazonaws.com/barrio/Coconut-Mocha.jpg',
            },
        ],
        ...buildBaseProductData({
            sales_channels,
            sku: 'COCONUT-MOCHA',
            prices: {
                usd: 22.0,
                cad: 29.0,
            },
        }),
    },
    {
        title: 'Chili Choco Spice - Dark Roast',
        description: 'Embark on a daring flavor journey with our Chili Choco Spice, a dark roast that boldly combines the fiery warmth of chili with the decadent richness of chocolate. This adventurous blend is a thrilling experience for the palate, offering a spicy-sweet symphony that is both exciting and deeply satisfying.',
        handle: 'chili-choco-spice-dark-roast',
        collection_id: collections.find(({ title }) => title === 'Dark Roasts')?.id,
        category_ids: categories.filter(({ name }) => name === 'Blends').map(({ id }) => id),
        status: utils_1.ProductStatus.PUBLISHED,
        tag_ids: tags.filter((t) => ['Guatemala'].includes(t.value)).map((t) => t.id),
        thumbnail: 'https://lambdacurrysites.s3.us-east-1.amazonaws.com/barrio/Chili-Choco.jpg',
        shipping_profile_id,
        images: [
            {
                url: 'https://lambdacurrysites.s3.us-east-1.amazonaws.com/barrio/Chili-Choco.jpg',
            },
        ],
        ...buildBaseProductData({
            sales_channels,
            sku: 'CHILI-CHOCO',
            prices: {
                usd: 24.0,
                cad: 31.0,
            },
        }),
    },
    {
        title: 'Cardamom Spiced Roast - Dark Roast',
        description: 'Transport yourself to distant lands with our Cardamom Spiced Roast, a dark blend infused with the exotic and aromatic essence of cardamom. This luxurious coffee offers a rich and captivating taste experience, enveloping you in a world of flavor that is both intriguing and comforting.',
        handle: 'cardamom-spiced-roast-dark-blend',
        collection_id: collections.find(({ title }) => title === 'Dark Roasts')?.id,
        category_ids: categories.filter(({ name }) => name === 'Blends').map(({ id }) => id),
        status: utils_1.ProductStatus.PUBLISHED,
        tag_ids: tags.filter((t) => ['Yemen'].includes(t.value)).map((t) => t.id),
        thumbnail: 'https://lambdacurrysites.s3.us-east-1.amazonaws.com/barrio/Cardamom-Spice.jpg',
        shipping_profile_id,
        images: [
            {
                url: 'https://lambdacurrysites.s3.us-east-1.amazonaws.com/barrio/Cardamom-Spice.jpg',
            },
        ],
        ...buildBaseProductData({
            sales_channels,
            sku: 'CARDAMOM-SPICE',
            prices: {
                usd: 25.0,
                cad: 32.0,
            },
        }),
    },
    {
        title: 'Twilight Peak - Dark Roast',
        description: 'Discover the majestic flavors of our Twilight Peak, a dark roast sourced from the pristine highlands of Peru. This coffee is a celebration of bold, smooth flavors with a refined finish, offering a rich and satisfying experience that is perfect for those who appreciate a well-crafted cup.',
        handle: 'twilight-peak-dark-roast',
        collection_id: collections.find(({ title }) => title === 'Dark Roasts')?.id,
        category_ids: categories.filter(({ name }) => name === 'Blends').map(({ id }) => id),
        status: utils_1.ProductStatus.PUBLISHED,
        tag_ids: tags.filter((t) => ['Peru'].includes(t.value)).map((t) => t.id),
        thumbnail: 'https://lambdacurrysites.s3.us-east-1.amazonaws.com/barrio/Twilight-Peak.jpg',
        shipping_profile_id,
        images: [
            {
                url: 'https://lambdacurrysites.s3.us-east-1.amazonaws.com/barrio/Twilight-Peak.jpg',
            },
        ],
        ...buildBaseProductData({
            sales_channels,
            sku: 'TWILIGHT-PEAK',
            prices: {
                usd: 26.0,
                cad: 33.0,
            },
        }),
    },
];
exports.seedProducts = seedProducts;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZHVjdHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvc2NyaXB0cy9zZWVkL3Byb2R1Y3RzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLDJDQUFnRDtBQUVoRCxNQUFNLG9CQUFvQixHQUFHLENBQUMsRUFDNUIsY0FBYyxFQUNkLEdBQUcsRUFDSCxNQUFNLEVBQUUsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBUXJCLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDTCxPQUFPLEVBQUU7UUFDUDtZQUNFLEtBQUssRUFBRSxPQUFPO1lBQ2QsTUFBTSxFQUFFLENBQUMsWUFBWSxFQUFFLFFBQVEsQ0FBQztTQUNqQztRQUNEO1lBQ0UsS0FBSyxFQUFFLE1BQU07WUFDYixNQUFNLEVBQUUsQ0FBQyxNQUFNLENBQUM7U0FDakI7S0FDRjtJQUNELGNBQWMsRUFBRSxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUM5QyxFQUFFO0tBQ0gsQ0FBQyxDQUFDO0lBQ0gsUUFBUSxFQUFFO1FBQ1I7WUFDRSxLQUFLLEVBQUUsWUFBWTtZQUNuQixHQUFHLEVBQUUsR0FBRyxHQUFHLGFBQWE7WUFDeEIsT0FBTyxFQUFFO2dCQUNQLEtBQUssRUFBRSxZQUFZO2dCQUNuQixJQUFJLEVBQUUsTUFBTTthQUNiO1lBQ0QsZ0JBQWdCLEVBQUUsS0FBSztZQUN2QixNQUFNLEVBQUU7Z0JBQ047b0JBQ0UsTUFBTSxFQUFFLEdBQUc7b0JBQ1gsYUFBYSxFQUFFLEtBQUs7aUJBQ3JCO2dCQUNEO29CQUNFLE1BQU0sRUFBRSxHQUFHO29CQUNYLGFBQWEsRUFBRSxLQUFLO2lCQUNyQjthQUNGO1NBQ0Y7UUFDRDtZQUNFLEtBQUssRUFBRSxRQUFRO1lBQ2YsR0FBRyxFQUFFLEdBQUcsR0FBRyxTQUFTO1lBQ3BCLE9BQU8sRUFBRTtnQkFDUCxLQUFLLEVBQUUsUUFBUTtnQkFDZixJQUFJLEVBQUUsTUFBTTthQUNiO1lBQ0QsZ0JBQWdCLEVBQUUsS0FBSztZQUN2QixNQUFNLEVBQUU7Z0JBQ047b0JBQ0UsTUFBTSxFQUFFLEdBQUc7b0JBQ1gsYUFBYSxFQUFFLEtBQUs7aUJBQ3JCO2dCQUNEO29CQUNFLE1BQU0sRUFBRSxHQUFHO29CQUNYLGFBQWEsRUFBRSxLQUFLO2lCQUNyQjthQUNGO1NBQ0Y7S0FDRjtDQUNGLENBQUMsQ0FBQztBQUVJLE1BQU0sWUFBWSxHQUFHLENBQUMsRUFDM0IsV0FBVyxFQUNYLElBQUksRUFDSixjQUFjLEVBQ2QsVUFBVSxFQUNWLG1CQUFtQixHQU9wQixFQUFtQyxFQUFFLENBQUM7SUFDckM7UUFDRSxLQUFLLEVBQUUsNkJBQTZCO1FBQ3BDLFdBQVcsRUFDVCxrVEFBa1Q7UUFDcFQsTUFBTSxFQUFFLDJCQUEyQjtRQUNuQyxNQUFNLEVBQUUscUJBQWEsQ0FBQyxTQUFTO1FBQy9CLFlBQVksRUFBRSxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLENBQUMsSUFBSSxLQUFLLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQztRQUNwRixPQUFPLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxhQUFhLEVBQUUsZUFBZSxFQUFFLFFBQVEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFDMUcsU0FBUyxFQUFFLDZFQUE2RTtRQUN4RixhQUFhLEVBQUUsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxDQUFDLEtBQUssS0FBSyxlQUFlLENBQUMsRUFBRSxFQUFFO1FBQzdFLG1CQUFtQjtRQUNuQixNQUFNLEVBQUU7WUFDTjtnQkFDRSxHQUFHLEVBQUUsNkVBQTZFO2FBQ25GO1NBQ0Y7UUFDRCxHQUFHLG9CQUFvQixDQUFDO1lBQ3RCLGNBQWM7WUFDZCxHQUFHLEVBQUUsY0FBYztZQUNuQixNQUFNLEVBQUU7Z0JBQ04sR0FBRyxFQUFFLElBQUk7Z0JBQ1QsR0FBRyxFQUFFLElBQUk7YUFDVjtTQUNGLENBQUM7S0FDSDtJQUNEO1FBQ0UsS0FBSyxFQUFFLDRCQUE0QjtRQUNuQyxXQUFXLEVBQ1QsOFRBQThUO1FBQ2hVLE1BQU0sRUFBRSxxQkFBcUI7UUFDN0IsTUFBTSxFQUFFLHFCQUFhLENBQUMsU0FBUztRQUMvQixhQUFhLEVBQUUsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxDQUFDLEtBQUssS0FBSyxhQUFhLENBQUMsRUFBRSxFQUFFO1FBQzNFLFlBQVksRUFBRSxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLENBQUMsSUFBSSxLQUFLLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQztRQUNwRixPQUFPLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1FBQzFFLFNBQVMsRUFBRSxvRkFBb0Y7UUFDL0YsbUJBQW1CO1FBQ25CLE1BQU0sRUFBRTtZQUNOO2dCQUNFLEdBQUcsRUFBRSxvRkFBb0Y7YUFDMUY7U0FDRjtRQUNELEdBQUcsb0JBQW9CLENBQUM7WUFDdEIsY0FBYztZQUNkLEdBQUcsRUFBRSxlQUFlO1lBQ3BCLE1BQU0sRUFBRTtnQkFDTixHQUFHLEVBQUUsSUFBSTtnQkFDVCxHQUFHLEVBQUUsSUFBSTthQUNWO1NBQ0YsQ0FBQztLQUNIO0lBQ0Q7UUFDRSxLQUFLLEVBQUUscUNBQXFDO1FBQzVDLFdBQVcsRUFDVCwyVEFBMlQ7UUFDN1QsTUFBTSxFQUFFLG1DQUFtQztRQUMzQyxNQUFNLEVBQUUscUJBQWEsQ0FBQyxTQUFTO1FBQy9CLGFBQWEsRUFBRSxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLENBQUMsS0FBSyxLQUFLLGNBQWMsQ0FBQyxFQUFFLEVBQUU7UUFDNUUsWUFBWSxFQUFFLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsQ0FBQyxJQUFJLEtBQUssZUFBZSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDO1FBQzNGLE9BQU8sRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLGFBQWEsRUFBRSxVQUFVLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1FBQzNGLFNBQVMsRUFBRSwrRUFBK0U7UUFDMUYsbUJBQW1CO1FBQ25CLE1BQU0sRUFBRTtZQUNOO2dCQUNFLEdBQUcsRUFBRSwrRUFBK0U7YUFDckY7U0FDRjtRQUNELEdBQUcsb0JBQW9CLENBQUM7WUFDdEIsY0FBYztZQUNkLEdBQUcsRUFBRSxnQkFBZ0I7WUFDckIsTUFBTSxFQUFFO2dCQUNOLEdBQUcsRUFBRSxJQUFJO2dCQUNULEdBQUcsRUFBRSxJQUFJO2FBQ1Y7U0FDRixDQUFDO0tBQ0g7SUFDRDtRQUNFLEtBQUssRUFBRSw2QkFBNkI7UUFDcEMsV0FBVyxFQUNULHlTQUF5UztRQUMzUyxNQUFNLEVBQUUsMkJBQTJCO1FBQ25DLGFBQWEsRUFBRSxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLENBQUMsS0FBSyxLQUFLLGVBQWUsQ0FBQyxFQUFFLEVBQUU7UUFDN0UsWUFBWSxFQUFFLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsQ0FBQyxJQUFJLEtBQUssUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDO1FBQ3BGLE1BQU0sRUFBRSxxQkFBYSxDQUFDLFNBQVM7UUFDL0IsT0FBTyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUM1RSxTQUFTLEVBQUUsNkVBQTZFO1FBQ3hGLG1CQUFtQjtRQUNuQixNQUFNLEVBQUU7WUFDTjtnQkFDRSxHQUFHLEVBQUUsNkVBQTZFO2FBQ25GO1NBQ0Y7UUFDRCxHQUFHLG9CQUFvQixDQUFDO1lBQ3RCLGNBQWM7WUFDZCxHQUFHLEVBQUUsY0FBYztZQUNuQixNQUFNLEVBQUU7Z0JBQ04sR0FBRyxFQUFFLElBQUk7Z0JBQ1QsR0FBRyxFQUFFLElBQUk7YUFDVjtTQUNGLENBQUM7S0FDSDtJQUNEO1FBQ0UsS0FBSyxFQUFFLHNDQUFzQztRQUM3QyxXQUFXLEVBQ1QsNlNBQTZTO1FBQy9TLE1BQU0sRUFBRSxvQ0FBb0M7UUFDNUMsYUFBYSxFQUFFLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsQ0FBQyxLQUFLLEtBQUssZUFBZSxDQUFDLEVBQUUsRUFBRTtRQUM3RSxZQUFZLEVBQUUsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxDQUFDLElBQUksS0FBSyxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUM7UUFDcEYsTUFBTSxFQUFFLHFCQUFhLENBQUMsU0FBUztRQUMvQixPQUFPLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1FBQzVFLFNBQVMsRUFBRSw4RUFBOEU7UUFDekYsbUJBQW1CO1FBQ25CLE1BQU0sRUFBRTtZQUNOO2dCQUNFLEdBQUcsRUFBRSw4RUFBOEU7YUFDcEY7U0FDRjtRQUNELEdBQUcsb0JBQW9CLENBQUM7WUFDdEIsY0FBYztZQUNkLEdBQUcsRUFBRSxlQUFlO1lBQ3BCLE1BQU0sRUFBRTtnQkFDTixHQUFHLEVBQUUsSUFBSTtnQkFDVCxHQUFHLEVBQUUsSUFBSTthQUNWO1NBQ0YsQ0FBQztLQUNIO0lBRUQ7UUFDRSxLQUFLLEVBQUUsZ0NBQWdDO1FBQ3ZDLFdBQVcsRUFDVCxrVEFBa1Q7UUFDcFQsTUFBTSxFQUFFLDhCQUE4QjtRQUN0QyxhQUFhLEVBQUUsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxDQUFDLEtBQUssS0FBSyxhQUFhLENBQUMsRUFBRSxFQUFFO1FBQzNFLFlBQVksRUFBRSxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLENBQUMsSUFBSSxLQUFLLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQztRQUNwRixNQUFNLEVBQUUscUJBQWEsQ0FBQyxTQUFTO1FBQy9CLE9BQU8sRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFDN0UsU0FBUyxFQUFFLDRFQUE0RTtRQUN2RixtQkFBbUI7UUFDbkIsTUFBTSxFQUFFO1lBQ047Z0JBQ0UsR0FBRyxFQUFFLDRFQUE0RTthQUNsRjtTQUNGO1FBQ0QsR0FBRyxvQkFBb0IsQ0FBQztZQUN0QixjQUFjO1lBQ2QsR0FBRyxFQUFFLGFBQWE7WUFDbEIsTUFBTSxFQUFFO2dCQUNOLEdBQUcsRUFBRSxJQUFJO2dCQUNULEdBQUcsRUFBRSxJQUFJO2FBQ1Y7U0FDRixDQUFDO0tBQ0g7SUFFRDtRQUNFLEtBQUssRUFBRSxvQ0FBb0M7UUFDM0MsV0FBVyxFQUNULDhSQUE4UjtRQUNoUyxNQUFNLEVBQUUsa0NBQWtDO1FBQzFDLGFBQWEsRUFBRSxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLENBQUMsS0FBSyxLQUFLLGFBQWEsQ0FBQyxFQUFFLEVBQUU7UUFDM0UsWUFBWSxFQUFFLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsQ0FBQyxJQUFJLEtBQUssUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDO1FBQ3BGLE1BQU0sRUFBRSxxQkFBYSxDQUFDLFNBQVM7UUFDL0IsT0FBTyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUN6RSxTQUFTLEVBQUUsK0VBQStFO1FBQzFGLG1CQUFtQjtRQUNuQixNQUFNLEVBQUU7WUFDTjtnQkFDRSxHQUFHLEVBQUUsK0VBQStFO2FBQ3JGO1NBQ0Y7UUFDRCxHQUFHLG9CQUFvQixDQUFDO1lBQ3RCLGNBQWM7WUFDZCxHQUFHLEVBQUUsZ0JBQWdCO1lBQ3JCLE1BQU0sRUFBRTtnQkFDTixHQUFHLEVBQUUsSUFBSTtnQkFDVCxHQUFHLEVBQUUsSUFBSTthQUNWO1NBQ0YsQ0FBQztLQUNIO0lBRUQ7UUFDRSxLQUFLLEVBQUUsNEJBQTRCO1FBQ25DLFdBQVcsRUFDVCxrU0FBa1M7UUFDcFMsTUFBTSxFQUFFLDBCQUEwQjtRQUNsQyxhQUFhLEVBQUUsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxDQUFDLEtBQUssS0FBSyxhQUFhLENBQUMsRUFBRSxFQUFFO1FBQzNFLFlBQVksRUFBRSxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLENBQUMsSUFBSSxLQUFLLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQztRQUNwRixNQUFNLEVBQUUscUJBQWEsQ0FBQyxTQUFTO1FBQy9CLE9BQU8sRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFDeEUsU0FBUyxFQUFFLDhFQUE4RTtRQUN6RixtQkFBbUI7UUFDbkIsTUFBTSxFQUFFO1lBQ047Z0JBQ0UsR0FBRyxFQUFFLDhFQUE4RTthQUNwRjtTQUNGO1FBQ0QsR0FBRyxvQkFBb0IsQ0FBQztZQUN0QixjQUFjO1lBQ2QsR0FBRyxFQUFFLGVBQWU7WUFDcEIsTUFBTSxFQUFFO2dCQUNOLEdBQUcsRUFBRSxJQUFJO2dCQUNULEdBQUcsRUFBRSxJQUFJO2FBQ1Y7U0FDRixDQUFDO0tBQ0g7Q0FDRixDQUFDO0FBeE5XLFFBQUEsWUFBWSxnQkF3TnZCIn0=