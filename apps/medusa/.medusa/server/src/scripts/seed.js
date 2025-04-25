"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = seedDemoData;
const core_flows_1 = require("@medusajs/core-flows");
const utils_1 = require("@medusajs/framework/utils");
const core_flows_2 = require("@medusajs/medusa/core-flows");
const products_1 = require("./seed/products");
const create_product_reviews_1 = require("@lambdacurry/medusa-product-reviews/workflows/create-product-reviews");
const reviews_1 = require("./seed/reviews");
const create_product_review_responses_1 = require("@lambdacurry/medusa-product-reviews/workflows/create-product-review-responses");
async function seedDemoData({ container }) {
    const logger = container.resolve(utils_1.ContainerRegistrationKeys.LOGGER);
    const remoteLink = container.resolve(utils_1.ContainerRegistrationKeys.LINK);
    const fulfillmentModuleService = container.resolve(utils_1.Modules.FULFILLMENT);
    const salesChannelModuleService = container.resolve(utils_1.Modules.SALES_CHANNEL);
    const storeModuleService = container.resolve(utils_1.Modules.STORE);
    const paymentModuleService = container.resolve(utils_1.Modules.PAYMENT);
    const canadianCountries = ['ca'];
    const americanCountries = ['us'];
    const allCountries = [...canadianCountries, ...americanCountries];
    logger.info('Seeding store data...');
    const [store] = await storeModuleService.listStores();
    let defaultSalesChannel = await salesChannelModuleService.listSalesChannels({
        name: 'Default Sales Channel',
    });
    if (!defaultSalesChannel.length) {
        // create the default sales channel
        const { result: salesChannelResult } = await (0, core_flows_1.createSalesChannelsWorkflow)(container).run({
            input: {
                salesChannelsData: [
                    {
                        name: 'Default Sales Channel',
                    },
                ],
            },
        });
        defaultSalesChannel = salesChannelResult;
    }
    await (0, core_flows_1.updateStoresWorkflow)(container).run({
        input: {
            selector: { id: store.id },
            update: {
                supported_currencies: [
                    {
                        currency_code: 'usd',
                        is_default: true,
                    },
                    {
                        currency_code: 'cad',
                    },
                ],
                default_sales_channel_id: defaultSalesChannel[0].id,
            },
        },
    });
    logger.info('Seeding region data...');
    const { result: regionResult } = await (0, core_flows_1.createRegionsWorkflow)(container).run({
        input: {
            regions: [
                {
                    name: 'United States',
                    currency_code: 'usd',
                    countries: americanCountries,
                    payment_providers: ['pp_stripe_stripe'],
                },
                {
                    name: 'Canada',
                    currency_code: 'cad',
                    countries: canadianCountries,
                    payment_providers: ['pp_stripe_stripe'],
                },
            ],
        },
    });
    const usRegion = regionResult[0];
    const caRegion = regionResult[1];
    logger.info('Finished seeding regions.');
    logger.info('Seeding tax regions...');
    await (0, core_flows_1.createTaxRegionsWorkflow)(container).run({
        input: allCountries.map((country_code) => ({
            country_code,
        })),
    });
    logger.info('Finished seeding tax regions.');
    logger.info('Seeding stock location data...');
    const { result: stockLocationResult } = await (0, core_flows_1.createStockLocationsWorkflow)(container).run({
        input: {
            locations: [
                {
                    name: 'South Lamar Location',
                    address: {
                        city: 'Austin',
                        country_code: 'US',
                        province: 'TX',
                        address_1: '1200 S Lamar Blvd',
                        postal_code: '78704',
                    },
                },
            ],
        },
    });
    // const europeanStockLocation = stockLocationResult[0];
    const americanStockLocation = stockLocationResult[0];
    await remoteLink.create([
        {
            [utils_1.Modules.STOCK_LOCATION]: {
                stock_location_id: americanStockLocation.id,
            },
            [utils_1.Modules.FULFILLMENT]: {
                fulfillment_provider_id: 'manual_manual',
            },
        },
    ]);
    logger.info('Seeding fulfillment data...');
    const { result: shippingProfileResult } = await (0, core_flows_1.createShippingProfilesWorkflow)(container).run({
        input: {
            data: [
                {
                    name: 'Default',
                    type: 'default',
                },
            ],
        },
    });
    const shippingProfile = shippingProfileResult[0];
    const northAmericanFulfillmentSet = await fulfillmentModuleService.createFulfillmentSets({
        name: 'North American delivery',
        type: 'shipping',
        service_zones: [
            {
                name: 'United States',
                geo_zones: [
                    {
                        country_code: 'us',
                        type: 'country',
                    },
                ],
            },
            {
                name: 'Canada',
                geo_zones: [
                    {
                        country_code: 'ca',
                        type: 'country',
                    },
                ],
            },
        ],
    });
    await remoteLink.create({
        [utils_1.Modules.STOCK_LOCATION]: {
            stock_location_id: americanStockLocation.id,
        },
        [utils_1.Modules.FULFILLMENT]: {
            fulfillment_set_id: northAmericanFulfillmentSet.id,
        },
    });
    const { result: collectionsResult } = await (0, core_flows_2.createCollectionsWorkflow)(container).run({
        input: {
            collections: [
                {
                    title: 'Light Roasts',
                    handle: 'light-roasts',
                },
                {
                    title: 'Medium Roasts',
                    handle: 'medium-roasts',
                },
                {
                    title: 'Dark Roasts',
                    handle: 'dark-roasts',
                },
            ],
        },
    });
    await (0, core_flows_1.createShippingOptionsWorkflow)(container).run({
        input: [
            {
                name: 'Standard Shipping',
                price_type: 'flat',
                provider_id: 'manual_manual',
                service_zone_id: northAmericanFulfillmentSet.service_zones[0].id,
                shipping_profile_id: shippingProfile.id,
                type: {
                    label: 'Standard',
                    description: 'Ship in 2-3 days.',
                    code: 'standard',
                },
                prices: [
                    {
                        currency_code: 'usd',
                        amount: 5,
                    },
                    {
                        currency_code: 'cad',
                        amount: 5,
                    },
                    {
                        region_id: usRegion.id,
                        amount: 5,
                    },
                    {
                        region_id: caRegion.id,
                        amount: 5,
                    },
                ],
                rules: [
                    {
                        attribute: 'enabled_in_store',
                        value: 'true',
                        operator: 'eq',
                    },
                    {
                        attribute: 'is_return',
                        value: 'false',
                        operator: 'eq',
                    },
                ],
            },
            {
                name: 'Express Shipping',
                price_type: 'flat',
                provider_id: 'manual_manual',
                service_zone_id: northAmericanFulfillmentSet.service_zones[0].id,
                shipping_profile_id: shippingProfile.id,
                type: {
                    label: 'Express',
                    description: 'Ship in 24 hours.',
                    code: 'express',
                },
                prices: [
                    {
                        currency_code: 'usd',
                        amount: 10,
                    },
                    {
                        currency_code: 'cad',
                        amount: 10,
                    },
                    {
                        region_id: usRegion.id,
                        amount: 10,
                    },
                    {
                        region_id: caRegion.id,
                        amount: 10,
                    },
                ],
                rules: [
                    {
                        attribute: 'enabled_in_store',
                        value: 'true',
                        operator: 'eq',
                    },
                    {
                        attribute: 'is_return',
                        value: 'false',
                        operator: 'eq',
                    },
                ],
            },
        ],
    });
    logger.info('Finished seeding fulfillment data.');
    await (0, core_flows_1.linkSalesChannelsToStockLocationWorkflow)(container).run({
        input: {
            id: americanStockLocation.id,
            add: [defaultSalesChannel[0].id],
        },
    });
    logger.info('Finished seeding stock location data.');
    logger.info('Seeding publishable API key data...');
    const { result: publishableApiKeyResult } = await (0, core_flows_1.createApiKeysWorkflow)(container).run({
        input: {
            api_keys: [
                {
                    title: 'Storefront',
                    type: 'publishable',
                    created_by: '',
                },
            ],
        },
    });
    const publishableApiKey = publishableApiKeyResult[0];
    await (0, core_flows_1.linkSalesChannelsToApiKeyWorkflow)(container).run({
        input: {
            id: publishableApiKey.id,
            add: [defaultSalesChannel[0].id],
        },
    });
    logger.info('Finished seeding publishable API key data.');
    logger.info('Seeding product data...');
    const { result: categoryResult } = await (0, core_flows_1.createProductCategoriesWorkflow)(container).run({
        input: {
            product_categories: [
                {
                    name: 'Blends',
                    is_active: true,
                },
                {
                    name: 'Single Origin',
                    is_active: true,
                },
            ],
        },
    });
    const { result: productTagsResult } = await (0, core_flows_1.createProductTagsWorkflow)(container).run({
        input: {
            product_tags: [
                {
                    value: 'Ethiopia',
                },
                {
                    value: 'Colombia',
                },
                {
                    value: 'Best Sellers',
                },
                {
                    value: 'Brazil',
                },
                {
                    value: 'Africa',
                },
                {
                    value: 'Latin America',
                },
            ],
        },
    });
    const { result: productResult } = await (0, core_flows_1.createProductsWorkflow)(container).run({
        input: {
            products: (0, products_1.seedProducts)({
                collections: collectionsResult,
                tags: productTagsResult,
                categories: categoryResult,
                sales_channels: [{ id: defaultSalesChannel[0].id }],
                shipping_profile_id: shippingProfile.id,
            }),
        },
    });
    for (const product of productResult) {
        const firstVariant = product.variants[0];
        // Determine a random number of reviews between 5 and 10 for this product
        const numReviews = Math.floor(Math.random() * 6) + 5; // Random number between 5 and 10
        // Shuffle the customers array to get random customers for each product
        const shuffledCustomers = [...reviews_1.texasCustomers].sort(() => 0.5 - Math.random());
        const selectedCustomers = shuffledCustomers.slice(0, numReviews);
        // Shuffle the review contents to get random reviews
        const shuffledReviews = [...reviews_1.reviewContents].sort(() => 0.5 - Math.random());
        const selectedReviews = shuffledReviews.slice(0, numReviews);
        // Create multiple orders for each product with different customers
        const orders = [];
        for (const customer of selectedCustomers) {
            const { result: order } = await (0, core_flows_1.createOrderWorkflow)(container).run({
                input: {
                    email: customer.email,
                    shipping_address: {
                        first_name: customer.first_name,
                        last_name: customer.last_name,
                        phone: customer.phone,
                        city: customer.city,
                        country_code: 'US',
                        province: 'TX',
                        address_1: customer.address_1,
                        postal_code: customer.postal_code,
                    },
                    items: [
                        {
                            variant_id: firstVariant.id,
                            product_id: product.id,
                            quantity: 1,
                            title: product.title,
                            thumbnail: product.thumbnail ?? undefined,
                            unit_price: 18.0,
                        },
                    ],
                    transactions: [
                        {
                            amount: 18.0,
                            currency_code: 'usd',
                        },
                    ],
                    region_id: usRegion.id,
                    sales_channel_id: defaultSalesChannel[0].id,
                },
            });
            orders.push(order);
        }
        // Create product reviews for each order
        const productReviews = [];
        for (let i = 0; i < orders.length; i++) {
            const order = orders[i];
            const customer = selectedCustomers[i];
            const review = selectedReviews[i];
            productReviews.push({
                product_id: product.id,
                order_id: order.id,
                order_line_item_id: order.items?.[0]?.id,
                rating: review.rating,
                content: review.content,
                first_name: customer.first_name,
                name: `${customer.first_name} ${customer.last_name}`,
                email: customer.email,
                images: review.images,
            });
        }
        const { result: productReviewsResult } = await (0, create_product_reviews_1.createProductReviewsWorkflow)(container).run({
            input: {
                productReviews: productReviews,
            },
        });
        await (0, create_product_review_responses_1.createProductReviewResponsesWorkflow)(container).run({
            input: {
                responses: productReviewsResult.map((review) => ({
                    product_review_id: review.id,
                    content: (0, reviews_1.generateReviewResponse)(review),
                })),
            },
        });
    }
    logger.info('Finished seeding product data.');
    logger.info(`PUBLISHABLE API KEY: ${publishableApiKey.token}`);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9zY3JpcHRzL3NlZWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUE4QkEsK0JBcWNDO0FBbmVELHFEQWU4QjtBQUU5QixxREFBK0U7QUFDL0UsNERBQXdFO0FBT3hFLDhDQUErQztBQUMvQyxpSEFBb0g7QUFDcEgsNENBQXdGO0FBQ3hGLG1JQUFxSTtBQUV0SCxLQUFLLFVBQVUsWUFBWSxDQUFDLEVBQUUsU0FBUyxFQUFZO0lBQ2hFLE1BQU0sTUFBTSxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsaUNBQXlCLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDbkUsTUFBTSxVQUFVLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxpQ0FBeUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNyRSxNQUFNLHdCQUF3QixHQUE4QixTQUFTLENBQUMsT0FBTyxDQUFDLGVBQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUNuRyxNQUFNLHlCQUF5QixHQUErQixTQUFTLENBQUMsT0FBTyxDQUFDLGVBQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUN2RyxNQUFNLGtCQUFrQixHQUF3QixTQUFTLENBQUMsT0FBTyxDQUFDLGVBQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUVqRixNQUFNLG9CQUFvQixHQUEwQixTQUFTLENBQUMsT0FBTyxDQUFDLGVBQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUV2RixNQUFNLGlCQUFpQixHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDakMsTUFBTSxpQkFBaUIsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2pDLE1BQU0sWUFBWSxHQUFHLENBQUMsR0FBRyxpQkFBaUIsRUFBRSxHQUFHLGlCQUFpQixDQUFDLENBQUM7SUFFbEUsTUFBTSxDQUFDLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO0lBRXJDLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxNQUFNLGtCQUFrQixDQUFDLFVBQVUsRUFBRSxDQUFDO0lBQ3RELElBQUksbUJBQW1CLEdBQUcsTUFBTSx5QkFBeUIsQ0FBQyxpQkFBaUIsQ0FBQztRQUMxRSxJQUFJLEVBQUUsdUJBQXVCO0tBQzlCLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNoQyxtQ0FBbUM7UUFDbkMsTUFBTSxFQUFFLE1BQU0sRUFBRSxrQkFBa0IsRUFBRSxHQUFHLE1BQU0sSUFBQSx3Q0FBMkIsRUFBQyxTQUFTLENBQUMsQ0FBQyxHQUFHLENBQUM7WUFDdEYsS0FBSyxFQUFFO2dCQUNMLGlCQUFpQixFQUFFO29CQUNqQjt3QkFDRSxJQUFJLEVBQUUsdUJBQXVCO3FCQUM5QjtpQkFDRjthQUNGO1NBQ0YsQ0FBQyxDQUFDO1FBQ0gsbUJBQW1CLEdBQUcsa0JBQWtCLENBQUM7SUFDM0MsQ0FBQztJQUVELE1BQU0sSUFBQSxpQ0FBb0IsRUFBQyxTQUFTLENBQUMsQ0FBQyxHQUFHLENBQUM7UUFDeEMsS0FBSyxFQUFFO1lBQ0wsUUFBUSxFQUFFLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxFQUFFLEVBQUU7WUFDMUIsTUFBTSxFQUFFO2dCQUNOLG9CQUFvQixFQUFFO29CQUNwQjt3QkFDRSxhQUFhLEVBQUUsS0FBSzt3QkFDcEIsVUFBVSxFQUFFLElBQUk7cUJBQ2pCO29CQUNEO3dCQUNFLGFBQWEsRUFBRSxLQUFLO3FCQUNyQjtpQkFDRjtnQkFDRCx3QkFBd0IsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO2FBQ3BEO1NBQ0Y7S0FDRixDQUFDLENBQUM7SUFDSCxNQUFNLENBQUMsSUFBSSxDQUFDLHdCQUF3QixDQUFDLENBQUM7SUFFdEMsTUFBTSxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUUsR0FBRyxNQUFNLElBQUEsa0NBQXFCLEVBQUMsU0FBUyxDQUFDLENBQUMsR0FBRyxDQUFDO1FBQzFFLEtBQUssRUFBRTtZQUNMLE9BQU8sRUFBRTtnQkFDUDtvQkFDRSxJQUFJLEVBQUUsZUFBZTtvQkFDckIsYUFBYSxFQUFFLEtBQUs7b0JBQ3BCLFNBQVMsRUFBRSxpQkFBaUI7b0JBQzVCLGlCQUFpQixFQUFFLENBQUMsa0JBQWtCLENBQUM7aUJBQ3hDO2dCQUNEO29CQUNFLElBQUksRUFBRSxRQUFRO29CQUNkLGFBQWEsRUFBRSxLQUFLO29CQUNwQixTQUFTLEVBQUUsaUJBQWlCO29CQUM1QixpQkFBaUIsRUFBRSxDQUFDLGtCQUFrQixDQUFDO2lCQUN4QzthQUNGO1NBQ0Y7S0FDRixDQUFDLENBQUM7SUFDSCxNQUFNLFFBQVEsR0FBRyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDakMsTUFBTSxRQUFRLEdBQUcsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2pDLE1BQU0sQ0FBQyxJQUFJLENBQUMsMkJBQTJCLENBQUMsQ0FBQztJQUV6QyxNQUFNLENBQUMsSUFBSSxDQUFDLHdCQUF3QixDQUFDLENBQUM7SUFFdEMsTUFBTSxJQUFBLHFDQUF3QixFQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztRQUM1QyxLQUFLLEVBQUUsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDLFlBQVksRUFBRSxFQUFFLENBQUMsQ0FBQztZQUN6QyxZQUFZO1NBQ2IsQ0FBQyxDQUFDO0tBQ0osQ0FBQyxDQUFDO0lBRUgsTUFBTSxDQUFDLElBQUksQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO0lBRTdDLE1BQU0sQ0FBQyxJQUFJLENBQUMsZ0NBQWdDLENBQUMsQ0FBQztJQUU5QyxNQUFNLEVBQUUsTUFBTSxFQUFFLG1CQUFtQixFQUFFLEdBQUcsTUFBTSxJQUFBLHlDQUE0QixFQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztRQUN4RixLQUFLLEVBQUU7WUFDTCxTQUFTLEVBQUU7Z0JBQ1Q7b0JBQ0UsSUFBSSxFQUFFLHNCQUFzQjtvQkFDNUIsT0FBTyxFQUFFO3dCQUNQLElBQUksRUFBRSxRQUFRO3dCQUNkLFlBQVksRUFBRSxJQUFJO3dCQUNsQixRQUFRLEVBQUUsSUFBSTt3QkFDZCxTQUFTLEVBQUUsbUJBQW1CO3dCQUM5QixXQUFXLEVBQUUsT0FBTztxQkFDckI7aUJBQ0Y7YUFDRjtTQUNGO0tBQ0YsQ0FBQyxDQUFDO0lBQ0gsd0RBQXdEO0lBQ3hELE1BQU0scUJBQXFCLEdBQUcsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFckQsTUFBTSxVQUFVLENBQUMsTUFBTSxDQUFDO1FBQ3RCO1lBQ0UsQ0FBQyxlQUFPLENBQUMsY0FBYyxDQUFDLEVBQUU7Z0JBQ3hCLGlCQUFpQixFQUFFLHFCQUFxQixDQUFDLEVBQUU7YUFDNUM7WUFDRCxDQUFDLGVBQU8sQ0FBQyxXQUFXLENBQUMsRUFBRTtnQkFDckIsdUJBQXVCLEVBQUUsZUFBZTthQUN6QztTQUNGO0tBQ0YsQ0FBQyxDQUFDO0lBRUgsTUFBTSxDQUFDLElBQUksQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO0lBQzNDLE1BQU0sRUFBRSxNQUFNLEVBQUUscUJBQXFCLEVBQUUsR0FBRyxNQUFNLElBQUEsMkNBQThCLEVBQUMsU0FBUyxDQUFDLENBQUMsR0FBRyxDQUFDO1FBQzVGLEtBQUssRUFBRTtZQUNMLElBQUksRUFBRTtnQkFDSjtvQkFDRSxJQUFJLEVBQUUsU0FBUztvQkFDZixJQUFJLEVBQUUsU0FBUztpQkFDaEI7YUFDRjtTQUNGO0tBQ0YsQ0FBQyxDQUFDO0lBRUgsTUFBTSxlQUFlLEdBQUcscUJBQXFCLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFakQsTUFBTSwyQkFBMkIsR0FBRyxNQUFNLHdCQUF3QixDQUFDLHFCQUFxQixDQUFDO1FBQ3ZGLElBQUksRUFBRSx5QkFBeUI7UUFDL0IsSUFBSSxFQUFFLFVBQVU7UUFDaEIsYUFBYSxFQUFFO1lBQ2I7Z0JBQ0UsSUFBSSxFQUFFLGVBQWU7Z0JBQ3JCLFNBQVMsRUFBRTtvQkFDVDt3QkFDRSxZQUFZLEVBQUUsSUFBSTt3QkFDbEIsSUFBSSxFQUFFLFNBQVM7cUJBQ2hCO2lCQUNGO2FBQ0Y7WUFDRDtnQkFDRSxJQUFJLEVBQUUsUUFBUTtnQkFDZCxTQUFTLEVBQUU7b0JBQ1Q7d0JBQ0UsWUFBWSxFQUFFLElBQUk7d0JBQ2xCLElBQUksRUFBRSxTQUFTO3FCQUNoQjtpQkFDRjthQUNGO1NBQ0Y7S0FDRixDQUFDLENBQUM7SUFFSCxNQUFNLFVBQVUsQ0FBQyxNQUFNLENBQUM7UUFDdEIsQ0FBQyxlQUFPLENBQUMsY0FBYyxDQUFDLEVBQUU7WUFDeEIsaUJBQWlCLEVBQUUscUJBQXFCLENBQUMsRUFBRTtTQUM1QztRQUNELENBQUMsZUFBTyxDQUFDLFdBQVcsQ0FBQyxFQUFFO1lBQ3JCLGtCQUFrQixFQUFFLDJCQUEyQixDQUFDLEVBQUU7U0FDbkQ7S0FDRixDQUFDLENBQUM7SUFFSCxNQUFNLEVBQUUsTUFBTSxFQUFFLGlCQUFpQixFQUFFLEdBQUcsTUFBTSxJQUFBLHNDQUF5QixFQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztRQUNuRixLQUFLLEVBQUU7WUFDTCxXQUFXLEVBQUU7Z0JBQ1g7b0JBQ0UsS0FBSyxFQUFFLGNBQWM7b0JBQ3JCLE1BQU0sRUFBRSxjQUFjO2lCQUN2QjtnQkFDRDtvQkFDRSxLQUFLLEVBQUUsZUFBZTtvQkFDdEIsTUFBTSxFQUFFLGVBQWU7aUJBQ3hCO2dCQUNEO29CQUNFLEtBQUssRUFBRSxhQUFhO29CQUNwQixNQUFNLEVBQUUsYUFBYTtpQkFDdEI7YUFDRjtTQUNGO0tBQ0YsQ0FBQyxDQUFDO0lBRUgsTUFBTSxJQUFBLDBDQUE2QixFQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztRQUNqRCxLQUFLLEVBQUU7WUFDTDtnQkFDRSxJQUFJLEVBQUUsbUJBQW1CO2dCQUN6QixVQUFVLEVBQUUsTUFBTTtnQkFDbEIsV0FBVyxFQUFFLGVBQWU7Z0JBQzVCLGVBQWUsRUFBRSwyQkFBMkIsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtnQkFDaEUsbUJBQW1CLEVBQUUsZUFBZSxDQUFDLEVBQUU7Z0JBQ3ZDLElBQUksRUFBRTtvQkFDSixLQUFLLEVBQUUsVUFBVTtvQkFDakIsV0FBVyxFQUFFLG1CQUFtQjtvQkFDaEMsSUFBSSxFQUFFLFVBQVU7aUJBQ2pCO2dCQUNELE1BQU0sRUFBRTtvQkFDTjt3QkFDRSxhQUFhLEVBQUUsS0FBSzt3QkFDcEIsTUFBTSxFQUFFLENBQUM7cUJBQ1Y7b0JBQ0Q7d0JBQ0UsYUFBYSxFQUFFLEtBQUs7d0JBQ3BCLE1BQU0sRUFBRSxDQUFDO3FCQUNWO29CQUNEO3dCQUNFLFNBQVMsRUFBRSxRQUFRLENBQUMsRUFBRTt3QkFDdEIsTUFBTSxFQUFFLENBQUM7cUJBQ1Y7b0JBQ0Q7d0JBQ0UsU0FBUyxFQUFFLFFBQVEsQ0FBQyxFQUFFO3dCQUN0QixNQUFNLEVBQUUsQ0FBQztxQkFDVjtpQkFDRjtnQkFDRCxLQUFLLEVBQUU7b0JBQ0w7d0JBQ0UsU0FBUyxFQUFFLGtCQUFrQjt3QkFDN0IsS0FBSyxFQUFFLE1BQU07d0JBQ2IsUUFBUSxFQUFFLElBQUk7cUJBQ2Y7b0JBQ0Q7d0JBQ0UsU0FBUyxFQUFFLFdBQVc7d0JBQ3RCLEtBQUssRUFBRSxPQUFPO3dCQUNkLFFBQVEsRUFBRSxJQUFJO3FCQUNmO2lCQUNGO2FBQ0Y7WUFDRDtnQkFDRSxJQUFJLEVBQUUsa0JBQWtCO2dCQUN4QixVQUFVLEVBQUUsTUFBTTtnQkFDbEIsV0FBVyxFQUFFLGVBQWU7Z0JBQzVCLGVBQWUsRUFBRSwyQkFBMkIsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtnQkFDaEUsbUJBQW1CLEVBQUUsZUFBZSxDQUFDLEVBQUU7Z0JBQ3ZDLElBQUksRUFBRTtvQkFDSixLQUFLLEVBQUUsU0FBUztvQkFDaEIsV0FBVyxFQUFFLG1CQUFtQjtvQkFDaEMsSUFBSSxFQUFFLFNBQVM7aUJBQ2hCO2dCQUNELE1BQU0sRUFBRTtvQkFDTjt3QkFDRSxhQUFhLEVBQUUsS0FBSzt3QkFDcEIsTUFBTSxFQUFFLEVBQUU7cUJBQ1g7b0JBQ0Q7d0JBQ0UsYUFBYSxFQUFFLEtBQUs7d0JBQ3BCLE1BQU0sRUFBRSxFQUFFO3FCQUNYO29CQUNEO3dCQUNFLFNBQVMsRUFBRSxRQUFRLENBQUMsRUFBRTt3QkFDdEIsTUFBTSxFQUFFLEVBQUU7cUJBQ1g7b0JBQ0Q7d0JBQ0UsU0FBUyxFQUFFLFFBQVEsQ0FBQyxFQUFFO3dCQUN0QixNQUFNLEVBQUUsRUFBRTtxQkFDWDtpQkFDRjtnQkFDRCxLQUFLLEVBQUU7b0JBQ0w7d0JBQ0UsU0FBUyxFQUFFLGtCQUFrQjt3QkFDN0IsS0FBSyxFQUFFLE1BQU07d0JBQ2IsUUFBUSxFQUFFLElBQUk7cUJBQ2Y7b0JBQ0Q7d0JBQ0UsU0FBUyxFQUFFLFdBQVc7d0JBQ3RCLEtBQUssRUFBRSxPQUFPO3dCQUNkLFFBQVEsRUFBRSxJQUFJO3FCQUNmO2lCQUNGO2FBQ0Y7U0FDRjtLQUNGLENBQUMsQ0FBQztJQUVILE1BQU0sQ0FBQyxJQUFJLENBQUMsb0NBQW9DLENBQUMsQ0FBQztJQUVsRCxNQUFNLElBQUEscURBQXdDLEVBQUMsU0FBUyxDQUFDLENBQUMsR0FBRyxDQUFDO1FBQzVELEtBQUssRUFBRTtZQUNMLEVBQUUsRUFBRSxxQkFBcUIsQ0FBQyxFQUFFO1lBQzVCLEdBQUcsRUFBRSxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztTQUNqQztLQUNGLENBQUMsQ0FBQztJQUVILE1BQU0sQ0FBQyxJQUFJLENBQUMsdUNBQXVDLENBQUMsQ0FBQztJQUVyRCxNQUFNLENBQUMsSUFBSSxDQUFDLHFDQUFxQyxDQUFDLENBQUM7SUFDbkQsTUFBTSxFQUFFLE1BQU0sRUFBRSx1QkFBdUIsRUFBRSxHQUFHLE1BQU0sSUFBQSxrQ0FBcUIsRUFBQyxTQUFTLENBQUMsQ0FBQyxHQUFHLENBQUM7UUFDckYsS0FBSyxFQUFFO1lBQ0wsUUFBUSxFQUFFO2dCQUNSO29CQUNFLEtBQUssRUFBRSxZQUFZO29CQUNuQixJQUFJLEVBQUUsYUFBYTtvQkFDbkIsVUFBVSxFQUFFLEVBQUU7aUJBQ2Y7YUFDRjtTQUNGO0tBQ0YsQ0FBQyxDQUFDO0lBQ0gsTUFBTSxpQkFBaUIsR0FBRyx1QkFBdUIsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUVyRCxNQUFNLElBQUEsOENBQWlDLEVBQUMsU0FBUyxDQUFDLENBQUMsR0FBRyxDQUFDO1FBQ3JELEtBQUssRUFBRTtZQUNMLEVBQUUsRUFBRSxpQkFBaUIsQ0FBQyxFQUFFO1lBQ3hCLEdBQUcsRUFBRSxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztTQUNqQztLQUNGLENBQUMsQ0FBQztJQUVILE1BQU0sQ0FBQyxJQUFJLENBQUMsNENBQTRDLENBQUMsQ0FBQztJQUUxRCxNQUFNLENBQUMsSUFBSSxDQUFDLHlCQUF5QixDQUFDLENBQUM7SUFFdkMsTUFBTSxFQUFFLE1BQU0sRUFBRSxjQUFjLEVBQUUsR0FBRyxNQUFNLElBQUEsNENBQStCLEVBQUMsU0FBUyxDQUFDLENBQUMsR0FBRyxDQUFDO1FBQ3RGLEtBQUssRUFBRTtZQUNMLGtCQUFrQixFQUFFO2dCQUNsQjtvQkFDRSxJQUFJLEVBQUUsUUFBUTtvQkFDZCxTQUFTLEVBQUUsSUFBSTtpQkFDaEI7Z0JBQ0Q7b0JBQ0UsSUFBSSxFQUFFLGVBQWU7b0JBQ3JCLFNBQVMsRUFBRSxJQUFJO2lCQUNoQjthQUNGO1NBQ0Y7S0FDRixDQUFDLENBQUM7SUFFSCxNQUFNLEVBQUUsTUFBTSxFQUFFLGlCQUFpQixFQUFFLEdBQUcsTUFBTSxJQUFBLHNDQUF5QixFQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztRQUNuRixLQUFLLEVBQUU7WUFDTCxZQUFZLEVBQUU7Z0JBQ1o7b0JBQ0UsS0FBSyxFQUFFLFVBQVU7aUJBQ2xCO2dCQUNEO29CQUNFLEtBQUssRUFBRSxVQUFVO2lCQUNsQjtnQkFDRDtvQkFDRSxLQUFLLEVBQUUsY0FBYztpQkFDdEI7Z0JBQ0Q7b0JBQ0UsS0FBSyxFQUFFLFFBQVE7aUJBQ2hCO2dCQUNEO29CQUNFLEtBQUssRUFBRSxRQUFRO2lCQUNoQjtnQkFDRDtvQkFDRSxLQUFLLEVBQUUsZUFBZTtpQkFDdkI7YUFDRjtTQUNGO0tBQ0YsQ0FBQyxDQUFDO0lBRUgsTUFBTSxFQUFFLE1BQU0sRUFBRSxhQUFhLEVBQUUsR0FBRyxNQUFNLElBQUEsbUNBQXNCLEVBQUMsU0FBUyxDQUFDLENBQUMsR0FBRyxDQUFDO1FBQzVFLEtBQUssRUFBRTtZQUNMLFFBQVEsRUFBRSxJQUFBLHVCQUFZLEVBQUM7Z0JBQ3JCLFdBQVcsRUFBRSxpQkFBaUI7Z0JBQzlCLElBQUksRUFBRSxpQkFBaUI7Z0JBQ3ZCLFVBQVUsRUFBRSxjQUFjO2dCQUMxQixjQUFjLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQztnQkFDbkQsbUJBQW1CLEVBQUUsZUFBZSxDQUFDLEVBQUU7YUFDeEMsQ0FBQztTQUNIO0tBQ0YsQ0FBQyxDQUFDO0lBRUgsS0FBSyxNQUFNLE9BQU8sSUFBSSxhQUFhLEVBQUUsQ0FBQztRQUNwQyxNQUFNLFlBQVksR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRXpDLHlFQUF5RTtRQUN6RSxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxpQ0FBaUM7UUFFdkYsdUVBQXVFO1FBQ3ZFLE1BQU0saUJBQWlCLEdBQUcsQ0FBQyxHQUFHLHdCQUFjLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO1FBQzlFLE1BQU0saUJBQWlCLEdBQUcsaUJBQWlCLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxVQUFVLENBQUMsQ0FBQztRQUVqRSxvREFBb0Q7UUFDcEQsTUFBTSxlQUFlLEdBQUcsQ0FBQyxHQUFHLHdCQUFjLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO1FBQzVFLE1BQU0sZUFBZSxHQUFHLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBRTdELG1FQUFtRTtRQUNuRSxNQUFNLE1BQU0sR0FBRyxFQUFFLENBQUM7UUFDbEIsS0FBSyxNQUFNLFFBQVEsSUFBSSxpQkFBaUIsRUFBRSxDQUFDO1lBQ3pDLE1BQU0sRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLEdBQUcsTUFBTSxJQUFBLGdDQUFtQixFQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztnQkFDakUsS0FBSyxFQUFFO29CQUNMLEtBQUssRUFBRSxRQUFRLENBQUMsS0FBSztvQkFDckIsZ0JBQWdCLEVBQUU7d0JBQ2hCLFVBQVUsRUFBRSxRQUFRLENBQUMsVUFBVTt3QkFDL0IsU0FBUyxFQUFFLFFBQVEsQ0FBQyxTQUFTO3dCQUM3QixLQUFLLEVBQUUsUUFBUSxDQUFDLEtBQUs7d0JBQ3JCLElBQUksRUFBRSxRQUFRLENBQUMsSUFBSTt3QkFDbkIsWUFBWSxFQUFFLElBQUk7d0JBQ2xCLFFBQVEsRUFBRSxJQUFJO3dCQUNkLFNBQVMsRUFBRSxRQUFRLENBQUMsU0FBUzt3QkFDN0IsV0FBVyxFQUFFLFFBQVEsQ0FBQyxXQUFXO3FCQUNsQztvQkFDRCxLQUFLLEVBQUU7d0JBQ0w7NEJBQ0UsVUFBVSxFQUFFLFlBQVksQ0FBQyxFQUFFOzRCQUMzQixVQUFVLEVBQUUsT0FBTyxDQUFDLEVBQUU7NEJBQ3RCLFFBQVEsRUFBRSxDQUFDOzRCQUNYLEtBQUssRUFBRSxPQUFPLENBQUMsS0FBSzs0QkFDcEIsU0FBUyxFQUFFLE9BQU8sQ0FBQyxTQUFTLElBQUksU0FBUzs0QkFDekMsVUFBVSxFQUFFLElBQUk7eUJBQ2pCO3FCQUNGO29CQUNELFlBQVksRUFBRTt3QkFDWjs0QkFDRSxNQUFNLEVBQUUsSUFBSTs0QkFDWixhQUFhLEVBQUUsS0FBSzt5QkFDckI7cUJBQ0Y7b0JBQ0QsU0FBUyxFQUFFLFFBQVEsQ0FBQyxFQUFFO29CQUN0QixnQkFBZ0IsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO2lCQUM1QzthQUNGLENBQUMsQ0FBQztZQUVILE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDckIsQ0FBQztRQUVELHdDQUF3QztRQUN4QyxNQUFNLGNBQWMsR0FBRyxFQUFFLENBQUM7UUFDMUIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUN2QyxNQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDeEIsTUFBTSxRQUFRLEdBQUcsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDdEMsTUFBTSxNQUFNLEdBQUcsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRWxDLGNBQWMsQ0FBQyxJQUFJLENBQUM7Z0JBQ2xCLFVBQVUsRUFBRSxPQUFPLENBQUMsRUFBRTtnQkFDdEIsUUFBUSxFQUFFLEtBQUssQ0FBQyxFQUFFO2dCQUNsQixrQkFBa0IsRUFBRSxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTtnQkFDeEMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxNQUFNO2dCQUNyQixPQUFPLEVBQUUsTUFBTSxDQUFDLE9BQU87Z0JBQ3ZCLFVBQVUsRUFBRSxRQUFRLENBQUMsVUFBVTtnQkFDL0IsSUFBSSxFQUFFLEdBQUcsUUFBUSxDQUFDLFVBQVUsSUFBSSxRQUFRLENBQUMsU0FBUyxFQUFFO2dCQUNwRCxLQUFLLEVBQUUsUUFBUSxDQUFDLEtBQUs7Z0JBQ3JCLE1BQU0sRUFBRSxNQUFNLENBQUMsTUFBTTthQUN0QixDQUFDLENBQUM7UUFDTCxDQUFDO1FBRUQsTUFBTSxFQUFFLE1BQU0sRUFBRSxvQkFBb0IsRUFBRSxHQUFHLE1BQU0sSUFBQSxxREFBNEIsRUFBQyxTQUFTLENBQUMsQ0FBQyxHQUFHLENBQUM7WUFDekYsS0FBSyxFQUFFO2dCQUNMLGNBQWMsRUFBRSxjQUFjO2FBQy9CO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsTUFBTSxJQUFBLHNFQUFvQyxFQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztZQUN4RCxLQUFLLEVBQUU7Z0JBQ0wsU0FBUyxFQUFFLG9CQUFvQixDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsQ0FBQztvQkFDL0MsaUJBQWlCLEVBQUUsTUFBTSxDQUFDLEVBQUU7b0JBQzVCLE9BQU8sRUFBRSxJQUFBLGdDQUFzQixFQUFDLE1BQU0sQ0FBQztpQkFDeEMsQ0FBQyxDQUFDO2FBQ0o7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsTUFBTSxDQUFDLElBQUksQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDO0lBQzlDLE1BQU0sQ0FBQyxJQUFJLENBQUMsd0JBQXdCLGlCQUFpQixDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7QUFDakUsQ0FBQyJ9