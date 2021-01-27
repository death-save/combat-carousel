/**
 * @module FixedDraggable
 */

/**
 * An implementation of the Draggable class that allows fixed elements to be dragged
 */
export default class FixedDraggable extends Draggable {
    constructor(app, element, handle, resizable) {
        super(app, element, handle, resizable);
    }

    /* ----------------------------------------- */

    /**
    * Handle the initial mouse click which activates dragging behavior for the application
    * @private
    * @override
    */
    _onDragMouseDown(event) {
        event.preventDefault();
        // Record initial position
        const appPosition = {
            width: this.app.position.width ?? this.app.element.width(),
            height: this.app.position.height ?? this.app.element.height(),
            left: this.app.position.left ?? this.app.element.position().left,
            top: this.app.position.top ?? this.app.element.position().top,
            scale: this.app.position.scale ?? 1.0
        }
        
        this.initialPosition = appPosition;
        this.position = duplicate(appPosition);
        this._initial = {x: event.clientX, y: event.clientY};
        // Add temporary handlers
        window.addEventListener(...this.handlers.dragMove);
        window.addEventListener(...this.handlers.dragUp);
    }

    /* ----------------------------------------- */
        
    /**
     * Move the window with the mouse, bounding the movement to ensure the window stays within bounds of the viewport
     * @private
     */
    _onDragMouseMove(event) {
        event.preventDefault();
        // Limit dragging to 60 updates per second
        const now = Date.now();
        if ( (now - this._moveTime) < (1000/60) ) return;
        this._moveTime = now;
        
        // Update application position
        this.position.left = this.initialPosition.left + (event.clientX - this._initial.x);
        this.position.top = this.initialPosition.top + (event.clientY - this._initial.y);

        this.app.setPosition({
            left: this.position.left,
            top: this.position.top
        });
	}
	
    /* ----------------------------------------- */
    
    /**
     * Conclude the dragging behavior when the mouse is release, setting the final position and removing listeners
     * @private
     */
    _onDragMouseUp(event) {
        event.preventDefault();
        if (this.app._onDragMouseUp instanceof Function) this.app._onDragMouseUp(event, this.position, this.initialPosition);
        window.removeEventListener(...this.handlers.dragMove);
        window.removeEventListener(...this.handlers.dragUp);
	}
	
    /* ----------------------------------------- */
	
	/**
	 * Handle the initial mouse click which activates dragging behavior for the application
     * @private
     */
    _onResizeMouseDown(event) {
        event.preventDefault();
        // Limit dragging to 60 updates per second
        const now = Date.now();
        if ( (now - this._moveTime) < (1000/60) ) return;
        this._moveTime = now;
        // Record initial position
        this.position = duplicate(this.app.position);
        if ( this.position.height === "auto" ) this.position.height = this.element.clientHeight;
        if ( this.position.width === "auto" ) this.position.width = this.element.clientWidth;
        this._initial = {x: event.clientX, y: event.clientY};
        // Add temporary handlers
        window.addEventListener(...this.handlers.resizeMove);
        window.addEventListener(...this.handlers.resizeUp);
	}
	
	/* ----------------------------------------- */
	
	/**
     * Move the window with the mouse, bounding the movement to ensure the window stays within bounds of the viewport
     * @private
     */
    _onResizeMouseMove(event) {
        event.preventDefault();
        this.app.setPosition({
            width: this.position.width + (event.clientX - this._initial.x),
            height: this.position.height + (event.clientY - this._initial.y)
        });
    }
    
    /* ----------------------------------------- */
    
    /**
     * Conclude the dragging behavior when the mouse is release, setting the final position and removing listeners
     * @private
     */
    _onResizeMouseUp(event) {
        event.preventDefault();
        window.removeEventListener(...this.handlers.resizeMove);
        window.removeEventListener(...this.handlers.resizeUp);
        this.app._onResize(event);
    }
}