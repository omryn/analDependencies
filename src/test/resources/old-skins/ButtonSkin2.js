define.oldSkin({
    name: 'skins.core.ButtonSkin2',
    Class: {
        Extends: 'mobile.core.skins.BaseSkin',
        _params: [
            {'id': 'themeDir', 'type': 'themeUrl', 'defaultTheme': 'THEME_DIRECTORY'}
        ],
        _html: '<span class="buttonLeft buttonStates"></span>' +
            '<span class="buttonCenter buttonStates" skinPart="caption"></span>' +
            '<span class="buttonRight buttonStPhotoGalleryGridDefaultSkin.jsates"></span>',
        _css: [
            '{cursor:pointer; display:inline;}',
            '[disabled] {cursor: default; }',
            ' .buttonLeft{display:inline-block;background: url([themeDir]btns_left.png) no-repeat; height:35px;width:9px;}',
            ' .buttonCenter{display:inline-block;font-weight:bold;height:35px;background: url([themeDir]btns_mid.png) repeat-x top; vertical-align: top; line-height: 34px;}',
            ' .buttonRight{display:inline-block;background: url([themeDir]btns_right.png) no-repeat; height:35px;width:9px;}',
            ' .buttonStates{background-position: 0 -72px;color:#444;}',
            '[state=grayed] .buttonStates{background-position: 0 -146px!important;color:#555;}',
            '[disabled] .buttonStates{background-position: 0 -109px!important;color:#888;}'
        ]
    }
});
