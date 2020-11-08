# -*- coding: utf-8 -*-
import json
from odoo import http, tools
from odoo.http import request


class KsgController(http.Controller):

    # Product Controller

    @http.route('/ksg/product/categories', type='json', auth="none")
    def get_product_categories(self):
        product_categories = request.env['product.category'].sudo().search([('parent_id', '=', False)])
        return [{'id': category.id, 'name': category.name} for category in product_categories]

    @http.route('/ksg/product/list_product', type='json', auth="none")
    def get_products(self, **post):
        domain = []
        categ_id = post.get('category_id', False)
        product_name = post.get('product_name', False)
        if categ_id and categ_id != 'all':
            domain += [('categ_id', '=', int(categ_id))]
        if product_name:
            domain += [('name', 'ilike', product_name)]
        products = request.env['product.template'].sudo().search(domain)
        return [{'id': product.id, 'name': product.name,
                 'list_price': product.list_price, 'description': product.description} for product in products]

    @http.route('/ksg/product/browse_product', type='json', auth="none")
    def browse_product(self, **post):
        id = post.get('id', False)
        if not id:
            return False
        product = request.env['product.template'].browse(int(id))
        return {'id': product.id, 'name': product.name,
                'list_price': product.list_price, 'description': product.description,
                'website_description': product.website_description}

    # Blog Controller

    @http.route('/ksg/blog/categories', type='json', auth="none")
    def get_blog_categories(self):
        blog_categories = request.env['blog.blog'].sudo().search([])
        return [{'id': category.id, 'name': category.name} for category in blog_categories]

    @http.route('/ksg/blog/list_blog', type='json', auth="none")
    def get_blogs(self, **post):
        domain = []
        blog_id = post.get('blog_id', False)
        blog_name = post.get('blog_name', False)
        if blog_id and blog_id != 'all':
            domain += [('blog_id', '=', int(blog_id))]
        if blog_name:
            domain += [('name', 'ilike', blog_name)]
        blogs = request.env['blog.post'].sudo().search(domain)
        return [{'id': blog.id, 'name': blog.name, 'teaser': blog.teaser,
                 'post_date': blog.post_date.strftime('%m/%d/%Y') if blog.post_date else '',
                 'blog_categ_id': blog.blog_id.id, 'blog_categ_name': blog.blog_id.name,
                 'background-image': json.loads(blog.cover_properties).get('background-image')} for blog in blogs]

    @http.route('/ksg/blog/browse_blog', type='json', auth="none")
    def browse_blog(self, **post):
        id = post.get('id', False)
        if not id:
            return False
        blog = request.env['blog.post'].browse(int(id))
        return {'id': blog.id, 'name': blog.name, 'teaser': blog.teaser,
                'post_date': blog.post_date.strftime('%m/%d/%Y') if blog.post_date else '',
                'blog_categ_id': blog.blog_id.id, 'blog_categ_name': blog.blog_id.name,
                'background-image': json.loads(blog.cover_properties).get('background-image'),
                'content': blog.content}