/**
 * Overrides module
 * @module overrides
 */

/**
 * Wrapper to call overrides
 */
export default function overrideMethods() {
    SceneNavigation.prototype.expand = sceneNavExpandOverride;
    SceneNavigation.prototype.collapse = sceneNavCollapseOverride;
}

/**
 * Override sceneNavExpand to move Hook call into promise
 */
function sceneNavExpandOverride() {
    if ( !this._collapsed ) return true;
    const nav = this.element;
    const icon = nav.find("#nav-toggle i.fas");
    const ul = nav.children("#scene-list");
    return new Promise(resolve => {
      ul.slideDown(200, () => {
        nav.removeClass("collapsed");
        icon.removeClass("fa-caret-down").addClass("fa-caret-up");
        this._collapsed = false;
        Hooks.callAll("collapseSceneNavigation", this, this._collapsed);
        resolve(true);
      });
      
    });
}

/**
 * Override sceneNavCollapse to move Hook call into promise
 */
function sceneNavCollapseOverride() {
    if ( this._collapsed ) return true;
    const nav = this.element;
    const icon = nav.find("#nav-toggle i.fas");
    const ul = nav.children("#scene-list");
    return new Promise(resolve => {
      ul.slideUp(200, () => {
        nav.addClass("collapsed");
        icon.removeClass("fa-caret-up").addClass("fa-caret-down");
        this._collapsed = true;
        Hooks.callAll("collapseSceneNavigation", this, this._collapsed);
        resolve(true);
      });
      
    });
}