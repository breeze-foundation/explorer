import view from './view.js'

export default class extends view {
  constructor() {
    super()
    this.blockNum = parseInt(window.location.hash.substr(4))
    this.setTitle('Block #' + this.blockNum)
  }

  getHtml() {
    return `
    ${this.loadingHtml("acc", "account")}
<div id="blk-notfound">
    <h2>Block not found</h2><br>
    <a type="button" class="btn btn-primary" href="#">Home</a>
</div>
<div id="blk-error">
    <h2>Something went wrong when retrieving block</h2><br>
    <a type="button" class="btn btn-primary" href="#">Home</a>
</div>
<div class="block-page-content-wrapper">
    <div id="blk-container">
        <div class="header-search-part">
            <div class="hd-search-g-wrap">
                <input id="input" class="input-design dblocks-search" onkeypress="searchEnter()" type="search"
                    placeholder="Block / Account / Tx" aria-label="Search">
                <button id="searchIcon" onclick="searchSubmit()">

                </button>
            </div>
        </div>
        <div class="block-content-rw">
            <h3 class="tbl-title margin-2 text-center"><span id="blk-num"></span></h3>
            <div class="blocks">
                <div class="block">
                    <p>Transactions</p>
                    <div class="bb">
                        <div class="text-truncate">
                            <p id="blk-txs-heading">0</p>
                        </div>
                    </div>
                </div>
                <div class="block">
                    <p>Hash</p>
                    <div class="bb">
                        <div class="text-truncate">

                            <p id="blk-det-hash"></p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="blocks">
                <div class="block">
                    <p>Timestamp</p>
                    <div class="bb">
                        <div class="text-truncate">

                            <p id="blk-det-ts"></p>
                        </div>
                    </div>
                </div>
                <div class="block">
                    <p>Witness</p>
                    <div class="bb">
                        <div class="text-truncate">

                            <p id="blk-det-miner"></p>
                        </div>
                    </div>
                </div>
                <div class="block">
                    <p>Phash</p>
                    <div class="bb">
                        <div class="text-truncate">

                            <p id="blk-det-phash"></p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="blocks">
                <div class="block">
                    <p>Signature</p>
                    <div class="bb">
                        <div class="text-truncate">

                            <p id="blk-det-sig"></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="block-content-rw">
            <div id="blk-txs">
                <h3 class="tbl-title margin-2 text-center"><span id="txs-in-blk">0 Transactions in this block</span>
                </h3>
            </div>
        </div>
        <div class="pagination justify-content-center btn-group blk-btn-prevnext" role="group">
            <a id="blk-btn-prev">Previous block</a>
            <a id="blk-btn-next">Next block</a>
        </div>
    </div>
</div> <!-- ./block-page-content-wrapper -->
        `
  }

  init() {
    if (isNaN(this.blockNum)) {
      $('#blk-loading').hide()
      $('.spinner-border').hide()
      $('#blk-notfound').show()
      return
    }
    axios.get(config.api + '/block/' + this.blockNum).then((blk) => {
      $('#blk-num').text('Block #' + thousandSeperator(this.blockNum))
      $('#blk-det-phash').text(blk.data.phash)
      $('#blk-det-ts').text(blk.data.timestamp)
      $('#blk-det-ts').append(' <span class="badge badge-pill badge-info">' + new Date(blk.data.timestamp).toLocaleString() + '</span>')
      $('#blk-det-miner').text(blk.data.miner)

      if (blk.data.missedBy)
        $('#blk-det-miss').text(blk.data.missedBy)
      else
        $('#blk-fld-miss').hide()

      $('#blk-det-dist').text(blk.data.dist || '0')
      $('#blk-det-burn').text(blk.data.burn || '0')
      $('#blk-det-hash').text(blk.data.hash)
      $('#blk-det-sig').text(blk.data.signature)

      // Prepare previous and next buttons
      $('#blk-btn-prev').attr('href', '/b/' + (this.blockNum - 1))
      $('#blk-btn-next').attr('href', '/b/' + (this.blockNum + 1))

      // Genesis and hardfork badge
      if (this.blockNum == 0) {
        $('#blk-btn-prev').hide()
        $('#blk-btn-next').css('border-top-left-radius', '0.25rem')
        $('#blk-btn-next').css('border-bottom-left-radius', '0.25rem')
        $('#blk-num').append(' <span class="badge badge-secondary">Genesis</span>')
      }

      // List transactions
      if (blk.data.txs.length > 0) {
        $('#txs-in-blk').html(blk.data.txs.length + ' Transactions in this block')
        if (isPuralArr(blk.data.txs))
          $('#blk-txs-heading').text(blk.data.txs.length + ' transactions in this block')
        else
          $('#blk-txs-heading').text('1 transaction in this block')
        $('#blk-txs').append(txBCardsHtml([blk.data]))
      }

      addAnchorClickListener()
      $('#blk-loading').hide()
      $('.spinner-border').hide()
      $('#blk-container').show()
    }).catch((e) => {
      $('#blk-loading').hide()
      $('.spinner-border').hide()
      if (e == 'Error: Request failed with status code 404') {
        $('#blk-notfound').show()
      } else $('#blk-error').show()
    })
  }
}
