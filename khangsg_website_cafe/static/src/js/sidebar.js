odoo.define('khangsg_website_cafe.cafe_shop_sidebar', function (require) {
    $(document).ready(function() {
        if (window.location.pathname == '/'){
            $('.hamburger_menus').hide();
        }
    });
});