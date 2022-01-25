import view from './view.js'

export default class extends view {
    constructor() {
        super()
        this.setTitle('Content')
        this.contentId = window.location.hash.substr(10)
    }

    getHtml() {
        return `
            ${this.loadingHtml('content', 'content')}
            ${this.errorHtml('content', 'content')}
            ${this.notFoundHtml('content', 'Content')}
            <div id="content-container">
            <div class="header-search-part mb-30">
                    <div class="hd-search-g-wrap">
                    <input id="input" class="input-design dblocks-search" onkeypress="searchEnter()" type="search" placeholder="Block / Account / Tx" aria-label="Search">
                <button id="searchIcon" onclick="searchSubmit()">
                    
                </button>
                    </div>
                </div>
    <div class="cmn-display">
        <div class="t-flex-g-wrapper">
            <h2 class="text-truncate content-heading cmn-display-title type-3"><span id="content-id"></span>
            </h2>
            <div class="ex-links-wrap text-right">
                <a type="button" class="btn size-2" id="content-parent-btn">View parent
                    content</a>
                <a type="button" target="_blank" class="btn size-2" id="content-besocial" style="background-color:#709CF0"></a>
            </div>
        </div>
        <div class="display-tbl">
            <table class="table tbl-first-120 table-sm" id="content-fields">
                <tr>
                    <th scope="row">Author:</th>
                    <td id="content-author"></td>
                </tr>
                <tr>
                    <th scope="row">Link:</th>
                    <td id="content-link"></td>
                </tr>
                <tr>
                    <th scope="row">Timestamp:</th>
                    <td id="content-ts"></td>
                </tr>
            </table>
        </div>
    </div>

    <div class="content-dt-wrapper">
        <h3 class="tbl-title text-center"><span>Content data</span></h3>
        <div id="content-json" class="color-dim font-12"></div>
    </div>
    <div class="wrapper-6">
        <h3 class="tbl-title text-center"><span>Votes</span></h3>
        <div class="tbl-hr-scroller">
            <div class="display-tbl tbl-6">
                <table class="table table-sm table-bordered" id="content-votes">
                    <thead>
                        <tr>
                            <th scope="col">Voter</th>
                            <th scope="col">Vote Time</th>
                            <th scope="col">VP</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>
        </div>
    </div>
    <div id="content-comments">
        <h5>Comments</h5>
        <table class="table table-sm table-striped table-bordered">
            <thead>
                <tr>
                    <th scope="col">Author</th>
                    <th scope="col">Link</th>
                    <th scope="col">View Comment</th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
    </div>
</div>
        `
    }

    init() {
        axios.get(config.api + '/content/' + this.contentId).then((content) => {
            $('#content-id').text(content.data._id)
            $('#content-author').text(content.data.author)
            $('#content-link').text(DOMPurify.sanitize(content.data.link))
            $('#content-ts').text(content.data.ts)
            $('#content-ts').append(' <span class="badge badge-pill badge-info">' + new Date(content.data.ts).toLocaleString() + '</span>')
            $('#content-json').html(jsonToTableRecursive(content.data.json))
            $('#content-besocial').attr('href', 'https://besocial.ai/post/' + this.contentId)

            if (content.data.pa && content.data.pp) {
                $('#content-parent-btn').show()
                $('#content-parent-btn').attr('href', '/content/' + content.data.pa + '/' + content.data.pp)
                $('#content-pa').text(content.data.pa)
                $('#content-pp').text(content.data.pp)
                $('.content-parent').show()
                $('.content-heading').prepend('Comment')
                $('#content-besocial').append('View comment on BeSocial')
            } else {
                $('#content-parent-btn').removeClass('d-inline')
                $('#content-parent-btn').hide()
                $('.content-heading').prepend('<img src="https://img.icons8.com/ios/24/709CF0/document--v1.png"/>')
                $('#content-besocial').append('View on BeSocial')
            }

            // Votes
            let votesHtml = ''
            // Append to table
            for (let i = 0; i < content.data.votes.length; i++) {
                console.log(content.data.votes[i])
                votesHtml += '<tr><td>' + content.data.votes[i].u + '</td>'
                votesHtml += '<td>' + new Date(content.data.votes[i].ts).toLocaleString() + '</td>'
                votesHtml += '<td>' + thousandSeperator(content.data.votes[i].vp) + '</td>'
                votesHtml += '</tr>'
            }
            $('#content-votes tbody').append(votesHtml)

            // Comments
            if (content.data.child.length > 0) {
                $('#content-comments').show()
                let commentsHtml = ''
                for (let i = 0; i < content.data.child.length; i++) {
                    commentsHtml += '<tr><td>' + content.data.child[i][0] + '</td><td>' + DOMPurify.sanitize(content.data.child[i][1]) + '</td>'
                    commentsHtml += '<td><a href="#/content/' + content.data.child[i][0] + '/' + content.data.child[i][1] + '">View Comment</a></td></tr>'
                }
                $('#content-comments table tbody').append(commentsHtml)
            }

            $('#content-loading').hide()
            $('.spinner-border').hide()
            $('#content-container').show()
            addAnchorClickListener()
        }).catch((e) => {
            console.log(e)
            $('#content-loading').hide()
            $('.spinner-border').hide()
            if (e == 'Error: Request failed with status code 404')
                $('#content-notfound').show()
            else
                $('#content-error').show()
        })
    }
}