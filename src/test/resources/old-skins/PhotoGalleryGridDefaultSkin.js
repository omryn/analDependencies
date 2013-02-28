define.oldSkin({
    name: 'skins.core.PhotoGalleryGridDefaultSkin',
    Class: {
        Extends: 'extended.BaseSkin',
        _comps: [
            {'id': 'repeater', 'skin': 'dependency.from.comp.Skin', 'styleGroup': 'inherit'},
            {'id': 'fullScreen', 'skin': 'other.dependency.from.comp.Skin', 'styleGroup': 'inherit'}
        ],

        _params: [
            {'id': 'thumbSpacing', 'type': 'CSSString', 'defaultTheme': 'thumbSpacing', 'name': ''},
            {'id': '$thumbBorderRadius', 'type': 'cssBorderRadius', 'defaultTheme': 'radiusThumb', 'name': ''},
            {'id': 'borderThumb', 'type': 'CSSString', 'defaultTheme': 'borderThumb', 'name': ''},
            {'id': 'componentSpacing', 'type': 'CSSString', 'defaultTheme': 'componentSpacing', 'name': ''}
        ],

        _html: '<div skinPart="img" skin="dependency.from.html.Skin"></div>' +
                '<div skinPart="photoFullScreen" skin="other.dependency.from.html.Skin"></div>',

        _css: [
            '{text-align:center; overflow:hidden; margin-bottom:[componentSpacing]}',
            '%imagesContainer% {margin:0 auto;}',
            '%imagesContainer% div{float:left;}',
            '%imagesContainer% div[comp="core.components.Image"] {margin:0 [thumbSpacing] [thumbSpacing] [thumbSpacing]; [$thumbBorderRadius] border:[borderThumb];}'
        ],

        itemSkinClassName: 'item.skin.class.Name',

        fullScreenViewSkinClassName: 'full.screen.view.skin.class.Name'
    }
});