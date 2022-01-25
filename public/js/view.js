export default class {
    constructor() {}
    setTitle(title) {
        if (title)
            title += ' - Breeze Block Explorer'
        else
            title = 'Breeze Block Explorer'
        document.title = title
    }
    setHtml() { return "" }
    init() {}

    loadingHtml(prefix,desc) {
        return `
            <div class="d-flex justify-content-center" id="blk-loading">
        <div class="spinner-border" role="status">
            <span class="sr-only">Loading block...</span>
        </div>
    </div>
        `
    }

    errorHtml(prefix,desc) {
        return `
            <div id="${prefix}-error">
                <h2>Something went wrong when retrieving ${desc}</h2><br>
                <a type="button" class="btn btn-primary" href="#">Home</a>
            </div>
        `
    }

    notFoundHtml(prefix,desc) {
        return `
            <div id="${prefix}-notfound">
                <h2>${desc} not found</h2><br>
                <a type="button" class="btn btn-primary" href="#">Home</a>
            </div>
        `
    }
}