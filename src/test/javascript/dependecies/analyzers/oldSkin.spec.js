"use strict";

var requireSrc = require('../../helpers/requireSrc.js');
var resource = require('../../helpers/resource.js');


var definitions;

requireSrc('MockDefineRunner').getDefinitions(resource('old-skins/PhotoGalleryGridDefaultSkin.js'), function (defs) {
    definitions = defs.oldSkin[0][0]
});

describe('oldSkin', function () {
    beforeEach(function () {
        waitsFor(function () {
            return definitions;
        }, 'definitions to be parsed', 200);
        runs(function () {
            var analyzer = requireSrc('analyzers/oldskin.js');
            this.dependencies = analyzer(definitions);
        });
    });

    describe('when analyzing PhotoGalleryGridDefaultSkin ', function () {
        it('should include dependencies from Extends', function () {
            expect(this.dependencies).toContain('extended.BaseSkin');
        });
        it('should analyze _comps', function(){
            expect(this.dependencies).toContain('dependency.from.comp.Skin');
            expect(this.dependencies).toContain('other.dependency.from.comp.Skin');
        });
        it('should analyze _html', function(){
            expect(this.dependencies).toContain('dependency.from.html.Skin');
            expect(this.dependencies).toContain('other.dependency.from.html.Skin');
        });
        it('should analyze itemSkinClassName', function(){
            expect(this.dependencies).toContain('item.skin.class.Name');
        });
        it('should analyze fullScreenViewSkinClassName', function(){
            expect(this.dependencies).toContain('full.screen.view.skin.class.Name');
        });
    });
});