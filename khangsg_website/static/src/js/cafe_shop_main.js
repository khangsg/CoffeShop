odoo.define('khangsg_website.cafe_shop_main', function (require) {
var ajax = require('web.ajax');
var core = require('web.core');
var qweb = core.qweb;

var product_categories_xml = ajax.loadXML('/khangsg_website/static/src/xml/product_categories.xml', core.qweb);
var products_xml = ajax.loadXML('/khangsg_website/static/src/xml/products.xml', core.qweb);
var product_detail_xml = ajax.loadXML('/khangsg_website/static/src/xml/product_detail.xml', core.qweb);
var blog_categories_xml = ajax.loadXML('/khangsg_website/static/src/xml/blog_categories.xml', core.qweb);
var blogs_xml = ajax.loadXML('/khangsg_website/static/src/xml/blogs.xml', core.qweb);
var blog_detail_xml = ajax.loadXML('/khangsg_website/static/src/xml/blog_detail.xml', core.qweb);

function setVideoSize() {
    const vidWidth = 1920;
    const vidHeight = 1080;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const tempVidWidth = windowHeight * vidWidth / vidHeight;
    const tempVidHeight = windowWidth * vidHeight / vidWidth;
    const newVidWidth = tempVidWidth > windowWidth ? tempVidWidth : windowWidth;
    const newVidHeight = tempVidHeight > windowHeight ? tempVidHeight : windowHeight;
    const tmVideo = $('#tm-video');

    tmVideo.css('width', newVidWidth);
    tmVideo.css('height', newVidHeight);
}

function openTab(evt, id) {
    $('.tm-tab-content').hide();
    $('#' + id).show();
    $('.tm-tab-link').removeClass('active');
    $(evt.currentTarget).addClass('active');
}

function initPage() {
    let pageId = location.hash;

    if (pageId) {
        try{
            highlightMenu($(`.tm-page-link[href^="${pageId}"]`));
            showPage($(pageId));
        }catch(err){return;}
    } else {
        try{
            pageId = $('.tm-page-link.active').attr('href');
            showPage($(pageId));
        }catch(err){return;}
    }
}

function highlightMenu(menuItem) {
    $('.tm-page-link').removeClass('active');
    menuItem.addClass('active');
}

function showPage(page) {
    $('.tm-page-content').hide();
    page.show();
}

function render_product_categories(){
    product_categories_xml.then(function(){
        ajax.rpc("/ksg/product/categories", {}).then(function(categories) {
            var categories = qweb.render('ksg_website.product_categories', {categories: categories});
            $('.tm-page-content').find(".tm-categories").empty().append(categories);
            $('a.category-item').click(function(ev){
                $('a.category-item').removeClass('active');
                $(ev.currentTarget).addClass('active');
                var $id = $(ev.currentTarget).attr("data-id");
                render_product_list($id);
            });
        });
    });
}

function render_product_list(category_id=null, product_name=null){
    products_xml.then(function(){
        ajax.rpc("/ksg/product/list_product", {category_id: category_id, product_name: product_name}).then(function(products) {
            var products = qweb.render('ksg_website.products', {products: products});
            $('.tm-page-content').find(".tm-product-list").empty().append(products);
            $('.tm-list-item').click(function(ev){
                var $id = $(ev.currentTarget).attr("data-id");
                product_detail_xml.then(function(){
                    ajax.rpc("/ksg/product/browse_product", {id: $id}).then(function(product) {
                        if(product){
                            var product = qweb.render('ksg_website.product_detail', {product: product});
                            $('.tm-page-content').find(".tm-product-list").empty().append(product);
                        }
                    });
                });
            })
        });
    });
}

function render_blog_categories(){
    blog_categories_xml.then(function(){
        ajax.rpc("/ksg/blog/categories", {}).then(function(categories) {
            var categories = qweb.render('ksg_website.blog_categories', {categories: categories});
            $('.tm-page-content').find(".blog-categories").empty().append(categories);
            $('a.blog-category-item').click(function(ev){
                $('a.blog-category-item').removeClass('active');
                $(ev.currentTarget).addClass('active');
                var $id = $(ev.currentTarget).attr("data-id");
                render_blog_list($id);
            });
        });
    });
}

function render_blog_list(blog_id=null, blog_name=null){
    blogs_xml.then(function(){
        ajax.rpc("/ksg/blog/list_blog", {blog_id: blog_id, blog_name: blog_name}).then(function(blogs) {
            var blogs = qweb.render('ksg_website.blogs', {blogs: blogs});
            $('#blog_post').find(".tm-special-items").empty().append(blogs);
            $('.tm-special-item').click(function(ev){
                var $id = $(ev.currentTarget).attr("data-id");
                blog_detail_xml.then(function(){
                    ajax.rpc("/ksg/blog/browse_blog", {id: $id}).then(function(blog) {
                        if(blog){
                            var blog_qweb = qweb.render('ksg_website.blog_detail', {blog: blog});
                            $('.tm-special-items').empty().append(blog_qweb);
                        }
                    });
                });
            });
        });
    });
}

function init_search(){
    $('.search_input').keypress(function (ev) {
        if (ev.which == 13) {
            var search_option = $("input[name='search_option']:checked").val();
            if (search_option == 'product_item'){
                var product_name = $(ev.currentTarget).val();
                var category_id = $('.tm-categories').find('.active').attr("data-id");
                render_product_list(category_id, product_name);
                $('.product_menu').trigger('click', [false]);
            }
            if (search_option == 'blog'){
                var blog_name = $(ev.currentTarget).val();
                var blog_id = $(ev.currentTarget).attr("data-id");
                render_blog_list(null, blog_name);
                $('.blog_post_menu').trigger('click', [false]);
            }
        }
    });
}

$(document).ready(function() {

    /***************** Pages *****************/

    initPage();
    render_product_categories();
    render_product_list();
    render_blog_categories();
    render_blog_list();
    init_search();

    $('.product_menu').click(function(ev, load_data=true){
        if (load_data){
            render_product_list();
        }
    });

    $('.blog_post_menu').click(function(ev, load_data=true){
        if (load_data){
            render_blog_list();
        }
    });

    $('.tm-page-link').click(function(event) {

        if (window.innerWidth > 991) {
            event.preventDefault();
        }

        highlightMenu($(event.currentTarget));
        showPage($(event.currentTarget.hash));
    });


    /***************** Tabs *******************/

    $('.tm-tab-link').on('click', e => {
        e.preventDefault();
        openTab(e, $(e.target).data('id'));
    });

    $('.tm-tab-link.active').click(); // Open default tab


    /************** Video background *********/

    setVideoSize();

    // Set video background size based on window size
    let timeout;
    window.onresize = function() {
        clearTimeout(timeout);
        timeout = setTimeout(setVideoSize, 100);
    };

    // Play/Pause button for video background
    const btn = $("#tm-video-control-button");

    btn.on("click", function(e) {
        const video = document.getElementById("tm-video");
        $(this).removeClass();

        if (video.paused) {
            video.play();
            $(this).addClass("fas fa-pause");
        } else {
            video.pause();
            $(this).addClass("fas fa-play");
        }
    });
});
});