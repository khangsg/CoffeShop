from . import controllers


# Change some default data
def pre_init_hook(cr):
    cr.execute("""
    update res_company set name = 'Wave Cafe' where id = 1;
    delete from stock_production_lot;
    delete from sale_order_template_option;
    delete from stock_valuation_layer;
    delete from stock_inventory_line;
    delete from stock_move;
    delete from stock_quant;
    delete from sale_order_template_line;
    delete from sale_order_line;
    delete from sale_order;
    delete from product_product;
    delete from product_template;
    delete from product_category;
    delete from blog_post;
    update website_menu set name = 'Product' where url = '/shop';
    """)