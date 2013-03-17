"use strict";

var requireSrc = require('../../helpers/requireSrc.js');
var resource = require('../../helpers/resource.js');


var definitions;

requireSrc('MockDefineRunner').getDefinitions(resource('old-skins/PhotoGalleryGridDefaultSkin.js'), function (errors, defs) {
    definitions = defs.oldSkin[0][0];
});

describe('oldSkin', function () {
    beforeEach(function () {
        waitsFor(function () {
            return definitions;
        }, 'definitions to be parsed', 200);
        runs(function () {
            var analyzer = requireSrc('analyzers/oldskin.js');
            this.result = analyzer(definitions);
        });
    });

    describe('when analyzing PhotoGalleryGridDefaultSkin ', function () {
        it('should include dependencies from Extends', function () {
            expect(this.result.dependencies).toContain('extended.BaseSkin');
        });
        it('should analyze _comps', function () {
            expect(this.result.dependencies).toContain('dependency.from.comp.Skin');
            expect(this.result.dependencies).toContain('other.dependency.from.comp.Skin');
        });
        it('should analyze _html', function () {
            expect(this.result.dependencies).toContain('dependency.from.html.Skin');
            expect(this.result.dependencies).toContain('other.dependency.from.html.Skin');
        });
        it('should analyze itemSkinClassName', function () {
            expect(this.result.dependencies).toContain('item.skin.class.Name');
        });
        it('should analyze fullScreenViewSkinClassName', function () {
            expect(this.result.dependencies).toContain('full.screen.view.skin.class.Name');
        });
        it('should extract the skin name', function () {
            expect(this.result.name).toBe('skins.core.PhotoGalleryGridDefaultSkin');
        });
    });
});