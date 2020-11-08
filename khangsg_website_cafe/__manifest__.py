# -*- coding: utf-8 -*-
{
    'name': 'Coffee Shop Website',
    'category': 'Website',
    'author': 'khangnguyen16021990@gmail.com',
    'description': 'https://odoo-vn.com',
    'depends': [
        'base',
        'product',
        'sale',
        'sale_management',
        'stock',
        'website',
        'website_blog',
        'website_search_blog',
        'website_sale'
    ],
    'data': [
        'security/ir.model.access.csv',
        'data/product_categories.xml',
        'data/products.xml',
        'data/blog_post.xml',
        'views/product_template.xml',
        'views/menu.xml',
        'template/assets.xml',
        'template/header.xml',
        'template/footer.xml',
        'pages/home.xml'
    ],
    'qweb': [
        'static/src/xml/product_categories.xml',
        'static/src/xml/products.xml',
        'static/src/xml/product_detail.xml'
    ],
    'installable': True,
    'application': False,
    'auto_install': False,
    'pre_init_hook': 'pre_init_hook',
}
