from product.models import ProductCatalog

from order.cart.models import Cart, CartItem


class AutoOrderConfigManager:
    @staticmethod
    def add_to_auto_order_list_task(config, product):

        catalog_prods = ProductCatalog.objects.filter(tag_id=product.tag_id)

        if not catalog_prods:
            return 'this product is not currently available for auto-orders'

        cart, _ = Cart.objects.get_or_create(user=product.retailer, type='SMART')
        prod = min(catalog_prods, key=lambda product: product.new_price)
        cart_item, created = CartItem.objects.get_or_create(cart=cart, product=prod)

        if not created:
            return 'already in cart!'
        cart_item.quantity = (
            config.ordering_amount if prod.quantity >= config.ordering_amount else prod.quantity
        )
        cart_item.save()
        return 'item added to auto-order list!'
