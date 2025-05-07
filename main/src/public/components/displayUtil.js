const ToggleClass = (ele, onShow) => {
    ele.classList.remove("show", "hide");
    ele.classList.add(onShow ? "show" : "hide");
};

/**
 * 
 * @param {string|object} selector 
 * @param {*} onShow 
 * @returns 
 */
function ToggleDisplay(selector, onShow) {
    try {
        if (typeof selector === "string") {
            const elements = document.querySelectorAll(selector);
            if (elements.length === 0) {
                console.warn("The passed in element in ToggleDisplay is empty.");
                return;
            }
            for (const ele of elements) {
                ToggleClass(ele, onShow);
            }
        } else if (typeof selector === "object") {
            if (Array.isArray(selector)) {
                for (const ele of selector) {
                    ToggleClass(ele, onShow);
                }
            } else if (document.body.contains(selector)) {
                ToggleClass(selector, onShow);
            }
        } else {
            console.warn("The selector passed in is not in the supported format: ", selector);
            return;
        }
    } catch (err) {
        console.warn("Error occured: ", err);
        return;
    }
};

export {
    ToggleDisplay,
};