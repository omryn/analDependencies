"use strict";
describe('grunt task', function () {
    describe('when including all test resources and excluding **/Mock*', function () {
        it('should analyze all dependencies', function (done) {
            expect('target/dependencies.json').toHaveParsedContent({
                "skin.with.deep.Dependencies": [
                    "skin.with.shallow.Dependencies"
                ],
                "skins.core.ButtonSkinChild": [
                    "skins.core.ButtonSkin"
                ],
                "skins.core.PhotoGalleryGridDefaultSkin": [
                    "dependency.from.comp.Skin",
                    "dependency.from.html.Skin",
                    "extended.BaseSkin",
                    "full.screen.view.skin.class.Name",
                    "item.skin.class.Name",
                    "other.dependency.from.comp.Skin",
                    "other.dependency.from.html.Skin"
                ]
            }, done);
        });
    });
});