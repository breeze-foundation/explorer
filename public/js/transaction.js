import view from "./view.js";

export default class extends view {
  constructor() {
    super();
    this.setTitle("Transaction");
    this.txhashChars = /^[a-f0-9]*$/;
    this.txhash = window.location.hash.substr(5);
  }

  getHtml() {
    return `
        ${this.loadingHtml("acc", "account")}
    <div id="txn-notfound">
        <h2>Transaction not found</h2><br>
        <a type="button" class="btn btn-primary" href="#">Home</a>
    </div>
    <div id="txn-error">
        <h2>Something went wrong when retrieving transaction</h2><br>
        <a type="button" class="btn btn-primary" href="#">Home</a>
    </div>
    <div id="txn-container">
    <div class="header-search-part mb-30">
                    <div class="hd-search-g-wrap">
                    <input id="input" class="input-design dblocks-search" onkeypress="searchEnter()" type="search" placeholder="Block / Account / Tx" aria-label="Search">
                <button id="searchIcon" onclick="searchSubmit()">
                    
                </button>
                    </div>
                </div>
        <div class="cmn-display bg-transparent">
            <h2 class="cmn-display-title type-3 text-truncate mb-2" style="padding-bottom:6px;"><img src="https://img.icons8.com/ios/24/709CF0/document--v1.png"/> <span id="txn-id"></span> <span class="block-number-hash" id="includedInBlock" style="float:right"></span></h2>
            
            <div class="card dblocks-card mb-2" id="txn-card" style="border-top: 2px dotted #36395D;margin-left:-20px;margin-right:-20px;padding-left:20px;background: #00000047 !important;"></div>
            <div class="acc_transactionpage_rows">
                <div class="acc_row">
                    <p class="acc_row-type">Type:</p>
                    <div class="acc_row-content text">
                        <div class="text-truncate">
                            <p id="txn-det-type"></p>
                        </div>
                    </div>
                </div>
                <div class="acc_row">
                    <p class="acc_row-type">Sender:</p>
                    <div class="acc_row-content text">
                        <div class="text-truncate">
                            <p id="txn-det-sender"></p>
                        </div>
                    </div>
                </div>
                <div class="acc_row">
                    <p class="acc_row-type">Timestamp:</p>
                    <div class="acc_row-content text">
                        <div class="text-truncate">
                            <p id="txn-det-ts"></p>
                        </div>
                    </div>
                </div>
                <div class="acc_row">
                    <p class="acc_row-type">Hash:</p>
                    <div class="acc_row-content text">
                        <div class="text-truncate">
                            <p id="txn-det-hash"></p>
                        </div>
                    </div>
                </div>
                <div class="acc_row">
                    <p class="acc_row-type">Signature:</p>
                    <div class="acc_row-content text">
                        <div class="text-truncate">
                            <p id="txn-det-sig"></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <h3 class="tbl-title text-center"><span>Transaction data</span></h3>
        <div class="tbl-cmn-bg">
        <div class="display-tbl">
        <div id="txn-det-data"></div>
        </div>
        </div>
    </div>
        `;
  }

  init() {
    if (this.txhash.length !== 64 || !this.txhashChars.test(this.txhash)) {
      $("#txn-loading").hide();
      $(".spinner-border").hide();
      $("#txn-notfound").show();
      return;
    }

    axios
      .get(config.api + "/tx/" + this.txhash)
      .then((txn) => {
        $("#txn-id").text(txn.data.hash);
        $("#includedInBlock").html(
          'Block <a href="/#/b/' +
            txn.data.includedInBlock +
            '" style="color: #1FC1C3">#' +
            thousandSeperator(txn.data.includedInBlock) +
            "</a>"
        );
        $("#txn-card").html(
          '<p class="dblocks-card-content">' + txToHtml(txn.data) + "</p>"
        );
        $("#txn-det-type").text(txn.data.type);
        $("#txn-det-type").append(
          ' <span class="badge badge-pill badge-info">' +
            TransactionTypes[txn.data.type] +
            "</span>"
        );
        $("#txn-det-sender").text(txn.data.sender);
        $("#txn-det-ts").text(txn.data.ts);
        $("#txn-det-ts").append(
          ' <span class="badge badge-pill badge-info">' +
            new Date(txn.data.ts).toLocaleString() +
            "</span>"
        );
        $("#txn-det-hash").text(txn.data.hash);
        $("#txn-det-sig").text(txn.data.signature);

        $("#txn-det-data").append(jsonToTableRecursive(txn.data.data));

        $("#txn-loading").hide();
        $(".spinner-border").hide();
        $("#txn-container").show();
      })
      .catch((e) => {
        $("#txn-loading").hide();
        $(".spinner-border").hide();
        if (e == "Error: Request failed with status code 404")
          $("#txn-notfound").show();
        else $("#txn-error").show();
      });
  }
}
