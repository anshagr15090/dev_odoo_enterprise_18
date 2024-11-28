/** @odoo-module **/

import { registry } from '@web/core/registry';
import configuratorTourUtils from '@sale/js/tours/product_configurator_tour_utils';

registry
    .category('web_tour.tours')
    .add('website_sale_subscription_product_configurator', {
        url: '/shop?search=Main product',
        steps: () => [
            {
                content: "Select Main product",
                trigger: '.oe_product_cart a:contains("Main product")',
                run: 'click',
            },
            {
                content: "Click on add to cart",
                trigger: '#add_to_cart',
                run: 'click',
            },
            // Assert that the subscription prices and plans are correct.
            configuratorTourUtils.assertProductPrice("Main product", '5.00'),
            configuratorTourUtils.assertProductPriceInfo("Main product", "per week"),
            configuratorTourUtils.assertOptionalProductPrice("Optional product", '6.00'),
            configuratorTourUtils.assertOptionalProductPriceInfo("Optional product", "per week"),
            {
                content: "Proceed to checkout",
                trigger: 'button:contains(Proceed to Checkout)',
                run: 'click',
            },
            {
                content: "Verify the subscription price in the cart",
                trigger: 'div[name="website_sale_cart_line_price"]:contains(5.00)',
            },
            {
                content: "Verify the subscription plan in the cart",
                trigger: 'div[name="website_sale_cart_line_price"]:contains(per week)',
            },
        ],
   });