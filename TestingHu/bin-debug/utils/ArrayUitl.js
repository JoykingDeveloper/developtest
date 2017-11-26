var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var ArrayUitl = (function () {
    function ArrayUitl() {
    }
    ArrayUitl.getElementCount = function (array, value) {
        var count = 0;
        if (array != null && array.length > 0) {
            for (var k in array) {
                if (array[k] === value) {
                    count++;
                }
            }
        }
        return count;
    };
    return ArrayUitl;
}());
__reflect(ArrayUitl.prototype, "ArrayUitl");
//# sourceMappingURL=ArrayUitl.js.map